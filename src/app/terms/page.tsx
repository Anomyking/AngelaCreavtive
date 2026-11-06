import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Angela",
  description: "The terms and conditions governing your use of Angela's printing services in Kenya.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="bg-brand-950 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-600 mb-3">Legal</p>
          <h1 className="text-3xl font-medium text-brand-300">Terms of Service</h1>
          <p className="text-sm text-brand-600 mt-3">Last updated: 25 May 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Intro */}
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-10">
          <p className="text-sm text-brand-700 leading-relaxed">
            These terms govern your use of <strong>Angela</strong> (&quot;we&quot;, &quot;us&quot;,
            &quot;our&quot;) — operated from Westlands, Nairobi, Kenya. By placing an order or using
            our services, you agree to these terms. Please read them carefully.
          </p>
        </div>

        <article className="prose-angela space-y-8 text-sm text-brand-700 leading-relaxed">

          <Section number="1" title="About us">
            <p>
              Angela is a printing services company registered in Kenya, operating from Westlands, Nairobi.
              We provide printing, branding, and design services to individuals, businesses, and organisations
              across all 47 counties in Kenya.
            </p>
            <p className="mt-3">
              Contact: <a href="mailto:hello@angela.co.ke" className="text-brand-600 hover:underline">hello@angela.co.ke</a>{" "}
              · <a href="tel:+254700000000" className="text-brand-600 hover:underline">+254 700 000 000</a>
            </p>
          </Section>

          <Section number="2" title="Placing an order">
            <p>
              Orders can be placed through our website, via WhatsApp, by phone, or in person at our studio.
              By placing an order, you confirm that:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>You are at least 18 years old, or ordering on behalf of a registered business</li>
              <li>You own or have permission to use any artwork, logos, or designs submitted to us</li>
              <li>The information you provide (contact details, delivery address, design specs) is accurate</li>
              <li>You understand that custom-printed items cannot be returned for refunds once production begins</li>
            </ul>
            <p className="mt-3">
              Orders are confirmed once payment is received. We reserve the right to refuse any order that
              violates these terms, contains illegal or offensive content, or that we are unable to fulfil.
            </p>
          </Section>

          <Section number="3" title="Pricing and payment">
            <p>
              All prices are in <strong>Kenyan Shillings (KES)</strong> and include VAT where applicable.
              Prices shown on our website are for standard specifications. Custom requirements (sizes, finishes,
              quantities outside standard tiers) may incur additional charges, communicated via a quote.
            </p>
            <p className="mt-3">
              We don&apos;t take payment on our website. After you place an order, our team will contact you
              to confirm it and arrange payment. Payment options include:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>M-Pesa</strong> — arranged with our team once your order is confirmed</li>
              <li><strong>Bank transfer</strong> — for orders above KES 50,000</li>
              <li><strong>Business credit</strong> — 30-day terms for approved business accounts</li>
            </ul>
            <p className="mt-3">
              Payments must be confirmed before we begin production, unless a credit arrangement is in place.
              Orders that remain unpaid after we have asked for payment may be cancelled.
            </p>
          </Section>

          <Section number="4" title="Production and turnaround">
            <p>
              Turnaround times listed on each product page are estimates based on standard production. We start
              the clock once we receive your final, approved design.
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Same-day printing</strong> — available for select products, when ordered before 12 PM and the design is ready</li>
              <li><strong>Standard turnaround</strong> — 1 to 4 business days depending on the product</li>
              <li><strong>Custom or bulk orders</strong> — turnaround communicated in your quote</li>
            </ul>
            <p className="mt-3">
              Delays may occur due to design revisions, payment processing, public holidays, or unforeseen
              technical issues. We will communicate any delays as soon as possible.
            </p>
          </Section>

          <Section number="5" title="Design submission and proofs">
            <p>
              You are responsible for providing print-ready artwork in the formats we accept (PDF, AI, PSD, PNG, JPG)
              at a minimum of 300 DPI with the correct dimensions and bleed.
            </p>
            <p className="mt-3">
              For every order, we send a <strong>digital pre-print proof</strong> by email. You must review and
              approve this proof before production begins. By approving the proof, you accept:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The artwork as it appears in the proof</li>
              <li>Any spelling, layout, or colour issues you may have missed</li>
              <li>That we are not liable for errors approved by you</li>
            </ul>
            <p className="mt-3">
              We offer a <strong>physical proof service</strong> (KES 500, credited to final order) for orders
              above KES 30,000 — allowing you to inspect the actual print before bulk production.
            </p>
          </Section>

          <Section number="6" title="Delivery and collection">
            <p>We offer the following delivery options:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Studio collection</strong> — free pickup from our Westlands, Nairobi location during business hours</li>
              <li><strong>Nairobi delivery</strong> — KES 450, or free on orders over KES 7,000</li>
              <li><strong>Nationwide delivery</strong> — KES 850 via trusted courier partners, or free on orders over KES 7,000. Typical delivery time is 2–4 business days</li>
            </ul>
            <p className="mt-3">
              Delivery dates are estimates and not guaranteed. We are not liable for delays caused by courier
              services. Risk of loss transfers to you once items leave our premises with our courier partner.
            </p>
          </Section>

          <Section number="7" title="Reprint guarantee and refunds">
            <p>
              We stand behind every job. If your order arrives <strong>damaged</strong>, contains a{" "}
              <strong>printing error caused by us</strong>, or differs from the approved proof, we will{" "}
              <strong>reprint it at no charge</strong>.
            </p>
            <p className="mt-3">To claim a reprint, contact us within <strong>48 hours of delivery</strong> with:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your order reference</li>
              <li>Clear photos of the issue</li>
              <li>A description of the problem</li>
            </ul>
            <p className="mt-3">
              <strong>Refunds:</strong> Because all items are custom printed to your specifications, we generally
              do not offer cash refunds. Where a refund is required (e.g. order cancelled before production),
              it will be processed to your original payment method within 5–7 business days, less any non-recoverable
              fees such as design work already completed.
            </p>
            <p className="mt-3">
              <strong>We are not liable</strong> for issues caused by: incorrect information you provided,
              errors in your supplied artwork, colours appearing different on screens than in print (RGB vs CMYK),
              or approval of proofs containing the error.
            </p>
          </Section>

          <Section number="8" title="Intellectual property">
            <p>
              <strong>Your artwork stays yours.</strong> By submitting designs to us, you grant us a limited
              licence to use them solely for the purpose of fulfilling your order.
            </p>
            <p className="mt-3">
              You confirm that you own or have permission to use any logos, images, fonts, or designs you submit.
              You are responsible for any copyright or trademark issues arising from your artwork. We reserve the
              right to refuse jobs that appear to infringe third-party rights.
            </p>
            <p className="mt-3">
              <strong>Our content stays ours.</strong> All content on this website — text, images, logos, code,
              design — is the property of Angela and may not be copied, reproduced, or used without our written
              permission, except for normal browsing.
            </p>
          </Section>

          <Section number="9" title="Cancellations">
            <p>
              You can cancel an order within <strong>2 hours</strong> of placing it, before it enters production,
              for a full refund. Once production begins, we cannot cancel the order — but you can still claim a
              reprint if the final product has issues.
            </p>
            <p className="mt-3">
              We reserve the right to cancel any order at our discretion, with a full refund, if we are unable to
              fulfil it for any reason (e.g. material shortages, equipment failure, illegal content).
            </p>
          </Section>

          <Section number="10" title="Use of the website">
            <p>By using this website, you agree not to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Submit content that is illegal, defamatory, obscene, or that infringes anyone&apos;s rights</li>
              <li>Use the site for fraudulent or harmful purposes</li>
              <li>Attempt to gain unauthorised access to our systems</li>
              <li>Use bots, scrapers, or other automated tools to access the site</li>
              <li>Interfere with the security or functioning of the site</li>
            </ul>
          </Section>

          <Section number="11" title="Accounts and security">
            <p>
              You are responsible for keeping your account password secure and for any activity on your account.
              Notify us immediately if you suspect unauthorised access.
            </p>
            <p className="mt-3">
              We may suspend or terminate accounts that violate these terms, attempt fraud, or that have been
              inactive for over 24 months.
            </p>
          </Section>

          <Section number="12" title="Limitation of liability">
            <p>
              To the maximum extent allowed by Kenyan law, our total liability for any order is limited to{" "}
              <strong>the amount you paid for that order</strong>. We are not liable for indirect losses such
              as lost profits, lost business opportunities, or consequential damages.
            </p>
            <p className="mt-3">
              Nothing in these terms limits liability for death, personal injury caused by our negligence,
              or fraud — where Kenyan law does not allow such limits.
            </p>
          </Section>

          <Section number="13" title="Changes to these terms">
            <p>
              We may update these terms from time to time. The latest version will always be available on this
              page, with the &quot;Last updated&quot; date at the top. Continued use of our services after changes
              means you accept the updated terms.
            </p>
          </Section>

          <Section number="14" title="Governing law">
            <p>
              These terms are governed by the laws of Kenya. Any disputes will be resolved through the courts of
              Kenya. We encourage you to contact us first to resolve any issues — most disputes are best handled
              with a quick conversation.
            </p>
          </Section>

          <Section number="15" title="Contact us">
            <p>If you have any questions about these terms:</p>
            <div className="mt-4 bg-brand-50 border border-brand-100 rounded-xl p-4 space-y-2">
              <p>📧 Email: <a href="mailto:hello@angela.co.ke" className="text-brand-600 hover:underline">hello@angela.co.ke</a></p>
              <p>📱 WhatsApp: <a href="https://wa.me/254700000000" className="text-brand-600 hover:underline">+254 700 000 000</a></p>
              <p>📍 Visit: Westlands, Nairobi — Mon to Sat, 8 AM – 6 PM</p>
            </div>
          </Section>

        </article>

        <div className="mt-12 pt-8 border-t border-brand-50 text-center">
          <p className="text-xs text-brand-400 mb-4">By using Angela you agree to these terms and our</p>
          <Link href="/privacy" className="text-sm text-brand-600 hover:underline">Privacy Policy →</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-medium text-brand-950 mb-3 flex items-baseline gap-3">
        <span className="text-xs text-brand-400 font-mono">{number}.</span>
        {title}
      </h2>
      <div className="text-brand-700">{children}</div>
    </section>
  );
}

