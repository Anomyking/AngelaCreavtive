# 🔐 Admin Dashboard Guide

Your private control room for managing the entire Angela business.

---

## How to access

### URL
```
https://angela.co.ke/admin
```
(or `http://localhost:3000/admin` during development)

### Password
Set in your `.env.local` file:
```env
ADMIN_PASSWORD=your-secure-password-here
```

Change this to something strong. This password is **never visible** in the browser — it's only checked server-side.

### Login flow
1. Visit `/admin`
2. You're auto-redirected to `/admin/login`
3. Enter your admin password
4. Cookie set for 7 days — stays logged in
5. Sign out from the sidebar when done

---

## What you can do as admin

### 📊 Dashboard (`/admin`)
The first screen you see. At a glance:

- **Total revenue** — sum of all paid orders, plus this month's number
- **Total orders** — full count + how many are pending action
- **In production** — orders currently being printed or ready for collection
- **Pending quotes** — quote requests waiting for your response
- **Recent orders** — the last 5 orders with status
- **Pending quotes** — the next quotes to action

### 🛒 Orders (`/admin/orders`)
Every order ever placed, sortable table view showing:
- Order reference number
- Customer name + phone
- Number of items
- Total amount
- Payment status (paid / pending / refunded)
- Order status (pending → confirmed → printing → ready → dispatched → delivered)
- Date placed
- "View" link → full detail

### 🛒 Order Detail (`/admin/orders/[id]`)
Full info for a single order:

**View:**
- Customer details (name, email, phone) — one-click WhatsApp/email buttons
- Delivery method & address
- Payment method & status
- Full itemised list with quantities and prices
- Visual progress tracker showing where the order is

**Manage:**
- Mark payment as **Paid** (or Pending / Refunded) once you've received it — the website takes no online payment, so you arrange payment with the customer and record it here. Revenue on the dashboard only counts orders marked Paid.
- Update order status with a single click
- Add tracking code when dispatched
- Automatic email sent to customer when status changes (printing/ready/dispatched/delivered)

**Statuses you can set:**
- ⏳ **Pending** — payment not received yet
- ✅ **Confirmed** — paid, ready for production
- 🖨️ **Printing** — currently in production (triggers email)
- 🎉 **Ready** — ready for collection (triggers email)
- 🚚 **Dispatched** — sent via courier with tracking (triggers email)
- 📦 **Delivered** — completed (triggers email)
- ❌ **Cancelled** — order cancelled

### 📋 Quotes (`/admin/quotes`)
All quote requests in a split view:

**Left panel:** list of all quotes with status badges
**Right panel:** details of the selected quote

For each quote you can:
- See full customer details
- View product requirements and specs
- Click **WhatsApp** to reply directly with pre-filled message
- Click **Email** to reply via email with pre-filled subject
- Click **Call** to dial the customer's number
- Enter your quote amount in KES
- Add internal notes (e.g. "Includes design, delivery extra")
- Mark as **Quoted** (you sent them a price) or **Decline**

---

## What gets emailed automatically

| Action                        | Customer email | Admin email |
|-------------------------------|---------------|-------------|
| Order placed                  | ✅ Confirmation | ✅ Copy with full details |
| Quote request submitted       | ✅ Acknowledgment | ✅ Action-required notice |
| Order marked "Printing"       | ✅ Update      |             |
| Order marked "Ready"          | ✅ Collection info | |
| Order marked "Dispatched"     | ✅ With tracking code | |
| Order marked "Delivered"      | ✅ With review link | |

All emails arrive in your navy-and-indigo Angela-branded template — looks professional and matches the site.

---

## Database access (advanced)

Orders, quotes and product stock live in MongoDB Atlas. For things not in the dashboard yet:

1. Log in to **mongodb.com/atlas** → your cluster → **Browse Collections**
2. Database `angela` (or whatever you set as `MONGODB_DB`) → collections `orders`, `quotes`, `product_status`
3. Use the **Filter** box, or **Aggregations**, to run custom queries

Useful filters (paste into the Filter box on the `orders` / `quotes` collections):

```js
// Unpaid orders still waiting for payment
{ "payment_status": "pending", "status": { "$ne": "cancelled" } }

// Pending quotes older than 24 hours (need action!)
// (replace the date with "24 hours ago" in ISO format)
{ "status": "pending", "created_at": { "$lt": { "$date": "2026-01-01T00:00:00Z" } } }

// All orders for one customer
{ "customer_email": "jane@company.co.ke" }
```

Top customers by spend (use the **Aggregations** tab on `orders`):

```js
[
  { "$match": { "payment_status": "paid" } },
  { "$group": { "_id": "$customer_email", "name": { "$first": "$customer_name" },
                "orders": { "$sum": 1 }, "total_spent": { "$sum": "$total" } } },
  { "$sort": { "total_spent": -1 } },
  { "$limit": 10 }
]
```

---

## Security tips

- **Never share your admin password** — it gives full access to all customer data
- **Use a strong password** — at least 16 characters, mix of letters/numbers/symbols
- **Change it periodically** — every 3–6 months
- **Log out when on shared computers**
- **Your `MONGODB_URI` in `.env.local` should never be shared** — it contains your database password

---

## What's NOT in the admin (yet)

Things you'd still do via WhatsApp/manually for now:
- Refund processing (handled by you directly — then mark the order as Refunded)
- Manually adding orders not placed through the site
- Editing product prices (currently in `src/data/index.ts` — requires redeploy)
- Customer support tickets
- Inventory management

These can be added as you scale. Just let me know which you need first.

