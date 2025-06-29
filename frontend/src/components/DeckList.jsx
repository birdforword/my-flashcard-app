// frontend/src/components/DeckList.jsx
// デッキの一覧を表示するだけのシンプルなコンポーネント
import React from "react";

export default function DeckList({ decks, onSelect, onDelete, onExport }) {
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
    </div>
  );
}
