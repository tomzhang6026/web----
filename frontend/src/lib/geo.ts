// 简单的 IP 地理位置检测
// 使用 sessionStorage 缓存结果，避免频繁调用免费 API

const CACHE_KEY = "vfc_user_country";

// Tier 1: Developed Economies (High Willingness To Pay)
const TIER1_COUNTRIES = [
  "US", "CA", "AU", "NZ", "GB", 
  "IE", "FR", "DE", "IT", "ES", "NL", "BE", "LU", "AT", "CH", "SE", "NO", "DK", "FI",
  "JP", "KR", "SG", "HK", "TW",
  "AE", "SA", "QA", "IL"
];

export type PricingTier = "CN" | "Tier1" | "Tier2";

export async function detectCountry(): Promise<string> {
  // 1. 检查缓存
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) return cached;

  try {
    // 2. 调用免费 API (ipapi.co 或者 ip-api.com)
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("Geo API failed");
    
    const data = await res.json();
    const country = data.country_code || "US"; // 默认 US
    
    // 3. 写入缓存
    sessionStorage.setItem(CACHE_KEY, country);
    return country;
  } catch (e) {
    console.warn("Failed to detect country, defaulting to US", e);
    return "US";
  }
}

export function isChina(countryCode: string): boolean {
  return countryCode === "CN";
}

export function getPricingTier(country: string): PricingTier {
  if (country === "CN") return "CN";
  if (TIER1_COUNTRIES.includes(country)) return "Tier1";
  return "Tier2"; // Rest of the world (India, SEA, LatAm, etc.)
}
