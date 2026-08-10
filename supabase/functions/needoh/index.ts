// Redirects old site links to Vercel, and handles photo uploads server-side
// (service role) so the browser never deals with storage permissions.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, "");

  if (req.method === "POST" && path.endsWith("/upload")) {
    try {
      const base = Deno.env.get("SUPABASE_URL")!;
      const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const ct = req.headers.get("content-type") || "image/jpeg";
      const slot = url.searchParams.get("slot");
      if (slot && !["1", "2"].includes(slot)) return json(400, { error: "bad slot" });
      const name = slot
        ? `gallery-${slot}.jpg`
        : `order-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

      const body = await req.arrayBuffer();
      if (body.byteLength === 0) return json(400, { error: "empty file" });
      if (body.byteLength > 10 * 1024 * 1024) return json(413, { error: "file too large" });

      const res = await fetch(`${base}/storage/v1/object/needoh-photos/${name}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "apikey": key,
          "Content-Type": ct,
          "x-upsert": "true",
        },
        body,
      });
      const text = await res.text();
      if (!res.ok) return json(res.status, { error: text });
      return json(200, {
        url: `${base}/storage/v1/object/public/needoh-photos/${name}`,
      });
    } catch (e) {
      return json(500, { error: String(e) });
    }
  }

  const target = path.endsWith("/orders")
    ? "https://needoh-cases.vercel.app/orders.html"
    : "https://needoh-cases.vercel.app/";
  return new Response(null, { status: 308, headers: { ...cors, Location: target } });
});
