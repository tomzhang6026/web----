# VISA签证文件专用智能压缩工具（MVP）——架构与后续升级指南

本仓库包含一个基于 FastAPI（Python）+ React（Vite + TailwindCSS）的签证材料压缩工具。本文档面向未来升级（登录系统、月卡/年卡订阅、计费/放行策略优化）提供清晰的规则说明、已有预留点、扩展建议与注意事项。

目录
- 1. 当前功能（MVP）概览
- 2. 架构概览与约束
- 3. 已预留的扩展点
- 4. 登录与订阅（月卡/年卡）未来设计
- 5. 数据模型与迁移建议
- 6. 支付/放行策略演进（Paddle → 订阅）
- 7. 配置与环境变量
- 8. 前端升级要点
- 9. 安全与合规注意事项
- 10. 运维与清理
- 11. 测试与验收建议

## 1) 当前功能（MVP）概览
- 智能压缩
  - 内容感知压缩：按页面内容类型（文字密集/混合/图片重/复杂背景）自适应质量、尺寸与颜色处理。
  - 统一版式：输出 A4 竖向（portrait），横图内容自动旋转并等比放置，保证文字正向朝上。
  - 大小控制：按目标大小（1/2/4/5MB）进行总量控制，优先保护文字页清晰度。
  - 预览：展示压缩后前 10 页 JPEG 预览（默认保留 6 小时）。
- 下载与试用
  - 本地 LocalStorage 记录免费次数（3 次内免费下载）。
  - 后端具备 free_mode（含 free_mode_until 截止时间）与 enforce_payment 等开关，用于灰度与切换。
  - 下载授权通过 `file_token` 与（试用/付费）状态判定。
- 前端体验
  - 多上传位（默认 5 个，可增加）、可排序。
  - 上传前选定目标大小并显示对应最大页数；前端统计总页数并提示是否超限。
  - 中/英双语，默认中国大陆显示中文，其它地区显示英文；PC-only 访问提示。
  - 压缩进度条（不确定进度）、防重复提交、失败重试提示。
- 运维
  - 预览/中间文件定期清理（文件 TTL），手动接口与后续可接入定时任务。

## 2) 架构概览与约束
- 后端（FastAPI）
  - 分层：`routers/`（仅 HTTP I/O）、`services/`（业务逻辑）、`core/`（配置与通用工具）。
  - 数据层：`models/tables.py` 定义实体（当前含 `File`、`Payment`）。
  - 原则：后端无状态，状态放 DB/文件存储；严禁在路由放业务逻辑。
  - 错误处理：外部调用（图像处理、支付）统一 try/except，返回清晰可读错误。
- 前端（React + Tailwind）
  - 原子化组件：`components/ui/` 为无业务组件；`components/features/` 为功能模块；`pages/` 负责编排。
  - PC-only：根层拦截移动端并显示友好提示。

## 3) 已预留的扩展点
- 支付抽象
  - `Payment` 表：包含 `provider/status/raw_payload`，Webhook 已通路；后续可扩展订阅事件。
  - 计划新增 `IPaymentProvider` 接口（统一“创建交易/校验签名/处理 Webhook”）。
- 授权放行
  - `DownloadService.authorize_and_stream(file_token, is_trial)`：后续可无侵入替换为“用户订阅权益”校验。
- 配置开关
  - `free_mode_enabled/free_mode_until/enforce_payment/free_download_limit/client_trial_enabled` 已加入，便于灰度。
  - 可后续添加 `require_login`, `subscription_required` 等。
- 压缩与预览
  - 结果 PDF 与预览路径按 `file_token` 隔离，便于未来做“用户目录隔离”和“用户配额统计”。

## 4) 登录与订阅（月卡/年卡）未来设计
目标：引入“登录态 + 订阅权益（月卡/年卡）”的放行模型，兼容现有一次性单次付费（pay-per-download）。

建议接口与组件
- 后端
  - `services/auth.py`：登录/注册/Token 签发；支持 JWT；可扩展第三方登录。
  - `services/subscription.py`：订阅状态查询、权益判定（是否有下载/压缩额度、到期时间）。
  - `services/payment.py`：`IPaymentProvider`、`PaddleProvider`（Checkout/订阅/Webhook 验证）。
  - 中间件/依赖：提取当前用户（可选 JWT/Cookie），供路由鉴权使用。
- 前端
  - 新增“登录/账户”入口、订阅状态展示、续费/开通入口。
  - 下载/压缩按钮根据“订阅/试用/付费”动态显示与放行。

放行优先级（建议）
1. 系统处于 Free Mode（未到期）：直接放行。
2. 登录用户且订阅有效：放行。
3. 未登录或无订阅：若剩余免费次数 > 0，放行，否则进入付费（单次或订阅购买）。

## 5) 数据模型与迁移建议
现有（缩略）
- `File(id, file_token, original_name, stored_path, page_count, total_size_bytes, status, created_at, expires_at)`
- `Payment(id, file_token, provider, status, raw_payload, created_at)`

建议新增/扩展
- `User(id, email, password_hash, locale, created_at, status, ...)`
- `Plan(id, code, name, period, currency, price, features_json, active)`
- `Subscription(id, user_id, plan_id, status, current_period_end, cancel_at, external_ref, created_at)`
- `Entitlement/Usage`（可选）：记录用户已用次数/容量等，用于配额。
- 扩展现有表：
  - `File` 增加 `user_id`（可空，迁移期间允许匿名）；便于隔离与统计。
  - `Payment` 增加 `user_id`, `plan_id`, `file_token` 可选（订阅不一定对应单个文件）；保存 `passthrough/custom_data`（含 `file_token` 和/或 `user_id`）。

迁移工具
- 建议引入 Alembic 管理迁移，保证生产稳定升级与回滚。

索引与清理
- 常用查询字段添加索引：`file_token`, `created_at`, `user_id`, `status`。
- TTL 清理策略：文件与预览按 `expires_at` 清理；支付记录保留期按合规要求设定。

## 6) 支付/放行策略演进（Paddle → 订阅）
- 当前：一次性付费（pay-per-download）骨架 + Webhook。
- 演进：
  - 订阅产品（Plan）在 Paddle 后台配置；Webhook 处理订阅事件（创建、续费、取消、退款）。
  - Webhook 验签：使用 Paddle 公钥/签名或 HMAC（取决于 Classic/Billing）。
  - 放行逻辑根据用户订阅状态判断；对单笔付费的文件仍支持 `file_token` 放行（与订阅并存）。
- 安全：
  - 任何放行必须由后端依据签名/DB 状态判定；前端仅做引导。
  - Webhook 防重放（时间戳校验、去重表、签名有效期）。

## 7) 配置与环境变量
核心（示例，具体值见 `backend/env.example` 与 `backend/app/core/config.py`）
- 文件/试用
  - `storage_dir`, `FILE_TTL_HOURS`
  - `free_mode_enabled`, `free_mode_until`, `enforce_payment`, `free_download_limit`, `client_trial_enabled`
- 上传限制
  - `allowed_mime_types`, `max_input_file_mb`, `max_total_input_mb`, `enforce_page_limits`
- CORS/日志/DB
  - `CORS_ALLOWED_ORIGINS`, `LOG_LEVEL`, `DATABASE_URL`
- Paddle（占位）
  - `PADDLE_ENV`, `PADDLE_PUBLIC_KEY`, `PADDLE_VENDOR_ID`, `PADDLE_PRODUCT_ID`/`PRICE_ID`, `PADDLE_WEBHOOK_SECRET`
- 未来登录/订阅建议新增
  - `REQUIRE_LOGIN`, `SUBSCRIPTION_REQUIRED`, `JWT_SECRET`, `JWT_EXPIRES_IN`

## 8) 前端升级要点
- 组件职责保持清晰：
  - `components/ui/*`：无业务（按钮、选择、语言切换、进度条等）。
  - `components/features/*`：上传区、预览区、下载/支付按钮、浏览器支持等。
  - `pages/*`：编排状态/调用 API。
- 登录接入：
  - 新增“账户入口”（登录/注册/登出），持久化 Token（HttpOnly Cookie 或安全存储）。
  - 下载/压缩按钮读取“订阅/试用”状态，动态文案与禁用态。
- i18n：
  - 已支持中英切换，新增登录/订阅相关文案键时按字典维护。
- UX：
  - 保持“进度条、防重复提交、失败重试”一致体验。

## 9) 安全与合规注意事项
- 后端无状态，严禁在内存保存放行状态；一律查询 DB。
- 不信任前端：试用次数、地区/价格必须在后端再校验（前端仅作提示）。
- Webhook 安全：
  - 验签、公钥轮换、重放防护、事件幂等（以 `event_id` 或签名+时间戳去重）。
- 隐私与合规：
  - 文件过期自动删除；隐私政策与用户协议可在前端链接到专页。
- 价格与币种：
  - 不在代码硬编码；后端读取配置或由支付平台返回。

## 10) 运维与清理
- 清理任务
  - 定期删除过期预览与文件；清理过期记录；保留期可配置。
- 监控与日志
  - 建议接入 Sentry/Prometheus/Grafana；统一结构化日志与错误分级。
- 部署
  - 前后端分域名 + HTTPS；CORS 仅允许前端域名；反代缓存静态预览（注意 TTL）。

## 11) 测试与验收建议
- 压缩策略：不同类型文档在目标大小下的清晰度与总大小达标。
- 方向/尺寸：横竖混排文字方向正确，最终 A4 竖版统一。
- 上传限制：类型/单文件大小/总大小/页数上限触发友好错误。
- 预览：展示压缩后前10页、清晰可读、TTL 后不可访问。
- 试用到期：`free_mode_until` 到期后切换收费逻辑验证。
- 支付链路：单次付费/订阅开通 → Webhook → DB 状态 → 下载放行。
- 登录/订阅（未来）：登录态持久化、订阅到期/续费、取消、退款事件处理。

---
更新历史（要点）
- 2025-11：完成进度条、防重复提交、失败重试提示、移动端友好文案；后端加入上传与页数限制校验；`free_mode_until` 设定至 2026-01-31 23:59:59Z。
- 2025-11：压缩策略完善：方向检测、多内容类型自适应、A4 竖版统一与总量控制；预览改为压缩后前10页。

后续如需“登录/订阅”骨架代码（不改变现有行为），可按本 README 的第 4~6 节快速扩展：先引入数据表与接口定义，占位实现不启用，再灰度切换到生产。 


