1. リポジトリ構成
Backend
Node.js + Express + Sequelize を利用したAPIサーバーです。README の冒頭にも記載されています。
backend/src/ 内に次のような構成があり:

config/ … DB接続設定（database.js）

controllers/ … ビジネスロジック呼び出し

models/ … Sequelizeモデル定義

routes/ … APIエンドポイント

services/ … 外部サービス利用やDB操作

server.js … ルーティングをまとめ、アプリを起動

Frontend
React (Create React App) を利用しており、frontend/src/ 配下にコンポーネントや API ラッパーがあります。
代表的なコンポーネント例:

Player.jsx (YouTube埋め込み再生)

CardForm.jsx (カード作成フォーム)

CaptionsList.jsx 等

その他
Postgres を docker-compose で起動できる設定が docker-compose.yml にあります。

2. セットアップ方法
README によれば:

cd backend && npm install

.env を作成して環境変数を設定

例: DATABASE_URL（必須）

YouTube API を利用する場合は YOUTUBE_API_KEY も必要

npm run dev (バックエンドの起動)

cd frontend && npm install && npm start (フロントエンドの起動)

データベース接続は Postgres を想定しており、.env で DATABASE_URL を設定します。必要に応じて docker-compose を使用してDBを立てられます。

3. 主なコードの流れ
API サーバー起動: backend/src/server.js で Express アプリを作成し、各種ルート (/api/cards 等) を登録します。

カード操作: controllers/cardController.js が受けたリクエストを services/cardService.js に渡し、Sequelize モデル Card を通じてDB操作を行います。

デッキ機能: models/deckModel.js と routes/deckRoutes.js により、カードをデッキ単位で管理できます。

フロントエンド: src/App.jsx に全体のUIロジックがあり、動画ID入力→字幕取得→カード作成などの一連の操作を制御します。API呼び出しは services/api.js 経由で行います。

4. 重要事項・開発時の注意
.env や credentials.json（Googleサービスアカウントキーなど）は Git で無視する設定になっています。環境変数の管理には注意してください。

ライセンスファイルは空です，運用ルールを決める場合は追記が必要かもしれません。

基本的なテストは frontend/src/App.test.js にサンプルがあるのみです。大きなテスト基盤はまだ整備されていません。

5. 次に学習・確認すると良い事項
Express + Sequelize の基本と、backend/src 以下のコードの関係。DBモデル (Card, Deck) と各ルートの動きが理解できれば、APIの追加変更がやりやすくなります。

React Hooks とコンポーネント構成
frontend/src/App.jsx と各コンポーネントの連携を読むことで、UI のデータフローや状態管理の方法が掴めます。

Docker Compose でのローカル環境構築
Postgres を docker-compose で立ち上げて .env の DATABASE_URL を設定すれば、バックエンドをすぐに動かせます。

API連携の詳細
services/api.js のメソッドを確認し、フロントからバックエンドへの通信経路・データ形式を把握しておくとよいでしょう。

今後の強化ポイント

テストコードの追加

デプロイ設定 (CI/CD) の整備

空の LICENSE ファイルの整備