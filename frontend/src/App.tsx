import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DeviceManagement from "./pages/DeviceManagement";
import Profile from "./pages/Profile";
import { getInitialLocale, t } from "./lib/i18n";
import { getRegion } from "./lib/region";
import { Routes, Route, Link } from "react-router-dom";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import AUP from "./pages/legal/AUP";

// Blog Pages
import BlogIndex from "./pages/blog/BlogIndex";
import GuideCN from "./pages/blog/GuideCN";
import GuideEN from "./pages/blog/GuideEN";
import DpiGuideCN from "./pages/blog/DpiGuideCN";
import TopToolsEN from "./pages/blog/TopToolsEN";
import GuideUK from "./pages/blog/GuideUK";
import GuideAus from "./pages/blog/GuideAus";
import GuideSchengen from "./pages/blog/GuideSchengen";
import GuideUS from "./pages/blog/GuideUS";
import GuideCanada from "./pages/blog/GuideCanada";

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
      <Route path="/login" element={<PCGate><Login /></PCGate>} />
      <Route path="/register" element={<PCGate><Register /></PCGate>} />
      <Route path="/device-management" element={<PCGate><DeviceManagement /></PCGate>} />
      <Route path="/profile" element={<PCGate><Profile /></PCGate>} />
      
      {/* Blog Routes */}
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/visa-file-compression-guide-cn" element={<GuideCN />} />
      <Route path="/blog/visa-file-compression-guide-en" element={<GuideEN />} />
      <Route path="/blog/why-pdf-size-too-large-dpi-cn" element={<DpiGuideCN />} />
      <Route path="/blog/top-5-passport-photo-tools-en" element={<TopToolsEN />} />
      
      <Route path="/blog/uk-visa-file-requirements-guide" element={<GuideUK />} />
      <Route path="/blog/australia-visa-immiaccount-limit-guide" element={<GuideAus />} />
      <Route path="/blog/schengen-visa-digital-document-guide" element={<GuideSchengen />} />
      <Route path="/blog/us-visa-photo-requirements-ds160-guide" element={<GuideUS />} />
      <Route path="/blog/canada-visa-ircc-file-limit-guide" element={<GuideCanada />} />

      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/aup" element={<AUP />} />
    </Routes>
  );
}
