import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Angela",
  description: "How Angela collects, uses, and protects your personal information. Compliant with Kenya's Data Protection Act 2019.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="bg-brand-950 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-600 mb-3">Legal</p>
          <h1 className="text-3xl font-medium text-brand-300">Privacy Policy</h1>
          <p className="text-sm text-brand-600 mt-3">Last updated: 25 May 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Intro */}
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-10">
          <p className="text-sm text-brand-700 leading-relaxed">
            <strong>Angela</strong> respects your privacy and is committed to protecting your personal data.
            This policy explains what information we collect, how we use it, and your rights — in line with
            <strong> Kenya&apos;s Data Protection Act 2019</strong>.
          </p>
        </div>

        <article className="space-y-8 text-sm text-brand-700 leading-relaxed">

          <Section number="1" title="Who we are">
            <p>
              Angela is the data controller for the personal information we collect about you.
              We&apos;re based in Westlands, Nairobi, Kenya.
            </p>
            <div className="mt-4 bg-brand-50 border border-brand-100 rounded-xl p-4 space-y-1">
              <p>📧 <strong>Data protection contact:</strong> <a href="mailto:privacy@angela.co.ke" className="text-brand-600 hover:underline">privacy@angela.co.ke</a></p>
              <p>📱 <strong>Phone:</strong> <a href="tel:+254700000000" className="text-brand-600 hover:underline">+254 700 000 000</a></p>
            </div>
          </Section>

          <Section number="2" title="Information we collect">
            <p>We collect only the information needed to provide you with our printing services:</p>

            <div className="mt-4 space-y-3">
              <DataCategory
                title="Account information"
                items={["Your name", "Email address", "Phone number / WhatsApp", "Password (encrypted — we never see it)", "Company name (optional)"]}
              />
              <DataCategory
                title="Order information"
                items={["Products ordered", "Quantities and specifications", "Design files you upload", "Delivery address", "Payment method (we don't store full card numbers)"]}
              />
              <DataCategory
                title="Quote information"
                items={["Product requirements you describe", "Quantity and timeline", "Design files you share"]}
              />
              <DataCategory
                title="Communications"
                items={["WhatsApp messages with our team", "Email correspondence", "Phone call notes (for customer service)"]}
              />
              <DataCategory
                title="Technical information"
                items={["Browser type and device", "IP address (anonymised)", "Pages visited and how you arrived (via Google Analytics)", "Cookies — see Section 8 below"]}
              />
            </div>
          </Section>

          <Section number="3" title="How we use your information">
            <p>We use your data only for these specific purposes:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Fulfilling orders</strong> — production, payment, delivery, customer service</li>
              <li><strong>Sending quotes</strong> — replying to your quote requests with pricing</li>
              <li><strong>Order updates</strong> — email and WhatsApp notifications about your order status</li>
              <li><strong>Account management</strong> — letting you log in, see your order history, save your cart</li>
              <li><strong>Improving our service</strong> — analysing site usage in aggregate (no individual tracking)</li>
              <li><strong>Marketing (optional)</strong> — sending occasional deals and print tips, only if you subscribe — you can unsubscribe at any time</li>
              <li><strong>Legal compliance</strong> — meeting tax, accounting, and regulatory obligations</li>
            </ul>
          </Section>

          <Section number="4" title="Legal basis for processing">
            <p>Under the Kenya Data Protection Act 2019, we process your data based on:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Contract</strong> — to fulfil the order you placed with us</li>
              <li><strong>Consent</strong> — for marketing emails (opt-in only)</li>
              <li><strong>Legitimate interest</strong> — to improve our service and prevent fraud</li>
              <li><strong>Legal obligation</strong> — to comply with tax and accounting laws</li>
            </ul>
          </Section>

          <Section number="5" title="Who we share data with">
            <p>
              We <strong>never sell your data</strong>. We share data only with trusted third parties who help
              us run our business, and only what they need to do their job:
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs border border-brand-100 rounded-xl overflow-hidden">
                <thead className="bg-brand-50">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-brand-700 font-medium">Service</th>
                    <th className="text-left px-4 py-2.5 text-brand-700 font-medium">What they get</th>
                    <th className="text-left px-4 py-2.5 text-brand-700 font-medium">Why</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  <tr><td className="px-4 py-2.5">Supabase</td><td className="px-4 py-2.5">Account & order data</td><td className="px-4 py-2.5">Database hosting (EU servers)</td></tr>
                  <tr><td className="px-4 py-2.5">Resend</td><td className="px-4 py-2.5">Email address & order details</td><td className="px-4 py-2.5">Send order confirmation emails</td></tr>
                  <tr><td className="px-4 py-2.5">Vercel</td><td className="px-4 py-2.5">Anonymised technical logs</td><td className="px-4 py-2.5">Host our website</td></tr>
                  <tr><td className="px-4 py-2.5">Courier partners</td><td className="px-4 py-2.5">Name, address, phone</td><td className="px-4 py-2.5">Deliver your order</td></tr>
                  <tr><td className="px-4 py-2.5">Google Analytics</td><td className="px-4 py-2.5">Anonymised usage data</td><td className="px-4 py-2.5">Site analytics</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              We may also share data if required by law (court order, regulatory request) or to prevent fraud.
            </p>
          </Section>

          <Section number="6" title="How long we keep your data">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account information</strong> — as long as your account is active, plus 12 months</li>
              <li><strong>Order records</strong> — 7 years (required for tax and accounting under Kenyan law)</li>
              <li><strong>Design files you upload</strong> — 12 months after order completion, then deleted</li>
              <li><strong>Quote requests</strong> — 12 months</li>
              <li><strong>Marketing data</strong> — until you unsubscribe</li>
              <li><strong>Anonymous analytics</strong> — 26 months (Google Analytics default)</li>
            </ul>
            <p className="mt-3">
              You can request earlier deletion at any time — see Section 9.
            </p>
          </Section>

          <Section number="7" title="How we protect your data">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Encryption</strong> — all data transmitted is protected by TLS (HTTPS)</li>
              <li><strong>Password security</strong> — passwords are hashed using bcrypt — we never see your actual password</li>
              <li><strong>Access control</strong> — only authorised staff can access customer data, and only what they need</li>
              <li><strong>Payment security</strong> — we don&apos;t collect or store card details on this website. Payment is arranged directly with our team</li>
              <li><strong>Database security</strong> — row-level security ensures users can only see their own data</li>
              <li><strong>Regular updates</strong> — we keep our systems patched against security vulnerabilities</li>
            </ul>
          </Section>

          <Section number="8" title="Cookies">
            <p>We use cookies to make the site work and to understand how it&apos;s used:</p>
            <div className="mt-3 space-y-3">
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
                <p className="text-sm font-medium text-brand-900 mb-1">🔒 Essential cookies</p>
                <p className="text-xs">Required for login sessions, cart functionality, and security. The site won&apos;t work without these.</p>
              </div>
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
                <p className="text-sm font-medium text-brand-900 mb-1">📊 Analytics cookies</p>
                <p className="text-xs">Google Analytics — to understand traffic patterns. Anonymised — we can&apos;t identify individual visitors. You can opt out using Google&apos;s browser tools.</p>
              </div>
            </div>
            <p className="mt-3 text-xs">
              You can block or delete cookies via your browser settings, though some features may stop working.
            </p>
          </Section>

          <Section number="9" title="Your rights">
            <p>Under Kenya&apos;s Data Protection Act 2019, you have the following rights:</p>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {[
                { title: "Access",      desc: "Request a copy of all data we hold about you" },
                { title: "Correction",  desc: "Ask us to fix incorrect information" },
                { title: "Deletion",    desc: "Request we delete your data (subject to legal retention)" },
                { title: "Portability", desc: "Get your data in a portable format" },
                { title: "Object",      desc: "Object to certain types of processing" },
                { title: "Withdraw consent", desc: "Stop marketing emails or unsubscribe at any time" },
              ].map((r) => (
                <div key={r.title} className="bg-brand-50 border border-brand-100 rounded-xl p-3">
                  <p className="text-sm font-medium text-brand-900 mb-1">{r.title}</p>
                  <p className="text-xs">{r.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              To exercise any of these rights, email{" "}
              <a href="mailto:privacy@angela.co.ke" className="text-brand-600 hover:underline">
                privacy@angela.co.ke
              </a>{" "}
              — we&apos;ll respond within 7 days.
            </p>
            <p className="mt-3">
              You also have the right to lodge a complaint with the{" "}
              <strong>Office of the Data Protection Commissioner (ODPC) Kenya</strong> if you believe we have
              not handled your data correctly. Visit{" "}
              <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">www.odpc.go.ke</a>.
            </p>
          </Section>

          <Section number="10" title="Children's privacy">
            <p>
              Our services are intended for users aged 18 and over, or for businesses. We do not knowingly
              collect data from children under 18. If you believe a child has provided us with data, please
              contact us and we&apos;ll delete it.
            </p>
          </Section>

          <Section number="11" title="International data transfers">
            <p>
              Some of our service providers (Supabase, Vercel, Resend, Google Analytics) host data outside Kenya
              — primarily in the EU and US. These providers are bound by data protection agreements that ensure
              your information receives equivalent protection.
            </p>
          </Section>

          <Section number="12" title="Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. Significant changes will be communicated
              by email to registered users. The latest version is always available here, with the &quot;Last updated&quot;
              date at the top.
            </p>
          </Section>

          <Section number="13" title="Contact us">
            <p>If you have any questions or want to exercise your rights:</p>
            <div className="mt-4 bg-brand-50 border border-brand-100 rounded-xl p-4 space-y-2">
              <p>📧 <strong>Data protection:</strong> <a href="mailto:privacy@angela.co.ke" className="text-brand-600 hover:underline">privacy@angela.co.ke</a></p>
              <p>📧 <strong>General enquiries:</strong> <a href="mailto:hello@angela.co.ke" className="text-brand-600 hover:underline">hello@angela.co.ke</a></p>
              <p>📱 <strong>WhatsApp:</strong> <a href="https://wa.me/254700000000" className="text-brand-600 hover:underline">+254 700 000 000</a></p>
              <p>📍 <strong>Visit:</strong> Westlands, Nairobi — Mon to Sat, 8 AM – 6 PM</p>
            </div>
          </Section>

        </article>

        <div className="mt-12 pt-8 border-t border-brand-50 text-center">
          <Link href="/terms" className="text-sm text-brand-600 hover:underline">← Terms of Service</Link>
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

function DataCategory({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
      <p className="text-sm font-medium text-brand-900 mb-2">{title}</p>
      <ul className="list-disc pl-5 text-xs text-brand-600 space-y-1">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

