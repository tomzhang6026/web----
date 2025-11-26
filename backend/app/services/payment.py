from typing import Any, Protocol, Optional
import json
from sqlalchemy.orm import Session
from ..models.tables import PaymentRecord


class IPaymentProvider(Protocol):
    def create_checkout(self, file_token: str) -> dict:
        ...

    def verify_webhook(self, payload: bytes, signature: str) -> dict:
        ...


class PaddlePaymentProvider:
    """
    占位：Paddle 支付将在后续里程碑完成接入与验签。
    """

    def __init__(self, public_key: str | None):
        self.public_key = public_key

    def create_checkout(self, file_token: str) -> dict:
        raise NotImplementedError

    def verify_webhook(self, payload: bytes, signature: str) -> dict:
        # TODO: 使用 Paddle 公钥进行真实验签与事件解析
        data = json.loads(payload.decode("utf-8"))
        return data


class PaymentService:
    def __init__(self, provider: IPaymentProvider):
        self.provider = provider

    def mark_payment(
        self, db: Session, file_token: str, status: str, raw_payload: Optional[str]
    ) -> None:
        rec = PaymentRecord(
            file_token=file_token, status=status, provider="PADDLE", raw_payload=raw_payload
        )
        db.add(rec)
        db.commit()


