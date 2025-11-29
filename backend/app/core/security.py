from datetime import datetime, timedelta
from typing import Any, Union
import uuid

from passlib.context import CryptContext
import jwt  # pyjwt

from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], device_id: str) -> tuple[str, str]:
    """
    生成 JWT Token 和 JTI。
    返回: (encoded_jwt, jti)
    """
    now = datetime.utcnow()
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    expire = now + expires_delta
    
    jti = str(uuid.uuid4()) # 唯一ID
    
    to_encode = {
        "sub": str(subject), # user_id
        "dev": device_id,    # device_id
        "exp": expire,
        "iat": now,
        "jti": jti
    }
    
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt, jti

def verify_paddle_signature(public_key_pem: str, body: bytes, signature: str) -> bool:
    """
    验证 Paddle Webhook 签名（占位实现，后续里程碑完善）
    """
    # TODO: Implement with Paddle public key and signature scheme
    return False
