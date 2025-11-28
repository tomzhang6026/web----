# Backend (FastAPI) - Compression Tool

## 快速开始test
1) 创建虚拟环境并安装依赖
```
pip install -r backend/requirements.txt
```
2) 复制环境变量模板
```
cp backend/env.example backend/.env
```
3) 启动开发服务器
```
uvicorn backend.app.main:app --reload
```

## 结构
```
backend/
  app/
    main.py
    routers/
      health.py
      __init__.py
    services/
      compression.py
      payment.py
      __init__.py
    core/
      config.py
      db.py
      security.py
      __init__.py
    models/
      schemas.py
      tables.py
      __init__.py
  requirements.txt
  env.example
```

## 说明
- 严格遵循 routers / services / core 分层；业务逻辑仅在 services 中实现。
- 当前提供 `/api/healthz` 健康检查、`/api/files/process` 压缩与预览、下载与 Paddle webhook 骨架。
- 生产配置请通过环境变量注入，不要在代码中硬编码密钥或价格。


