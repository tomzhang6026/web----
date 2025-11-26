export default function BrowserSupport() {
  const browsers = [
    { name: "Chrome (最新两个版本)", note: "Windows / macOS" },
    { name: "Microsoft Edge (Chromium)", note: "Windows / macOS" },
    { name: "Firefox (最新两个版本)", note: "Windows / macOS" },
    { name: "Safari 15+", note: "macOS" },
    { name: "Opera (Chromium)", note: "Windows / macOS" },
    { name: "Brave (Chromium)", note: "Windows / macOS" },
    { name: "Vivaldi (Chromium)", note: "Windows / macOS" },
    { name: "Arc (Chromium)", note: "macOS" },
    { name: "QQ 浏览器(Chromium 内核)", note: "Windows" },
    { name: "360 极速浏览器(Chromium 内核)", note: "Windows" },
  ];
  return (
    <aside className="text-sm text-gray-700">
      <h2 className="font-medium mb-2">已适配的桌面浏览器</h2>
      <ul className="space-y-1">
        {browsers.map((b) => (
          <li key={b.name} className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-gray-400" />
            <span>
              {b.name}
              {b.note ? <span className="text-gray-500"> · {b.note}</span> : null}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mt-2">
        说明：工具仅支持桌面端浏览器，移动端已拦截。
      </p>
    </aside>
  );
}


