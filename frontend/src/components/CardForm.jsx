// frontend/src/components/CardForm.jsx
import { useState, useEffect } from 'react';  // useEffect を追加
import { createCard } from '../services/api';

export default function CardForm({
  onCreated,
  videoId,
  initialFront = '',
  initialTimeSec = null
}) {
  const [front, setFront] = useState(initialFront);
  const [back, setBack]   = useState('');
  const [timeSec, setTimeSec] = useState(initialTimeSec);

  // initialFront が変わったら front を更新
  useEffect(() => {
    setFront(initialFront);
  }, [initialFront]);

  // initialTimeSec が変わったら timeSec を更新
  useEffect(() => {
    setTimeSec(initialTimeSec);
  }, [initialTimeSec]);

  const submit = async () => {
    await createCard({
      videoId,
      timeSec,
      frontText: front,
      backText: back,
      thumbnail: null,
    });
    setFront('');
    setBack('');
    setTimeSec(null);
    onCreated();
  };

  return (
    <div className="my-4 flex flex-col space-y-2">
      <input
        className="border p-2"
        placeholder="Front"
        value={front}
        onChange={e => setFront(e.target.value)}
      />
      <input
        className="border p-2"
        placeholder="Back"
        value={back}
        onChange={e => setBack(e.target.value)}
      />
      {/* timeSec がある場合は非表示でもOKですが、デバッグ用に出すならこちら */}
      {/* <p className="text-sm text-gray-500">Time: {timeSec}s</p> */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={submit}
      >
        カード作成
      </button>
    </div>
  );
}
