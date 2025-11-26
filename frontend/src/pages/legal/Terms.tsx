import LegalLayout from "./LegalLayout";
import { getInitialLocale } from "../../lib/i18n";
import { getRegion } from "../../lib/region";

export default function Terms() {
  const locale = getInitialLocale(getRegion);
  const isZh = locale === "zh-CN";
  return (
    <LegalLayout title={isZh ? "用户协议 Terms of Service" : "Terms of Service / 用户协议"}>
      {isZh ? (
        <>
          <p><strong>最近更新日期：</strong>2025年11月26日</p>
          <p>本用户协议（“本协议”）系您（“用户”）与 <strong>VisaFileCompress</strong>（“我们”）之间就您访问与使用 <strong>visafilecompress.com</strong> 及相关服务所订立的法律协议。您访问或使用本服务，即表示您同意受本协议约束。</p>

          <h2>1. 服务内容</h2>
          <ul>
            <li>我们提供在线的文件/图片压缩、PDF 输出、预览等服务。</li>
            <li>我们可能对服务进行优化或升级，服务不保证在任何时间均可用。</li>
          </ul>

          <h2>2. 账户与付款</h2>
          <ul>
            <li>使用付费功能时，相关费用由 <strong>Paddle</strong> 处理与结算。</li>
            <li>您应保证向我们或 Paddle 提供的信息真实、准确、完整并保持更新。</li>
          </ul>

          <h2>3. 文件与内容处理</h2>
          <ul>
            <li>您上传的文件仅用于提供本服务所需的处理（如压缩）。</li>
            <li>压缩结果与预览具有保存时限，超时将自动删除。</li>
            <li>我们不审核、不传播、不共享您的文件内容。</li>
          </ul>

          <h2>4. 使用限制</h2>
          <ul>
            <li>不得将本服务用于违法、侵权、色情、暴力、仇恨、骚扰等用途。</li>
            <li>不得进行攻击、探测、过量调用、绕过访问控制或其他影响服务稳定性的行为。</li>
          </ul>

          <h2>5. 免责声明与责任限制</h2>
          <ul>
            <li>本服务按“现状”和“可用”基础提供，不对适用于特定目的作任何明示或暗示担保。</li>
            <li>对于不可抗力或第三方原因导致的服务中断或损失，我们不承担责任。</li>
          </ul>

          <h2>6. 计费、支付与退款</h2>
          <p>详见《可接受使用政策（AUP + 支付/退款）》，并受 <strong>Paddle</strong> 的政策约束。</p>

          <h2>7. 适用法律与争议解决</h2>
          <p>本协议受 <strong>加拿大</strong> 法律管辖。与本协议或本服务有关的争议，由有管辖权的法院解决。</p>
        </>
      ) : (
        <>
          <p><strong>Last Updated:</strong> Nov 26, 2025</p>
          <p>This Terms of Service (“Agreement”) is a legal agreement between you (“User”) and <strong>VisaFileCompress</strong> (“we”, “us”) governing your access to and use of <strong>visafilecompress.com</strong> and the related services. By accessing or using the Service, you agree to be bound by this Agreement.</p>

          <h2>1. Service</h2>
          <ul>
            <li>We provide online file/image compression, PDF output, and preview features.</li>
            <li>We may optimize or upgrade the Service; availability is not guaranteed at all times.</li>
          </ul>

          <h2>2. Accounts & Payments</h2>
          <ul>
            <li>Paid features are processed and settled by <strong>Paddle</strong>.</li>
            <li>You must ensure the information provided to us or Paddle is accurate, complete, and kept up to date.</li>
          </ul>

          <h2>3. Content Handling</h2>
          <ul>
            <li>Your uploaded files are used solely to provide the Service (e.g., compression).</li>
            <li>Outputs and previews are retained for a limited time and then auto‑deleted.</li>
            <li>We do not review, distribute, or share your file contents.</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <ul>
            <li>No illegal, infringing, pornographic, violent, hateful, or harassing uses.</li>
            <li>No attacks, probing, excessive calls, access‑control circumvention, or any activity that destabilizes the Service.</li>
          </ul>

          <h2>5. Disclaimer & Limitation of Liability</h2>
          <ul>
            <li>The Service is provided “as is” and “as available,” without warranties of any kind.</li>
            <li>We are not liable for outages or losses arising from force majeure or third‑party causes.</li>
          </ul>

          <h2>6. Billing, Payment & Refund</h2>
          <p>See the “Acceptable Use Policy (AUP) + Payment/Refund” for details, subject to <strong>Paddle</strong> policy.</p>

          <h2>7. Governing Law & Dispute Resolution</h2>
          <p>This Agreement is governed by the laws of <strong>Canada</strong>. Disputes shall be resolved by competent courts.</p>
        </>
      )}
    </LegalLayout>
  );
}


