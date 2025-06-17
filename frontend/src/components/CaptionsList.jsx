// frontend/src/components/CaptionsList.jsx
export default function CaptionsList({ captions, onSelect }) {
  if (!captions || captions.length === 0) {
    return <p className="mt-4 text-gray-500">字幕が見つかりませんでした</p>;
  }
  return (
    <ul className="mt-4 max-h-64 overflow-auto space-y-1">
      {captions.map((c, idx) => (
        <li
          key={idx}
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => onSelect && onSelect(c)}
        >
          <span className="font-mono text-sm mr-2">
            {Math.floor(c.offset)}s
          </span>
          {c.text}
        </li>
      ))}
    </ul>
  );
}
