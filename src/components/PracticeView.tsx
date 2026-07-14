"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Song } from "@/lib/types";
import ChordDiagram from "./ChordDiagram";
import { findCurrent } from "@/lib/eventUtils";

interface Props {
  song: Song;
  currentTime: number;
  onSeek: (time: number) => void;
}

/** Seconds before a chord change when we start highlighting the next chord */
const NEXT_CHORD_WARN_SEC = 1.0;

export default function PracticeView({ song, currentTime, onSeek }: Props) {
  const [showDiagram, setShowDiagram] = useState(true);

  // ── Chord sync ────────────────────────────────────────────────────────────
  const { current: currentChord, nextItem: nextChord } = useMemo(
    () => findCurrent(song.chords, currentTime),
    [song.chords, currentTime]
  );

  const timeToNextChord = nextChord != null ? nextChord.time - currentTime : Infinity;
  const isNextChordImminent =
    timeToNextChord >= 0 && timeToNextChord < NEXT_CHORD_WARN_SEC;

  // ── Lyric sync ────────────────────────────────────────────────────────────
  const { index: lyricIdx } = useMemo(
    () => findCurrent(song.lyrics, currentTime),
    [song.lyrics, currentTime]
  );

  // Refs for smooth scroll
  const lyricScrollRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement | null>(null);
  const prevLyricIdx = useRef(lyricIdx);

  useEffect(() => {
    if (lyricIdx === prevLyricIdx.current) return;
    prevLyricIdx.current = lyricIdx;

    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [lyricIdx]);

  return (
    <div className="flex flex-col items-center px-3 pb-28 space-y-2 pt-3">
      {/* ── Current chord ── */}
      <div className="w-full text-center">
        <div
          className="font-black tracking-tight leading-none text-white select-none cursor-pointer"
          style={{ fontSize: "clamp(4rem, 20vw, 8rem)" }}
          onClick={() => currentChord && onSeek(currentChord.time)}
        >
          {currentChord?.chord ?? <span className="text-gray-700">—</span>}
        </div>
      </div>

      {/* ── Chord diagram + next chord row ── */}
      <div className="flex items-center justify-center gap-6 w-full">
        {showDiagram && currentChord && (
          <ChordDiagram chordName={currentChord.chord} size="lg" showLegend />
        )}

        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">次のコード</span>
          <div
            className={`text-3xl font-bold select-none cursor-pointer transition-colors duration-200 ${
              isNextChordImminent
                ? "text-orange-400 scale-110"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => nextChord && onSeek(nextChord.time)}
            style={{
              transform: isNextChordImminent ? "scale(1.12)" : "scale(1)",
              transition: "transform 0.2s ease, color 0.2s ease",
            }}
          >
            {nextChord?.chord ?? <span className="text-gray-700">—</span>}
          </div>
          {showDiagram && nextChord && (
            <ChordDiagram chordName={nextChord.chord} size="sm" />
          )}
        </div>
      </div>

      {/* ── Toggle diagram ── */}
      <button
        onClick={() => setShowDiagram((v) => !v)}
        className="text-xs text-gray-500 underline"
      >
        {showDiagram ? "コード表を隠す" : "コード表を表示"}
      </button>

      {/* ── Lyric scroll ── */}
      <div className="w-full pt-3 border-t border-gray-800">
        {song.lyrics.length === 0 ? (
          <p className="text-center text-gray-700 text-sm py-4">（歌詞なし）</p>
        ) : (
          <div
            ref={lyricScrollRef}
            className="overflow-y-scroll scrollbar-none"
            style={{ height: "200px" }}
          >
            {/* Top spacer so first lyric can scroll to center */}
            <div style={{ height: "80px" }} aria-hidden />

            {song.lyrics.map((l, i) => {
              const diff = i - lyricIdx;
              const isCurrent = diff === 0;
              const isNear1 = Math.abs(diff) === 1;
              const isNear2 = Math.abs(diff) === 2;

              return (
                <div
                  key={l.id}
                  ref={isCurrent ? activeItemRef : null}
                  onClick={() => onSeek(l.time)}
                  className={`text-center px-3 py-1 cursor-pointer select-none transition-all duration-200 ${
                    isCurrent
                      ? "text-white font-bold"
                      : isNear1
                      ? "text-gray-500"
                      : isNear2
                      ? "text-gray-700"
                      : "text-gray-800"
                  }`}
                  style={{
                    fontSize: isCurrent
                      ? "clamp(1.2rem, 5vw, 1.6rem)"
                      : isNear1
                      ? "1rem"
                      : "0.875rem",
                  }}
                >
                  {l.text}
                </div>
              );
            })}

            {/* Bottom spacer */}
            <div style={{ height: "80px" }} aria-hidden />
          </div>
        )}
      </div>
    </div>
  );
}
