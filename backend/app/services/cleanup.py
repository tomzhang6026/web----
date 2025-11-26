import os
import shutil
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.tables import FileRecord


class CleanupService:
    @staticmethod
    def cleanup_expired(db: Session) -> int:
        now = datetime.utcnow()
        records = (
            db.query(FileRecord)
            .filter(FileRecord.expires_at <= now, FileRecord.status == "READY")
            .all()
        )
        count = 0
        for rec in records:
            try:
                if rec.stored_path and os.path.exists(rec.stored_path):
                    os.remove(rec.stored_path)
                if rec.previews_dir and os.path.isdir(rec.previews_dir):
                    shutil.rmtree(rec.previews_dir, ignore_errors=True)
            except Exception:
                pass
            rec.status = "DELETED"
            count += 1
        db.commit()
        return count


