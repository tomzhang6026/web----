import React from 'react';
import { Locale, t } from '../../lib/i18n';

interface SEOFAQProps {
  locale: Locale;
}

export default function SEOFAQ({ locale }: SEOFAQProps) {
  const faqs = [
    {
      q: locale === 'zh-CN' ? '上传的文件安全吗？' : 'Is it safe to upload my passport/documents?',
      a: locale === 'zh-CN' 
        ? '非常安全。您的文件通过 HTTPS 加密传输，处理完全自动化，并在 1 小时后自动从服务器永久删除。' 
        : 'Yes, absolutely. Your files are transferred via encrypted HTTPS, processed automatically, and permanently deleted from our servers after 1 hour.'
    },
    {
      q: locale === 'zh-CN' ? '为什么我的加拿大签证文件总是上传失败？' : 'Why does my file fail to upload to Canada IRCC (GCKey)?',
      a: locale === 'zh-CN' 
        ? 'IRCC 对每个插槽有 4MB 的严格限制。如果你尝试上传高清扫描件，通常会失败。我们的工具专为解决此问题设计，可将其压缩至 4MB 以下而不模糊。' 
        : 'IRCC has a strict 4MB limit per slot. If you upload high-res scans, they often fail. Our tool is specifically tuned to compress documents under 4MB while keeping text readable.'
    },
    {
      q: locale === 'zh-CN' ? '是否支持压缩澳洲 ImmiAccount 的文件？' : 'Does this work for Australia ImmiAccount?',
      a: locale === 'zh-CN' 
        ? '支持。澳洲签证要求 5MB 以内的文件。使用我们的 "5MB (Australia)" 预设即可完美适配。' 
        : 'Yes. Australian visas require files under 5MB. Simply use our "5MB (Australia)" preset to ensure your files are accepted.'
    },
    {
      q: locale === 'zh-CN' ? '我可以免费使用吗？' : 'Is this service free?',
      a: locale === 'zh-CN' 
        ? '是的，我们提供免费试用模式，无需信用卡即可开始压缩。' 
        : 'Yes, we offer a free trial mode. You can start compressing your visa documents immediately without a credit card.'
    }
  ];

  // JSON-LD for FAQPage (helps Google display Q&A in search results)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {locale === 'zh-CN' ? '常见问题 (FAQ)' : 'Frequently Asked Questions'}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((f, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">{f.q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

