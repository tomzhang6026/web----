import BlogLayout from "../../components/layout/BlogLayout";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

export default function GuideCanada() {
  return (
    <BlogLayout>
      <article className="prose lg:prose-xl mx-auto">
        <span className="text-blue-600 font-semibold tracking-wide text-sm uppercase">
          Visa Guides
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
          IRCC (GCKey) File Size Limit: How to Upload Documents for Canada Visa
        </h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-8 border-b pb-6">
          <span>Last Updated: Nov 30, 2025</span>
          <span>•</span>
          <span>5 min read</span>
        </div>

        <p className="lead text-xl text-gray-600 mb-8">
          Whether applying for a Study Permit, Work Permit, or Visitor Visa, the Immigration, Refugees and Citizenship Canada (IRCC) portal is the gateway. And it has a very specific barrier: the <strong>4MB Limit</strong>.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. The "4MB Limit" Explained</h2>
        <p>
          Every single upload slot in your GCKey account (e.g., "Proof of Means of Financial Support", "Client Information") has a hard cap of <strong>4 MB (4,194,304 bytes)</strong>.
        </p>
        <p>
          <strong>The Challenge:</strong> The "Client Information" slot often requires you to combine your Letter of Explanation, Travel History, Additional Assets, and Family Photos into ONE file. This can easily reach 20MB+ if not compressed properly.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. "Validation Error" on IMM Forms</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <p className="font-bold text-yellow-800">Do NOT Compress IMM Forms!</p>
          <p className="text-yellow-700">
             Official application forms (like IMM5257, IMM1294) are digitally signed encrypted PDFs. <strong>Never attempt to compress these.</strong> Upload them exactly as you downloaded and validated them. Only compress your <em>supporting documents</em> (bank statements, letters, scans).
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Best Practices for "Client Information"</h2>
        <p>
          To fit 50 pages of evidence into 4MB:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 my-4">
          <li><strong>Resolution:</strong> Lower images to 96-100 DPI.</li>
          <li><strong>Color:</strong> Convert text-heavy pages (like bank statements) to Grayscale. Keep only ID photos in color.</li>
          <li><strong>Merge:</strong> Use a reliable PDF merger that re-encodes the stream.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. What if 4MB is Impossible?</h2>
        <p>
          If your file is still 6MB after extreme compression, you are likely including too many high-res photos. 
        </p>
        <p><strong>Solution:</strong> Paste your photos into a Word document first, resize them to fit the page, and "Save as PDF" with "Minimum Size" selected. Then run it through our compressor to squeeze the last 20%. </p>

        <div className="mt-12 p-8 bg-blue-50 rounded-xl text-center border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Solve the IRCC 4MB Headache</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Compress your Client Information / Letter of Explanation to exactly under 4MB without pixelating your text.
          </p>
          <Link to="/">
            <Button size="lg" label="Start Free Compression" />
          </Link>
        </div>
      </article>
    </BlogLayout>
  );
}

