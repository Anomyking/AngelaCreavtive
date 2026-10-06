# 🚀 Angela — Go Live Checklist

## Before you start — what you need
- GitHub account (free) → github.com
- Vercel account (free) → vercel.com
- Supabase account (free) → supabase.com
- Resend account (free) → resend.com
- IntaSend account → intasend.com
- Your .co.ke domain → truehost.co.ke (~KES 1,000/yr)
- Google Analytics account (free) → analytics.google.com

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

## STEP 2 — Set up Supabase (10 mins)

1. Go to supabase.com → New project
2. Name: "Angela" | Region: pick closest (Europe or US)
3. Wait for project to initialize (~2 mins)
4. Go to **SQL Editor** → paste contents of `supabase-schema.sql` → **Run**
5. Go to **Settings → API** → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

---

## STEP 3 — Set up Resend (5 mins)

1. Go to resend.com → Sign up
2. **Domains** → Add Domain → enter `angela.co.ke`
3. Add the DNS records shown to your domain registrar (Truehost)
4. Wait for verification (usually < 5 mins)
5. **API Keys** → Create API Key → copy → `RESEND_API_KEY`

---

## STEP 4 — Set up IntaSend (15 mins)

1. Go to intasend.com → Sign up with your business details
2. Complete KYC verification (business registration required)
3. **Settings → API Keys** → copy:
   - Publishable key → `INTASEND_PUBLISHABLE_KEY`
   - Secret key → `INTASEND_SECRET_KEY`
4. Start in test mode: `INTASEND_TEST_MODE=true`
5. After going live: set `INTASEND_TEST_MODE=false`

---

## STEP 5 — Deploy to Vercel (10 mins)

1. Go to vercel.com → **Add New Project**
2. **Import Git Repository** → select your `Angela` repo
3. Framework: Next.js (auto-detected)
4. **Environment Variables** → add ALL variables from `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL        = (from Supabase)
NEXT_PUBLIC_SUPABASE_ANON_KEY   = (from Supabase)
SUPABASE_SERVICE_ROLE_KEY       = (from Supabase)
RESEND_API_KEY                  = (from Resend)
ADMIN_EMAIL                     = hello@angela.co.ke
ADMIN_PASSWORD                  = (choose a strong password)
INTASEND_PUBLISHABLE_KEY        = (from IntaSend)
INTASEND_SECRET_KEY             = (from IntaSend)
INTASEND_WEBHOOK_SECRET         = (from IntaSend webhook settings)
INTASEND_TEST_MODE              = true
NEXT_PUBLIC_APP_URL             = https://angela.co.ke
NEXT_PUBLIC_GA_ID               = G-XXXXXXXXXX
ADMIN_PASSWORD                  = your-secure-admin-password
```

5. Click **Deploy** → wait ~2 mins → your site is live on a `.vercel.app` URL

---

## STEP 6 — Connect your domain (10 mins)

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

## STEP 7 — Set up IntaSend webhook (5 mins)

1. IntaSend dashboard → **Webhooks**
2. Add webhook URL: `https://angela.co.ke/api/webhook`
3. Events: select `payment.complete` and `payment.failed`
4. Copy the webhook secret → add as `INTASEND_WEBHOOK_SECRET` in Vercel

---

## STEP 8 — Set up Google Analytics (5 mins)

1. analytics.google.com → New property → Web
2. Enter `angela.co.ke`
3. Copy your **Measurement ID** (G-XXXXXXXXXX)
4. Add to Vercel env vars: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
5. Redeploy (Vercel → Deployments → Redeploy)

---

## STEP 9 — Google Search Console (10 mins)

1. search.google.com/search-console → Add property
2. Enter `angela.co.ke` → HTML tag verification method
3. Copy the content value → `GOOGLE_SITE_VERIFICATION` in Vercel
4. Verify → then submit your sitemap:
   - Sitemap URL: `https://angela.co.ke/sitemap.xml`

---

## STEP 10 — Go live checklist ✅

Before announcing:

- [ ] Open `angela.co.ke` — site loads correctly
- [ ] Place a test order (M-Pesa test mode)
- [ ] Submit a quote request — check you receive the email
- [ ] Open `/admin` — login works, orders show up
- [ ] Check mobile on your phone — everything responsive
- [ ] WhatsApp button appears after 3 seconds
- [ ] Cart works — add item, open drawer, proceed to checkout
- [ ] Switch IntaSend to live mode: `INTASEND_TEST_MODE=false`
- [ ] Redeploy on Vercel after updating env vars

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
| IntaSend   | 2.9% per sale|
| **Total**  | **~KES 85/mo** |

---

## Need help?

Every phase of the build is documented. If something breaks:
1. Check the browser console for errors
2. Check Vercel deployment logs
3. Check Supabase logs (Dashboard → Logs)

