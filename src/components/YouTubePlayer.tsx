"use client";

import { PlayerState, PlayerControls } from "@/hooks/useYouTubePlayer";

interface Props {
  containerId: string;
  urlInput: string;
  onUrlInputChange: (v: string) => void;
  onLoadVideo: () => void;
  playerState: PlayerState;
  playerControls: PlayerControls;
  compact?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function YouTubePlayer({
  containerId,
  urlInput,
  onUrlInputChange,
  onLoadVideo,
  playerState,
  playerControls,
  compact = false,
}: Props) {
  const { isPlaying, currentTime, duration, playbackRate, availableRates } =
    playerState;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onLoadVideo();
  };

  return (
    <div className="bg-black">
      {/* URL input row — hide in compact/practice mode */}
      {!compact && (
        <div className="flex gap-2 px-3 py-2 bg-gray-900">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => onUrlInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="YouTube URL または動画ID"
            className="flex-1 bg-gray-800 text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
          />
          <button
            onClick={onLoadVideo}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-medium px-4 py-2 rounded-md whitespace-nowrap"
          >
            読み込む
          </button>
        </div>
      )}

      {/* YouTube player iframe — always in DOM, never hidden */}
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <div
          id={containerId}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-900 px-3 py-2 space-y-2">
        {/* Time display */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1 mx-3 bg-gray-700 rounded-full h-1.5 overflow-hidden">
            {duration > 0 && (
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            )}
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Playback buttons */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => playerControls.seekTo(0)}
            className="touch-target bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-md px-3 py-2 text-sm"
            aria-label="先頭へ"
          >
            ⏮
          </button>
          <button
            onClick={() => playerControls.seekBy(-5)}
            className="touch-target bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-md px-4 py-2 text-sm"
            aria-label="5秒戻る"
          >
            -5s
          </button>
          <button
            onClick={playerControls.toggle}
            className="touch-target bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md px-6 py-2 text-lg font-bold min-w-[56px]"
            aria-label={isPlaying ? "一時停止" : "再生"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            onClick={() => playerControls.seekBy(5)}
            className="touch-target bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-md px-4 py-2 text-sm"
            aria-label="5秒進む"
          >
            +5s
          </button>

          {/* Playback rate */}
          <select
            value={playbackRate}
            onChange={(e) =>
              playerControls.setPlaybackRate(parseFloat(e.target.value))
            }
            className="bg-gray-700 text-white text-sm rounded-md px-2 py-2 outline-none"
            aria-label="再生速度"
          >
            {availableRates.map((r) => (
              <option key={r} value={r}>
                {r}x
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
