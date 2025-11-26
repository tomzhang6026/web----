const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function getHealth(): Promise<{ status: string }> {
  const res = await fetch(`${BASE_URL}/healthz`);
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
  const res = await fetch(`${BASE_URL}/files/process`, {
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
  const res = await fetch(
    `${BASE_URL}/files/download/${encodeURIComponent(fileToken)}?${
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

export const api = { getHealth, processFiles, fetchDownloadBlob };


