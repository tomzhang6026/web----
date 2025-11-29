import BlogLayout from "../../components/layout/BlogLayout";

export default function DpiGuideCN() {
  return (
    <BlogLayout>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
        为什么我的 PDF 只有 1 页却有 10MB？—— 揭秘扫描仪的 DPI 陷阱
      </h1>
      <div className="text-gray-500 mb-8 text-sm">
        发布时间：2025-11-30 · 分类：技术科普 · 阅读：8k+
      </div>

      <div className="prose prose-blue max-w-none">
        <p className="text-lg mb-6">
          这可能是你在准备签证材料时遇到过最诡异的事情：明明只扫描了一张纸（比如无犯罪证明），结果生成的 PDF 文件竟然高达 <strong>10MB</strong> 甚至 <strong>20MB</strong>！而移民局网站（如 IRCC）只允许传 <strong>4MB</strong>。
        </p>
        <p className="mb-4">
          这到底是怎么回事？是我的扫描仪坏了吗？不，这是因为你不小心掉进了 <strong>DPI (分辨率)</strong> 的陷阱。
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">什么是 DPI？为什么它很重要？</h2>
        <p className="mb-4">
            DPI (Dots Per Inch) 指的是每英寸里有多少个墨点/像素。
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>72 DPI</strong>: 屏幕显示的最低标准（文件极小）。</li>
            <li><strong>150 DPI</strong>: 适合普通办公文档（如合同），清晰且体积适中。</li>
            <li><strong>300 DPI</strong>: 高清打印标准（如护照、证件）。</li>
            <li><strong>600 DPI+</strong>: 印刷级/照片级（文件巨大）。</li>
        </ul>
        <p className="mb-4">
            很多家用打印机/扫描仪的默认设置是 <strong>600 DPI</strong> 甚至是 <strong>1200 DPI</strong>。这就导致一张普通的 A4 纸，被当成了一张巨幅海报来扫描，文件体积自然爆炸。
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">常见的“错误”扫描姿势</h2>
        <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li><strong>选择了“照片模式”而非“文档模式”</strong>：照片模式通常会以最高 DPI 扫描。</li>
            <li><strong>保存为未压缩的 TIFF 或 BMP</strong>：这些格式不压缩数据，体积巨大。</li>
            <li><strong>全彩扫描了黑白文档</strong>：明明是黑白字的无犯罪证明，却用了 24位真彩色扫描，体积直接翻 3 倍。</li>
        </ol>

        <h2 className="text-2xl font-bold mt-8 mb-4">如何解决？(无需重新扫描)</h2>
        <p className="mb-4">
            如果你已经扫描完了，没必要再去折腾打印机。使用专业的压缩工具可以在不肉眼降低画质的情况下，把 DPI 降回合理的 <strong>150-200 DPI</strong>。
        </p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <h3 className="font-bold text-yellow-800">推荐方案：使用 VisaFileCompress</h3>
            <p className="text-sm mt-2 text-yellow-700">
                我们的工具会自动检测你的文件 DPI。如果发现过高（如 600+），它会智能重采样到 <strong>150 DPI (针对普通文档)</strong> 或 <strong>200 DPI (针对证件)</strong>，瞬间将 10MB 的文件压到 500KB，同时保持肉眼清晰。
            </p>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">实测数据对比</h2>
        <p className="mb-4">我们拿一张 A4 彩色学位证进行了测试：</p>
        <table className="min-w-full border border-gray-200 text-sm mb-6">
            <thead className="bg-gray-50">
                <tr>
                    <th className="border p-2">原始参数</th>
                    <th className="border p-2">文件大小</th>
                    <th className="border p-2">处理后 (VisaFileCompress)</th>
                    <th className="border p-2">处理后大小</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border p-2">600 DPI / 彩色</td>
                    <td className="border p-2 text-red-600 font-bold">25 MB</td>
                    <td className="border p-2">150 DPI / 智能色彩</td>
                    <td className="border p-2 text-green-600 font-bold">0.8 MB</td>
                </tr>
            </tbody>
        </table>

        <p className="text-lg font-bold mt-8">结论：</p>
        <p className="mb-8">
            不要被扫描仪的默认设置坑了。如果你不想研究复杂的参数，直接把大文件拖进 VisaFileCompress，我们帮你一键搞定“瘦身”。
        </p>
      </div>
    </BlogLayout>
  );
}

