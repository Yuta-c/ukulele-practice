"use client";

import { PlayerState, PlayerControls } from "@/hooks/useYouTubePlayer";
import { Song, ViewMode } from "@/lib/types";

interface Props {
  playerState: PlayerState;
  playerControls: PlayerControls;
  loop: Song["loop"];
  onLoopToggle: () => void;
  viewMode: ViewMode;
  onViewModeToggle: () => void;
}

export default function BottomBar({
  playerState,
  playerControls,
  loop,
  onLoopToggle,
  viewMode,
  onViewModeToggle,
}: Props) {
  const { isPlaying } = playerState;
  const loopEnabled = loop?.enabled ?? false;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{ maxWidth: "672px", margin: "0 auto" }}
    >
      {/* Actual bar */}
      <div
        className="bg-gray-950/95 backdrop-blur-sm border-t border-gray-800"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-around px-1 py-2">
          {/* -5s */}
          <button
            onClick={() => playerControls.seekBy(-5)}
            className="flex flex-col items-center gap-0.5 w-14 py-1 text-gray-300 active:text-white"
            aria-label="5秒戻る"
          >
            <span className="text-xl leading-none">⏪</span>
            <span className="text-[10px] leading-tight">-5s</span>
          </button>

          {/* Play / Pause — largest, center */}
          <button
            onClick={playerControls.toggle}
            className={`flex items-center justify-center w-14 h-14 rounded-full text-white text-2xl shadow-lg ${
              isPlaying
                ? "bg-blue-600 active:bg-blue-700"
                : "bg-blue-500 active:bg-blue-600"
            }`}
            aria-label={isPlaying ? "一時停止" : "再生"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* +5s */}
          <button
            onClick={() => playerControls.seekBy(5)}
            className="flex flex-col items-center gap-0.5 w-14 py-1 text-gray-300 active:text-white"
            aria-label="5秒進む"
          >
            <span className="text-xl leading-none">⏩</span>
            <span className="text-[10px] leading-tight">+5s</span>
          </button>

          {/* Loop toggle */}
          <button
            onClick={onLoopToggle}
            className={`flex flex-col items-center gap-0.5 w-14 py-1 rounded-lg ${
              loopEnabled ? "text-orange-400" : "text-gray-600"
            }`}
            aria-label={loopEnabled ? "ループ無効化" : "ループ有効化"}
          >
            <span className="text-xl leading-none">🔁</span>
            <span className="text-[10px] leading-tight">
              {loopEnabled ? "ON" : "OFF"}
            </span>
          </button>

          {/* View mode toggle */}
          <button
            onClick={onViewModeToggle}
            className={`flex flex-col items-center gap-0.5 w-14 py-1 rounded-lg ${
              viewMode === "practice" ? "text-green-400" : "text-blue-400"
            }`}
            aria-label={viewMode === "practice" ? "編集モードへ" : "練習モードへ"}
          >
            <span className="text-xl leading-none">
              {viewMode === "practice" ? "✏️" : "🎵"}
            </span>
            <span className="text-[10px] leading-tight">
              {viewMode === "practice" ? "編集" : "練習"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
