// netlify/functions/proxy-api.js
export default async (req) => {
  try {
    const url = "https://casper-ai-573fqmg7wa-uc.a.run.app/settings/";

    // Forward the request to your backend
    const resp = await fetch(url, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method !== "GET" ? req.body : undefined,
    });

    const data = await resp.text();

    return new Response(data, {
      status: resp.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
