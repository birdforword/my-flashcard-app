// frontend/src/components/SubtitleOverlay.jsx
import { useEffect, useState } from "react";

export default function SubtitleOverlay({ player, captions }) {
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    if (!player || !captions.length) {
      setCurrentText("");
      return;
    }

    const interval = setInterval(() => {
      const t = player.getCurrentTime();
      const cap = captions.find(
        (c) => t >= c.offset && t < c.offset + c.duration,
      );
      setCurrentText(cap ? cap.text : "");
    }, 500);

    return () => clearInterval(interval);
  }, [player, captions]);

  // テキストが無ければ何も出さない
  if (!currentText) return null;

  return (
    <div className="mt-2 p-2 bg-gray-800 text-white text-center rounded">
      {currentText}
    </div>
  );
}
