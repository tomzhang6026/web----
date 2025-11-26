import Home from "./pages/Home";
import { getInitialLocale, t } from "./lib/i18n";
import { getRegion } from "./lib/region";
import { Routes, Route, Link } from "react-router-dom";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import AUP from "./pages/legal/AUP";

function isMobileDevice(): boolean {
  const ua = navigator.userAgent || navigator.vendor;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
}

function PCGate({ children }: { children: React.ReactNode }) {
  const locale = getInitialLocale(getRegion);
  if (isMobileDevice()) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">{t("pcOnly", locale)}</h1>
          <p className="text-gray-600">{t("pcOnlyHint", locale)}</p>
          <div className="mt-6 text-sm">
            <Link to="/privacy" className="text-blue-600 hover:underline mr-4" target="_blank" rel="noopener noreferrer">隐私政策 / Privacy</Link>
            <Link to="/terms" className="text-blue-600 hover:underline mr-4" target="_blank" rel="noopener noreferrer">用户协议 / Terms</Link>
            <Link to="/aup" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">可接受使用政策 / AUP</Link>
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PCGate><Home /></PCGate>} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/aup" element={<AUP />} />
    </Routes>
  );
}


