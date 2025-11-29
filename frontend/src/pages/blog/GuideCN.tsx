import BlogLayout from "../../components/layout/BlogLayout";

export default function GuideCN() {
  return (
    <BlogLayout>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
        2025 签证/留学文件压缩攻略：学信网、IRCC、ImmiAccount 上传失败的终极解决方案
      </h1>
      <div className="text-gray-500 mb-8 text-sm">
        发布时间：2025-11-30 · 分类：签证攻略 · 阅读：10k+
      </div>

      <div className="prose prose-blue max-w-none">
        <p className="text-lg mb-6">
          无论是申请<strong>加拿大签证 (IRCC)</strong>、<strong>澳洲 WHV</strong>，还是在国内进行<strong>学信网认证</strong>、<strong>留服中心学历认证</strong>，最让人崩溃的往往是那个红色的报错弹窗：
        </p>
        <blockquote className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 italic text-red-700">
          “文件大小超过限制 (File size exceeds limit)”<br/>
          “请上传小于 2MB 的 PDF 文件”
        </blockquote>
        
        <p className="mb-4">
          很多同学为了把文件压小，随便找个在线工具一压，结果<strong>字迹模糊、二维码扫不出来</strong>，最后直接导致<strong>拒签</strong>或<strong>退件</strong>。今天这篇“保姆级教程”，就教你如何安全、高清地搞定这一切。
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">一、 各大平台文件大小限制一览表 (2025最新)</h2>
        <p className="mb-4">建议收藏！这些数据来自官方最新指南。</p>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border p-2 text-left">申请平台</th>
                <th className="border p-2 text-left">常见限制</th>
                <th className="border p-2 text-left">避坑指南</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-medium">加拿大移民局 (IRCC/GCKey)</td>
                <td className="border p-2">4 MB</td>
                <td className="border p-2">必须是 PDF，不能加密。</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">澳洲移民局 (ImmiAccount)</td>
                <td className="border p-2">5 MB</td>
                <td className="border p-2">文件名只能含英文数字，推荐 96 DPI。</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">新西兰 (RealMe)</td>
                <td className="border p-2">2 MB</td>
                <td className="border p-2">照片必须是 JPG，文件是 PDF。</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">学信网 (CHSI)</td>
                <td className="border p-2">2 MB / 5 MB</td>
                <td className="border p-2">成绩单扫描件一定要清晰，否则审核不通过。</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">留服中心 (CSCSE)</td>
                <td className="border p-2">10 MB / 2 MB</td>
                <td className="border p-2">不同材料限制不同，学位证通常要求小于 2M。</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">二、 为什么普通压缩工具不行？</h2>
        <p className="mb-4">
            大部分工具（包括 Adobe 的某些预设）采用的是“全图模糊”策略。这会导致：
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>护照号/身份证号看不清</strong>：这是签证官审核的核心，模糊必拒。</li>
            <li><strong>印章/二维码糊成一团</strong>：学信网报告的验证码如果扫不出来，直接视为无效。</li>
            <li><strong>隐私泄露</strong>：很多免费网站会把你的文件保留 24 小时甚至更久，存在倒卖风险。</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">三、 正确的解决方案：VisaFileCompress</h2>
        <p className="mb-4">
            这就是我们开发 <a href="/" className="text-blue-600 font-bold underline">VisaFileCompress</a> 的原因。作为一款专为留学/移民 DIY 党设计的工具，它有三个“黑科技”：
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li><strong>智能分层压缩</strong>：它能识别出“文字”和“背景”。把背景压得很糊（省空间），但把文字保留在 300 DPI（保清晰）。亲测 10MB 的成绩单压到 1MB，字迹依然锐利。</li>
            <li><strong>自动 A4 纠偏</strong>：手机拍的文件往往是歪的，或者大小不一。它会自动旋转、裁剪并统一成标准的 A4 竖版 PDF。</li>
            <li><strong>阅后即焚</strong>：文件处理完 6 小时后，服务器会自动物理删除，绝不留底。</li>
        </ol>

        <h2 className="text-2xl font-bold mt-8 mb-4">四、 手把手操作教程 (3步搞定)</h2>
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="font-bold mb-2">Step 1: 上传文件</h3>
            <p className="mb-4">直接把你的 PDF、JPG、PNG 拖进 <a href="/" className="text-blue-600 underline">首页上传区</a>。支持批量上传（比如把护照页、签证页一起拖进去）。</p>
            
            <h3 className="font-bold mb-2">Step 2: 设定目标大小</h3>
            <p className="mb-4">比如你要传加拿大 IRCC，就选 <strong>4MB</strong>；要传学信网，就选 <strong>2MB</strong>。</p>
            
            <h3 className="font-bold mb-2">Step 3: 下载</h3>
            <p>点击“开始处理”，几秒钟后即可下载。如果是付费会员，还能享受无限次高速处理。</p>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">常见问题 (Q&A)</h2>
        
        <h3 className="font-bold mt-4">Q: 如果压缩后还是超过限制怎么办？</h3>
        <p className="mb-2">A: 可以尝试分卷上传（如果平台允许），或者在 VisaFileCompress 中选择更小的目标尺寸（如 1MB）。通常 1MB 对于 A4 文档来说，清晰度也是够用的。</p>
        
        <h3 className="font-bold mt-4">Q: 手机拍的照片可以直接转 PDF 吗？</h3>
        <p className="mb-2">A: 可以！VisaFileCompress 支持直接上传 JPG/PNG 图片，会自动帮你转成 PDF 并排版。</p>

        <div className="mt-12 p-6 bg-gray-100 rounded-lg text-center">
            <p className="text-lg font-medium mb-4">搞定文件大小，离下签就更近一步！</p>
            <a href="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                立即免费压缩文件
            </a>
        </div>
      </div>
    </BlogLayout>
  );
}

