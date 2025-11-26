export type Region = "CN" | "ROW";

const CN_TIMEZONES = new Set([
  "Asia/Shanghai",
  "Asia/Chongqing",
  "Asia/Harbin",
  "Asia/Urumqi",
  "Asia/Hong_Kong",
  "Asia/Macau",
]);

export function getRegion(): Region {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && CN_TIMEZONES.has(tz)) return "CN";
  } catch {}
  const lang = (navigator.language || "").toLowerCase();
  if (lang.includes("zh-cn")) return "CN";
  return "ROW";
}


