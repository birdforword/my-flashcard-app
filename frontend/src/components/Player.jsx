// frontend/src/components/Player.jsx
import YouTube from "react-youtube";

export default function Player({
  videoId,
  onReady,
  onStateChange,
  startTime,
  endTime,
  onCreateCard,
}) {
  const opts = {
    height: "360",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      controls: 1,
      rel: 0,
    },
  };

  return (
    <div className="relative my-4 inline-block">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={(event) => {
          // プレーヤーのインスタンスを親に渡したいとき
          onReady && onReady(event.target);
        }}
        onStateChange={(event) => {
          // 再生・停止などのイベントを検知したいとき
          onStateChange && onStateChange(event.data);
        }}
      />
      {onCreateCard && (
        <div className="absolute bottom-2 left-24 flex items-center space-x-2 bg-white bg-opacity-80 px-2 py-1 rounded text-xs">
          <span className="font-mono">
            {startTime !== null ? startTime.toFixed(2) : ""}
          </span>
          <span className="font-mono">{endTime.toFixed(2)}</span>
          <button
            className="bg-green-500 text-white px-2 py-0.5 rounded"
            onClick={onCreateCard}
          >
            作成
          </button>
        </div>
      )}
    </div>
  );
}
