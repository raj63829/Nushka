// netlify/functions/proxy-api.js
import fetch from "node-fetch"; // only needed for Node <18, optional in Netlify Node18 runtime

export async function handler(event, context) {
  try {
    // Backend URL (HTTP-only)
    const backendUrl = "http://casper-ai-573fqmg7wa-uc.a.run.app/settings/";

    // Forward the request method, headers, and body
    const response = await fetch(backendUrl, {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/json",
        // You can forward other headers if needed
      },
      body: event.httpMethod !== "GET" ? event.body : undefined,
    });

    // Read response text or JSON
    const data = await response.text(); // use .json() if backend always returns JSON

    return {
      statusCode: response.status,
      body: data,
      headers: {
        "Content-Type": "application/json", // ensures browser treats it as JSON
      },
    };
  } catch (error) {
    console.error("Proxy API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Proxy API failed", details: error.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
