import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
// 使用 .js + ?url，避免服务端对 .mjs 的错误 MIME 映射导致加载失败
// @ts-ignore
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

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


