import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .core.config import settings
from .core.db import engine, Base
from .routers import health, files, webhook, maintenance

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

# Static previews and files
app.mount(
    "/static",
    StaticFiles(directory=settings.storage_dir),
    name="static",
)


