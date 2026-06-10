// netlify/functions/data.js

const { createClient } = require("@netlify/blobs");

const ADMIN_ID = "fusionia";
const ADMIN_PW = "zZ8$ePmy#ZYO";
const BLOB_KEY = "catalog";

// ===== 初期データ =====
const INITIAL = {
  cats: [
    { id: 1, name: "Tシャツ",   img: null, active: true },
    { id: 2, name: "パーカー",   img: null, active: true },
    { id: 3, name: "ポロシャツ", img: null, active: true },
    { id: 4, name: "ジャケット", img: null, active: true },
    { id: 5, name: "パンツ",     img: null, active: true },
  ],
  prods: [
    {
      id: 1, catId: 1,
      name: "ドライTシャツ レギュラー",
      headline: "吸汗速乾 / 全季節対応",
      desc: "快適な着心地とスタイリッシュなデザインを両立。ビジネスシーンから日常使いまで幅広く活躍します。",
      price: 1980,
      colors: ["ホワイト","ネイビー","ブラック","グレー"],
      colorImgs: {},
      sizes: ["XS","S","M","L","XL","XXL"],
      sizeTable: {
        cols: ["XS","S","M","L","XL","XXL"],
        rows: [
          { label: "SIZE(cm)", cells: ["48","50","52","54","56","58"] },
          { label: "サイズNo.", cells: ["01","02","03","04","05","06"] },
          { label: "身幅",     cells: ["46","48","50","52","54","56"] },
          { label: "着丈",     cells: ["63","66","69","72","75","78"] },
        ],
      },
      active: true,
    },
    { id: 2, catId: 1, name: "ヘビーウェイトTシャツ", headline: "", desc: "", price: 2480, colors: ["ホワイト","ブラック","カーキ"], colorImgs: {}, sizes: ["S","M","L","XL"], sizeTable: null, active: true },
    { id: 3, catId: 2, name: "プルオーバーパーカー", headline: "裏起毛素材 / 保温性抜群", desc: "寒い季節でも快適に過ごせる裏起毛素材を使用。チームウェアとしても最適な一着です。", price: 4980, colors: ["グレー","ネイビー","ブラック"], colorImgs: {}, sizes: ["S","M","L","XL","XXL"], sizeTable: null, active: true },
    { id: 4, catId: 3, name: "ドライポロシャツ", headline: "", desc: "", price: 3200, colors: ["ホワイト","ネイビー","レッド"], colorImgs: {}, sizes: ["S","M","L","XL","XXL"], sizeTable: null, active: true },
    { id: 5, catId: 4, name: "ブルゾン スタンドカラー", headline: "", desc: "", price: 7800, colors: ["ブラック","ネイビー"], colorImgs: {}, sizes: ["S","M","L","XL"], sizeTable: null, active: true },
    { id: 6, catId: 5, name: "カーゴパンツ", headline: "", desc: "", price: 4200, colors: ["ブラック","グレー"], colorImgs: {}, sizes: ["S","M","L","XL","XXL"], sizeTable: null, active: true },
  ],
  colorMaster: [
    { id: 1, name: "ホワイト", hex: "#F5F5F3" },
    { id: 2, name: "ブラック", hex: "#1A1A1A" },
    { id: 3, name: "ネイビー", hex: "#1A3A5C" },
    { id: 4, name: "グレー",   hex: "#888780" },
    { id: 5, name: "レッド",   hex: "#C0392B" },
    { id: 6, name: "ブルー",   hex: "#2980B9" },
  ],
  nextCatId: 6,
  nextProdId: 7,
  nextColorId: 7,
};

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Netlify Blobs クライアントの初期化
  let store;
  try {
    store = createClient({ name: "workwear" });
  } catch (e) {
    console.error("Blobs Client Error:", e);
  }

  // -------- GET: データ取得（認証不要） --------
  if (event.httpMethod === "GET") {
    try {
      if (store) {
        const raw = await store.get(BLOB_KEY);
        if (raw) return { statusCode: 200, headers, body: raw };
      }
      return { statusCode: 200, headers, body: JSON.stringify(INITIAL) };
    } catch (e) {
      return { statusCode: 200, headers, body: JSON.stringify(INITIAL) };
    }
  }

  // -------- POST: データ保存（認証必須） --------
  if (event.httpMethod === "POST") {
    const auth = event.headers["authorization"] || "";
    const encoded = Buffer.from(`${ADMIN_ID}:${ADMIN_PW}`).toString("base64");
    
    if (auth !== `Basic ${encoded}`) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    if (!store) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Storage not initialized" }) };
    }

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
    }

    try {
      await store.set(BLOB_KEY, JSON.stringify(body));
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
