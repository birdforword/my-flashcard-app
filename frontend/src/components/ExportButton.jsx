// frontend/src/components/ExportButton.jsx
import { exportDeck } from "../services/api";

export default function ExportButton({ deckId, deckName }) {
  const download = async () => {
    try {
      const blob = await exportDeck(deckId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${deckName}.apkg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("エクスポート中にエラーが発生しました");
      console.error(err);
    }
  };

  return (
    <button
      className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      onClick={download}
    >
      Ankiエクスポート
    </button>
  );
}
