from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.db import get_db
from ..services.cleanup import CleanupService

router = APIRouter()


@router.post("/maintenance/cleanup")
def run_cleanup(db: Session = Depends(get_db)) -> dict:
    removed = CleanupService.cleanup_expired(db)
    return {"removed": removed}


