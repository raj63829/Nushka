// netlify/functions/proxy-api.js
export async function handler(event, context) {
  const backendUrl = "http://casper-ai-573fqmg7wa-uc.a.run.app/settings/";

  try {
    const response = await fetch(backendUrl, {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: event.httpMethod !== "GET" ? event.body : undefined,
    });

    // Try to parse backend response safely
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text }; // fallback if backend doesn’t return JSON
    }

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Proxy API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Proxy failed",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
