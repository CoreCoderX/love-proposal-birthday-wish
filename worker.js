/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // You can later replace * with your GitHub Pages URL
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    if (request.method !== "POST") {
      return new Response("Only POST requests allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    const body = await request.json();

    const BOT_TOKEN = env.BOT_TOKEN; // or your hardcoded token, but not recommended
    const CHAT_ID = env.CHAT_ID; // or your hardcoded chat id, but not recommended

    const telegramURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await fetch(telegramURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `💌 Love Proposal Reply:\n\n${body.message}`,
      }),
    });

    return new Response("Success ❤️", {
      headers: corsHeaders,
    });
  },
};
