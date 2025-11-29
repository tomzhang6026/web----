// 管理认证状态：Token, Device ID
import { api } from "./api";

const DEVICE_ID_KEY = "vfc_device_id";
const TOKEN_KEY = "vfc_auth_token";

// 获取或生成 Device ID (永不改变，除非清缓存)
export function getDeviceId(): string {
  let did = localStorage.getItem(DEVICE_ID_KEY);
  if (!did) {
    did = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, did);
  }
  return did;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  // 不清除 Device ID，因为这是设备的身份证
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

