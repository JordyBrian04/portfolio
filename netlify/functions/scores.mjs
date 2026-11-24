// Classement mondial du lancer de paniers (Top 10), stocké dans Netlify Blobs.
import { getStore } from "@netlify/blobs";

export default async (req) => {
  const headers = { "content-type": "application/json", "cache-control": "no-store" };
  const store = getStore("basket-scores");
  let list = (await store.get("top", { type: "json" })) || [];

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "JSON invalide" }), { status: 400, headers }); }
    const name = String(body.name ?? "").replace(/[^\p{L}\p{N} _.-]/gu, "").trim().slice(0, 12) || "Anonyme";
    const score = Math.floor(Number(body.score));
    if (!Number.isFinite(score) || score < 1 || score > 99) return new Response(JSON.stringify({ error: "Score invalide" }), { status: 400, headers });
    list.push({ name, score, date: new Date().toISOString().slice(0, 10) });
    list.sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));
    list = list.slice(0, 10);
    await store.setJSON("top", list);
  } else if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), { status: 405, headers });
  }
  return new Response(JSON.stringify(list), { headers });
};

export const config = { path: "/api/scores" };
