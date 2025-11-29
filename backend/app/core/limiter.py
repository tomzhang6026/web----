from slowapi import Limiter
from slowapi.util import get_remote_address

# 初始化限流器
# key_func=get_remote_address 表示根据客户端 IP 进行限流
limiter = Limiter(key_func=get_remote_address)

