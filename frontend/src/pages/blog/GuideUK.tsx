import BlogLayout from "../../components/layout/BlogLayout";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

export default function GuideUK() {
  return (
    <BlogLayout>
      <article className="prose lg:prose-xl mx-auto">
        <span className="text-blue-600 font-semibold tracking-wide text-sm uppercase">
          Visa Guides
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
          Official Guide: UK Visa Document Upload Requirements (2025 UKVI)
        </h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-8 border-b pb-6">
          <span>Last Updated: Nov 30, 2025</span>
          <span>•</span>
          <span>3 min read</span>
        </div>

        <p className="lead text-xl text-gray-600 mb-8">
          Applying for a UK Student, Visitor, or Work visa via GOV.UK? Failing to meet the strict digital document standards can lead to delays or rejections. Here is the technical breakdown of UKVI requirements.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. The "6MB Rule" and Format Limits</h2>
        <p>
          The UK Visas and Immigration (UKVI) commercial partners (TLScontact and VFS Global) utilize upload portals that enforce strict limits:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 my-4">
          <li><strong>Max File Size:</strong> Generally <strong>6 MB per file</strong> (some categories allow up to 10MB, but 6MB is the safe standard).</li>
          <li><strong>Allowed Formats:</strong> PDF (preferred), JPG, PNG.</li>
          <li><strong>Prohibited:</strong> Zip files, password-protected PDFs, or unstable links.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Critical Document Standards</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <p className="font-bold text-yellow-800">Official Recommendation:</p>
          <p className="text-yellow-700">Always scan documents in <strong>Grayscale (Black & White)</strong> unless color is explicitly required (like passport bio pages). This significantly reduces file size.</p>
        </div>
        
        <h3 className="font-bold text-lg mt-4">A4 Formatting</h3>
        <p>
          All uploaded documents must be readable when printed on A4 paper. If you take photos of your bank statements or transcripts with a phone, they often result in irregular sizes. Use a tool to standardized them to <strong>A4 Portrait</strong> dimensions.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. How to Handle Multi-Page Documents</h2>
        <p>
          Do not upload 12 separate JPG files for a 12-month bank statement. This confuses the caseworkers.
        </p>
        <p><strong>Correct Approach:</strong> Combine all pages of a single document type (e.g., "Financial Evidence") into <strong>one single PDF file</strong>. Ensure the sequence is chronological.</p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Troubleshooting: "File Too Large" Error</h2>
        <p>
          If your scanned bank statement is 15MB, you cannot upload it. You must compress it without losing legibility.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 my-4">
          <li><strong>Step 1:</strong> Check DPI. 150-200 DPI is sufficient for text.</li>
          <li><strong>Step 2:</strong> Convert images to PDF.</li>
          <li><strong>Step 3:</strong> Use a smart compressor that targets a specific size (e.g., under 6MB).</li>
        </ul>

        <div className="mt-12 p-8 bg-blue-50 rounded-xl text-center border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Prepare Your UK Visa Files Now</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Auto-resize images to A4, merge them into PDF, and compress to under 6MB—all in one click.
          </p>
          <Link to="/">
            <Button size="lg" label="Start Free Compression" />
          </Link>
        </div>
      </article>
    </BlogLayout>
  );
}

