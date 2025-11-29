import BlogLayout from "../../components/layout/BlogLayout";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

export default function GuideUS() {
  return (
    <BlogLayout>
      <article className="prose lg:prose-xl mx-auto">
        <span className="text-blue-600 font-semibold tracking-wide text-sm uppercase">
          Visa Guides
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
          US Visa (DS-160) Photo & Document Upload Rules: The Complete Guide
        </h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-8 border-b pb-6">
          <span>Last Updated: Nov 30, 2025</span>
          <span>•</span>
          <span>4 min read</span>
        </div>

        <p className="lead text-xl text-gray-600 mb-8">
          The US Department of State has one of the strictest automated photo checkers in the world for the DS-160 form. Additionally, the CEAC portal for immigrant visas has its own set of PDF rules.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. The Famous "2x2 Inch" Photo Rule</h2>
        <p>
          For B1/B2, F1, and H1B visas, the first hurdle is the digital photo.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 my-4">
          <li><strong>Dimensions:</strong> Must be square, minimum 600x600 pixels, maximum 1200x1200pixels.</li>
          <li><strong>File Size:</strong> Must be less than <strong>240 KB</strong>.</li>
          <li><strong>Compression Ratio:</strong> Less than 20:1.</li>
        </ul>
        <p className="bg-red-50 text-red-700 p-4 rounded border border-red-200">
          <strong>Common Error:</strong> "Photo quality is poor." This often happens if you over-compress the JPG. You need a tool that balances size (under 240KB) with quality.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. CEAC Portal (Immigrant/Green Card)</h2>
        <p>
          If you are uploading civil documents to the CEAC (Consular Electronic Application Center):
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 my-4">
          <li><strong>Format:</strong> PDF only (for documents) or JPG (for photos).</li>
          <li><strong>Max Size:</strong> <strong>2 MB</strong> per file (strictly enforced).</li>
          <li><strong>Orientation:</strong> All pages must be upright.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. "Review Page" Uploads (221g)</h2>
        <p>
          Sometimes you are asked to submit additional documents via email or a specific portal after an interview (221g administrative processing).
        </p>
        <p>
          In these cases, the rule is almost always: <strong>Merge everything into one PDF</strong>. Do not send 10 separate attachments.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. How to Fix "File Error"</h2>
        <p>
          If the US visa site rejects your file:
        </p>
        <ul className="list-decimal pl-6 space-y-2 text-gray-700 my-4">
          <li><strong>Check Filename:</strong> Use only English letters and numbers. Example: <code>Passport.pdf</code> not <code>护照.pdf</code>.</li>
          <li><strong>Check PDF Version:</strong> Avoid PDF 1.7 or higher features like embedded forms. Use a standard PDF compressor to "flatten" the file.</li>
        </ul>

        <div className="mt-12 p-8 bg-blue-50 rounded-xl text-center border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Fix Your DS-160 Photo & Files</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Get your photo under 240KB and your PDFs under 2MB instantly.
          </p>
          <Link to="/">
            <Button size="lg" label="Start Free Compression" />
          </Link>
        </div>
      </article>
    </BlogLayout>
  );
}

