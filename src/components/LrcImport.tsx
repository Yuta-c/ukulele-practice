"use client";

import { useState } from "react";
import { parseLrc, exportToLrc, ParseResult } from "@/lib/lrcParser";
import { LyricEvent, ChordEvent } from "@/lib/types";

interface Props {
  lyrics: LyricEvent[];
  chords: ChordEvent[];
  onImport: (result: ParseResult) => void;
}

const PLACEHOLDER = `[00:12.40][Am] 歌詞の1行目
[00:15.80][F] 歌詞の2行目
[00:20.00][C] 歌詞の3行目
[00:24.50][G7] 歌詞の4行目`;

export default function LrcImport({ lyrics, chords, onImport }: Props) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const handleImport = () => {
    const result = parseLrc(text);
    if (result.lyrics.length === 0 && result.chords.length === 0) {
      alert("解析できる行が見つかりませんでした。形式を確認してください。");
      return;
    }
    if (
      window.confirm(
        `${result.lyrics.length} 行の歌詞と ${result.chords.length} 個のコードを読み込みます。\n既存のデータは上書きされます。続けますか？`
      )
    ) {
      onImport(result);
      setOpen(false);
      setText("");
    }
  };

  const handleExport = () => {
    const lrc = exportToLrc(lyrics, chords);
    const blob = new Blob([lrc], { type: "text/plain; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chords.lrc";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 text-sm font-semibold"
      >
        <span>LRC テキスト入出力</span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="bg-gray-900 p-3 space-y-3">
          <p className="text-xs text-gray-400">
            形式：{" "}
            <code className="bg-gray-800 px-1 rounded">
              [MM:SS.cc][コード名] 歌詞テキスト
            </code>
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={6}
            className="w-full bg-gray-800 text-white text-sm rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-y"
          />
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium py-2 rounded-md"
            >
              インポート
            </button>
            <button
              onClick={handleExport}
              className="flex-1 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white text-sm font-medium py-2 rounded-md"
            >
              エクスポート
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
