import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .core.config import settings
from .core.db import engine, Base
from .core.limiter import limiter
from .routers import health, files, webhook, maintenance, auth, plans

# Import models to ensure tables are created by SQLAlchemy
# even if they are not yet used in routers
from .models import tables

app = FastAPI(title=settings.app_name)

# Rate Limiter Setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure storage directory exists
os.makedirs(settings.storage_dir, exist_ok=True)

# Create tables
Base.metadata.create_all(bind=engine)

app.include_router(health.router, prefix="/api")
app.include_router(files.router, prefix="/api")
app.include_router(webhook.router, prefix="/api")
app.include_router(maintenance.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(plans.router, prefix="/api")

# Static previews and files
app.mount(
    "/static",
    StaticFiles(directory=settings.storage_dir),
    name="static",
)
