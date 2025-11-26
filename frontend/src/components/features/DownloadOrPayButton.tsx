import { Locale, t } from "../../lib/i18n";
import { getTrialCount } from "../../lib/storage";
import { getPriceLabel } from "../../lib/pricing";
import { getRegion } from "../../lib/region";

type Props = {
  locale: Locale;
  disabled?: boolean;
  onDownload: () => void;
  onPay: () => void;
};

export default function DownloadOrPayButton({
  locale,
  disabled,
  onDownload,
  onPay,
}: Props) {
  const forceFree = (import.meta.env.VITE_FREE_MODE as string | undefined)?.toLowerCase() === "true";
  const trials = getTrialCount();
  const freeLeft = Math.max(0, 3 - trials);
  const isFree = forceFree || freeLeft > 0;
  const label = isFree ? t("downloadNow", locale) : t("payAndDownload", locale);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={isFree ? onDownload : onPay}
        className={`px-4 py-2 rounded-md ${
          isFree
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-black hover:bg-gray-800 text-white"
        } disabled:opacity-50`}
      >
        {label}
      </button>
      {!isFree && (
        <div className="text-sm text-gray-700">
          {t("priceLabel", locale)}：{getPriceLabel(getRegion(), locale)}
        </div>
      )}
    </div>
  );
}


