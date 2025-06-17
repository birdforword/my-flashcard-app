# my-flashcard-app

## Overview
- Backend: Node.js + Express + Sequelize
- Frontend: React

## Setup
1. `cd backend && npm install`
2. `.env` を作成して環境変数を設定
3. `npm run dev`
4. `cd frontend && npm install && npm start`


my-flashcard-app/
├── backend/                       # バックエンド（Node.js + Express + Sequelize）
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # PostgreSQL接続設定
│   │   ├── controllers/
│   │   │   └── cardController.js  # カードCRUDロジック
│   │   ├── models/
│   │   │   └── cardModel.js       # Sequelizeモデル定義
│   │   ├── routes/
│   │   │   ├── captions.js        # /api/captions/:videoId
│   │   │   ├── cards.js           # /api/cards
│   │   │   └── export.js          # /api/export
│   │   ├── services/
│   │   │   ├── youtubeService.js  # 字幕取得
│   │   │   ├── cardService.js  
│   │   │   └── ankiService.js     # genankiラップ
│   │   └── server.js              # Express初期化＋ルーティング紐付け
│   ├── .env                       # 環境変数(SECRETはここに)
│   ├── credentials.json           # Googleサービスアカウントキー
│   ├── package.json               # backend用依存＆スクリプト
│   └── package-lock.json
│
├── frontend/                      # フロントエンド（React or Next.js）
│   ├── public/                    # 静的ファイル（favicon, robots.txt…）
│   ├── src/
│   │   ├── components/
│   │   │   ├── Player.jsx         # YouTube埋め込み＋字幕リスト
│   │   │   ├── CardForm.jsx       # カード作成フォーム
│   │   │   └── ExportButton.jsx   # Ankiエクスポートボタン
│   │   ├── pages/                 # Next.jsならここに画面コンポーネント
│   │   ├── services/
│   │   │   └── api.js             # axiosラッパー
│   │   └── App.jsx                # ルートコンポーネント（CRAの場合）
│   ├── package.json               # frontend用依存＆スクリプト
│   └── tailwind.config.js         # （任意）Tailwind設定
│
├── docker-compose.yml             # （任意）Postgres + Node コンテナ化
├── .gitignore                     # node_modules, .env, credentials.json など
├── README.md                      # プロジェクト概要＆起動手順
└── LICENSE                        # ライセンス（必要なら）