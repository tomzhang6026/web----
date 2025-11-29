import { getDeviceId, getToken } from "./auth";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  code?: string;
  data?: any;
  constructor(message: string, status: number, code?: string, data?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

// 通用请求封装
async function fetchClient(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  
  // 1. 注入 Device ID (所有请求必带)
  if (!headers.has("X-Device-ID")) {
    headers.set("X-Device-ID", getDeviceId());
  }
  
  // 2. 注入 Token (如果有，且没有被覆盖)
  if (!headers.has("Authorization")) {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
  }

  const config = {
    ...options,
    headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  return res;
}

export async function getHealth(): Promise<{ status: string }> {
  const res = await fetchClient("/healthz");
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json();
}

type ProcessResp = {
  file_token: string;
  page_count: number;
  preview_urls: string[];
  expires_at: string;
  total_size_bytes: number;
};

export async function processFiles(form: FormData): Promise<ProcessResp> {
  const res = await fetchClient("/files/process", {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Process failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchDownloadBlob(
  fileToken: string,
  trial: boolean
): Promise<{ blob: Blob; filename: string }> {
  const res = await fetchClient(
    `/files/download/${encodeURIComponent(fileToken)}?${
      trial ? "trial=1" : ""
    }`
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Download failed: ${res.status} ${text}`);
  }
  const cd = res.headers.get("content-disposition") || "";
  const matched = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(cd);
  const filename = decodeURIComponent(matched?.[1] || matched?.[2] || "compressed.pdf");
  const blob = await res.blob();
  return { blob, filename };
}

// Auth API
type TokenResp = { access_token: string; token_type: string };

export async function login(email: string, password: string): Promise<TokenResp> {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetchClient("/auth/login", {
    method: "POST",
    body: formData,
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(err.detail || "Login failed", res.status, err.code, err);
  }
  return res.json();
}

export async function register(email: string, password: string): Promise<TokenResp> {
  const res = await fetchClient("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(err.detail || "Registration failed", res.status, err.code, err);
  }
  return res.json();
}

export type Device = {
  id: number;
  device_id: string;
  ip_address: string;
  user_agent: string;
  last_active_at: string;
  is_current: boolean;
};

export async function getDevices(token?: string): Promise<Device[]> {
    const headers: Record<string, string> = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetchClient("/auth/devices", { headers });
    if (!res.ok) throw new Error("Failed to fetch devices");
    return res.json();
}

export async function deleteDevice(sessionId: number, token?: string): Promise<void> {
    const headers: Record<string, string> = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetchClient(`/auth/devices/${sessionId}`, { 
        method: "DELETE",
        headers 
    });
    if (!res.ok) throw new Error("Failed to delete device");
}

// Plans & Redemption
export type PlanInfo = {
  email: string;
  plan_name: string | null;
  is_valid: boolean;
  expires_at: string | null;
  device_limit: number;
};

export async function getMyPlan(): Promise<PlanInfo> {
  const res = await fetchClient("/plans/me");
  if (!res.ok) throw new Error("Failed to fetch plan info");
  return res.json();
}

export async function redeemCode(code: string): Promise<any> {
  const res = await fetchClient("/plans/redeem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Redemption failed");
  }
  return res.json();
}

export const api = { getHealth, processFiles, fetchDownloadBlob, login, register, getDevices, deleteDevice, getMyPlan, redeemCode };
