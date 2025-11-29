from typing import Tuple, List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
import jwt

from ..core.db import get_db
from ..core.config import settings
from ..services.auth import AuthService, DeviceLimitReached
from ..models.tables import User, UserSession

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class DeviceInfo(BaseModel):
    id: int
    device_id: str
    ip_address: Optional[str]
    user_agent: Optional[str]
    last_active_at: datetime
    is_current: bool

# Deps
async def get_current_user_token(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> Tuple[User, str, str]: 
    """
    仅验证 Token 签名有效性，不验证是否在 active_sessions 中。
    用于设备管理接口。
    Returns: (User, device_id, jti)
    """
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("sub")
        device_id = payload.get("dev")
        jti = payload.get("jti")
        if user_id is None or device_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")
    
    user = db.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user, device_id, jti

# Routes
@router.post("/auth/register", response_model=Token)
async def register(
    user_in: UserCreate, 
    request: Request,
    x_device_id: str = Header(..., alias="X-Device-ID"),
    db: Session = Depends(get_db)
):
    user = AuthService.register_user(db, user_in.email, user_in.password)
    try:
        token, _ = AuthService.login_device(
            db, user, x_device_id, 
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent")
        )
        return {"access_token": token, "token_type": "bearer"}
    except DeviceLimitReached as e:
        # 注册成功但登录失败（理论上新注册用户不会满，除非数据库脏数据）
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={
                "detail": "Device limit reached",
                "code": "DEVICE_LIMIT_REACHED",
                "temp_token": e.temp_token
            }
        )

@router.post("/auth/login", response_model=Token)
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    x_device_id: str = Header(..., alias="X-Device-ID"),
    db: Session = Depends(get_db)
):
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        token, _ = AuthService.login_device(
            db, user, x_device_id,
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent")
        )
        return {"access_token": token, "token_type": "bearer"}
    except DeviceLimitReached as e:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={
                "detail": "Device limit reached",
                "code": "DEVICE_LIMIT_REACHED",
                "temp_token": e.temp_token
            }
        )

@router.get("/auth/devices", response_model=List[DeviceInfo])
async def get_devices(
    current_user_data: Tuple[User, str, str] = Depends(get_current_user_token),
    db: Session = Depends(get_db)
):
    user, current_dev_id, _ = current_user_data
    stmt = select(UserSession).where(UserSession.user_id == user.id).order_by(UserSession.last_active_at.desc())
    sessions = db.scalars(stmt).all()
    
    return [
        {
            "id": s.id,
            "device_id": s.device_id,
            "ip_address": s.ip_address,
            "user_agent": s.user_agent,
            "last_active_at": s.last_active_at,
            "is_current": s.device_id == current_dev_id
        } 
        for s in sessions
    ]

@router.delete("/auth/devices/{session_id}")
async def delete_device(
    session_id: int,
    current_user_data: Tuple[User, str, str] = Depends(get_current_user_token),
    db: Session = Depends(get_db)
):
    user, _, _ = current_user_data
    session = db.get(UserSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(session)
    db.commit()
    return {"status": "success"}
