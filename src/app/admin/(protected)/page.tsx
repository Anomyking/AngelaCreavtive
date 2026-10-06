import Link from "next/link";
import {
  getRecentOrders, getPendingQuotes, getDashboardStats, getRevenueTrend, getQuotes,
  DashboardStats, DBOrder, DBQuote,
} from "@/lib/db";
import RevenueChart from "@/components/admin/RevenueChart";

function formatKES(n: number) { return `KES ${(n ?? 0).toLocaleString("en-KE")}`; }
function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const statusColors: Record<string, string> = {
  pending:    "bg-amber-50 text-amber-700 border-amber-200",
  confirmed:  "bg-blue-50 text-blue-700 border-blue-200",
  printing:   "bg-purple-50 text-purple-700 border-purple-200",
  ready:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  dispatched: "bg-cyan-50 text-cyan-700 border-cyan-200",
  delivered:  "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-red-50 text-red-600 border-red-200",
};

export default async function AdminDashboard() {
  let stats: DashboardStats, recentOrders: DBOrder[], pendingQuotes: DBQuote[], trend: { date: string; total: number }[], allQuotes: DBQuote[];
  try {
    [stats, recentOrders, pendingQuotes, trend, allQuotes] = await Promise.all([
      getDashboardStats(),
      getRecentOrders(6),
      getPendingQuotes(),
      getRevenueTrend(14),
      getQuotes({ limit: 100 }),
    ]);
  } catch {
    stats = { total_orders: 0, pending: 0, confirmed: 0, printing: 0, ready: 0, delivered: 0, total_revenue: 0, revenue_this_month: 0 };
    recentOrders = []; pendingQuotes = []; trend = []; allQuotes = [];
  }

  // Calculate stats
  const conversionRate = allQuotes.length > 0
    ? Math.round((allQuotes.filter(q => q.status === "accepted").length / allQuotes.length) * 100)
    : 0;
  const avgOrderValue = stats.total_orders > 0
    ? Math.round((stats.total_revenue ?? 0) / stats.total_orders)
    : 0;
  const trendTotal = trend.reduce((acc, d) => acc + d.total, 0);
  const trendDailyAvg = trend.length > 0 ? Math.round(trendTotal / trend.length) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/orders" className="text-xs bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors">
            View all orders →
          </Link>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Total revenue"
          value={formatKES(stats.total_revenue ?? 0)}
          sub={`${formatKES(stats.revenue_this_month ?? 0)} this month`}
          accent="brand"
        />
        <KpiCard
          label="Average order"
          value={formatKES(avgOrderValue)}
          sub={`${stats.total_orders ?? 0} orders total`}
          accent="blue"
        />
        <KpiCard
          label="Open quotes"
          value={`${pendingQuotes.length}`}
          sub={`${conversionRate}% conversion rate`}
          accent="amber"
        />
        <KpiCard
          label="In production"
          value={`${(stats.printing ?? 0) + (stats.confirmed ?? 0)}`}
          sub={`${stats.ready ?? 0} ready for collection`}
          accent="emerald"
        />
      </div>

      {/* Charts + Status overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-medium text-slate-900">Revenue · last 14 days</h2>
              <p className="text-xs text-slate-500 mt-0.5">Avg {formatKES(trendDailyAvg)}/day · Total {formatKES(trendTotal)}</p>
            </div>
          </div>
          <RevenueChart data={trend} />
        </div>

        {/* Order pipeline */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-sm font-medium text-slate-900 mb-4">Order pipeline</h2>
          <div className="space-y-3">
            {[
              { label: "Pending",     count: stats.pending,    color: "bg-amber-500"   },
              { label: "Confirmed",   count: stats.confirmed,  color: "bg-blue-500"    },
              { label: "Printing",    count: stats.printing,   color: "bg-purple-500"  },
              { label: "Ready",       count: stats.ready,      color: "bg-emerald-500" },
              { label: "Delivered",   count: stats.delivered,  color: "bg-green-600"   },
            ].map((s) => {
              const max = Math.max(stats.pending, stats.confirmed, stats.printing, stats.ready, stats.delivered, 1);
              const pct = ((s.count ?? 0) / max) * 100;
              return (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{s.label}</span>
                    <span className="font-medium text-slate-800">{s.count ?? 0}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`${s.color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent orders + Pending quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent orders */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-medium text-slate-900">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-brand-600 hover:text-brand-800">View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState icon="🛒" title="No orders yet" sub="Orders will appear here once customers checkout" />
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{order.customer_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">{order.reference} · {timeAgo(order.created_at)}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-medium text-slate-900">{formatKES(order.total)}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border mt-1 inline-block capitalize ${statusColors[order.status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pending quotes */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-medium text-slate-900">Pending quotes</h2>
            <Link href="/admin/quotes" className="text-xs text-brand-600 hover:text-brand-800">View all →</Link>
          </div>
          {pendingQuotes.length === 0 ? (
            <EmptyState icon="📋" title="No pending quotes" sub="New quote requests will appear here" />
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingQuotes.map((quote) => (
                <Link key={quote.id} href="/admin/quotes"
                  className="flex items-start justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{quote.customer_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{quote.product_name} · {quote.quantity}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{timeAgo(quote.created_at)}</p>
                  </div>
                  <span className="text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded shrink-0 ml-3">
                    Needs reply
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: "brand" | "blue" | "amber" | "emerald" }) {
  const accents: Record<typeof accent, string> = {
    brand:   "from-brand-50 to-white border-brand-200",
    blue:    "from-blue-50 to-white border-blue-200",
    amber:   "from-amber-50 to-white border-amber-200",
    emerald: "from-emerald-50 to-white border-emerald-200",
  };
  return (
    <div className={`bg-gradient-to-br ${accents[accent]} border rounded-2xl p-5`}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-3xl mb-2 opacity-60">{icon}</p>
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="text-xs text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

