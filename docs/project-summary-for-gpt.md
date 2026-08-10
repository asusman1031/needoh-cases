# NeeDoh Case Order Site — What We Built

A summary of the project so far, for sharing with other AI assistants or
collaborators.

## The idea

A free hobby project: a "Google Form, but ours" web order site where friends
and family order custom 3D-printed cases for NeeDoh squishies (heart cases,
single/multi cube cases, Dohjees multi-packs, Fuzz Ball cases, Cool Cat cases,
etc.). No revenue goal — sales help grow a kid's NeeDoh collection.

## Live site

- Order form: https://needoh-cases.vercel.app/
- Private order queue (passcode-gated): https://needoh-cases.vercel.app/orders.html
- Code: https://github.com/asusman1031/needoh-cases

## What the order form collects

Built to the "NeeDoh Order Form Must-Haves" spec (originally drafted in a
ChatGPT conversation):

1. **About you** — name, email/phone, preferred contact (text/email), optional
   Instagram/Facebook handle
2. **Case size** — Single / Double / Triple / Quad / Large multi / Custom
3. **NeeDoh types** — multi-select: Original, Nice Cube, Gumdrop, Cube,
   Teenie, Dohnut, Gummy, Dohjees, Fuzz Ball, Cool Cat, Other
4. **Colors** — visual color-chip picker (11 standard colors + specialty
   finishes: glow-in-the-dark, metallic, silk, marble, galaxy sparkle,
   rainbow, custom), plus optional lid color and text/logo color
5. **Lid design** — solid, NeeDoh logo, name, initials, custom text, custom
   design, or "surprise me"; text designs reveal a personalization field
   (20-char limit) and font choice (Fun/Bubble/Block/Script/Surprise me)
6. **Quantity + fulfillment** — quantity, pickup/local delivery/ship (address
   appears only when needed), payment preference (Venmo/Cash App/PayPal/Apple
   Pay/cash) — payment itself is settled after order confirmation, not on-site
7. **Extras** — photo upload of their NeeDoh (so we know exactly which one
   they mean), need-by date, special requests

On submit: a confirmation screen with an order number (e.g. `Order #NEE-7K2P`)
and an order summary.

## The private order queue

`orders.html` — passcode login, then every order newest-first as cards showing
all specs, the customer's photo link, and contact info, with one-tap status
buttons (New → Printing → Done) and an open-order count.

## Architecture (deliberately simple)

- **Frontend:** two static HTML files, no framework, no build step. Playful
  design (Baloo 2 font, bright gradient background, chunky bordered cards).
- **Database:** Supabase Postgres, one table `needoh_orders`.
- **Security model:** row-level security. The public (publishable) key in the
  page source can only INSERT orders — it cannot read, update, or delete, so
  no visitor can see anyone else's contact info. The admin queue reads through
  a `security definer` Postgres function that checks a passcode
  (`get_needoh_orders`), and updates statuses through another
  (`set_needoh_order_status`).
- **Photo uploads:** public Supabase Storage bucket `needoh-photos`,
  upload-only policy for the public key.
- **Hosting:** Vercel, auto-deploying from the GitHub repo on every push
  (framework preset "Other", no build). A Supabase Edge Function serves 308
  redirects from the originally shared supabase.co URLs to the Vercel site.

## Decisions & lessons along the way

- Started with hosting on a Supabase Edge Function (base64-embedded HTML)
  because the automated Vercel token couldn't create projects and the GitHub
  Actions token couldn't enable GitHub Pages (needs repo admin). Once the repo
  was imported into Vercel by hand, Vercel became the primary host and the
  edge function became a redirect.
- Order numbers are generated client-side and stored in an `order_code`
  column, because `Prefer: return=representation` on insert would require
  SELECT permission that the security model intentionally withholds.
- Payment is a preference field, not a checkout — for a friends-and-family
  hobby site, invoicing by Venmo/Cash App after confirming the total avoids
  payment-processor complexity entirely.

## Open items

- Add real case photos to the homepage gallery (`images/cases-1.jpg`,
  `images/cases-2.jpg` in the repo).
- Possibly: pictures next to each case-size option, per-item pricing display,
  and compatible-case filtering based on the selected NeeDoh type.
