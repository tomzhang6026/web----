import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

// 指向 public 目录下的 worker 文件（手动复制并重命名为 .js）
// 这样可以规避服务器对 .mjs 文件的 MIME 类型检查问题
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export async function getPdfPageCount(file: File): Promise<number> {
  const buffer = await file.arrayBuffer();
  const task = getDocument({
    data: buffer,
    // 在严格 CSP 环境下更稳妥
    isEvalSupported: false,
    useWorkerFetch: false,
  });
  const doc = await task.promise;
  const pages = doc.numPages;
  await doc.destroy();
  return pages;
}

export function isPdf(file: File): boolean {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  return file.type === "application/pdf" || ext === "pdf";
}
