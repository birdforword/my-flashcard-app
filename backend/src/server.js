// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// 1) モデルをインポート（定義のみ、関連付けは後述）
import Card from './models/cardModel.js';
import Deck from './models/deckModel.js';

import cardsRouter     from './routes/cards.js';
import captionsRouter  from './routes/captions.js';
import exportRouter    from './routes/export.js';
import videosRouter    from './routes/videos.js';
import subtitlesRouter from './routes/subtitles.js';
import deckRouter      from './routes/deckRoutes.js';

dotenv.config();
const app = express();

// JSON と CORS を有効化
app.use(cors());
app.use(express.json());

// 2) モデル間の関連付け（必ず sync の前に！）
Deck.hasMany(Card,   { foreignKey: 'deckId', onDelete: 'CASCADE' });
Card.belongsTo(Deck, { foreignKey: 'deckId' });

// 3) ルーティング定義
app.use('/api/videos',    videosRouter);
app.use('/api/health',    (req, res) => res.send('OK'));
app.use('/api/cards',     cardsRouter);
app.use('/api/captions',  captionsRouter);
app.use('/api/export',    exportRouter);
app.use('/api/subtitles', subtitlesRouter);
app.use('/api/decks',     deckRouter);

// 4) DB同期＆サーバ起動
sequelize
  .sync({ force: true })   // force:true で既存テーブルを DROP → 再作成
  .then(() => {
    console.log('🗄️ DB synced (force:true)');
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`🚀 Listening on port ${port}`));
  })
  .catch(err => {
    console.error('🔥 DB sync failed:', err);
    process.exit(1);
  });
