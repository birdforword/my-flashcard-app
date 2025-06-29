// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import {
  fetchHealth,
  fetchCards,
  fetchCaptions,
  fetchDecks,
  createDeck,
  deleteDeck,
  createCard
} from './services/api';
import Player          from './components/Player';
import SubtitleOverlay from './components/SubtitleOverlay';
import UploadSubtitles from './components/UploadSubtitles';
import CaptionsList    from './components/CaptionsList';
import DeckList        from './components/DeckList';
import CardForm        from './components/CardForm';
import ExportButton    from './components/ExportButton';
import { deleteCard } from './services/api';

function App() {
  const [status,      setStatus]      = useState('');
  const [cards,       setCards]       = useState([]);
  const [decks,       setDecks]       = useState([]);
  const [currentDeck, setCurrentDeck] = useState(null);

  const [inputText, setInputText] = useState('');
  const [videoId,   setVideoId]   = useState('');
  const [captions,  setCaptions]  = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [player,    setPlayer]    = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [currTime,  setCurrTime]  = useState(0);

  // ── デッキ一覧取得 ────────────────────────────
  useEffect(() => {
    fetchDecks().then(setDecks);
  }, []);

  // ── デッキ選択 or 初回 健康チェック＋カード取得 ──────────
  useEffect(() => {
    fetchHealth().then(setStatus);
    if (currentDeck) {
      fetchCards(currentDeck).then(setCards);
    } else {
      setCards([]);
    }
  }, [currentDeck]);

  // ── 動画ID 変更時の字幕取得 ───────────────────────
  useEffect(() => {
    if (!videoId) {
      setCaptions([]);
      return;
    }
    fetchCaptions(videoId, 'en')
      .then(setCaptions)
      .catch(() => setCaptions([]));
  }, [videoId]);

  // ── プレイヤーの現在時刻更新 ─────────────────────
  useEffect(() => {
    if (!player) return;
    const id = setInterval(() => {
      setCurrTime(player.getCurrentTime());
    }, 500);
    return () => clearInterval(id);
  }, [player]);

  const handleStateChange = state => {
    if (state === 1 && player) {
      setStartTime(player.getCurrentTime());
    }
  };

  // ── イベントハンドラ ───────────────────────────
  const onSearch = () => {
    let id;
    try {
      const url = new URL(inputText);
      id = url.hostname.includes('youtu.be')
        ? url.pathname.slice(1)
        : url.searchParams.get('v') || '';
    } catch {
      id = inputText.trim();
    }
    setVideoId(id);
  };

  const handleUpload = parsed => setCaptions(parsed);

  // ── JSX ───────────────────────────────────────
  return (
    <div className="p-4 space-y-6">
      {/* サーバステータス */}
      <p className="text-sm text-gray-600">サーバー: {status}</p>

      {/* デッキ一覧 & 作成 */}
      <DeckList
        decks={decks}
        onSelect={id => setCurrentDeck(id)}
        onCreate={async name => {
          await createDeck(name);
          fetchDecks().then(setDecks);
        }}
        onDeleteDeck={async id => {
          await deleteDeck(id);
          if (currentDeck === id) setCurrentDeck(null);
          fetchDecks().then(setDecks);
        }}
        onDeleteCard={async id => {
          await deleteCard(id);
          fetchDecks().then(setDecks);
          if (currentDeck) fetchCards(currentDeck).then(setCards);
        }}
      />

      {/* 選択中のデッキ名 */}
      {currentDeck && (
        <h2 className="text-xl font-semibold">
          デッキ: {decks.find(d => d.id === currentDeck)?.name}
        </h2>
      )}

      {/* YouTube URL/ID 検索フォーム */}
      <div className="flex items-center space-x-2">
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
          onStateChange={handleStateChange}
        />
      )}

      {player && (
        <div className="flex items-center space-x-4">
          <span className="font-mono text-sm">
            Start: {startTime !== null ? startTime.toFixed(2) : '--'}s
          </span>
          <span className="font-mono text-sm">
            Now: {currTime.toFixed(2)}s
          </span>
          {currentDeck && (
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={async () => {
                if (startTime === null) return;
                await createCard({
                  deckId: currentDeck,
                  videoId,
                  timeSec: startTime,
                  frontText: `{{Start}}${startTime.toFixed(2)}`,
                  backText: `{{End}}${currTime.toFixed(2)}`,
                  thumbnail: null,
                });
                fetchCards(currentDeck).then(setCards);
              }}
            >
              作成
            </button>
          )}
        </div>
      )}

      {/* 自動取得 or 手動アップロード */}
      {videoId && captions.length === 0 && (
        <UploadSubtitles onParsed={handleUpload} />
      )}
      {videoId && captions.length > 0 && (
        <>
          <SubtitleOverlay player={player} captions={captions} />
          <CaptionsList
            captions={captions}
            onSelect={c => {
              setSelected(c);
              player?.seekTo(c.offset, true);
            }}
          />
        </>
      )}

      {/* カード作成フォーム */}
      {currentDeck && (
        <CardForm
          deckId={currentDeck}
          videoId={videoId}
          initialFront={selected?.text || ''}
          initialTimeSec={selected?.offset || null}
          onCreated={() => {
            fetchCards(currentDeck).then(setCards);
          }}
        />
      )}

      {/* カード一覧 & エクスポート */}
      {currentDeck && (
        <>
          <h2 className="text-xl">Cards</h2>
          <ul className="list-disc pl-5 space-y-1">
            {cards.map(c => (
              <li key={c.id}>
                [{c.id}] {c.frontText} → {c.backText}
              </li>
            ))}
          </ul>
          <ExportButton deckId={currentDeck} />
        </>
      )}
    </div>
  );
}

export default App;
