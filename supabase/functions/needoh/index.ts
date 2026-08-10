// The site now lives on Vercel (auto-deployed from GitHub).
// This function keeps previously shared supabase.co links working.
Deno.serve((req: Request) => {
  const path = new URL(req.url).pathname.replace(/\/+$/, "");
  const target = path.endsWith("/orders")
    ? "https://needoh-cases.vercel.app/orders.html"
    : "https://needoh-cases.vercel.app/";
  return new Response(null, { status: 308, headers: { Location: target } });
});
