import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPdfPageCount, isPdf } from "../../lib/pdf";
import { Locale, t } from "../../lib/i18n";

type Props = {
  initialSlots?: number;
  onTotalPagesChange?: (total: number) => void;
  onSlotsChange?: (items: { file?: File; pageCount?: number }[]) => void;
  locale?: "zh-CN" | "en";
};

type Slot = {
  id: string;
  file?: File;
  pageCount?: number;
  loading?: boolean;
  error?: string;
};

function acceptFile(file: File): boolean {
  return /(pdf|png|jpe?g)$/i.test(file.name.split(".").pop() || "");
}

export default function UploadZone({
  initialSlots = 5,
  onTotalPagesChange,
  onSlotsChange,
  locale,
}: Props) {
  const [slots, setSlots] = useState<Slot[]>(
    Array.from({ length: initialSlots }).map((_, i) => ({
      id: `slot-${i + 1}-${Date.now()}`,
    }))
  );

  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const setFileFor = useCallback((slotIdx: number, file?: File) => {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = { ...next[slotIdx], file, loading: !!file, error: undefined, pageCount: undefined };
      return next;
    });
    if (file) {
      if (isPdf(file)) {
        getPdfPageCount(file)
          .then((pages) =>
            setSlots((prev) => {
              const next = [...prev];
              next[slotIdx] = { ...next[slotIdx], pageCount: pages, loading: false };
              return next;
            })
          )
          .catch(() =>
            setSlots((prev) => {
              const next = [...prev];
              next[slotIdx] = {
                ...next[slotIdx],
                loading: false,
                error: "PDF解析失败",
                pageCount: undefined,
              };
              return next;
            })
          );
      } else {
        setSlots((prev) => {
          const next = [...prev];
          next[slotIdx] = { ...next[slotIdx], pageCount: 1, loading: false };
          return next;
        });
      }
    }
  }, []);

  const move = useCallback((idx: number, dir: -1 | 1) => {
    setSlots((prev) => {
      const next = [...prev];
      const to = idx + dir;
      if (to < 0 || to >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[to];
      next[to] = tmp;
      return next;
    });
  }, []);

  const addSlot = useCallback(() => {
    setSlots((prev) => [...prev, { id: `slot-${prev.length + 1}-${Date.now()}` }]);
  }, []);

  const totalPages = useMemo(
    () => slots.reduce((sum, s) => sum + (s.file ? s.pageCount ?? 0 : 0), 0),
    [slots]
  );

  useEffect(() => {
    onTotalPagesChange?.(totalPages);
    onSlotsChange?.(slots.map((s) => ({ file: s.file, pageCount: s.pageCount })));
  }, [totalPages, onTotalPagesChange, onSlotsChange, slots]);

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot, idx) => (
          <div
            key={slot.id}
            className="rounded-lg border-2 border-dashed border-gray-300 bg-white"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <div className="text-sm text-gray-600">
                {t("position", locale as Locale)} {idx + 1}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="px-2 py-1 text-sm rounded border"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                >
                  {t("moveUp", locale as Locale)}
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-sm rounded border"
                  onClick={() => move(idx, 1)}
                  disabled={idx === slots.length - 1}
                >
                  {t("moveDown", locale as Locale)}
                </button>
                {slot.file && (
                  <button
                    type="button"
                    className="px-2 py-1 text-sm rounded border text-red-600"
                    onClick={() => setFileFor(idx, undefined)}
                  >
                    {t("clear", locale as Locale)}
                  </button>
                )}
              </div>
            </div>

            <div
              className="h-36 flex items-center justify-center cursor-pointer"
              onClick={() => fileInputs.current[slot.id]?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f && acceptFile(f)) setFileFor(idx, f);
              }}
            >
              {!slot.file ? (
                <div className="text-center px-4 text-sm text-gray-600">
                  {t("dragOrClickSingle", locale as Locale)}
                </div>
              ) : (
                <div className="px-4 text-center">
                  <div className="text-sm font-medium">{slot.file.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round(slot.file.size / 1024)} KB
                  </div>
                  {slot.loading && (
                    <div className="text-xs text-blue-600 mt-1">
                      {t("parsing", locale as Locale)}
                    </div>
                  )}
                  {!slot.loading && typeof slot.pageCount === "number" && (
                    <div className="text-xs text-green-700 mt-1">
                      {t("pages", locale as Locale)}：{slot.pageCount}
                    </div>
                  )}
                  {!slot.loading && slot.error && (
                    <div className="text-xs text-red-600 mt-1">{slot.error}</div>
                  )}
                </div>
              )}
              <input
                ref={(el) => (fileInputs.current[slot.id] = el)}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && acceptFile(f)) setFileFor(idx, f);
                  if (e.target) e.target.value = "";
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={addSlot}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-50"
        >
          <span className="text-lg leading-none">＋</span>
          <span>{t("addSlot", locale as Locale)}</span>
        </button>
      </div>
    </section>
  );
}


