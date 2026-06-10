const { createClient } = require("@netlify/blobs");

const ADMIN_ID = "fusionia";
const ADMIN_PW = "zZ8$ePmy#ZYO";
const BLOB_KEY = "catalog";

// (初期データ INITIAL はそのまま使ってください)
// ... (中略) ...

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };

  const store = createClient({ name: "workwear" });

  if (event.httpMethod === "GET") {
    try {
      const raw = await store.get(BLOB_KEY);
      return { statusCode: 200, headers, body: raw || JSON.stringify(INITIAL) };
    } catch (e) {
      return { statusCode: 200, headers, body: JSON.stringify(INITIAL) };
    }
  }

  if (event.httpMethod === "POST") {
    const auth = event.headers["authorization"] || "";
    const encoded = Buffer.from(`${ADMIN_ID}:${ADMIN_PW}`).toString("base64");
    
    if (auth !== `Basic ${encoded}`) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    try {
      // 受信データを解析
      const body = JSON.parse(event.body);
      
      // 保存処理
      await store.set(BLOB_KEY, JSON.stringify(body));
      
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      console.error("POST Error Details:", e); // ← Netlifyのログに詳細が出るはず！
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
