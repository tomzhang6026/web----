from datetime import datetime, timedelta
from typing import Optional, Tuple

from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from fastapi import HTTPException, status

from ..core.security import get_password_hash, verify_password, create_access_token
from ..models.tables import User, UserSession, Plan

class DeviceLimitReached(Exception):
    def __init__(self, temp_token: str):
        self.temp_token = temp_token

class AuthService:
    # ... (前部分不变) ...
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        return db.scalar(select(User).where(User.email == email))

    @staticmethod
    def register_user(db: Session, email: str, password: str) -> User:
        if AuthService.get_user_by_email(db, email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        hashed_pw = get_password_hash(password)
        user = User(
            email=email,
            hashed_password=hashed_pw,
            created_at=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        user = AuthService.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def login_device(
        db: Session, 
        user: User, 
        device_id: str, 
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Tuple[str, str]:
        
        # 1. Max devices
        max_devices = 2
        if user.plan_id:
            plan = db.get(Plan, user.plan_id)
            if plan:
                max_devices = plan.max_devices

        # 2. Active sessions
        now = datetime.utcnow()
        stmt = select(UserSession).where(UserSession.user_id == user.id).order_by(UserSession.last_active_at.asc())
        sessions = db.scalars(stmt).all()
        
        active_sessions = []
        for s in sessions:
            if s.expires_at > now:
                active_sessions.append(s)
            else:
                db.delete(s)
        
        if len(active_sessions) != len(sessions):
            db.commit()
        
        # 3. Check exist
        existing_session = next((s for s in active_sessions if s.device_id == device_id), None)
        
        if existing_session:
            session_to_update = existing_session
        else:
            # New device check
            if len(active_sessions) >= max_devices:
                # Generate temp token for device management
                temp_token, _ = create_access_token(user.id, device_id)
                raise DeviceLimitReached(temp_token)
            
            session_to_update = UserSession(
                user_id=user.id,
                device_id=device_id,
                ip_address=ip_address,
                user_agent=user_agent,
                last_active_at=now
            )
            db.add(session_to_update)

        # 5. Generate Token
        access_token, jti = create_access_token(user.id, device_id)
        
        # 6. Update Session
        from ..core.config import settings
        expire_time = now + timedelta(minutes=settings.access_token_expire_minutes)
        
        session_to_update.token_jti = jti
        session_to_update.last_active_at = now
        session_to_update.expires_at = expire_time
        session_to_update.ip_address = ip_address
        session_to_update.user_agent = user_agent
        
        db.commit()
        db.refresh(session_to_update)
        
        return access_token, jti
