from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from ..core.config import settings
from ..core.db import Base


class FileRecord(Base):
    __tablename__ = "files"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    file_token: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    stored_path: Mapped[str] = mapped_column(String(512))
    previews_dir: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    page_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(32), default="READY")  # READY/DELETED
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.utcnow() + timedelta(hours=settings.file_ttl_hours),
    )


class PaymentRecord(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    file_token: Mapped[str] = mapped_column(String(64), index=True)
    provider: Mapped[str] = mapped_column(String(32), default="PADDLE")
    status: Mapped[str] = mapped_column(String(16), default="PENDING")  # PENDING/PAID/FAILED
    raw_payload: Mapped[Optional[str]] = mapped_column(String(4000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


