from datetime import datetime, timedelta
from typing import Any, Union
import uuid
import hashlib
import base64
import bcrypt  # pip install bcrypt
import jwt

from .config import settings

# 不再使用 passlib，太重且有坑
# pwd_context = ... 删掉

def get_password_hash(password: str) -> str:
    """
    Secure password hashing using SHA256 + Bcrypt.
    1. SHA256 pre-hashing ensures fixed length (32 bytes), bypassing bcrypt's 72-byte limit.
    2. Base64 encoding makes it safe for bcrypt consumption.
    """
    # 1. Pre-hash
    digest = hashlib.sha256(password.encode('utf-8')).digest()
    # 2. Encode to safe bytes
    pwd_safe = base64.b64encode(digest)
    # 3. Bcrypt hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_safe, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # 1. Pre-hash
    digest = hashlib.sha256(plain_password.encode('utf-8')).digest()
    pwd_safe = base64.b64encode(digest)
    
    # 2. Bcrypt check
    try:
        return bcrypt.checkpw(pwd_safe, hashed_password.encode('utf-8'))
    except ValueError:
        # 防止非法 hash 格式报错
        return False

def create_access_token(subject: Union[str, Any], device_id: str) -> tuple[str, str]:
    now = datetime.utcnow()
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    expire = now + expires_delta
    
    jti = str(uuid.uuid4())
    
    to_encode = {
        "sub": str(subject),
        "dev": device_id,
        "exp": expire,
        "iat": now,
        "jti": jti
    }
    
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt, jti

def verify_paddle_signature(public_key_pem: str, body: bytes, signature: str) -> bool:
    return False
