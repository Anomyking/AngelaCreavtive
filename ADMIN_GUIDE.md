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
- Payment status (paid / pending / failed)
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
| Payment confirmed via webhook | ✅ Receipt     |             |
| Quote request submitted       | ✅ Acknowledgment | ✅ Action-required notice |
| Order marked "Printing"       | ✅ Update      |             |
| Order marked "Ready"          | ✅ Collection info | |
| Order marked "Dispatched"     | ✅ With tracking code | |
| Order marked "Delivered"      | ✅ With review link | |

All emails arrive in your navy-and-indigo Angela-branded template — looks professional and matches the site.

---

## Database access (advanced)

For things not in the dashboard yet, you can directly access Supabase:

1. Log in to **supabase.com** → your Angela project
2. **Table Editor** → see all tables (orders, quotes, profiles, carts)
3. **SQL Editor** → run custom queries

Useful queries:

```sql
-- Top 10 customers by spend
select customer_name, customer_email, count(*) as orders, sum(total) as total_spent
from orders
where payment_status = 'paid'
group by customer_name, customer_email
order by total_spent desc
limit 10;

-- Revenue this week
select sum(total) as revenue
from orders
where payment_status = 'paid'
and created_at >= now() - interval '7 days';

-- Pending quotes older than 24 hours (need action!)
select * from quotes
where status = 'pending'
and created_at < now() - interval '24 hours'
order by created_at asc;

-- Most popular products in the last month
select items->0->'product'->>'name' as product, count(*) as orders
from orders
where created_at >= now() - interval '30 days'
group by items->0->'product'->>'name'
order by orders desc;
```

---

## Security tips

- **Never share your admin password** — it gives full access to all customer data
- **Use a strong password** — at least 16 characters, mix of letters/numbers/symbols
- **Change it periodically** — every 3–6 months
- **Log out when on shared computers**
- **The service role key in `.env.local` should never be shared** — it bypasses all permissions

---

## What's NOT in the admin (yet)

Things you'd still do via WhatsApp/manually for now:
- Refund processing (via IntaSend dashboard)
- Manually adding orders not placed through the site
- Editing product prices (currently in `src/data/index.ts` — requires redeploy)
- Customer support tickets
- Inventory management

These can be added as you scale. Just let me know which you need first.

