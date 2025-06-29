// frontend/src/components/CardForm.jsx
import { useState, useEffect } from "react";
import { createCard } from "../services/api";

export default function CardForm({
  deckId, // ← 追加
  onCreated,
  videoId,
  initialFront = "",
  initialTimeSec = null,
}) {
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState("");
  const [timeSec, setTimeSec] = useState(initialTimeSec);

  // props が変わったとき同期
  useEffect(() => {
    setFront(initialFront);
  }, [initialFront]);
  useEffect(() => {
    setTimeSec(initialTimeSec);
  }, [initialTimeSec]);

  const submit = async () => {
    if (!deckId) {
      alert("カードを追加するデッキが選択されていません");
      return;
    }
    try {
      await createCard({
        deckId, // ← ここで必ず deckId を渡す
        videoId,
        timeSec,
        frontText: front,
        backText: back,
        thumbnail: null,
      });
      // フォームクリア
      setFront("");
      setBack("");
      setTimeSec(null);
      // 上位でカード一覧を再取得
      onCreated();
    } catch (err) {
      console.error("カード作成エラー", err);
      alert("カードの作成に失敗しました");
    }
  };

  return (
    <div className="my-4 flex flex-col space-y-2">
      <input
        className="border p-2"
        placeholder="表面テキスト"
        value={front}
        onChange={(e) => setFront(e.target.value)}
      />
      <input
        className="border p-2"
        placeholder="裏面テキスト"
        value={back}
        onChange={(e) => setBack(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={submit}
      >
        カード作成
      </button>
    </div>
  );
}
