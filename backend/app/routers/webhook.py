from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session
from ..core.db import get_db
from ..core.config import settings
from ..services.payment import PaddlePaymentProvider, PaymentService

router = APIRouter()


@router.post("/webhook/paddle")
async def paddle_webhook(
    request: Request,
    db: Session = Depends(get_db),
    paddle_signature: str | None = Header(None, alias="paddle-signature"),
):
    payload = await request.body()
    provider = PaddlePaymentProvider(settings.paddle_public_key)
    try:
        data = provider.verify_webhook(payload, paddle_signature or "")
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="invalid payload")

    file_token = (
        data.get("passthrough", {}).get("file_token")
        if isinstance(data.get("passthrough"), dict)
        else (data.get("custom_data", {}) or {}).get("file_token")
    )
    if not file_token:
        pt = data.get("passthrough")
        if isinstance(pt, str):
            try:
                import json
                j = json.loads(pt)
                file_token = j.get("file_token")
            except Exception:
                pass
    if not file_token:
        raise HTTPException(status_code=400, detail="file_token missing")

    event = data.get("event") or data.get("type") or ""
    if "payment_succeeded" not in str(event):
        return {"ok": True}

    service = PaymentService(provider)
    service.mark_payment(db, file_token=file_token, status="PAID", raw_payload=payload.decode("utf-8"))
    return {"ok": True}


