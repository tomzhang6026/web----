from typing import List, Optional
from datetime import datetime

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Compression Tool API"
    environment: str = Field(default="development")
    database_url: str = Field(default="sqlite:///./app.db")
    paddle_public_key: str | None = None
    paddle_env: str = Field(default="sandbox")
    file_ttl_hours: int = Field(default=6)
    cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:5173"])
    storage_dir: str = Field(default="storage")
    # Feature flags for rollout
    free_mode_enabled: bool = Field(default=True, description="If true, all downloads are free without payment.")
    free_mode_until: Optional[datetime] = None  # ISO8601, e.g. 2025-12-31T23:59:59Z
    enforce_payment: bool = Field(default=False, description="If true, ignore client trial and require paid status unless free_mode is active.")
    free_download_limit: int = Field(default=3, ge=0)
    client_trial_enabled: bool = Field(default=True, description="Allow client-provided trial flag during MVP phase.")
    # Upload validation
    allowed_mime_types: List[str] = Field(default_factory=lambda: ["application/pdf", "image/jpeg", "image/png"])
    max_input_file_mb: int = Field(default=50, ge=1)     # per-file input size cap
    max_total_input_mb: int = Field(default=200, ge=1)   # sum of all files per job
    enforce_page_limits: bool = Field(default=True, description="Reject jobs exceeding max pages allowed for selected target size.")


settings = Settings()


