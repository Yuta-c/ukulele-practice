"use client";

import { useState, useRef, useEffect, memo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Song, LyricEvent, ChordEvent } from "@/lib/types";
import { CHORD_NAMES } from "@/lib/ukuleleChords";
import LrcImport from "./LrcImport";
import TapSync from "./TapSync";
import { parsePlainText } from "@/lib/plainTextParser";

interface Props {
  song: Song;
  currentTime: number;
  onSongChange: (song: Song) => void;
  onSeek: (time: number) => void;
  onExport: () => void;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1);
  return `${m}:${sec.padStart(4, "0")}`;
}

function sortedByTime<T extends { time: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.time - b.time);
}

// ── Chord Events Editor ───────────────────────────────────────────────────────

/** Common chords for one-tap quick registration */
const QUICK_CHORDS = ["C", "F", "G", "G7", "Am", "Dm", "Em", "A", "E", "D"];

/** Memoized list row — only re-renders when the event data or editing state changes */
const ChordRow = memo(function ChordRow({
  event,
  isEditing,
  editValue,
  onSeek,
  onAdjust,
  onStartEdit,
  onEditChange,
  onCommitEdit,
  onCancelEdit,
  onRemove,
}: {
  event: ChordEvent;
  isEditing: boolean;
  editValue: string;
  onSeek: (t: number) => void;
  onAdjust: (id: string, delta: number) => void;
  onStartEdit: (c: ChordEvent) => void;
  onEditChange: (v: string) => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-gray-800 rounded-md px-2 py-1.5">
      <button
        onClick={() => onSeek(event.time)}
        className="text-xs text-blue-400 hover:text-blue-300 font-mono w-14 text-left shrink-0"
        title="この時刻へシーク"
      >
        {formatTime(event.time)}
      </button>
      <button
        onClick={() => onAdjust(event.id, -0.1)}
        className="text-xs bg-gray-700 px-1.5 py-0.5 rounded"
      >
        -
      </button>
      <button
        onClick={() => onAdjust(event.id, 0.1)}
        className="text-xs bg-gray-700 px-1.5 py-0.5 rounded"
      >
        +
      </button>
      {isEditing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onBlur={onCommitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommitEdit();
            if (e.key === "Escape") onCancelEdit();
          }}
          className="flex-1 bg-gray-700 text-white text-sm rounded px-1 py-0.5 outline-none"
        />
      ) : (
        <button
          onClick={() => onStartEdit(event)}
          className="flex-1 text-left text-sm font-bold text-yellow-300 hover:text-yellow-200"
        >
          {event.chord}
        </button>
      )}
      <button
        onClick={() => onRemove(event.id)}
        className="text-red-500 hover:text-red-400 text-sm shrink-0 px-1"
        aria-label="削除"
      >
        ✕
      </button>
    </div>
  );
});

function ChordEditor({
  chords,
  currentTimeRef,
  onSeek,
  onChange,
}: {
  chords: ChordEvent[];
  /** Use a ref so this component doesn't re-render every 100 ms */
  currentTimeRef: React.RefObject<number>;
  onSeek: (t: number) => void;
  onChange: (chords: ChordEvent[]) => void;
}) {
  const [newChord, setNewChord] = useState("Am");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editChord, setEditChord] = useState("");

  const addChord = (chord: string) => {
    const event: ChordEvent = {
      id: uuidv4(),
      time: currentTimeRef.current ?? 0,
      chord,
    };
    onChange(sortedByTime([...chords, event]));
  };

  const remove = (id: string) => onChange(chords.filter((c) => c.id !== id));

  const adjust = (id: string, delta: number) => {
    onChange(
      sortedByTime(
        chords.map((c) =>
          c.id === id ? { ...c, time: Math.max(0, c.time + delta) } : c
        )
      )
    );
  };

  const startEdit = (c: ChordEvent) => {
    setEditingId(c.id);
    setEditChord(c.chord);
  };

  const commitEdit = () => {
    if (!editingId) return;
    onChange(chords.map((c) => (c.id === editingId ? { ...c, chord: editChord } : c)));
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      {/* ── Quick register: one-tap common chords ── */}
      <div>
        <p className="text-xs text-gray-500 mb-1.5">ワンタップ登録（現在時刻）</p>
        <div className="grid grid-cols-5 gap-1.5">
          {QUICK_CHORDS.map((c) => (
            <button
              key={c}
              onClick={() => addChord(c)}
              className="bg-gray-800 hover:bg-gray-700 active:bg-blue-800 text-yellow-300 font-bold py-3 rounded-lg text-sm"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Custom chord + register ── */}
      <div className="flex gap-2 items-center">
        <select
          value={newChord}
          onChange={(e) => setNewChord(e.target.value)}
          className="w-24 bg-gray-800 text-white text-sm rounded-md px-2 py-2 outline-none"
        >
          {CHORD_NAMES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newChord}
          onChange={(e) => setNewChord(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addChord(newChord);
          }}
          placeholder="コード名"
          className="flex-1 bg-gray-800 text-white text-sm rounded-md px-2 py-2 outline-none min-w-0"
        />
        <button
          onClick={() => addChord(newChord)}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm px-3 py-2 rounded-md whitespace-nowrap"
        >
          登録
        </button>
      </div>

      {/* ── Event list ── */}
      <div className="space-y-1 max-h-52 overflow-y-auto">
        {chords.length === 0 && (
          <p className="text-gray-500 text-xs py-2 text-center">
            コードがありません
          </p>
        )}
        {chords.map((c) => (
          <ChordRow
            key={c.id}
            event={c}
            isEditing={editingId === c.id}
            editValue={editChord}
            onSeek={onSeek}
            onAdjust={adjust}
            onStartEdit={startEdit}
            onEditChange={setEditChord}
            onCommitEdit={commitEdit}
            onCancelEdit={() => setEditingId(null)}
            onRemove={remove}
          />
        ))}
      </div>
    </div>
  );
}

// ── Lyric Events Editor ───────────────────────────────────────────────────────

/** Memoized lyric row */
const LyricRow = memo(function LyricRow({
  event,
  isEditing,
  editValue,
  onSeek,
  onAdjust,
  onStartEdit,
  onEditChange,
  onCommitEdit,
  onCancelEdit,
  onRemove,
}: {
  event: LyricEvent;
  isEditing: boolean;
  editValue: string;
  onSeek: (t: number) => void;
  onAdjust: (id: string, delta: number) => void;
  onStartEdit: (l: LyricEvent) => void;
  onEditChange: (v: string) => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-gray-800 rounded-md px-2 py-1.5">
      <button
        onClick={() => onSeek(event.time)}
        className="text-xs text-blue-400 hover:text-blue-300 font-mono w-14 text-left shrink-0"
        title="この時刻へシーク"
      >
        {formatTime(event.time)}
      </button>
      <button
        onClick={() => onAdjust(event.id, -0.1)}
        className="text-xs bg-gray-700 px-1.5 py-0.5 rounded"
      >
        -
      </button>
      <button
        onClick={() => onAdjust(event.id, 0.1)}
        className="text-xs bg-gray-700 px-1.5 py-0.5 rounded"
      >
        +
      </button>
      {isEditing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onBlur={onCommitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommitEdit();
            if (e.key === "Escape") onCancelEdit();
          }}
          className="flex-1 bg-gray-700 text-white text-sm rounded px-1 py-0.5 outline-none"
        />
      ) : (
        <button
          onClick={() => onStartEdit(event)}
          className="flex-1 text-left text-sm text-white hover:text-gray-300 truncate"
        >
          {event.text}
        </button>
      )}
      <button
        onClick={() => onRemove(event.id)}
        className="text-red-500 hover:text-red-400 text-sm shrink-0 px-1"
        aria-label="削除"
      >
        ✕
      </button>
    </div>
  );
});

function LyricEditor({
  lyrics,
  currentTimeRef,
  onSeek,
  onChange,
}: {
  lyrics: LyricEvent[];
  currentTimeRef: React.RefObject<number>;
  onSeek: (t: number) => void;
  onChange: (lyrics: LyricEvent[]) => void;
}) {
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const text = newText.trim();
    if (!text) return;
    const event: LyricEvent = {
      id: uuidv4(),
      time: currentTimeRef.current ?? 0,
      text,
    };
    onChange(sortedByTime([...lyrics, event]));
    setNewText("");
    // Keep focus so user can type the next lyric immediately
    inputRef.current?.focus();
  };

  const remove = (id: string) => onChange(lyrics.filter((l) => l.id !== id));

  const adjust = (id: string, delta: number) => {
    onChange(
      sortedByTime(
        lyrics.map((l) =>
          l.id === id ? { ...l, time: Math.max(0, l.time + delta) } : l
        )
      )
    );
  };

  const startEdit = (l: LyricEvent) => {
    setEditingId(l.id);
    setEditText(l.text);
  };

  const commitEdit = () => {
    if (!editingId) return;
    onChange(lyrics.map((l) => (l.id === editingId ? { ...l, text: editText } : l)));
    setEditingId(null);
  };

  return (
    <div className="space-y-2">
      {/* Add new lyric */}
      <div className="flex gap-2 items-center">
        <input
          ref={inputRef}
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder="歌詞テキストを入力 → Enter で登録"
          className="flex-1 bg-gray-800 text-white text-sm rounded-md px-2 py-2 outline-none focus:ring-2 focus:ring-green-500 min-w-0"
        />
        <button
          onClick={add}
          className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm px-3 py-2 rounded-md whitespace-nowrap"
        >
          登録
        </button>
      </div>

      {/* Event list */}
      <div className="space-y-1 max-h-52 overflow-y-auto">
        {lyrics.length === 0 && (
          <p className="text-gray-500 text-xs py-2 text-center">
            歌詞がありません
          </p>
        )}
        {lyrics.map((l) => (
          <LyricRow
            key={l.id}
            event={l}
            isEditing={editingId === l.id}
            editValue={editText}
            onSeek={onSeek}
            onAdjust={adjust}
            onStartEdit={startEdit}
            onEditChange={setEditText}
            onCommitEdit={commitEdit}
            onCancelEdit={() => setEditingId(null)}
            onRemove={remove}
          />
        ))}
      </div>
    </div>
  );
}

// ── EditView ──────────────────────────────────────────────────────────────────

export default function EditView({
  song,
  currentTime,
  onSongChange,
  onSeek,
  onExport,
}: Props) {
  const [tab, setTab] = useState<"chord" | "lyric" | "import" | "tap">("chord");
  const [tapText, setTapText] = useState("");
  const [tapItems, setTapItems] = useState<ReturnType<typeof parsePlainText> | null>(null);

  /**
   * currentTimeRef lets ChordEditor / LyricEditor read the current playback
   * time without being re-rendered every 100 ms themselves.
   */
  const currentTimeRef = useRef<number>(currentTime);
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  const startTapSync = () => {
    const items = parsePlainText(tapText);
    if (items.length === 0) return;
    setTapItems(items);
  };

  const handleTapComplete = (chords: ChordEvent[], lyrics: LyricEvent[]) => {
    onSongChange({ ...song, chords, lyrics });
    setTapItems(null);
    setTapText("");
    setTab("chord");
  };

  return (
    <div className="px-3 py-3 space-y-4 pb-28">
      {/* Song title */}
      <div className="flex gap-2 items-center">
        <label className="text-sm text-gray-400 shrink-0">曲名</label>
        <input
          type="text"
          value={song.title}
          onChange={(e) => onSongChange({ ...song, title: e.target.value })}
          className="flex-1 bg-gray-800 text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
        />
        <button
          onClick={onExport}
          className="shrink-0 bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded-md"
        >
          JSON保存
        </button>
      </div>

      {/* Tabs */}
      {!tapItems && (
        <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
          {(
            [
              { key: "chord", label: "コード" },
              { key: "lyric", label: "歌詞" },
              { key: "import", label: "LRC" },
              { key: "tap", label: "タップ同期" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                tab === key
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      {!tapItems && tab === "chord" && (
        <ChordEditor
          chords={song.chords}
          currentTimeRef={currentTimeRef}
          onSeek={onSeek}
          onChange={(chords) => onSongChange({ ...song, chords })}
        />
      )}

      {!tapItems && tab === "lyric" && (
        <LyricEditor
          lyrics={song.lyrics}
          currentTimeRef={currentTimeRef}
          onSeek={onSeek}
          onChange={(lyrics) => onSongChange({ ...song, lyrics })}
        />
      )}

      {!tapItems && tab === "import" && (
        <LrcImport
          lyrics={song.lyrics}
          chords={song.chords}
          onImport={({ lyrics, chords }) =>
            onSongChange({ ...song, lyrics, chords })
          }
        />
      )}

      {!tapItems && tab === "tap" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            コードと歌詞を貼り付けて、動画に合わせてタップするだけでタイミングを登録できます。
          </p>
          <div className="bg-gray-900 rounded-lg p-2 text-xs text-gray-500 font-mono space-y-0.5">
            <div>[Am] 歌詞テキスト　← 括弧付きコード</div>
            <div>Am 歌詞テキスト　← スペース区切り</div>
            <div>Am　← コードのみ</div>
            <div>歌詞テキスト　← 歌詞のみ</div>
          </div>
          <textarea
            value={tapText}
            onChange={(e) => setTapText(e.target.value)}
            rows={8}
            placeholder={"[Am] 秋の空\n[F] 風吹いて\nG\n歌詞テキスト"}
            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none"
          />
          <button
            onClick={startTapSync}
            disabled={parsePlainText(tapText).length === 0}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl"
          >
            タップ同期を開始
          </button>
        </div>
      )}

      {/* TapSync overlay (replaces tabs) */}
      {tapItems && (
        <TapSync
          items={tapItems}
          currentTimeRef={currentTimeRef}
          onComplete={handleTapComplete}
          onCancel={() => setTapItems(null)}
        />
      )}
    </div>
  );
}
