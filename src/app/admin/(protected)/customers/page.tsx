import { getOrders, getQuotes } from "@/lib/db";
import Link from "next/link";

function formatKES(n: number) { return `KES ${(n ?? 0).toLocaleString("en-KE")}`; }

interface CustomerSummary {
  name:        string;
  email:       string;
  phone:       string;
  order_count: number;
  quote_count: number;
  total_spent: number;
  last_seen:   string;
}

export default async function CustomersAdminPage() {
  let orders: Awaited<ReturnType<typeof getOrders>> = [];
  let quotes: Awaited<ReturnType<typeof getQuotes>> = [];
  try {
    [orders, quotes] = await Promise.all([getOrders({ limit: 500 }), getQuotes({ limit: 500 })]);
  } catch { /* DB not ready */ }

  // Aggregate by email
  const map = new Map<string, CustomerSummary>();

  for (const o of orders) {
    const key = o.customer_email.toLowerCase();
    const existing = map.get(key);
    map.set(key, {
      name:        existing?.name ?? o.customer_name,
      email:       o.customer_email,
      phone:       o.customer_phone,
      order_count: (existing?.order_count ?? 0) + 1,
      quote_count: existing?.quote_count ?? 0,
      total_spent: (existing?.total_spent ?? 0) + (o.payment_status === "paid" ? o.total : 0),
      last_seen:   existing && existing.last_seen > o.created_at ? existing.last_seen : o.created_at,
    });
  }
  for (const q of quotes) {
    const key = q.customer_email.toLowerCase();
    const existing = map.get(key);
    map.set(key, {
      name:        existing?.name ?? q.customer_name,
      email:       q.customer_email,
      phone:       q.customer_phone,
      order_count: existing?.order_count ?? 0,
      quote_count: (existing?.quote_count ?? 0) + 1,
      total_spent: existing?.total_spent ?? 0,
      last_seen:   existing && existing.last_seen > q.created_at ? existing.last_seen : q.created_at,
    });
  }

  const customers = Array.from(map.values()).sort((a, b) => b.total_spent - a.total_spent);

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">{customers.length} unique customers · sorted by total spent</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {customers.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3 opacity-60">👥</p>
            <p className="text-sm font-medium text-slate-700">No customers yet</p>
            <p className="text-xs text-slate-500 mt-1">Customers appear here after their first order or quote</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Customer", "Contact", "Orders", "Quotes", "Total spent", "Last seen", ""].map((h) => (
                  <th key={h} className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.email} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{c.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-slate-600">{c.email}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{c.order_count}</td>
                  <td className="px-4 py-3 text-slate-700">{c.quote_count}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{formatKES(c.total_spent)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(c.last_seen).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <a href={`mailto:${c.email}`} title="Email"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 flex items-center justify-center text-xs transition-colors">📧</a>
                      <a href={`https://wa.me/${c.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" title="WhatsApp"
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 flex items-center justify-center text-xs transition-colors">💬</a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

