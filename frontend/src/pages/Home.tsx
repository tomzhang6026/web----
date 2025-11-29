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
import { getTrialCount, incrementTrialCount, MAX_DAILY_FREE } from "../lib/storage";
import BrowserSupport from "../components/features/BrowserSupport";
import ProgressBar from "../components/ui/ProgressBar";
import { trackEvent, GA_EVENTS } from "../lib/analytics";
import { useAuth } from "../contexts/AuthContext";

function HeroGuide({ locale }: { locale: Locale }) {
  const steps = [
    {
      icon: "🎯",
      title: locale === "zh-CN" ? "1. 设定目标大小" : "1. Set Target Size",
      desc: locale === "zh-CN" ? "选择期望的文件大小 (1MB ~ 5MB)" : "Choose your desired file size limit",
    },
    {
      icon: "📂",
      title: locale === "zh-CN" ? "2. 批量上传 & 排序" : "2. Upload & Sort",
      desc: locale === "zh-CN" ? "拖入多个图片/PDF，按需调整顺序" : "Drag & drop multiple files, reorder them",
    },
    {
      icon: "⬇️",
      title: locale === "zh-CN" ? "3. 智能压缩 & 下载" : "3. Compress & Download",
      desc: locale === "zh-CN" ? "自动排版为A4竖向，试用免费下载" : "Auto-layout to A4 portrait, free trial",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {steps.map((s, i) => (
        <div key={i} className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="text-4xl mb-3">{s.icon}</div>
          <h3 className="font-bold text-gray-800 mb-1">{s.title}</h3>
          <p className="text-sm text-gray-500">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

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
  const { isLoggedIn } = useAuth();
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
    
    trackEvent(GA_EVENTS.PROCESS_START, { target_size_mb: targetSizeMb, file_count: files.length });

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
          <div className="flex items-center gap-4">
             {isLoggedIn ? (
                 <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                     {locale === "zh-CN" ? "我的账户" : "My Account"}
                 </Link>
             ) : (
                 <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                     {locale === "zh-CN" ? "登录 / 注册" : "Login / Sign up"}
                 </Link>
             )}
             <LanguageToggle onChange={setLocale} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        <div className="order-2 md:order-1">
          <BrowserSupport />
        </div>
        <div className="order-1 md:order-2">
          
          <HeroGuide locale={locale} />

          <section className="mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-64">
                <Select
                  label={t("targetSize", locale)}
                  value={String(targetSizeMb)}
                  onChange={(v) => {
                      setTargetSizeMb(Number(v));
                      // Implicit Data Collection
                      const label = SIZE_OPTIONS.find(o => o.value === Number(v))?.label || "";
                      let dest = "unknown";
                      if (label.includes("Canada")) dest = "Canada";
                      if (label.includes("Australia")) dest = "Australia";
                      if (label.includes("US")) dest = "USA";
                      if (label.includes("UK")) dest = "UK";
                      if (label.includes("Schengen")) dest = "Schengen";
                      if (label.includes("China") || label.includes("学信网")) dest = "China";
                      
                      if (dest !== "unknown") {
                          trackEvent("select_destination", { destination: dest });
                      }
                  }}
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
            locale={locale}
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
                // 检查免费次数
                const canUseTrial = forceFree || getTrialCount() < MAX_DAILY_FREE; 
                
                try {
                  const { blob, filename } = await api.fetchDownloadBlob(fileToken, canUseTrial);
                  saveBlob(blob, filename);
                  trackEvent(GA_EVENTS.FILE_DOWNLOAD, { file_token: fileToken, is_paid: !canUseTrial });
                  
                  if (canUseTrial && !forceFree) {
                    incrementTrialCount();
                  }
                } catch (e) {
                  console.error(e);
                  alert("下载失败，请稍后重试");
                }
              }}
              onPay={() => {
                trackEvent(GA_EVENTS.PAYMENT_INITIATE, { file_token: fileToken });
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
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 border-b border-gray-200 pb-4">
           <span className="font-semibold text-gray-700">Guides:</span>
           <Link to="/blog/visa-file-compression-guide-cn" className="text-blue-600 hover:underline">签证文件压缩攻略</Link>
           <Link to="/blog/visa-file-compression-guide-en" className="text-blue-600 hover:underline">Visa PDF Guide</Link>
           <Link to="/blog/why-pdf-size-too-large-dpi-cn" className="text-blue-600 hover:underline">DPI 陷阱揭秘</Link>
           <Link to="/blog/top-5-passport-photo-tools-en" className="text-blue-600 hover:underline">Passport Photo Tools</Link>
           <Link to="/blog" className="text-gray-400 hover:text-gray-600 hover:underline ml-auto">View All →</Link>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link to="/privacy" className="hover:underline" target="_blank" rel="noopener noreferrer">隐私政策 / Privacy</Link>
          <Link to="/terms" className="hover:underline" target="_blank" rel="noopener noreferrer">用户协议 / Terms</Link>
          <Link to="/aup" className="hover:underline" target="_blank" rel="noopener noreferrer">可接受使用政策 / AUP</Link>
        </div>
      </footer>
    </div>
  );
}
