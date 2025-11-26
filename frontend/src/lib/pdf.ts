import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
// @ts-ignore
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorker;

export async function getPdfPageCount(file: File): Promise<number> {
  const buffer = await file.arrayBuffer();
  const task = getDocument({ data: buffer });
  const doc = await task.promise;
  const pages = doc.numPages;
  await doc.destroy();
  return pages;
}

export function isPdf(file: File): boolean {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  return file.type === "application/pdf" || ext === "pdf";
}


