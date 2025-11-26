type Props = {
  progress?: number; // 0-100; undefined 表示不确定进度
  label?: string;
  className?: string;
};

export default function ProgressBar({ progress, label, className }: Props) {
  const pct = typeof progress === "number" ? Math.max(0, Math.min(100, progress)) : undefined;
  return (
    <div className={className}>
      {label && <div className="mb-1 text-sm text-gray-700">{label}</div>}
      <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
        {typeof pct === "number" ? (
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        ) : (
          <div className="h-full bg-blue-600 animate-[progress_1.2s_ease_infinite]" style={{ width: "40%" }} />
        )}
      </div>
      <style>
        {`@keyframes progress{0%{margin-left:-40%}100%{margin-left:100%}}`}
      </style>
    </div>
  );
}


