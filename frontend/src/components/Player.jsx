// frontend/src/components/Player.jsx
import YouTube from "react-youtube";

export default function Player({ videoId, onReady, onStateChange }) {
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
    <div className="my-4">
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
    </div>
  );
}
