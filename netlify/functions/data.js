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
    // 【重要】getDeployStore を使うと、Netlifyが自動で認証・紐付けを行う
    const store = getDeployStore();

    if (event.httpMethod === "GET") {
      const raw = await store.get(BLOB_KEY);
      return { statusCode: 200, headers, body: raw || "{}" };
    }

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
    // もしここで落ちるなら、NetlifyのFunctions設定そのものに問題がある可能性が高い
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
