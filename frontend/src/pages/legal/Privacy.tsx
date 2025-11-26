import LegalLayout from "./LegalLayout";
import { getInitialLocale } from "../../lib/i18n";
import { getRegion } from "../../lib/region";

export default function Privacy() {
  const locale = getInitialLocale(getRegion);
  const isZh = locale === "zh-CN";
  return (
    <LegalLayout title={isZh ? "隐私政策 Privacy Policy" : "Privacy Policy / 隐私政策"}>
      {isZh ? (
        <>
          <p><strong>最近更新日期：</strong>2025年11月26日</p>
          <p>本隐私政策（“本政策”）适用于我们（“VisaFileCompress”“我们”）在您（“您/用户”）使用 <strong>visafilecompress.com</strong> 提供的网站、API、文档上传压缩服务以及由 Paddle 提供的支付服务（统称“本服务”）时对您的信息之收集、使用、存储与保护。使用本服务即表示您已阅读并同意本政策。</p>

          <h2>1. 我们收集的信息</h2>
          <h3>1.1 您主动提供的信息</h3>
          <ul>
            <li>联系方式（用于账户/订单沟通、发票寄送等）。</li>
            <li>支付相关识别信息（由 Paddle 处理，我们不接触银行卡信息）。</li>
            <li>与客服沟通的内容。</li>
          </ul>
          <h3>1.2 自动收集的信息</h3>
          <ul>
            <li>IP 地址（用于安全、反滥用）。</li>
            <li>浏览器与设备信息。</li>
            <li>操作与性能日志（用于问题定位与改进）。</li>
            <li>Cookies（仅用于站点基础功能，不做广告追踪）。</li>
          </ul>
          <h3>1.3 文件与内容处理</h3>
          <p>为提供文件压缩等服务，我们会在短期内处理并暂存您上传的文件内容：</p>
          <ul>
            <li>处理完成后，文件将在设定的时限内自动清理；预览文件默认保留约 <strong>6 小时</strong>（以配置为准）。</li>
            <li>我们不会将文件内容用于广告、画像或与本服务无关的目的。</li>
          </ul>

          <h2>2. 我们如何使用信息</h2>
          <ul>
            <li>提供、维护、改进文件压缩与下载等功能。</li>
            <li>处理与核验支付记录（由 Paddle 完成）。</li>
            <li>安全与反滥用（限制恶意请求/风控）。</li>
            <li>网站功能维护与性能优化。</li>
            <li>符合法律法规的留存义务。</li>
          </ul>
          <p><strong>我们不会：</strong></p>
          <ul>
            <li>出售您的个人数据。</li>
            <li>将文件内容用于广告、画像、训练等与服务无关的用途。</li>
          </ul>

          <h2>3. 数据处理的法律基础（适用于 GDPR 用户）</h2>
          <ul>
            <li>为履行与您之间的合同（提供本服务）所必需；</li>
            <li>符合法律合规要求（安全、反滥用等）；</li>
            <li>基于您的同意（例如 Cookies 与特定数据存储）。</li>
          </ul>

          <h2>4. Cookies 使用</h2>
          <ul>
            <li>站点基础功能；</li>
            <li>（如适用）登录状态与偏好保持；</li>
            <li>安全与防滥用。</li>
          </ul>
          <p>我们不使用第三方广告追踪 Cookies。</p>

          <h2>5. 数据保留时长</h2>
          <ul>
            <li>上传/生成的文件：到期自动清理（预览约 6 小时，具体以配置为准）。</li>
            <li>账户/订单数据：按法定要求保留。</li>
            <li>支付记录：遵循支付平台（Paddle）的合规要求，可能保留至法定年限。</li>
          </ul>

          <h2>6. 数据安全措施</h2>
          <ul>
            <li>全站 HTTPS 传输加密。</li>
            <li>最小权限访问控制。</li>
            <li>文件到期自动清理。</li>
            <li>按需部署防爬虫与 DDoS 防护。</li>
          </ul>

          <h2>7. 第三方共享</h2>
          <ul>
            <li>支付服务提供商 <strong>Paddle</strong>（交易与发票处理）。</li>
            <li>依法合规的监管/执法要求。</li>
          </ul>
          <p>我们不向第三方出售您的个人信息。</p>

          <h2>8. 您的权利（GDPR/CCPA）</h2>
          <ul>
            <li>访问、纠正、删除您的数据；</li>
            <li>限制或反对特定处理；</li>
            <li>数据可携带（在可行范围内）。</li>
          </ul>

          <h2>9. 未成年人隐私</h2>
          <p>本服务不面向 13 岁以下的未成年人，我们不会有意收集其数据。</p>

          <h2>10. 联系方式</h2>
          <p>如对本政策有任何问题，请联系：<strong>hsktestuk@gmail.com</strong></p>
        </>
      ) : (
        <>
          <p><strong>Last Updated:</strong> Nov 26, 2025</p>
          <p>This Privacy Policy (“Policy”) explains how <strong>VisaFileCompress</strong> (“we”, “us”) collects, uses, stores and protects your information when you (“you”/“user”) use the website, API, document upload/compression services, and payments processed by Paddle (collectively, the “Service”) at <strong>visafilecompress.com</strong>. By using the Service, you acknowledge that you have read and agree to this Policy.</p>

          <h2>1. Information We Collect</h2>
          <h3>1.1 Information You Provide</h3>
          <ul>
            <li>Contact information (for account/order communication and invoicing).</li>
            <li>Payment identification information (processed by Paddle; we do not access card data).</li>
            <li>Content of customer support communications.</li>
          </ul>
          <h3>1.2 Information Collected Automatically</h3>
          <ul>
            <li>IP address (for security and anti‑abuse).</li>
            <li>Browser and device information.</li>
            <li>Operational and performance logs (for troubleshooting and improvements).</li>
            <li>Cookies (for basic site functionality only; no ad tracking).</li>
          </ul>
          <h3>1.3 Files and Content Processing</h3>
          <p>To provide compression and related features, we temporarily process and store your uploaded files:</p>
          <ul>
            <li>Files are automatically deleted after a configured retention; previews are kept for about <strong>6 hours</strong> by default (subject to configuration).</li>
            <li>We do not use file contents for advertising, profiling, or any purpose unrelated to the Service.</li>
          </ul>

          <h2>2. How We Use Information</h2>
          <ul>
            <li>To provide, maintain, and improve compression and download features.</li>
            <li>To process and verify payments (performed by Paddle).</li>
            <li>For security and anti‑abuse (rate‑limiting, risk control).</li>
            <li>To maintain functionality and optimize performance.</li>
            <li>To satisfy legal and compliance obligations.</li>
          </ul>
          <p><strong>We do not:</strong></p>
          <ul>
            <li>Sell your personal data.</li>
            <li>Use file contents for advertising, profiling, or model training unrelated to the Service.</li>
          </ul>

          <h2>3. Legal Bases (GDPR)</h2>
          <ul>
            <li>Necessary to perform our contract with you (to provide the Service);</li>
            <li>Compliance with legal obligations (security, anti‑abuse, etc.);</li>
            <li>Your consent (e.g., Cookies and certain storage).</li>
          </ul>

          <h2>4. Cookies</h2>
          <ul>
            <li>Basic site functionality;</li>
            <li>(If applicable) session and preference retention;</li>
            <li>Security and anti‑abuse.</li>
          </ul>
          <p>We do not use third‑party ad tracking Cookies.</p>

          <h2>5. Data Retention</h2>
          <ul>
            <li>Uploaded/generated files: auto‑deleted upon expiry (previews ~6 hours by default; subject to configuration).</li>
            <li>Account/order data: retained as required by law.</li>
            <li>Payment records: retained per Paddle’s compliance requirements, up to statutory limits.</li>
          </ul>

          <h2>6. Security Measures</h2>
          <ul>
            <li>HTTPS across the site.</li>
            <li>Least‑privilege access control.</li>
            <li>Auto‑deletion of expired files.</li>
            <li>Anti‑scraping and DDoS protection as needed.</li>
          </ul>

          <h2>7. Sharing with Third Parties</h2>
          <ul>
            <li><strong>Paddle</strong> as the payment service provider (transactions and invoicing).</li>
            <li>Regulatory or law‑enforcement requirements.</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>

          <h2>8. Your Rights (GDPR/CCPA)</h2>
          <ul>
            <li>Access, rectify, and delete your data;</li>
            <li>Restrict or object to certain processing;</li>
            <li>Data portability (where feasible).</li>
          </ul>

          <h2>9. Children’s Privacy</h2>
          <p>The Service is not directed to children under 13, and we do not knowingly collect their data.</p>

          <h2>10. Contact</h2>
          <p>For any questions regarding this Policy, please contact: <strong>hsktestuk@gmail.com</strong></p>
        </>
      )}
    </LegalLayout>
  );
}


