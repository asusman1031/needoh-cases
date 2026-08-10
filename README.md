# NeeDoh Case Orders 🧊

A tiny order-collection site for custom 3D-printed NeeDoh cases — a "Google
Form, but ours" for gathering orders and print specs from friends and family.

## Live site

- **Order form** (share this): https://needoh-cases.vercel.app/
- **Order queue** (private, passcode-gated): https://needoh-cases.vercel.app/orders.html

Vercel auto-deploys every push to this repo's default branch. The old
`…supabase.co/functions/v1/needoh` links redirect here.

## Pages

- **`index.html`** — the public order form, following the "must-haves" spec:
  contact info + preferred contact method, case size (single through
  large/custom), multi-select NeeDoh types, main/lid/accent colors including
  specialty finishes, lid design + personalization text with font choice,
  quantity, pickup/delivery/shipping with conditional address, payment
  preference, optional NeeDoh photo upload, need-by date, special requests,
  and a confirmation screen with an order number.
- **`orders.html`** — the private order queue. Passcode-gated; shows every
  order newest-first and lets you flip status between New → Printing → Done.

## How it works

Static HTML/CSS/JS, no build step. Orders are stored in a Supabase Postgres
table (`needoh_orders`):

- The public form can **only insert** (row-level security blocks all reads and
  edits through the public key, so nobody can see other people's orders or
  contact info).
- The admin queue reads and updates through passcode-checked database
  functions (`get_needoh_orders`, `set_needoh_order_status`).

The Supabase URL and publishable key in the HTML are safe to expose — that's
what they're for; the security lives in the database policies.

## Hosting

Vercel hosts the site and auto-deploys every push. The Supabase Edge Function
(`supabase/functions/needoh/index.ts`) now just redirects old links to Vercel.
There's also a GitHub Pages workflow (`.github/workflows/pages.yml`) as a
backup host: enable Pages in the repo settings (source: GitHub Actions) and
trigger the workflow manually.

Customer photo uploads go to the public `needoh-photos` storage bucket
(upload-only for the public key; links are visible in the order queue).

## Running locally

Just open `index.html` in a browser, or:

```
python3 -m http.server 8000
```

and visit http://localhost:8000.
