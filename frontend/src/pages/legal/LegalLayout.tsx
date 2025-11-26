import { Link } from "react-router-dom";

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="mx-auto max-w-4xl px-6 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-black">
            VisaFileCompress
          </Link>
          <nav className="text-sm text-gray-600">
            <Link to="/privacy" className="hover:underline mr-4" target="_blank" rel="noopener noreferrer">隐私 / Privacy</Link>
            <Link to="/terms" className="hover:underline mr-4" target="_blank" rel="noopener noreferrer">协议 / Terms</Link>
            <Link to="/aup" className="hover:underline" target="_blank" rel="noopener noreferrer">AUP</Link>
          </nav>
        </div>
        <h1 className="text-2xl font-bold mt-4">{title}</h1>
      </header>
      <main className="mx-auto max-w-4xl px-6 pb-24">
        <article className="prose prose-sm md:prose lg:prose-lg max-w-none">
          {children}
        </article>
      </main>
      <footer className="mx-auto max-w-4xl px-6 py-10 text-sm text-gray-500">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link to="/privacy" className="hover:underline" target="_blank" rel="noopener noreferrer">隐私政策 / Privacy</Link>
          <Link to="/terms" className="hover:underline" target="_blank" rel="noopener noreferrer">用户协议 / Terms</Link>
          <Link to="/aup" className="hover:underline" target="_blank" rel="noopener noreferrer">可接受使用政策 / AUP</Link>
        </div>
        <div className="mt-2">© {new Date().getFullYear()} visafilecompress.com</div>
      </footer>
    </div>
  );
}


