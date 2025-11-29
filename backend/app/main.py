import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .core.config import settings
from .core.db import engine, Base
from .routers import health, files, webhook, maintenance, auth, plans

# Import models to ensure tables are created by SQLAlchemy
# even if they are not yet used in routers
from .models import tables

app = FastAPI(title=settings.app_name)

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
app.include_router(plans.router, prefix="/plans", tags=["plans"]) # 注意这里我不加 /api 前缀了？不，应该统一。

# 修正：保持统一前缀
app.include_router(plans.router, prefix="/api/plans", tags=["plans"])

# Static previews and files
app.mount(
    "/static",
    StaticFiles(directory=settings.storage_dir),
    name="static",
)
