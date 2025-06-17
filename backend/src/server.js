import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import cardsRouter    from './routes/cards.js';
import captionsRouter from './routes/captions.js';
import exportRouter   from './routes/export.js';
import videosRouter from './routes/videos.js';
import subtitlesRouter from './routes/subtitles.js';

dotenv.config();
const app = express();
app.use(cors(), express.json());
app.use('/api/videos', videosRouter);
app.use('/api/health', (req, res) => res.send('OK'));
app.use('/api/cards',    cardsRouter);
app.use('/api/captions', captionsRouter);
app.use('/api/export',   exportRouter);
app.use('/api/subtitles', subtitlesRouter);

sequelize.sync().then(() => {
  console.log('🗄️ DB synced');
  app.listen(process.env.PORT || 4000, () => console.log('🚀 Listening'));
});
