import { Locale, getCurrentLocale, setCurrentLocale, t } from "../../lib/i18n";

type Props = {
  onChange?: (locale: Locale) => void;
};

export default function LanguageToggle({ onChange }: Props) {
  const value = getCurrentLocale();
  return (
    <select
      className="border rounded-md px-2 py-1 text-sm"
      value={value}
      onChange={(e) => {
        const l = e.target.value as Locale;
        setCurrentLocale(l);
        onChange?.(l);
      }}
      aria-label={t("Language")}
    >
      <option value="zh-CN">中文</option>
      <option value="en">English</option>
    </select>
  );
}


