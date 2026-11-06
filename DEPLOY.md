# 🚀 Angela — Go Live Checklist

## Before you start — what you need
- GitHub account (free) → github.com
- Vercel account (free) → vercel.com
- MongoDB Atlas account (free) → mongodb.com/atlas — stores orders, quotes and product stock
- Supabase account (free) → supabase.com — customer sign-in / accounts only
- Resend account (free) → resend.com
- Your .co.ke domain → truehost.co.ke (~KES 1,000/yr)
- Google Analytics account (free) → analytics.google.com

> **Payments:** the website does not take online payment. Customers place an order,
> you contact them to arrange payment, then mark the order as **Paid** in the admin
> dashboard. No payment-provider account is needed.

---

## STEP 1 — Push to GitHub (5 mins)

```bash
# Inside your Angela folder
git init
git add .
git commit -m "Initial commit — Angela"

# Create a new repo on github.com named "Angela"
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/angela.git
git push -u origin main
```

---

## STEP 2 — Set up MongoDB Atlas (10 mins)

Orders, quotes and product stock are stored in MongoDB. Collections and indexes
are created automatically on first use — there is no schema to run.

1. Go to mongodb.com/atlas → create a free **M0** cluster
2. **Database Access** → Add a database user (username + password). Avoid special
   characters in the password, or URL-encode them.
3. **Network Access** → Add IP address → `0.0.0.0/0` (Render and Vercel use changing IPs)
4. **Database → Connect → Drivers** → copy the connection string, e.g.
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   → this is your `MONGODB_URI`
5. (Optional) `MONGODB_DB` sets the database name — defaults to `angela`

## STEP 2b — Set up Supabase for customer accounts (5 mins)

Supabase is now used only for customer sign-up / login (`/auth`, `/account`).

1. Go to supabase.com → New project
2. **Settings → API** → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## STEP 3 — Set up Resend (5 mins)

1. Go to resend.com → Sign up
2. **Domains** → Add Domain → enter `angela.co.ke`
3. Add the DNS records shown to your domain registrar (Truehost)
4. Wait for verification (usually < 5 mins)
5. **API Keys** → Create API Key → copy → `RESEND_API_KEY`

---

## STEP 4 — Deploy (Vercel or Render) (10 mins)

1. Go to vercel.com → **Add New Project**
2. **Import Git Repository** → select your `Angela` repo
3. Framework: Next.js (auto-detected)
4. **Environment Variables** → add these **before** the first deploy:

```
MONGODB_URI                     = (from MongoDB Atlas — REQUIRED for orders/quotes)
MONGODB_DB                      = angela   (optional)
NEXT_PUBLIC_SUPABASE_URL        = (from Supabase — customer login)
NEXT_PUBLIC_SUPABASE_ANON_KEY   = (from Supabase — customer login)
RESEND_API_KEY                  = (from Resend)
ADMIN_EMAIL                     = hello@angela.co.ke
ADMIN_PASSWORD                  = (choose a strong password — REQUIRED, the build fails without it)
NEXT_PUBLIC_APP_URL             = https://angela.co.ke
NEXT_PUBLIC_GA_ID               = G-XXXXXXXXXX
```

5. Click **Deploy** → wait ~2 mins → your site is live on a `.vercel.app` URL

On Render, add the same variables under your service's **Environment** tab.

---

## STEP 5 — Connect your domain (10 mins)

**In Vercel:**
1. Project → **Settings → Domains**
2. Add `angela.co.ke` and `www.angela.co.ke`
3. Vercel will show you DNS records to add

**In Truehost (your registrar):**
1. Login → DNS Management for your domain
2. Add the records Vercel shows you:
   - Type A: `76.76.21.21`
   - Type CNAME for www: `cname.vercel-dns.com`
3. Save — DNS propagates in 15–60 mins

---

## STEP 6 — Set up Google Analytics (5 mins)

1. analytics.google.com → New property → Web
2. Enter `angela.co.ke`
3. Copy your **Measurement ID** (G-XXXXXXXXXX)
4. Add to your env vars: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
5. Redeploy

---

## STEP 7 — Google Search Console (10 mins)

1. search.google.com/search-console → Add property
2. Enter `angela.co.ke` → HTML tag verification method
3. Copy the content value → `GOOGLE_SITE_VERIFICATION` in your env vars
4. Verify → then submit your sitemap:
   - Sitemap URL: `https://angela.co.ke/sitemap.xml`

---

## STEP 8 — Go live checklist ✅

Before announcing:

- [ ] Open `angela.co.ke` — site loads correctly
- [ ] Place a test order — you should get the "Order received" page and an email
- [ ] Submit a quote request — check you receive the email
- [ ] Open `/admin` — login works, the test order shows up
- [ ] On the order, click **Paid** under Payment — revenue on the dashboard updates
- [ ] Check `/admin` on your phone — menu button opens the navigation drawer
- [ ] WhatsApp button appears after 3 seconds
- [ ] Cart works — add item, open drawer, proceed to checkout
- [ ] Redeploy after updating env vars

---

## Admin dashboard

Access at: `https://angela.co.ke/admin`
Password: whatever you set as `ADMIN_PASSWORD`

---

## Costs summary (monthly)

| Service    | Cost         |
|------------|-------------|
| Vercel     | KES 0        |
| Supabase   | KES 0        |
| Resend     | KES 0        |
| Domain     | ~KES 85/mo   |
| **Total**  | **~KES 85/mo** |

---

## Need help?

Every phase of the build is documented. If something breaks:
1. Check the browser console for errors
2. Check your deployment logs
3. Check MongoDB Atlas (Database → Browse Collections, and Network Access if the app can't connect)
