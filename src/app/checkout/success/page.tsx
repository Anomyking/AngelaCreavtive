import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Success icon */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>

        <h1 className="text-2xl font-medium text-brand-950 mb-3">Order received!</h1>

        {ref && (
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-2 mb-4">
            <span className="text-xs text-brand-500">Order reference:</span>
            <span className="text-xs font-mono font-medium text-brand-800">{ref}</span>
          </div>
        )}

        <p className="text-sm text-brand-600 leading-relaxed mb-8">
          Thank you for your order. Our team will contact you shortly to confirm it and arrange
          payment. You&apos;ll receive an email confirmation and updates via WhatsApp.
        </p>

        {/* What happens next */}
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-8 text-left">
          <p className="text-sm font-medium text-brand-900 mb-4">What happens next</p>
          <div className="space-y-3">
            {[
              { icon: "📧", step: "You'll receive an email confirmation within 5 minutes" },
              { icon: "💬", step: "We'll contact you by WhatsApp or phone to confirm your order and arrange payment" },
              { icon: "🎨", step: "Our design team will send a proof for your approval" },
              { icon: "🖨️", step: "We print once payment is confirmed and you approve — or same-day if no changes" },
              { icon: "🚚", step: "We deliver or you collect — we'll confirm the timeline" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span className="text-base shrink-0">{item.icon}</span>
                <p className="text-xs text-brand-600 leading-relaxed">{item.step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors"
          >
            Back to home
          </Link>
          <a
            href="https://wa.me/254700000000"
            className="inline-flex items-center justify-center border border-brand-100 hover:border-brand-300 text-brand-600 text-sm px-6 py-3 rounded-full transition-colors"
          >
            💬 WhatsApp us
          </a>
        </div>

        <p className="text-xs text-brand-400 mt-6">
          Questions? Call us on{" "}
          <a href="tel:+254700000000" className="text-brand-600 hover:underline">+254 700 000 000</a>{" "}
          or email{" "}
          <a href="mailto:hello@angela.co.ke" className="text-brand-600 hover:underline">hello@angela.co.ke</a>
        </p>
      </div>
    </div>
  );
}

