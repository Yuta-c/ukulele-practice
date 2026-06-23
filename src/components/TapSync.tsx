"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TapItem } from "@/lib/plainTextParser";
import { ChordEvent, LyricEvent } from "@/lib/types";

interface Props {
  items: TapItem[];
  currentTimeRef: React.RefObject<number>;
  onComplete: (chords: ChordEvent[], lyrics: LyricEvent[]) => void;
  onCancel: () => void;
}

type TappedEntry = { item: TapItem; time: number };

export default function TapSync({
  items,
  currentTimeRef,
  onComplete,
  onCancel,
}: Props) {
  const [cursor, setCursor] = useState(0);
  const [tapped, setTapped] = useState<TappedEntry[]>([]);
  const [done, setDone] = useState(false);
  const tapButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard shortcut: Space / Enter → tap
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, done]);

  const handleTap = () => {
    if (cursor >= items.length) return;
    const time = currentTimeRef.current ?? 0;
    const newTapped = [...tapped, { item: items[cursor], time }];
    setTapped(newTapped);

    if (cursor + 1 >= items.length) {
      setDone(true);
    } else {
      setCursor(cursor + 1);
    }
  };

  const handleUndo = () => {
    if (tapped.length === 0) return;
    setTapped(tapped.slice(0, -1));
    setCursor(Math.max(0, cursor - 1));
    setDone(false);
  };

  const handleApply = () => {
    const chords: ChordEvent[] = [];
    const lyrics: LyricEvent[] = [];

    for (const { item, time } of tapped) {
      if (item.chord) {
        chords.push({ id: uuidv4(), time, chord: item.chord });
      }
      if (item.lyric) {
        lyrics.push({ id: uuidv4(), time, text: item.lyric });
      }
    }

    onComplete(chords, lyrics);
  };

  const prevItem = cursor > 0 ? items[cursor - 1] : null;
  const currentItem = !done ? items[cursor] : null;
  const nextItem = !done && cursor + 1 < items.length ? items[cursor + 1] : null;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {done ? items.length : cursor} / {items.length} 打刻済み
        </span>
        <div className="h-1.5 flex-1 mx-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{
              width: `${((done ? items.length : cursor) / items.length) * 100}%`,
            }}
          />
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-300 text-xs"
        >
          キャンセル
        </button>
      </div>

      {/* Item display */}
      {!done ? (
        <div className="bg-gray-900 rounded-xl px-4 py-5 space-y-2 min-h-[140px] flex flex-col justify-center">
          {/* Previous (dimmed) */}
          {prevItem ? (
            <div className="text-center opacity-30 text-sm">
              {prevItem.chord && (
                <span className="font-bold text-yellow-300 mr-2">
                  {prevItem.chord}
                </span>
              )}
              {prevItem.lyric && (
                <span className="text-gray-300">{prevItem.lyric}</span>
              )}
            </div>
          ) : (
            <div className="h-5" />
          )}

          {/* Current (highlighted) */}
          <div className="text-center">
            {currentItem?.chord && (
              <div className="text-4xl font-bold text-yellow-300 leading-tight">
                {currentItem.chord}
              </div>
            )}
            {currentItem?.lyric && (
              <div className="text-lg text-white mt-1">{currentItem.lyric}</div>
            )}
          </div>

          {/* Next (dimmed) */}
          {nextItem ? (
            <div className="text-center opacity-30 text-sm">
              {nextItem.chord && (
                <span className="font-bold text-yellow-300 mr-2">
                  {nextItem.chord}
                </span>
              )}
              {nextItem.lyric && (
                <span className="text-gray-300">{nextItem.lyric}</span>
              )}
            </div>
          ) : (
            <div className="h-5" />
          )}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl px-4 py-8 text-center">
          <div className="text-2xl mb-1">完了</div>
          <p className="text-gray-400 text-sm">
            全 {items.length} 項目を打刻しました。適用してください。
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleUndo}
          disabled={tapped.length === 0}
          className="flex-none bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-white text-sm px-4 py-3 rounded-xl"
        >
          ← 戻る
        </button>

        {!done ? (
          <button
            ref={tapButtonRef}
            onClick={handleTap}
            className="flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-lg font-bold py-3 rounded-xl select-none"
          >
            打刻　<span className="text-sm font-normal opacity-70">Space / Enter</span>
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white text-lg font-bold py-3 rounded-xl"
          >
            適用
          </button>
        )}
      </div>

      <p className="text-xs text-gray-600 text-center">
        動画を再生しながら、各コード・歌詞のタイミングで打刻してください
      </p>
    </div>
  );
}
