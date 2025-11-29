import BlogLayout from "../../components/layout/BlogLayout";
import { Link } from "react-router-dom";

export default function BlogIndex() {
  return (
    <BlogLayout>
      <h1 className="text-3xl font-bold mb-8">Blog & Guides</h1>
      <div className="grid gap-6">
        {/* Guide 1: CN Visa */}
        <Link to="/blog/visa-file-compression-guide-cn" className="block p-6 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
           <h2 className="text-xl font-bold text-blue-600 mb-2">2025 签证/留学文件压缩攻略 (中文版)</h2>
           <p className="text-gray-600">解决学信网、IRCC、留服中心上传文件过大的问题。</p>
           <div className="mt-4 text-sm text-gray-400">Nov 30, 2025</div>
        </Link>
        
        {/* Guide 2: EN Visa */}
        <Link to="/blog/visa-file-compression-guide-en" className="block p-6 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
           <h2 className="text-xl font-bold text-blue-600 mb-2">How to Compress PDF for Visa Application (2025 Guide)</h2>
           <p className="text-gray-600">Optimizing documents for Canada, Australia, UK, and US visa applications.</p>
           <div className="mt-4 text-sm text-gray-400">Nov 30, 2025</div>
        </Link>
        
        {/* Guide 3: DPI */}
        <Link to="/blog/why-pdf-size-too-large-dpi-cn" className="block p-6 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
           <h2 className="text-xl font-bold text-blue-600 mb-2">为什么我的 PDF 只有 1 页却有 10MB？—— 揭秘扫描仪的 DPI 陷阱</h2>
           <p className="text-gray-600">不懂 DPI 设置？本文教你如何无损瘦身。</p>
           <div className="mt-4 text-sm text-gray-400">Nov 30, 2025</div>
        </Link>

        {/* Guide 4: Top Tools */}
        <Link to="/blog/top-5-passport-photo-tools-en" className="block p-6 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all">
           <h2 className="text-xl font-bold text-blue-600 mb-2">Top 5 Free Tools to Resize Passport Photos for US DS-160</h2>
           <p className="text-gray-600">A detailed comparison of the best tools in 2025.</p>
           <div className="mt-4 text-sm text-gray-400">Nov 30, 2025</div>
        </Link>
      </div>
    </BlogLayout>
  );
}
