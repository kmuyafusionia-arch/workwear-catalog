# WORKWEAR カタログ — デプロイ手順

## 構成
```
workwear/
├── index.html                  ← フロントエンド（カタログ本体）
├── netlify.toml                ← Netlify設定
├── package.json                ← 依存パッケージ
└── netlify/
    └── functions/
        └── data.js             ← サーバーAPI（データ保存・取得）
```

## データの仕組み
- **GET  /.netlify/functions/data** → 誰でもカタログデータを取得できる
- **POST /.netlify/functions/data** → 管理者認証後にデータを上書き保存
- データは **Netlify Blobs**（Netlifyが提供するKVストレージ）に保存される
- 画像はBase64でデータに含まれて保存される

---

## デプロイ手順（Netlify）

### ① GitHubにリポジトリを作成
1. https://github.com にアクセスしてログイン
2. 右上「＋」→「New repository」
3. リポジトリ名: `workwear-catalog`、Public or Private どちらでも可
4. 「Create repository」

### ② ファイルをGitHubにアップロード
ターミナルが使える場合:
```bash
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/あなたのID/workwear-catalog.git
git push -u origin main
```

GitHubのWebで直接アップロードする場合:
- 「uploading an existing file」をクリック
- このフォルダの全ファイル＆フォルダをドラッグ&ドロップ

### ③ Netlifyでデプロイ
1. https://netlify.com にアクセス → 「Sign up」（GitHubアカウントで登録推奨）
2. ダッシュボードの「Add new site」→「Import an existing project」
3. GitHubを選択 → `workwear-catalog` リポジトリを選択
4. ビルド設定はそのまま（Build command: 空欄、Publish directory: `.`）
5. 「Deploy site」をクリック

### ④ Netlify Blobsを有効化（自動）
- デプロイ後、Netlify Blobsは自動で使えるようになります
- 追加設定は不要です

### ⑤ 完了
- Netlifyが `https://ランダム名.netlify.app` のURLを発行します
- そのURLにアクセスしてカタログが表示されればOK
- 管理パネル → 編集・保存 → サーバーに保存されます

---

## ローカルでテストする場合

```bash
# Netlify CLIをインストール
npm install -g netlify-cli

# プロジェクトフォルダで実行
cd workwear
npm install
netlify dev
```
→ http://localhost:8888 でアクセスできます

---

## 注意事項

- **画像サイズ**: 画像はBase64でDBに保存されます。1枚あたり500KB以下を推奨
- **Netlify Blobs の制限**: 無料プランで最大1GBまで保存可能
- **パスワード変更**: `netlify/functions/data.js` の `ADMIN_PW` を変更してください
