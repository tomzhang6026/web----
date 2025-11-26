import { useMemo } from "react";
import { Locale, t } from "../../lib/i18n";

type Params = {
  previewUrls: string[];
  pageCount?: number;
  locale: Locale;
  className?: string;
};

export default function PreviewPanel({ previewUrls, pageCount, locale, className }: Params) {
  const urls = previewUrls || [];
  const pageWidth = 600; // px: approximate single A4 page width in preview
  const halfPageHeight = Math.round(pageWidth * Math.SQRT2 * 0.5); // A4 height ≈ sqrt(2) * width; take half

  const containerStyle: React.CSSProperties = useMemo(
    () => ({ width: pageWidth, maxWidth: "100%", height: halfPageHeight, overflowY: "auto" }),
    [pageWidth, halfPageHeight]
  );

  if (!urls.length) return null;

  return (
    <section className={className}>
      <h2 className="text-sm font-medium mb-2">{t("preview", locale)}</h2>
      <div className="border rounded-md bg-white" style={containerStyle}>
        <div className="flex flex-col">
          {urls.map((u, idx) => (
            <div key={u} className="border-b last:border-b-0">
              <img src={u} alt={`preview-${idx + 1}`} className="block w-full h-auto" draggable={false} />
            </div>
          ))}
        </div>
      </div>
      {typeof pageCount === "number" && (
        <div className="text-xs text-gray-600 mt-2">
          {t("pages", locale)}: {pageCount}
        </div>
      )}
    </section>
  );
}


