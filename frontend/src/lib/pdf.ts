import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
// 在部分生产环境中，直接使用 ?url 的 workerSrc 可能因路径或 MIME 导致加载失败。
// 采用 Vite 的 ?worker 方式创建专用 Worker，并通过 workerPort 传给 pdf.js，避免静态路径问题。
// @ts-ignore
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";

const workerInstance: Worker = new PdfWorker();
GlobalWorkerOptions.workerPort = workerInstance;

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


