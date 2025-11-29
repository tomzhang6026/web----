import BlogLayout from "../../components/layout/BlogLayout";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

export default function GuideSchengen() {
  return (
    <BlogLayout>
      <article className="prose lg:prose-xl mx-auto">
        <span className="text-blue-600 font-semibold tracking-wide text-sm uppercase">
          Visa Guides
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
          Schengen Visa Digital Application: Document Checklist & PDF Requirements
        </h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-8 border-b pb-6">
          <span>Last Updated: Nov 30, 2025</span>
          <span>•</span>
          <span>3 min read</span>
        </div>

        <p className="lead text-xl text-gray-600 mb-8">
          Applying for a Schengen visa (France, Germany, Italy, etc.) is increasingly digital. Whether you apply via <strong>TLScontact</strong>, <strong>VFS Global</strong>, or <strong>BLS International</strong>, the digital document standards are surprisingly similar.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. One Document = One File</h2>
        <p>
          A common mistake is uploading 10 separate images for a hotel booking confirmation. The systems are designed to accept <strong>one file per category</strong>.
        </p>
        <p>
          You must merge your multi-page documents (e.g., flight itinerary, insurance policy, 3-month bank statements) into single, multi-page PDF files.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. The "A4 Portrait" Standard</h2>
        <p>
          European bureaucracy loves A4 paper. When digitizing your documents:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 my-4">
          <li>Ensure all pages are <strong>vertical (Portrait)</strong>.</li>
          <li>Ensure the size ratio matches standard A4.</li>
          <li>Avoid US Letter size if possible, though usually accepted, A4 is preferred.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Typical File Size Limits</h2>
        <p>
          While limits vary by specific consulate portal:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 my-4">
          <li><strong>France-Visas:</strong> Often requires files under 2MB or 4MB depending on type.</li>
          <li><strong>VFS Global:</strong> typically 5MB limit per file.</li>
        </ul>
        <p>
          <strong>Pro Tip:</strong> Aim for under <strong>2MB per document</strong> to be safe across all European portals.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Essential Checklist</h2>
        <p>Before uploading, verify your digital stack:</p>
        <ul className="list-decimal pl-6 space-y-2 text-gray-700 my-4">
          <li><strong>Passport:</strong> Scan of bio-page + all used pages (merged PDF).</li>
          <li><strong>Photo:</strong> ICAO standard, white background, 35x45mm (JPG).</li>
          <li><strong>Insurance:</strong> Coverage clearly stating 30,000 EUR medical coverage.</li>
          <li><strong>Funds:</strong> 3-6 months bank statements (merged PDF).</li>
        </ul>

        <div className="mt-12 p-8 bg-blue-50 rounded-xl text-center border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Merge & Compress for Schengen</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Easily combine your bank statements and itineraries into single, compliant PDF files ready for VFS/TLS upload.
          </p>
          <Link to="/">
            <Button size="lg" label="Start Free Compression" />
          </Link>
        </div>
      </article>
    </BlogLayout>
  );
}

