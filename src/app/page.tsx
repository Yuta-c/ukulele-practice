"use client";

import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Song, ViewMode } from "@/lib/types";
import {
  loadSongsWithDiagnostics,
  loadSongs,
  saveSong,
  deleteSong,
} from "@/lib/storage";
import { extractVideoId } from "@/lib/urlParser";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import YouTubePlayer from "@/components/YouTubePlayer";
import PracticeView from "@/components/PracticeView";
import EditView from "@/components/EditView";
import SongManager from "@/components/SongManager";
import LoopControl from "@/components/LoopControl";
import BottomBar from "@/components/BottomBar";

const PLAYER_CONTAINER_ID = "yt-player";

function createEmptySong(): Song {
  return {
    id: uuidv4(),
    title: "新しい曲",
    youtubeVideoId: "",
    lyrics: [],
    chords: [],
  };
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song>(() => createEmptySong());
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [urlInput, setUrlInput] = useState("");
  const [showSongManager, setShowSongManager] = useState(false);
  const [storageWarnings, setStorageWarnings] = useState<string[]>([]);

  const { state: playerState, controls: playerControls } = useYouTubePlayer(
    PLAYER_CONTAINER_ID,
    currentSong.loop
  );

  // Load songs from localStorage on mount (with diagnostics)
  useEffect(() => {
    const { songs: loaded, warnings } = loadSongsWithDiagnostics();
    if (warnings.length) setStorageWarnings(warnings);
    setSongs(loaded);
    if (loaded.length > 0) {
      const first = loaded[0];
      setCurrentSong(first);
      if (first.youtubeVideoId) {
        setUrlInput(`https://www.youtube.com/watch?v=${first.youtubeVideoId}`);
      }
    }
  }, []); // intentionally empty: run only on mount

  // Auto-save whenever currentSong changes
  useEffect(() => {
    saveSong(currentSong);
    setSongs(loadSongs());
  }, [currentSong]);

  const handleSongChange = useCallback((updated: Song) => {
    setCurrentSong(updated);
  }, []);

  const handleLoadVideo = useCallback(() => {
    const videoId = extractVideoId(urlInput);
    if (videoId) {
      setCurrentSong((prev) => ({ ...prev, youtubeVideoId: videoId }));
      playerControls.loadVideo(videoId);
    } else {
      alert("有効なYouTube URLを入力してください。");
    }
  }, [urlInput, playerControls]);

  const handleLoadSong = useCallback(
    (song: Song) => {
      setCurrentSong(song);
      if (song.youtubeVideoId) {
        playerControls.loadVideo(song.youtubeVideoId);
        setUrlInput(`https://www.youtube.com/watch?v=${song.youtubeVideoId}`);
      } else {
        setUrlInput("");
      }
      setShowSongManager(false);
    },
    [playerControls]
  );

  const handleNewSong = useCallback(() => {
    setCurrentSong(createEmptySong());
    setUrlInput("");
    setShowSongManager(false);
  }, []);

  const handleDeleteSong = useCallback(
    (id: string) => {
      if (!window.confirm("この曲を削除しますか？")) return;
      deleteSong(id);
      const remaining = loadSongs();
      setSongs(remaining);
      if (currentSong.id === id) {
        if (remaining.length > 0) {
          handleLoadSong(remaining[0]);
        } else {
          setCurrentSong(createEmptySong());
          setUrlInput("");
        }
      }
    },
    [currentSong.id, handleLoadSong]
  );

  const handleDuplicateSong = useCallback((song: Song) => {
    const dup: Song = {
      ...song,
      id: uuidv4(),
      title: `${song.title}（コピー）`,
      lyrics: song.lyrics.map((l) => ({ ...l, id: uuidv4() })),
      chords: song.chords.map((c) => ({ ...c, id: uuidv4() })),
    };
    saveSong(dup);
    setSongs(loadSongs());
  }, []);

  const handleRenameSong = useCallback(
    (id: string, title: string) => {
      const found = songs.find((s) => s.id === id);
      if (!found) return;
      const renamed = { ...found, title };
      saveSong(renamed);
      setSongs(loadSongs());
      if (currentSong.id === id) setCurrentSong(renamed);
    },
    [songs, currentSong.id]
  );

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(currentSong, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentSong.title}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [currentSong]);

  const handleImport = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as Song;
          if (typeof data.title !== "string") throw new Error("Invalid format");
          const imported: Song = {
            ...data,
            id: uuidv4(),
            lyrics: (data.lyrics ?? []).map((l) => ({ ...l, id: uuidv4() })),
            chords: (data.chords ?? []).map((c) => ({ ...c, id: uuidv4() })),
          };
          saveSong(imported);
          setSongs(loadSongs());
          handleLoadSong(imported);
        } catch {
          alert("JSONファイルの読み込みに失敗しました。");
        }
      };
      reader.readAsText(file);
    },
    [handleLoadSong]
  );

  const handleLoopToggle = useCallback(() => {
    setCurrentSong((prev) => ({
      ...prev,
      loop: {
        start: prev.loop?.start ?? 0,
        end: prev.loop?.end ?? 0,
        enabled: !(prev.loop?.enabled ?? false),
      },
    }));
  }, []);

  const handleViewModeToggle = useCallback(() => {
    setViewMode((m) => (m === "edit" ? "practice" : "edit"));
  }, []);

  // Keyboard shortcuts (disabled when focus is on input/textarea)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      if (e.key === " ") {
        e.preventDefault();
        playerControls.toggle();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        playerControls.seekBy(-5);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        playerControls.seekBy(5);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [playerControls]);

  return (
    <main className="min-h-screen bg-gray-950 text-white max-w-2xl mx-auto">
      {/* Song Manager Overlay */}
      {showSongManager && (
        <SongManager
          songs={songs}
          currentSongId={currentSong.id}
          onLoad={handleLoadSong}
          onNew={handleNewSong}
          onDelete={handleDeleteSong}
          onDuplicate={handleDuplicateSong}
          onRename={handleRenameSong}
          onClose={() => setShowSongManager(false)}
          onImport={handleImport}
        />
      )}

      {/* ── Storage warning banner ── */}
      {storageWarnings.length > 0 && (
        <div className="bg-yellow-900 border border-yellow-700 px-4 py-2 text-sm text-yellow-200 flex gap-2 items-start">
          <span>⚠️</span>
          <div className="flex-1">
            {storageWarnings.map((w, i) => (
              <p key={i}>{w}</p>
            ))}
          </div>
          <button
            onClick={() => setStorageWarnings([])}
            className="text-yellow-400 hover:text-white shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
        <button
          onClick={() => setShowSongManager(true)}
          className="text-sm bg-gray-800 hover:bg-gray-700 active:bg-gray-600 px-3 py-1.5 rounded-md"
        >
          曲一覧
        </button>
        <span className="flex-1 text-center text-sm font-semibold truncate">
          {currentSong.title}
        </span>
        <button
          onClick={handleViewModeToggle}
          className={`text-sm px-3 py-1.5 rounded-md font-medium ${
            viewMode === "practice"
              ? "bg-green-700 hover:bg-green-600"
              : "bg-blue-700 hover:bg-blue-600"
          }`}
        >
          {viewMode === "practice" ? "✏️ 編集" : "▶ 練習"}
        </button>
      </div>

      {/* ── YouTube Player (always rendered) ── */}
      <YouTubePlayer
        containerId={PLAYER_CONTAINER_ID}
        urlInput={urlInput}
        onUrlInputChange={setUrlInput}
        onLoadVideo={handleLoadVideo}
        playerState={playerState}
        playerControls={playerControls}
        compact={viewMode === "practice"}
      />

      {/* ── Loop Control ── */}
      <LoopControl
        loop={currentSong.loop}
        currentTime={playerState.currentTime}
        onLoopChange={(loop) => handleSongChange({ ...currentSong, loop })}
      />

      {/* ── Main view (edit or practice) ── */}
      {viewMode === "edit" ? (
        <EditView
          song={currentSong}
          currentTime={playerState.currentTime}
          onSongChange={handleSongChange}
          onSeek={playerControls.seekTo}
          onExport={handleExport}
        />
      ) : (
        <PracticeView
          song={currentSong}
          currentTime={playerState.currentTime}
          onSeek={playerControls.seekTo}
        />
      )}

      {/* ── Fixed bottom bar ── */}
      <BottomBar
        playerState={playerState}
        playerControls={playerControls}
        loop={currentSong.loop}
        onLoopToggle={handleLoopToggle}
        viewMode={viewMode}
        onViewModeToggle={handleViewModeToggle}
      />
    </main>
  );
}
