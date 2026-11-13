// Cloudflare Worker: lets the PO to Excel web app read a NetSuite PO link.
// It only fetches https links on *.netsuite.com, so it cannot be used as an open proxy.
const ALLOWED_ORIGIN = "*";   // after setup you can change this to "https://YOURNAME.github.io"

const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*"
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const target = new URL(request.url).searchParams.get("url");
    let u;
    try { u = new URL(target); } catch (e) { return new Response("Bad url", { status: 400, headers: cors }); }
    if (u.protocol !== "https:" || !u.hostname.endsWith(".netsuite.com")) {
      return new Response("Only NetSuite links are allowed", { status: 403, headers: cors });
    }
    const r = await fetch(u.toString(), { redirect: "follow" });
    const headers = new Headers(cors);
    headers.set("Content-Type", r.headers.get("Content-Type") || "application/octet-stream");
    return new Response(r.body, { status: r.status, headers });
  }
};
