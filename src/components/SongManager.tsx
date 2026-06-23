"use client";

import { useRef, useState } from "react";
import { Song } from "@/lib/types";

interface Props {
  songs: Song[];
  currentSongId: string;
  onLoad: (song: Song) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (song: Song) => void;
  onRename: (id: string, title: string) => void;
  onClose: () => void;
  onImport: (file: File) => void;
}

export default function SongManager({
  songs,
  currentSongId,
  onLoad,
  onNew,
  onDelete,
  onDuplicate,
  onRename,
  onClose,
  onImport,
}: Props) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRenameStart = (song: Song) => {
    setRenamingId(song.id);
    setRenameValue(song.title);
  };

  const handleRenameCommit = () => {
    if (renamingId && renameValue.trim()) {
      onRename(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h2 className="text-lg font-bold">曲一覧</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 text-xl"
          aria-label="閉じる"
        >
          ✕
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 px-4 py-3 border-b border-gray-800">
        <button
          onClick={onNew}
          className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium py-2 rounded-md"
        >
          + 新しい曲
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 rounded-md"
        >
          JSONインポート
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Song list */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-800">
        {songs.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            曲がありません。新しい曲を作成してください。
          </p>
        )}

        {songs.map((song) => (
          <div
            key={song.id}
            className={`flex items-center gap-2 px-4 py-3 ${
              song.id === currentSongId ? "bg-blue-950" : "hover:bg-gray-900"
            }`}
          >
            {renamingId === song.id ? (
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={handleRenameCommit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameCommit();
                  if (e.key === "Escape") setRenamingId(null);
                }}
                className="flex-1 bg-gray-800 text-white rounded px-2 py-1 text-sm outline-none"
              />
            ) : (
              <button
                onClick={() => onLoad(song)}
                className="flex-1 text-left text-sm font-medium truncate"
              >
                {song.title}
                {song.id === currentSongId && (
                  <span className="ml-2 text-xs text-blue-400">（選択中）</span>
                )}
              </button>
            )}

            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => handleRenameStart(song)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                title="名前変更"
              >
                ✏️
              </button>
              <button
                onClick={() => onDuplicate(song)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                title="複製"
              >
                📋
              </button>
              <button
                onClick={() => onDelete(song.id)}
                className="text-xs bg-red-900 hover:bg-red-800 px-2 py-1 rounded"
                title="削除"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
