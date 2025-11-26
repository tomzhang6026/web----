export type Locale = "zh-CN" | "en";

const dict: Record<Locale, Record<string, string>> = {
  "zh-CN": {
    appTitle: "VISA签证文件专用智能压缩工具",
    pcOnly: "仅限 PC 浏览器访问",
    pcOnlyHint: "请使用桌面浏览器（Chrome/Edge/Firefox/Safari）打开以获得最佳体验。",
    targetSize: "目标压缩后大小",
    maxPagesPrefix: "对应最大上传页数",
    totalPagesPrefix: "已选择总页数",
    allowedMaxPrefix: "允许最大",
    exceedTip: "超出最大页数限制，请减少页数或提高目标大小。",
    position: "位置",
    clear: "清除",
    moveUp: "上移",
    moveDown: "下移",
    addSlot: "新增上传位置",
    dragOrClickSingle: "拖拽或点击上传 单个 PDF/图片",
    parsing: "解析页数中…",
    pages: "页数",
    downloadNow: "免费下载",
    payAndDownload: "付费后下载",
    pricePending: "价格待确认",
    priceLabel: "价格",
    startCompressPlaceholder: "开始压缩（占位）",
    preview: "文件预览",
  },
  en: {
    appTitle: "Smart Compression for Visa Documents",
    pcOnly: "Desktop browsers only",
    pcOnlyHint: "Please use a desktop browser (Chrome/Edge/Firefox/Safari) for best experience.",
    targetSize: "Target size after compression",
    maxPagesPrefix: "Max allowed pages",
    totalPagesPrefix: "Total selected pages",
    allowedMaxPrefix: "Allowed max",
    exceedTip: "Exceeded max pages. Reduce pages or increase target size.",
    position: "Slot",
    clear: "Clear",
    moveUp: "Up",
    moveDown: "Down",
    addSlot: "Add upload slot",
    dragOrClickSingle: "Drag or click to upload one PDF/Image",
    parsing: "Parsing pages…",
    pages: "pages",
    downloadNow: "Download (Free)",
    payAndDownload: "Pay & Download",
    pricePending: "Price TBD",
    priceLabel: "Price",
    startCompressPlaceholder: "Start compression (placeholder)",
    preview: "Preview",
  },
};

let currentLocale: Locale | null = null;
const STORAGE_KEY = "locale";

export function detectLocale(): Locale {
  const lang = (navigator.language || "").toLowerCase();
  return lang.startsWith("zh") ? "zh-CN" : "en";
}

export function getInitialLocale(getRegion?: () => "CN" | "ROW"): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "zh-CN" || saved === "en") {
      currentLocale = saved;
      return saved;
    }
  } catch {}
  if (getRegion && getRegion() === "CN") {
    currentLocale = "zh-CN";
    return "zh-CN";
  }
  const d = detectLocale();
  currentLocale = d;
  return d;
}

export function setCurrentLocale(locale: Locale) {
  currentLocale = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {}
}

export function getCurrentLocale(): Locale {
  return currentLocale ?? detectLocale();
}

export function t(key: string, locale?: Locale): string {
  const l = locale ?? getCurrentLocale();
  return dict[l][key] ?? key;
}


