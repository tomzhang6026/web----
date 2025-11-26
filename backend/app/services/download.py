from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from ..models.tables import FileRecord, PaymentRecord


class DownloadService:
    @staticmethod
    def is_paid(db: Session, file_token: str) -> bool:
        paid = (
            db.query(PaymentRecord)
            .filter(PaymentRecord.file_token == file_token, PaymentRecord.status == "PAID")
            .first()
        )
        return paid is not None

    @staticmethod
    def authorize(db: Session, file_token: str, allow_trial: bool) -> FileRecord:
        file_rec = (
            db.query(FileRecord)
            .filter(FileRecord.file_token == file_token, FileRecord.status == "READY")
            .first()
        )
        if not file_rec:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="file not found")

        if allow_trial or DownloadService.is_paid(db, file_token):
            return file_rec

        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="payment required")


