// frontend/src/components/DeckList.jsx
import { useState, useEffect } from "react";

export default function DeckList({
  decks,
  onSelect,
  onCreate,
  onDelete,
  onExport,
  defaultName,
}) {
  const [name, setName] = useState("");

  // デフォルト名が更新されたら入力も更新する
  useEffect(() => {
    if (defaultName) {
      setName(defaultName);
    }
  }, [defaultName]);
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold mb-2">デッキ一覧</h2>
      <ul className="list-disc pl-5 mb-2">
        {decks.map((deck) => (
          <li key={deck.id} className="flex justify-between items-center">
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => onSelect(deck.id)}
            >
              {deck.name} ({deck.Cards.length})
            </span>
            <div className="space-x-2">
              <button
                className="text-green-600"
                onClick={() => onExport(deck)}
              >
                作成
              </button>
              <button className="text-red-500" onClick={() => onDelete(deck.id)}>
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex space-x-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="新しいデッキ名"
          className="border p-1 flex-1"
        />
        <button
          className="bg-green-500 text-white px-3"
          onClick={() => {
            onCreate(name);
            setName("");
          }}
        >
          作成
        </button>
      </div>
    </div>
  );
}
