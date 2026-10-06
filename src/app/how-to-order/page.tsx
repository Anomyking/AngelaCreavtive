import Link from "next/link";
export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl font-medium text-brand-300 capitalize">how to order</h1>
          <p className="text-sm text-brand-600 mt-2">This page is coming soon.</p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-5xl mb-4">🖨️</p>
        <p className="text-sm text-brand-600 mb-6">We are still filling in this page. WhatsApp or email us and we will help you directly.</p>
        <div className="flex gap-3 justify-center">
          <a href="https://wa.me/254700000000" className="inline-flex bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">WhatsApp us</a>
          <Link href="/" className="inline-flex border border-brand-100 hover:border-brand-300 text-brand-600 text-sm px-6 py-3 rounded-full transition-colors">Back home</Link>
        </div>
      </div>
    </div>
  );
}

