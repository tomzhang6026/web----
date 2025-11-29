from datetime import datetime, timedelta
from typing import Tuple, List, Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, status, Header, Body, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select
import jwt

from ..core.db import get_db
from ..core.config import settings
from ..core.limiter import limiter
from ..models.tables import User, UserSession, Plan, RedeemCode

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Dependency: 获取当前活跃用户（校验 Session 是否存在）
async def get_current_active_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> Tuple[User, str, str]: 
    """
    验证 Token 签名 + UserSession 存在性。
    用于业务接口。
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
    
    # 1. 查 Session
    stmt = select(UserSession).where(
        UserSession.user_id == int(user_id),
        UserSession.device_id == device_id,
        UserSession.token_jti == jti
    )
    session = db.scalar(stmt)
    if not session:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session invalid or expired")

    # 2. 查 User
    user = db.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
    return user, device_id, jti


@router.post("/init")
def init_plans(db: Session = Depends(get_db)):
    """初始化默认套餐"""
    if db.scalar(select(Plan).limit(1)):
        return {"msg": "Plans already initialized"}
    
    plans = [
        Plan(code="weekly", name="Weekly Pass", duration_days=7, price_cny_cents=990, max_devices=2),
        Plan(code="monthly", name="Monthly Pass", duration_days=30, price_cny_cents=1990, max_devices=2),
        Plan(code="yearly", name="Yearly Pass", duration_days=365, price_cny_cents=9900, max_devices=2),
    ]
    db.add_all(plans)
    db.commit()
    return {"msg": "Initialized"}

@router.post("/codes")
def generate_codes(
    plan_code: str, 
    count: int = 1, 
    admin_key: str = Header(..., alias="X-Admin-Key"),
    db: Session = Depends(get_db)
):
    """[Admin] 生成兑换码"""
    # 简单的 Admin 验证
    # TODO: Move to env var
    if admin_key != "mvp_admin_key_2025": 
        raise HTTPException(status_code=403, detail="Forbidden")

    plan = db.scalar(select(Plan).where(Plan.code == plan_code))
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    codes = []
    for _ in range(count):
        # 生成 12 位大写码：VF-XXXX-XXXX
        raw = uuid.uuid4().hex[:8].upper()
        code_str = f"VF-{raw[:4]}-{raw[4:]}"
        
        rc = RedeemCode(code=code_str, plan_id=plan.id)
        db.add(rc)
        codes.append(code_str)
    
    db.commit()
    return {"codes": codes}

@router.post("/redeem")
@limiter.limit("5/minute")
def redeem_code(
    request: Request,
    code: str = Body(..., embed=True), 
    current_user_data: Tuple[User, str, str] = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    user, _, _ = current_user_data
    
    # 1. 查找 Code
    rc = db.scalar(select(RedeemCode).where(RedeemCode.code == code))
    if not rc:
        raise HTTPException(status_code=404, detail="Invalid code")
    if rc.is_used:
        raise HTTPException(status_code=400, detail="Code already used")
    
    # 2. 查找 Plan
    plan = db.get(Plan, rc.plan_id)
    
    # 3. 更新用户
    now = datetime.utcnow()
    
    # 如果用户当前已有订阅且没过期，则延期
    if user.plan_expires_at and user.plan_expires_at > now:
        new_expire = user.plan_expires_at + timedelta(days=plan.duration_days)
    else:
        new_expire = now + timedelta(days=plan.duration_days)
    
    user.plan_id = plan.id
    user.plan_expires_at = new_expire
    
    # 4. 标记码为已用
    rc.is_used = True
    rc.used_by_user_id = user.id
    rc.used_at = now
    
    db.commit()
    
    return {
        "status": "success",
        "plan": plan.name,
        "expires_at": new_expire
    }

@router.get("/me")
def get_my_plan(
    current_user_data: Tuple[User, str, str] = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    user, _, _ = current_user_data
    plan_name = None
    is_valid = False
    
    if user.plan_id and user.plan_expires_at:
        if user.plan_expires_at > datetime.utcnow():
            is_valid = True
            plan = db.get(Plan, user.plan_id)
            plan_name = plan.name if plan else "Unknown"
            
    return {
        "email": user.email,
        "plan_name": plan_name,
        "is_valid": is_valid,
        "expires_at": user.plan_expires_at,
        "device_limit": 2
    }
