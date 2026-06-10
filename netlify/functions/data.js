// Netlify Blobsの環境で最も安定して動作する形式
const { getDeployStore } = require("@netlify/blobs");

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

  try {
    // サイトのストアを取得（名前を指定しなくても自動的に紐付く）
    const store = getDeployStore();

    // GET: データ取得
    if (event.httpMethod === "GET") {
      const raw = await store.get(BLOB_KEY);
      return { statusCode: 200, headers, body: raw || "{}" };
    }

    // POST: データ保存
    if (event.httpMethod === "POST") {
      const auth = event.headers["authorization"] || "";
      const encoded = Buffer.from(`${ADMIN_ID}:${ADMIN_PW}`).toString("base64");
      
      if (auth !== `Basic ${encoded}`) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
      }

      await store.set(BLOB_KEY, event.body);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }
  } catch (e) {
    console.error("Critical Error:", e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
