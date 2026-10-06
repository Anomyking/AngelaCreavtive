import { products, categories } from "@/data";
import { getAllProductStatuses } from "@/lib/db";
import ProductStatusRow from "@/components/admin/ProductStatusRow";

export default async function ProductsAdminPage() {
  let statuses: Awaited<ReturnType<typeof getAllProductStatuses>> = [];
  try { statuses = await getAllProductStatuses(); } catch { /* DB not set up yet */ }

  const statusMap = new Map(statuses.map((s) => [s.product_id, s]));

  // Compute summary
  const total       = products.length;
  const outOfStock  = statuses.filter((s) => s.stock_status === "out_of_stock").length;
  const lowStock    = statuses.filter((s) => s.stock_status === "low_stock").length;
  const hidden      = statuses.filter((s) => s.is_hidden).length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">Manage stock status, hide products, override prices</p>
        </div>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Chip label="Total products" value={total} color="slate" />
        <Chip label="In stock"       value={total - outOfStock - lowStock} color="emerald" />
        <Chip label="Low stock"      value={lowStock} color="amber" />
        <Chip label="Out of stock"   value={outOfStock} color="red" />
      </div>

      {/* Categories */}
      {categories.map((cat) => {
        const items = products.filter((p) => p.categoryId === cat.id);
        return (
          <div key={cat.id} className="mb-8">
            <h2 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <span>{cat.name}</span>
              <span className="text-xs text-slate-400">({items.length})</span>
            </h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Product</th>
                    <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Type</th>
                    <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider px-4 py-3">Base price</th>
                    <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider px-4 py-3 w-44">Stock status</th>
                    <th className="text-left text-[11px] font-medium text-slate-500 uppercase tracking-wider px-4 py-3 w-20">Visible</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <ProductStatusRow key={p.id} product={p} currentStatus={statusMap.get(p.id)} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Chip({ label, value, color }: { label: string; value: number; color: "slate" | "emerald" | "amber" | "red" }) {
  const colors: Record<typeof color, string> = {
    slate:   "bg-slate-50 border-slate-200 text-slate-900",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
    amber:   "bg-amber-50 border-amber-200 text-amber-900",
    red:     "bg-red-50 border-red-200 text-red-900",
  };
  return (
    <div className={`border rounded-xl px-4 py-3 ${colors[color]}`}>
      <p className="text-xs opacity-70">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

