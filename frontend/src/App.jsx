// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import {
  fetchHealth,
  fetchCards,
  fetchCaptions,
} from './services/api';
import Player           from './components/Player';
import CardForm         from './components/CardForm';
import CaptionsList     from './components/CaptionsList';
import ExportButton     from './components/ExportButton';
import UploadSubtitles  from './components/UploadSubtitles';
import SubtitleOverlay  from './components/SubtitleOverlay';

function App() {
  const [status, setStatus]       = useState('');
  const [cards, setCards]         = useState([]);
  const [inputText, setInputText] = useState('');
  const [videoId, setVideoId]     = useState('');
  const [captions, setCaptions]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [player, setPlayer]       = useState(null);

  // 初回とカード更新時
  const refresh = () => {
    fetchHealth().then(setStatus);
    fetchCards().then(setCards);
  };
  useEffect(refresh, []);

  // videoId が変わったら自動取得
  useEffect(() => {
    if (!videoId) {
      setCaptions([]);
      return;
    }
    fetchCaptions(videoId, 'en')
      .then(setCaptions)
      .catch(() => setCaptions([]));
  }, [videoId]);

  // 手動アップロード後
  const handleUpload = parsed => setCaptions(parsed);

  const extractVideoId = input => {
    try {
      const url = new URL(input);
      if (url.hostname.includes('youtu.be')) return url.pathname.slice(1);
      if (url.searchParams.has('v')) return url.searchParams.get('v');
      return null;
    } catch {
      return input.trim();
    }
  };
  const onSearch = () => {
    const id = extractVideoId(inputText);
    if (id) setVideoId(id);
    else alert('有効なIDまたはURLを入力してください');
  };

  return (
    <div className="p-4">
      {/* 検索フォーム */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          className="border p-2 flex-1"
          placeholder="YouTube URL または動画ID"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onSearch}
        >
          表示
        </button>
      </div>

      {/* 動画プレイヤー */}
      {videoId && (
        <Player
          key={videoId}
          videoId={videoId}
          onReady={setPlayer}
        />
      )}

      {/* 字幕：自動取得 or 手動アップロード */}
      {videoId && captions.length === 0 && (
        <UploadSubtitles onParsed={handleUpload} />
      )}
      {videoId && captions.length > 0 && (
        <>
          {/* 動画下のリアルタイム字幕 */}
          <SubtitleOverlay player={player} captions={captions} />
          {/* 字幕リスト */}
          <CaptionsList
            captions={captions}
            onSelect={c => {
              setSelected(c);
              if (player) player.seekTo(c.offset, true);
            }}
          />
        </>
      )}

      {/* カードフォーム */}
      <CardForm
        onCreated={refresh}
        videoId={videoId}
        initialFront={selected?.text || ''}
        initialTimeSec={selected?.offset || null}
      />

      {/* カード一覧 & エクスポート */}
      <h2 className="mt-6 text-xl">Cards</h2>
      <ul className="list-disc pl-5">
        {cards.map(c => (
          <li key={c.id}>
            [{c.id}] {c.frontText} → {c.backText}
          </li>
        ))}
      </ul>
      <ExportButton />
    </div>
  );
}

export default App;
