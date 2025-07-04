import { useEffect, useState, useCallback } from "react";
import {
  fetchHealth,
  fetchCards,
  fetchCaptions,
  fetchDecks,
  createDeck,
  deleteDeck,
  deleteCard,
  exportDeck,
  fetchVideoTitle,
} from "./services/api";
import Player from "./components/Player";
import SubtitleOverlay from "./components/SubtitleOverlay";
import UploadSubtitles from "./components/UploadSubtitles";
import CaptionsList from "./components/CaptionsList";
import DeckList from "./components/DeckList";
import CardForm from "./components/CardForm";

function App() {
  const [status, setStatus] = useState("");
  const [cards, setCards] = useState([]);
  const [decks, setDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(null);

  const [inputText, setInputText] = useState("");
  const [videoId, setVideoId] = useState("");
  const [captions, setCaptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [player, setPlayer] = useState(null);
  const [capturedStartSec, setCapturedStartSec] = useState(null);
  const [capturedEndSec, setCapturedEndSec] = useState(null);

  // ── デッキ一覧取得 ────────────────────────────
  useEffect(() => {
    fetchDecks().then(setDecks);
  }, []);

  // ── デッキ選択 or 初回 健康チェック＋カード取得 ──────────
  useEffect(() => {
    fetchHealth().then(setStatus);
    if (currentDeck) {
      fetchCards(currentDeck).then((cs) =>
        setCards(cs.slice().sort((a, b) => a.startSec - b.startSec))
      );
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
    fetchCaptions(videoId, "en")
      .then(setCaptions)
      .catch(() => setCaptions([]));
    fetchVideoTitle(videoId)
      .then(async (title) => {
        try {
          const existing = decks.find((d) => d.name === title);
          if (existing) {
            // Skip creation and use the existing deck
            setCurrentDeck(existing.id);
          } else {
            const deck = await createDeck(title);
            setCurrentDeck(deck.id);
            fetchDecks().then(setDecks);
          }
        } catch {
          // デッキ作成に失敗した場合でもタイトルは保持する
        }
      })
      .catch(() => {});
  }, [videoId, decks]);

  // Reset captured times when video changes
  useEffect(() => {
    setCapturedStartSec(null);
    setCapturedEndSec(null);
    setSelected(null);
  }, [videoId]);

  // ── プレイヤーの現在時刻更新 ─────────────────────
  useEffect(() => {
    if (!player) return;
    const id = setInterval(() => {
      setCapturedEndSec(player.getCurrentTime());
    }, 500);
    return () => clearInterval(id);
  }, [player]);

  const handlePlayerStateChange = (state) => {
    if (player) {
      if (state === 1) {
        const t = player.getCurrentTime();
        setCapturedStartSec(t);
      } else if (state === 2) {
        const t = player.getCurrentTime();
        setCapturedEndSec(t);
      }
    }
  };


  // ── イベントハンドラ ───────────────────────────
  const handleSearch = () => {
    let id;
    try {
      const url = new URL(inputText);
      id = url.hostname.includes("youtu.be")
        ? url.pathname.slice(1)
        : url.searchParams.get("v") || "";
    } catch {
      id = inputText.trim();
    }
    setVideoId(id);
  };

  const handleUpload = useCallback((parsed) => {
    setCaptions(parsed);
  }, []);


  const handleExportDeck = async (deck) => {
    try {
      const blob = await exportDeck(deck.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${deck.name}.apkg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("エクスポート中にエラーが発生しました");
      console.error(err);
    }
  };

  // ── JSX ───────────────────────────────────────
  return (
    <div className="p-4 space-y-6">
      {/* サーバステータス */}
      <p className="text-sm text-gray-600">サーバー: {status}</p>

      {/* デッキ一覧 */}
      <DeckList
        decks={decks}
        currentDeck={currentDeck}
        cards={cards}
        onSelect={(id) => setCurrentDeck(id)}
        onDelete={async (id) => {
          await deleteDeck(id);
          if (currentDeck === id) setCurrentDeck(null);
          fetchDecks().then(setDecks);
        }}
        onExport={handleExportDeck}
        onDeleteCard={async (id) => {
          await deleteCard(id);
          fetchCards(currentDeck).then((cs) =>
            setCards(cs.slice().sort((a, b) => a.startSec - b.startSec)),
          );
        }}
      />

      {/* 選択中のデッキ名と動画タイトルは表示しない */}

      {/* YouTube URL/ID 検索フォーム */}
      <div className="flex items-center space-x-2">
        <input
          className="border p-2 flex-1"
          placeholder="YouTube URL または動画ID"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSearch}
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
          onStateChange={handlePlayerStateChange}
        />
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
            onSelect={(c) => {
              setSelected(c);
              player?.seekTo(c.offset, true);
              setCapturedStartSec(c.offset);
              setCapturedEndSec(c.offset + c.duration);
            }}
          />
        </>
      )}

      {/* カード作成フォーム */}
      {currentDeck && (
        <CardForm
          deckId={currentDeck}
          videoId={videoId}
          initialFront={selected?.text || ""}
          initialStartSec={capturedStartSec}
          initialEndSec={capturedEndSec}
          onCreated={() =>
            fetchCards(currentDeck).then((cs) =>
              setCards(cs.slice().sort((a, b) => a.startSec - b.startSec))
            )
          }
        />
      )}

    </div>
  );
}

export default App;
