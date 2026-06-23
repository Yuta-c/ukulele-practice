"use client";

import { Song } from "@/lib/types";

interface Props {
  loop: Song["loop"];
  currentTime: number;
  onLoopChange: (loop: Song["loop"]) => void;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1).padStart(4, "0");
  return `${m}:${sec}`;
}

export default function LoopControl({ loop, currentTime, onLoopChange }: Props) {
  const enabled = loop?.enabled ?? false;
  const start = loop?.start ?? 0;
  const end = loop?.end ?? 0;

  const setStart = (v: number) =>
    onLoopChange({ start: Math.max(0, v), end: end, enabled });
  const setEnd = (v: number) =>
    onLoopChange({ start, end: Math.max(0, v), enabled });
  const setEnabled = (v: boolean) =>
    onLoopChange({ start, end, enabled: v });
  const clearLoop = () => onLoopChange(undefined);

  return (
    <div
      className={`px-3 py-2 border-b border-gray-800 ${
        enabled ? "bg-orange-950" : "bg-gray-900"
      }`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        {/* Loop toggle */}
        <button
          onClick={() => setEnabled(!enabled)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-md ${
            enabled
              ? "bg-orange-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          {enabled ? "🔁 ループ中" : "🔁 ループ"}
        </button>

        {/* A point */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">A:</span>
          <button
            onClick={() => setStart(currentTime)}
            className="text-xs bg-gray-700 hover:bg-gray-600 active:bg-gray-500 px-2 py-1 rounded"
            title="現在時刻をAに登録"
          >
            {formatTime(start)}
          </button>
          <button
            onClick={() => setStart(start - 0.1)}
            className="text-xs bg-gray-700 px-1.5 py-1 rounded"
          >
            ◀
          </button>
          <button
            onClick={() => setStart(start + 0.1)}
            className="text-xs bg-gray-700 px-1.5 py-1 rounded"
          >
            ▶
          </button>
          <button
            onClick={() => setStart(currentTime)}
            className="text-xs bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded"
            title="現在時刻をAに設定"
          >
            現在時刻
          </button>
        </div>

        {/* B point */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">B:</span>
          <button
            onClick={() => setEnd(currentTime)}
            className="text-xs bg-gray-700 hover:bg-gray-600 active:bg-gray-500 px-2 py-1 rounded"
            title="現在時刻をBに登録"
          >
            {formatTime(end)}
          </button>
          <button
            onClick={() => setEnd(end - 0.1)}
            className="text-xs bg-gray-700 px-1.5 py-1 rounded"
          >
            ◀
          </button>
          <button
            onClick={() => setEnd(end + 0.1)}
            className="text-xs bg-gray-700 px-1.5 py-1 rounded"
          >
            ▶
          </button>
          <button
            onClick={() => setEnd(currentTime)}
            className="text-xs bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded"
          >
            現在時刻
          </button>
        </div>

        {/* Clear */}
        {loop && (
          <button
            onClick={clearLoop}
            className="text-xs bg-gray-800 text-gray-400 hover:text-white px-2 py-1 rounded"
          >
            解除
          </button>
        )}
      </div>
    </div>
  );
}
