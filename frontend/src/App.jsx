import { useEffect, useState, useCallback } from "react";
import {
  fetchHealth,
  fetchCards,
  fetchCaptions,
  fetchDecks,
  createDeck,
  deleteDeck,
  createCard,
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
import ExportButton from "./components/ExportButton";

function App() {
  const [status, setStatus] = useState("");
  const [cards, setCards] = useState([]);
  const [decks, setDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(null);

  const [inputText, setInputText] = useState("");
  const [videoId, setVideoId] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [captions, setCaptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [player, setPlayer] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(0);

  // ── デッキ一覧取得 ────────────────────────────
  useEffect(() => {
    fetchDecks().then(setDecks);
  }, []);

  // ── デッキ選択 or 初回 健康チェック＋カード取得 ──────────
  useEffect(() => {
    fetchHealth().then(setStatus);
    if (currentDeck) {
      fetchCards(currentDeck).then((cs) =>
        setCards(cs.slice().sort((a, b) => a.timeSec - b.timeSec))
      );
    } else {
      setCards([]);
    }
  }, [currentDeck]);

  // ── 動画ID 変更時の字幕取得 ───────────────────────
  useEffect(() => {
    if (!videoId) {
      setCaptions([]);
      setVideoTitle("");
      return;
    }
    fetchCaptions(videoId, "en")
      .then(setCaptions)
      .catch(() => setCaptions([]));
    fetchVideoTitle(videoId)
      .then(async (title) => {
        setVideoTitle(title);
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
      .catch(() => setVideoTitle(""));
  }, [videoId]);

  // ── プレイヤーの現在時刻更新 ─────────────────────
  useEffect(() => {
    if (!player) return;
    const id = setInterval(() => {
      setEndTime(player.getCurrentTime());
    }, 500);
    return () => clearInterval(id);
  }, [player]);

  // プレイヤーの状態変化時の処理
  const handlePlayerStateChange = (state) => {
    if (state === 1 && player) {
      setStartTime(player.getCurrentTime());
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

  const quickCreateCard = async () => {
    if (!player || !currentDeck) return;
    const now = player.getCurrentTime();
    const start = startTime !== null ? startTime : now;
    const end = now;
    await createCard({
      deckId: currentDeck,
      videoId,
      timeSec: start,
      frontText: start.toFixed(2),
      backText: end.toFixed(2),
      thumbnail: null,
    });
    setStartTime(start);
    setEndTime(end);
    fetchCards(currentDeck).then((cs) =>
      setCards(cs.slice().sort((a, b) => a.timeSec - b.timeSec))
    );
  };

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
      />

      {/* 選択中のデッキ名 */}
      {currentDeck && (
        <h2 className="text-xl font-semibold">
          デッキ: {decks.find((d) => d.id === currentDeck)?.name}
        </h2>
      )}

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

      {player && (
        <div className="flex items-center space-x-4">
          <label className="font-mono text-sm flex items-center space-x-1">
            <span>Start:</span>
            <span className="inline-block w-20 text-right">
              {startTime !== null ? startTime.toFixed(2) : ""}
            </span>
          </label>
          <label className="font-mono text-sm flex items-center space-x-1">
            <span>End:</span>
            <span className="inline-block w-20 text-right">
              {endTime.toFixed(2)}
            </span>
          </label>
          <button
            className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
            disabled={!currentDeck}
            onClick={quickCreateCard}
          >
            作成
          </button>
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
            onSelect={(c) => {
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
          initialFront={selected?.text || ""}
          initialTimeSec={selected?.offset || null}
          onCreated={() =>
            fetchCards(currentDeck).then((cs) =>
              setCards(cs.slice().sort((a, b) => a.timeSec - b.timeSec))
            )
          }
        />
      )}

      {/* カード一覧 & エクスポート */}
      {currentDeck && (
        <>
          <h2 className="text-xl">Cards</h2>
          <ul className="list-disc pl-5 space-y-1">
            {cards.map((c) => (
              <li key={c.id} className="flex justify-between items-center">
                <span>
                  [{c.id}] {c.frontText} → {c.backText}
                </span>
                <button
                  className="text-red-500"
                  onClick={async () => {
                    await deleteCard(c.id);
                    fetchCards(currentDeck).then((cs) =>
                      setCards(cs.slice().sort((a, b) => a.timeSec - b.timeSec))
                    );
                  }}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
          <ExportButton
            deckId={currentDeck}
            deckName={decks.find((d) => d.id === currentDeck)?.name || "deck"}
          />
        </>
      )}
    </div>
  );
}

export default App;
