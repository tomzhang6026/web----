import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

// 彻底移除 import 导入，直接硬编码路径
// 这样 Vite 就不会去打包 pdf.worker.mjs，也不会生成那个带有 hash 的文件引用
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
