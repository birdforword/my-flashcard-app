// frontend/src/components/DeckList.jsx
// デッキの一覧を表示するだけのシンプルなコンポーネント
import React from "react";

export default function DeckList({
  decks,
  currentDeck,
  cards,
  onSelect,
  onDelete,
  onExport,
  onDeleteCard,
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold mb-2">デッキ一覧</h2>
      <ul className="list-disc pl-5 mb-2">
        {decks.map((deck) => (
          <li key={deck.id} className="mb-2">
            <div className="flex justify-between items-center">
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
                <button
                  className="text-red-500"
                  onClick={() => onDelete(deck.id)}
                >
                  削除
                </button>
              </div>
            </div>
            {deck.id === currentDeck && cards.length > 0 && (
              <ul className="list-disc pl-5 space-y-1 mt-1">
                {cards.map((c) => (
                  <li
                    key={c.id}
                    className="flex justify-between items-center"
                  >
                    <span>
                      Start: {c.startSec?.toFixed(2)} / End: {c.endSec?.toFixed(2)}
                      {" "}Front: {c.frontText} / Back: {c.backText}
                    </span>
                    {onDeleteCard && (
                      <button
                        className="text-red-500"
                        onClick={() => onDeleteCard(c.id)}
                      >
                        削除
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
