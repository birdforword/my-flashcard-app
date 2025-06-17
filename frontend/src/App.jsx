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

function App() {
  const [status, setStatus]       = useState('');
  const [cards, setCards]         = useState([]);
  const [inputText, setInputText] = useState('');
  const [videoId, setVideoId]     = useState('');
  const [captions, setCaptions]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [player, setPlayer]       = useState(null);

  // バックエンド健康チェック＋カード一覧取得
  const refresh = () => {
    fetchHealth().then(setStatus);
    fetchCards().then(setCards);
  };

  useEffect(refresh, []);

  // videoIdが変わったら自動的にキャプションを取る or クリア
  useEffect(() => {
    if (!videoId) {
      setCaptions([]);
      return;
    }
    fetchCaptions(videoId, 'en')
      .then(setCaptions)
      .catch(() => setCaptions([]));
  }, [videoId]);

  // SRT/VTTアップロード後のコール
  const handleUpload = parsedCaptions => {
    setCaptions(parsedCaptions);
  };

  // YouTube URL/ID からvideoId抽出
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
      <h1 className="text-2xl mb-4">Flashcard App</h1>
      <p>サーバーステータス: {status}</p>

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

      {/* 動画プレビュー */}
      {videoId && (
        <Player
          key={videoId}
          videoId={videoId}
          onReady={setPlayer}
        />
      )}

      {/* 自動取得が空のときは手動アップロード */}
      {captions.length === 0 && videoId && (
        <UploadSubtitles onParsed={handleUpload} />
      )}

      {/* 字幕リスト */}
      <CaptionsList
        captions={captions}
        onSelect={c => {
          setSelected(c);
          if (player) player.seekTo(c.offset, true);
        }}
      />

      {/* 選択した字幕を初期値にしたカードフォーム */}
      <CardForm
        onCreated={refresh}
        videoId={videoId}
        initialFront={selected?.text || ''}
        initialTimeSec={selected?.offset || null}
      />

      {/* カード一覧 */}
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
