import os
from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..core.config import settings
from ..core.db import get_db
from ..models.tables import FileRecord
from ..services.compression import CompressionService
from ..services.download import DownloadService

router = APIRouter()


class ProcessResponse(BaseModel):
    file_token: str
    page_count: int
    preview_urls: List[str] = Field(default_factory=list)
    expires_at: datetime
    total_size_bytes: int


def _is_free_mode() -> bool:
    if settings.free_mode_enabled:
        return True
    if settings.free_mode_until is not None:
        try:
            return datetime.utcnow() < settings.free_mode_until
        except Exception:
            return False
    return False


@router.post("/files/process", response_model=ProcessResponse)
async def process_files(
    target_size_mb: int = Form(..., ge=1),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    if not files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No files")
    try:
        output = await CompressionService().process(files, target_size_mb)
        record = FileRecord(
            file_token=output.file_token,
            stored_path=output.stored_pdf,
            previews_dir=os.path.join(settings.storage_dir, "previews", output.file_token),
            page_count=output.page_count,
            status="READY",
            created_at=datetime.utcnow(),
            expires_at=output.expires_at,
        )
        db.add(record)
        db.commit()
        return ProcessResponse(
            file_token=output.file_token,
            page_count=output.page_count,
            preview_urls=output.preview_urls,
            expires_at=output.expires_at,
            total_size_bytes=os.path.getsize(output.stored_pdf),
        )
    except ValueError as ve:
        # Validation errors -> 400
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {e}")


@router.get("/files/download/{file_token}")
def download_file(
    file_token: str,
    trial: int = 0,
    db: Session = Depends(get_db),
):
    # Feature-flag based gating
    if _is_free_mode():
        allow_trial = True
    else:
        if settings.enforce_payment:
            allow_trial = False
        else:
            allow_trial = settings.client_trial_enabled and (trial == 1)

    record = DownloadService.authorize(db, file_token, allow_trial=allow_trial)
    if not os.path.exists(record.stored_path):
        raise HTTPException(status_code=404, detail="file not ready")
    return FileResponse(
        path=record.stored_path,
        filename="compressed.pdf",
        media_type="application/pdf",
    )


