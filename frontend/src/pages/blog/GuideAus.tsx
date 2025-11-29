import BlogLayout from "../../components/layout/BlogLayout";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

export default function GuideAus() {
  return (
    <BlogLayout>
      <article className="prose lg:prose-xl mx-auto">
        <span className="text-blue-600 font-semibold tracking-wide text-sm uppercase">
          Visa Guides
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
          ImmiAccount Upload Rules: Preparing Documents for Australian Visa
        </h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-8 border-b pb-6">
          <span>Last Updated: Nov 30, 2025</span>
          <span>•</span>
          <span>4 min read</span>
        </div>

        <p className="lead text-xl text-gray-600 mb-8">
          The Department of Home Affairs uses the <strong>ImmiAccount</strong> system for nearly all Australian visa applications. It is notorious for its strict 5MB limit and specific file requirements.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. The Strict 5MB Limit</h2>
        <p>
          Unlike some other systems, ImmiAccount enforces a hard limit: <strong>5MB per file</strong>. If your PDF is 5.1MB, the upload will fail instantly.
        </p>
        <p className="text-gray-600 italic mt-2">
          *Note: For some specific forms, the limit might be lower, but 5MB is the standard global limit for attachments.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Color Scans Required</h2>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
          <p className="font-bold text-red-800">Important Distinction:</p>
          <p className="text-red-700">
            Unlike the UK, Australia <strong>requires color scans</strong> of original documents. Do not upload black and white copies of colored documents (like birth certificates or passports) unless the original is B&W.
          </p>
        </div>
        <p>
          This creates a challenge: Color scans create large file sizes, but you still must stay under 5MB. You need an advanced compression tool that reduces file size without stripping color.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Naming Conventions</h2>
        <p>
          ImmiAccount recommends clear, English filenames. Avoid special characters (like %, #, &) or non-English characters in filenames.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 my-4">
          <li><strong>Bad:</strong> 扫描件01.jpg</li>
          <li><strong>Good:</strong> Passport_Bio_Page_John_Doe.pdf</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Recommended Settings</h2>
        <table className="w-full text-left border-collapse my-4">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 font-semibold">Parameter</th>
              <th className="p-3 font-semibold">Setting</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3">Format</td>
              <td className="p-3">PDF (Best), JPG</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Resolution</td>
              <td className="p-3">96 DPI to 150 DPI</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Encryption</td>
              <td className="p-3">Must be <strong>Unencrypted</strong></td>
            </tr>
          </tbody>
        </table>

        <div className="mt-12 p-8 bg-blue-50 rounded-xl text-center border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Beat the 5MB Limit</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Compress your color scans to under 5MB while keeping them crystal clear for Australian immigration officers.
          </p>
          <Link to="/">
            <Button size="lg" label="Start Free Compression" />
          </Link>
        </div>
      </article>
    </BlogLayout>
  );
}

