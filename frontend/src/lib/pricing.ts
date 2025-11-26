import { Region } from "./region";
import { Locale } from "./i18n";

export function getPriceLabel(region: Region, _locale?: Locale): string {
  // 占位：等待具体定价规则
  if (region === "CN") return "¥ 待定";
  return "$ TBD";
}


