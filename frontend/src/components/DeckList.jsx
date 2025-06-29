// frontend/src/components/DeckList.jsx
import { useState } from 'react';

export default function DeckList({
  decks,
  onSelect,
  onCreate,
  onDeleteDeck,
  onDeleteCard
}) {
  const [name, setName] = useState('');
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold mb-2">デッキ一覧</h2>
      <ul className="list-disc pl-5 mb-2 space-y-2">
        {decks.map(deck => (
          <li key={deck.id}>
            <div className="flex justify-between">
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => onSelect(deck.id)}
              >
                {deck.name}
              </span>
              <button
                className="text-red-500"
                onClick={() => onDeleteDeck(deck.id)}
              >
                削除
              </button>
            </div>
            <ul className="ml-4 list-disc space-y-1">
              {deck.Cards.map(card => (
                <li key={card.id} className="flex justify-between">
                  <span>
                    [{card.timeSec}s] {card.frontText} → {card.backText}
                  </span>
                  <button
                    className="text-red-500"
                    onClick={() => onDeleteCard(card.id)}
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="flex space-x-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="新しいデッキ名"
          className="border p-1 flex-1"
        />
        <button
          className="bg-green-500 text-white px-3"
          onClick={() => { onCreate(name); setName(''); }}
        >
          作成
        </button>
      </div>
    </div>
  );
}
