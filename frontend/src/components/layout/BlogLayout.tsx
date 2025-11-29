import { Link } from "react-router-dom";
import LanguageToggle from "../ui/LanguageToggle";
import { useState } from "react";
import { Locale, getInitialLocale } from "../../lib/i18n";
import { getRegion } from "../../lib/region";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans leading-relaxed">
      <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600 hover:opacity-80">
            VisaFileCompress
          </Link>
          <div className="flex gap-4 items-center text-sm">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link to="/blog" className="text-gray-600 hover:text-blue-600 font-medium">Blog</Link>
            <Link to="/" className="hidden sm:inline-block bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-xs font-bold transition-colors">
               Use Tool Free
            </Link>
          </div>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {children}

        {/* Global Bottom CTA */}
        <div className="mt-16 p-8 bg-blue-50 rounded-2xl border border-blue-100 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-blue-900 mb-3">Ready to compress your files?</h3>
            <p className="text-blue-700 mb-6">Safe, fast, and compliant with official visa requirements.</p>
            <Link to="/" className="inline-block bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg transition-transform hover:scale-105">
            Start Free Compression Now →
            </Link>
            <p className="text-xs text-gray-500 mt-4">No login required • Auto-delete in 6 hours • SSL Encrypted</p>
        </div>
      </article>

      <footer className="bg-gray-50 mt-12 py-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p className="mb-4">
             VisaFileCompress - The smartest way to resize documents for immigration.
          </p>
          <div className="flex justify-center gap-4">
             <Link to="/" className="hover:underline">Home</Link>
             <Link to="/privacy" className="hover:underline">Privacy</Link>
             <Link to="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
