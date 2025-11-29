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
  previewUrl?: string;
  pageCount?: number;
  loading?: boolean;
  error?: string;
};

function acceptFile(file: File): boolean {
  // TODO: Add heic/webp later
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
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  // 处理单个文件的元数据（页数、预览图）
  const processFile = useCallback(async (file: File): Promise<{ pageCount?: number; error?: string }> => {
    if (isPdf(file)) {
      try {
        const pages = await getPdfPageCount(file);
        return { pageCount: pages };
      } catch (e) {
        return { error: "PDF解析失败" };
      }
    } else {
      // 图片默认为1页
      return { pageCount: 1 };
    }
  }, []);

  // 批量处理文件并填充到插槽
  const handleFiles = useCallback(
    async (files: FileList | File[], startIdx: number) => {
      const validFiles = Array.from(files)
        .filter(acceptFile)
        // 简单的按文件名排序，防止浏览器传来的乱序
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      if (validFiles.length === 0) return;

      setSlots((prev) => {
        const next = [...prev];
        let fileIdx = 0;

        // 1. 填充从 startIdx 开始的现有插槽
        for (let i = startIdx; i < next.length && fileIdx < validFiles.length; i++) {
            // 如果该插槽已有文件，我们可以选择覆盖，或者跳过。
            // 这里的逻辑是：用户点击了某个插槽上传，就从这个插槽开始覆盖/填充
            const file = validFiles[fileIdx++];
            next[i] = {
                ...next[i],
                file,
                loading: true,
                error: undefined,
                pageCount: undefined,
                previewUrl: !isPdf(file) ? URL.createObjectURL(file) : undefined,
            };
        }

        // 2. 如果文件还没填完，需要新增插槽
        while (fileIdx < validFiles.length) {
            const file = validFiles[fileIdx++];
            next.push({
                id: `slot-new-${Date.now()}-${fileIdx}`,
                file,
                loading: true,
                error: undefined,
                pageCount: undefined,
                previewUrl: !isPdf(file) ? URL.createObjectURL(file) : undefined,
            });
        }
        return next;
      });

      // 异步处理页数解析
      for (const file of validFiles) {
         processFile(file).then((res) => {
            setSlots(curr => curr.map(s => {
                if (s.file === file) {
                    return { ...s, loading: false, ...res };
                }
                return s;
            }));
         });
      }
    },
    [processFile]
  );

  const setFileFor = useCallback((slotIdx: number, file?: File) => {
    if (!file) {
      setSlots((prev) => {
        const next = [...prev];
        // 释放 ObjectURL
        if (next[slotIdx].previewUrl) URL.revokeObjectURL(next[slotIdx].previewUrl!);
        next[slotIdx] = { ...next[slotIdx], file: undefined, previewUrl: undefined, pageCount: undefined, loading: false, error: undefined };
        return next;
      });
      return;
    }
    handleFiles([file], slotIdx);
  }, [handleFiles]);

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

  // 拖拽排序逻辑
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    // 设置拖拽数据，用于验证来源
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // 必须阻止默认行为才能 allow drop
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    const sourceIdxStr = e.dataTransfer.getData("text/plain");
    // 只有当我们从这里开始拖拽时才处理（防止拖拽文件进来也被误判为排序）
    if (draggedIdx === null || sourceIdxStr !== String(draggedIdx)) return;
    
    const sourceIdx = draggedIdx;
    if (sourceIdx === targetIdx) {
        setDraggedIdx(null);
        return;
    }

    setSlots((prev) => {
      const next = [...prev];
      const [removed] = next.splice(sourceIdx, 1);
      next.splice(targetIdx, 0, removed);
      return next;
    });
    setDraggedIdx(null);
  };


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

  // 清理 ObjectURL
  useEffect(() => {
    return () => {
      slots.forEach(s => {
        if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
      });
    };
  }, []);

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot, idx) => (
          <div
            key={slot.id}
            className={`relative rounded-lg border-2 border-dashed bg-white overflow-hidden group transition-all
              ${draggedIdx === idx ? "opacity-50 border-blue-500 scale-95" : "border-gray-300 hover:border-blue-400"}
            `}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, idx)}
          >
            {/* Toolbar (Draggable Handle) */}
            <div 
              className="flex items-center justify-between px-2 py-1 bg-gray-200 border-b text-xs cursor-move select-none active:bg-gray-300 transition-colors"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={() => setDraggedIdx(null)}
              title="Drag to reorder"
            >
              <div className="flex items-center gap-2 font-medium text-gray-600">
                 <span className="text-gray-500">⠿</span>
                 <span>#{idx + 1}</span>
              </div>
              
              <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()} /* 防止点击按钮触发拖拽 */>
                <button
                  type="button"
                  className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  title={t("moveUp", locale as Locale)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30"
                  onClick={() => move(idx, 1)}
                  disabled={idx === slots.length - 1}
                  title={t("moveDown", locale as Locale)}
                >
                  ↓
                </button>
                {slot.file && (
                  <button
                    type="button"
                    className="p-1 ml-1 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded"
                    onClick={() => setFileFor(idx, undefined)}
                    title={t("clear", locale as Locale)}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Content Area (File Drop Zone) */}
            <div
              className="relative h-40 cursor-pointer flex flex-col items-center justify-center p-2"
              onClick={() => fileInputs.current[slot.id]?.click()}
              onDragOver={(e) => {
                  e.preventDefault(); // allow drop files
                  e.stopPropagation(); // stop bubbling to parent (which handles sort drop)
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation(); // stop bubbling
                if (e.dataTransfer.files?.length) {
                    handleFiles(e.dataTransfer.files, idx);
                }
              }}
            >
              {!slot.file ? (
                <div className="text-center text-gray-400">
                  <div className="text-3xl mb-2">+</div>
                  <div className="text-xs px-2">{t("dragOrClickSingle", locale as Locale)}</div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center">
                    {/* Preview Image / Icon */}
                    <div className="flex-1 w-full flex items-center justify-center overflow-hidden bg-gray-100 rounded mb-2 pointer-events-none">
                        {slot.previewUrl ? (
                            <img src={slot.previewUrl} alt="preview" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <span className="text-4xl text-red-500">PDF</span>
                        )}
                    </div>
                    
                    {/* File Info */}
                    <div className="w-full text-center">
                        <div className="text-xs font-medium truncate max-w-full" title={slot.file.name}>
                            {slot.file.name}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 mt-0.5">
                            <span>{Math.round(slot.file.size / 1024)} KB</span>
                            {slot.loading ? (
                                <span className="text-blue-500">Loading...</span>
                            ) : slot.error ? (
                                <span className="text-red-500">{slot.error}</span>
                            ) : (
                                <span className="text-green-600 font-bold">{slot.pageCount} P</span>
                            )}
                        </div>
                    </div>
                </div>
              )}

              <input
                ref={(el) => (fileInputs.current[slot.id] = el)}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                multiple // 允许批量上传
                onChange={(e) => {
                  if (e.target.files?.length) {
                      handleFiles(e.target.files, idx);
                  }
                  if (e.target) e.target.value = "";
                }}
              />
            </div>
          </div>
        ))}
        
        {/* Add Slot Button */}
        <button
          type="button"
          onClick={addSlot}
          className="h-full min-h-[180px] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <span className="text-3xl">+</span>
          <span className="text-sm mt-2">{t("addSlot", locale as Locale)}</span>
        </button>
      </div>
    </section>
  );
}
