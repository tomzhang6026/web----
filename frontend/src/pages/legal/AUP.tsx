import LegalLayout from "./LegalLayout";
import { getInitialLocale } from "../../lib/i18n";
import { getRegion } from "../../lib/region";

export default function AUP() {
  const locale = getInitialLocale(getRegion);
  const isZh = locale === "zh-CN";
  return (
    <LegalLayout title={isZh ? "可接受使用政策（AUP + 支付/退款）" : "Acceptable Use Policy (AUP) + Payment/Refund"}>
      {isZh ? (
        <>
          <p><strong>最近更新日期：</strong>2025年11月26日</p>
          <h2>1. 禁止用途</h2>
          <ul>
            <li>违法、侵权、骚扰、仇恨、暴力、色情等内容。</li>
            <li>攻击、探测、批量爬取、绕过访问控制或破坏服务稳定性。</li>
            <li>利用服务生成或传播恶意内容、垃圾信息。</li>
          </ul>
          <h2>2. 相关限制</h2>
          <ul>
            <li>不得上传未经授权的受保护内容。</li>
            <li>遵守隐私与数据保护法律。</li>
            <li>遵守平台合理使用与速率限制。</li>
          </ul>
          <h2>3. API／站点使用限制（如适用）</h2>
          <ul>
            <li>不得绕过认证与计费。</li>
            <li>不得批量生成高风险流量影响服务稳定。</li>
            <li>不得伪造来源或冒充他人。</li>
          </ul>
          <h2>4. 支付与发票</h2>
          <ul>
            <li>所有支付由 Paddle（paddle.com）处理并开具发票。</li>
            <li>价格与税费以 Paddle 结算为准。</li>
          </ul>
          <h2>5. 退款政策</h2>
          <ul>
            <li>遵循 Paddle 政策。若无法使用或存在可验证问题，可邮件申请人工协助。</li>
            <li>已经成功使用或明显滥用的订单一般不支持退款。</li>
            <li>订阅类产品可在续费前取消；续费后按 Paddle 政策处理。</li>
          </ul>
          <h2>6. 合作与支持</h2>
          <ul>
            <li>我们可对滥用进行限制、暂停或终止。</li>
            <li>我们可在必要情况下要求补充身份或订单信息。</li>
          </ul>
          <h2>联系方式</h2>
          <p>退款或政策相关问题，请发送邮件至：<strong>hsktestuk@gmail.com</strong>（请附 Paddle 订单号）。</p>
        </>
      ) : (
        <>
          <p><strong>Last Updated:</strong> Nov 26, 2025</p>
          <h2>1. Prohibited Uses</h2>
          <ul>
            <li>Illegal, infringing, harassing, hateful, violent, or pornographic content.</li>
            <li>Attacks, probing, scraping at scale, bypassing access control, or destabilizing the Service.</li>
            <li>Generating or distributing malicious content or spam.</li>
          </ul>
          <h2>2. Restrictions</h2>
          <ul>
            <li>No upload of protected content without proper authorization.</li>
            <li>Comply with privacy and data‑protection laws.</li>
            <li>Respect reasonable‑use and rate limits.</li>
          </ul>
          <h2>3. API/Site Use (if applicable)</h2>
          <ul>
            <li>No bypassing authentication or billing.</li>
            <li>No large‑scale high‑risk traffic that destabilizes the Service.</li>
            <li>No spoofing source or impersonation.</li>
          </ul>
          <h2>4. Payment & Invoicing</h2>
          <ul>
            <li>All payments are processed and invoiced by Paddle (paddle.com).</li>
            <li>Prices and taxes are determined by Paddle checkout.</li>
          </ul>
          <h2>5. Refund Policy</h2>
          <ul>
            <li>Subject to Paddle policy. If you face verifiable issues, you may request assistance by email.</li>
            <li>Orders already used successfully or abused are generally non‑refundable.</li>
            <li>Subscriptions can be canceled before renewal; post‑renewal follows Paddle policy.</li>
          </ul>
          <h2>6. Enforcement & Support</h2>
          <ul>
            <li>We may limit, suspend, or terminate for abuse.</li>
            <li>We may request additional identity or order information when necessary.</li>
          </ul>
          <h2>Contact</h2>
          <p>Email for refund/policy issues: <strong>hsktestuk@gmail.com</strong> (include your Paddle Order ID).</p>
        </>
      )}
    </LegalLayout>
  );
}


