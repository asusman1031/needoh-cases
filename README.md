# NeeDoh Case Orders 🧊

A tiny order-collection site for custom 3D-printed NeeDoh cases — a "Google
Form, but ours" for gathering orders and print specs from friends and family.

## Live site

- **Order form** (share this): https://zwiqmrlquldhjjwbeakj.supabase.co/functions/v1/needoh
- **Order queue** (private, passcode-gated): https://zwiqmrlquldhjjwbeakj.supabase.co/functions/v1/needoh/orders

## Pages

- **`index.html`** — the public order form. Collects name, contact, case style
  (Pizza Slice / Chill Case cube / Keychain Mini / Custom), which NeeDoh it's
  for, quantity, colors, logo yes/no, optional personalization text, needed-by
  date, and free-form notes.
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

The live site is served by a Supabase Edge Function (`supabase/functions/
needoh/index.ts`) that embeds both pages — regenerate it from the HTML files
and redeploy if you change them. There's also a GitHub Pages workflow
(`.github/workflows/pages.yml`) as an alternative host: enable Pages in the
repo settings (source: GitHub Actions) and trigger the workflow manually.

## Running locally

Just open `index.html` in a browser, or:

```
python3 -m http.server 8000
```

and visit http://localhost:8000.
