import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/db";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

const statusSteps = ["pending","confirmed","printing","ready","dispatched","delivered"];

const statusColors: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  printing:   "bg-purple-100 text-purple-700",
  ready:      "bg-emerald-100 text-emerald-700",
  dispatched: "bg-cyan-100 text-cyan-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-600",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order;
  try {
    order = await getOrderById(id);
  } catch {
    notFound();
  }

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <a href="/admin/orders" className="text-sm text-brand-500 hover:text-brand-800">← Orders</a>
            <span className="text-brand-200">/</span>
            <span className="text-sm text-brand-700 font-mono">{order.reference}</span>
          </div>
          <h1 className="text-2xl font-medium text-brand-950">{order.customer_name}</h1>
          <p className="text-sm text-brand-500 mt-1">
            Placed {new Date(order.created_at).toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <span className={`text-sm font-medium px-4 py-2 rounded-full capitalize ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Progress tracker */}
          <div className="bg-white border border-brand-100 rounded-2xl p-5">
            <h2 className="text-sm font-medium text-brand-950 mb-4">Order progress</h2>
            <div className="flex items-center gap-0">
              {statusSteps.filter(s => s !== "cancelled").map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                    currentStep > i ? "bg-brand-700 text-white" :
                    currentStep === i ? "bg-amber-100 text-amber-700 border-2 border-amber-300" :
                    "bg-brand-50 text-brand-300"
                  }`}>
                    {currentStep > i ? "✓" : i + 1}
                  </div>
                  <div className="ml-1 mr-2 hidden sm:block">
                    <p className={`text-[10px] font-medium capitalize ${currentStep >= i ? "text-brand-700" : "text-brand-300"}`}>{step}</p>
                  </div>
                  {i < statusSteps.filter(s => s !== "cancelled").length - 1 && (
                    <div className={`flex-1 h-px mx-1 ${currentStep > i ? "bg-brand-700" : "bg-brand-100"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-brand-100 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-50">
              <h2 className="text-sm font-medium text-brand-950">Items ordered</h2>
            </div>
            <div className="divide-y divide-brand-50">
              {(Array.isArray(order.items) ? order.items : []).map((item: { product?: { name?: string }; quantity?: number; unitPrice?: number; finish?: string }, i: number) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-xl shrink-0">🖨️</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-900">{item.product?.name ?? "Product"}</p>
                    <p className="text-xs text-brand-400 mt-0.5">{(item.quantity ?? 0).toLocaleString()} pcs · {item.finish ?? "Standard"}</p>
                  </div>
                  <p className="text-sm font-medium text-brand-900">
                    KES {Math.round((item.unitPrice ?? 0) * ((item.quantity ?? 0) / 100)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-brand-50 space-y-2 bg-brand-50">
              <div className="flex justify-between text-xs"><span className="text-brand-500">Subtotal</span><span className="text-brand-800">KES {order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-xs"><span className="text-brand-500">Delivery</span><span className={order.delivery_fee === 0 ? "text-emerald-600 font-medium" : "text-brand-800"}>{order.delivery_fee === 0 ? "FREE" : `KES ${order.delivery_fee.toLocaleString()}`}</span></div>
              <div className="flex justify-between text-sm font-medium pt-1 border-t border-brand-100"><span>Total</span><span>KES {order.total.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Update status */}
          <OrderStatusUpdater order={order} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-brand-100 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-brand-950 mb-4">Customer</h3>
            <div className="space-y-2">
              <p className="text-sm text-brand-800 font-medium">{order.customer_name}</p>
              <a href={`mailto:${order.customer_email}`} className="text-xs text-brand-600 hover:underline block">📧 {order.customer_email}</a>
              <a href={`tel:${order.customer_phone}`} className="text-xs text-brand-600 hover:underline block">📱 {order.customer_phone}</a>
            </div>
          </div>

          <div className="bg-white border border-brand-100 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-brand-950 mb-4">Delivery</h3>
            <div className="space-y-2">
              <p className="text-xs text-brand-600 capitalize">📦 {order.delivery_method.replace("_", " ")}</p>
              {order.delivery_address && <p className="text-xs text-brand-500 leading-relaxed">📍 {order.delivery_address}</p>}
              {order.tracking_code && <p className="text-xs text-brand-600 font-mono">🚚 {order.tracking_code}</p>}
            </div>
          </div>

          <div className="bg-white border border-brand-100 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-brand-950 mb-4">Payment</h3>
            <div className="space-y-2">
              <p className="text-xs text-brand-600 capitalize">💳 {order.payment_method}</p>
              <p className={`text-xs font-medium capitalize ${order.payment_status === "paid" ? "text-emerald-600" : "text-yellow-600"}`}>
                {order.payment_status === "paid" ? "✅ Paid" : "⏳ " + order.payment_status}
              </p>
            </div>
          </div>

          <div className="bg-white border border-brand-100 rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-medium text-brand-950 mb-3">Quick actions</h3>
            <a href={`https://wa.me/${order.customer_phone.replace(/\D/g,"")}?text=Hi ${order.customer_name}, update on your Angela order ${order.reference}:`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-brand-600 hover:text-brand-800 py-2 border-b border-brand-50">
              💬 WhatsApp customer
            </a>
            <a href={`mailto:${order.customer_email}?subject=Update on your order ${order.reference}`}
              className="flex items-center gap-2 text-xs text-brand-600 hover:text-brand-800 py-2">
              📧 Email customer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

