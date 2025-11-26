import { useMemo, useState, useCallback } from "react";
import UploadZone from "../components/features/UploadZone";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import { SIZE_OPTIONS } from "../config";
import LanguageToggle from "../components/ui/LanguageToggle";
import { Locale, getInitialLocale, t } from "../lib/i18n";
import { getRegion } from "../lib/region";
import PreviewPanel from "../components/features/PreviewPanel";
import DownloadOrPayButton from "../components/features/DownloadOrPayButton";
import { api } from "../lib/api";
import { saveBlob } from "../lib/download";
import { Link } from "react-router-dom";
import { getTrialCount, incrementTrialCount } from "../lib/storage";
import BrowserSupport from "../components/features/BrowserSupport";
import ProgressBar from "../components/ui/ProgressBar";

export default function Home() {
  const [targetSizeMb, setTargetSizeMb] = useState<number>(SIZE_OPTIONS[0].value);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [locale, setLocale] = useState<Locale>(() => getInitialLocale(getRegion));
  const [slotItems, setSlotItems] = useState<{ file?: File; pageCount?: number }[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [resultPageCount, setResultPageCount] = useState<number | undefined>(undefined);
  const [processing, setProcessing] = useState(false);
  const [fileToken, setFileToken] = useState<string | null>(null);
  const [resultSizeBytes, setResultSizeBytes] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const maxPages = useMemo(
    () => SIZE_OPTIONS.find((o) => o.value === targetSizeMb)?.maxPages ?? 0,
    [targetSizeMb]
  );

  const handleProcess = useCallback(async () => {
    if (processing) return;
    const files = slotItems.map((s) => s.file).filter(Boolean) as File[];
    if (files.length === 0) return;
    if (totalPages > maxPages) return;
    setErrorMsg(null);
    setProcessing(true);
    try {
      const form = new FormData();
      form.append("target_size_mb", String(targetSizeMb));
      files.forEach((f) => form.append("files", f));
      const res = await api.processFiles(form);
      setFileToken(res.file_token);
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
      const origin = new URL(apiBase).origin;
      setPreviewUrls((res.preview_urls || []).map((u) => (u.startsWith("/") ? origin + u : u)));
      setResultPageCount(res.page_count);
      setResultSizeBytes(res.total_size_bytes ?? null);
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(`处理失败：${msg}`);
    } finally {
      setProcessing(false);
    }
  }, [processing, slotItems, totalPages, maxPages, targetSizeMb]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{t("appTitle", locale)}</h1>
          <LanguageToggle onChange={setLocale} />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        <div className="order-2 md:order-1">
          <BrowserSupport />
        </div>
        <div className="order-1 md:order-2">
          <section className="mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-64">
                <Select
                  label={t("targetSize", locale)}
                  value={String(targetSizeMb)}
                  onChange={(v) => setTargetSizeMb(Number(v))}
                  options={SIZE_OPTIONS.map((o) => ({
                    label: o.label,
                    value: String(o.value),
                  }))}
                />
              </div>
              <div className="text-gray-700">
                {t("maxPagesPrefix", locale)}：
                <span className="font-medium">{maxPages}</span>
              </div>
            </div>
          </section>

          <UploadZone
            initialSlots={5}
            onTotalPagesChange={setTotalPages}
            onSlotsChange={setSlotItems}
          />

          <div className="mt-4">
            <div className="text-sm">
              {t("totalPagesPrefix", locale)}：{" "}
              <span className={totalPages > maxPages ? "text-red-600 font-semibold" : "font-medium"}>
                {totalPages}
              </span>{" "}
              / {t("allowedMaxPrefix", locale)}：
              <span className="font-medium">{maxPages}</span>
            </div>
            {totalPages > maxPages && (
              <div className="text-xs text-red-600 mt-1">{t("exceedTip", locale)}</div>
            )}
          </div>

          <PreviewPanel className="mt-6" locale={locale} previewUrls={previewUrls} pageCount={resultPageCount} />

          {processing && (
            <div className="mt-6">
              <ProgressBar label="正在上传/压缩，请稍候…" />
            </div>
          )}

          {errorMsg && !processing && (
            <div className="mt-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 flex items-center justify-between">
              <div className="text-sm">{errorMsg}</div>
              <div className="flex items-center gap-2">
                <Button label="重试" onClick={handleProcess} />
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <Button
              label={processing ? "处理中…" : t("startCompressPlaceholder", locale)}
              onClick={handleProcess}
              disabled={processing || totalPages === 0 || totalPages > maxPages}
            />
            <DownloadOrPayButton
              locale={locale}
              disabled={processing || !fileToken || totalPages === 0 || totalPages > maxPages}
              onDownload={async () => {
                if (!fileToken) return;
                const forceFree = (import.meta.env.VITE_FREE_MODE as string | undefined)?.toLowerCase() === "true";
                const canUseTrial = forceFree || getTrialCount() < 3;
                try {
                  const { blob, filename } = await api.fetchDownloadBlob(fileToken, canUseTrial);
                  saveBlob(blob, filename);
                  if (canUseTrial && !forceFree) {
                    incrementTrialCount();
                  }
                } catch (e) {
                  console.error(e);
                  alert("下载失败，请稍后重试");
                }
              }}
              onPay={() => {
                alert("支付流程将接入 Paddle，当前为占位。");
              }}
            />
          </div>

          {resultSizeBytes !== null && (
            <div className="mt-3 text-sm text-gray-700">
              压缩后文件大小：{" "}
              <span className="font-medium">{(resultSizeBytes / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}
        </div>
      </main>
      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-gray-500">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link to="/privacy" className="hover:underline" target="_blank" rel="noopener noreferrer">隐私政策 / Privacy</Link>
          <Link to="/terms" className="hover:underline" target="_blank" rel="noopener noreferrer">用户协议 / Terms</Link>
          <Link to="/aup" className="hover:underline" target="_blank" rel="noopener noreferrer">可接受使用政策 / AUP</Link>
        </div>
      </footer>
    </div>
  );
}


