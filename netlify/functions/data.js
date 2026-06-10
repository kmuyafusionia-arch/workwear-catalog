const { createClient } = require("@netlify/blobs");

const ADMIN_ID = "fusionia";
const ADMIN_PW = "zZ8$ePmy#ZYO";
const BLOB_KEY = "catalog";

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };

  // Blobsクライアントの作成（名前を固定）
  const store = createClient({ name: "workwear" });

  if (event.httpMethod === "GET") {
    try {
      const raw = await store.get(BLOB_KEY);
      return { statusCode: 200, headers, body: raw || "{}" };
    } catch (e) {
      return { statusCode: 200, headers, body: "{}" };
    }
  }

  if (event.httpMethod === "POST") {
    const auth = event.headers["authorization"] || "";
    const encoded = Buffer.from(`${ADMIN_ID}:${ADMIN_PW}`).toString("base64");
    
    if (auth !== `Basic ${encoded}`) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    try {
      // 受信データを直接保存
      await store.set(BLOB_KEY, event.body);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.toString() }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
