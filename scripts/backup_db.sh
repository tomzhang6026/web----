#!/bin/bash

# 设置变量
# 数据库所在目录（根据服务器实际路径调整）
DB_PATH="/srv/visafilecompress/app.db"
# 备份存放目录
BACKUP_ROOT="/root/backups/visafile"
# 当前日期
DATE=$(date +%Y%m%d_%H%M%S)

# 确保备份目录存在
mkdir -p "$BACKUP_ROOT"

# 检查数据库文件是否存在
if [ -f "$DB_PATH" ]; then
    # 复制数据库文件
    cp "$DB_PATH" "$BACKUP_ROOT/app.db_$DATE"
    echo "[$(date)] Backup created: $BACKUP_ROOT/app.db_$DATE"

    # 删除超过 30 天的旧备份，防止磁盘塞满
    find "$BACKUP_ROOT" -name "app.db_*" -type f -mtime +30 -delete
    echo "[$(date)] Cleaned up backups older than 30 days"
else
    echo "[$(date)] Error: Database file not found at $DB_PATH"
    exit 1
fi

