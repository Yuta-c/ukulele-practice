import { Song, LyricEvent, ChordEvent } from "./types";

const STORAGE_KEY = "ukulele_practice_songs";

// ── Schema guards ─────────────────────────────────────────────────────────────

function isLyricEvent(v: unknown): v is LyricEvent {
  if (!v || typeof v !== "object") return false;
  const d = v as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    d.id.length > 0 &&
    typeof d.time === "number" &&
    isFinite(d.time) &&
    d.time >= 0 &&
    typeof d.text === "string"
  );
}

function isChordEvent(v: unknown): v is ChordEvent {
  if (!v || typeof v !== "object") return false;
  const d = v as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    d.id.length > 0 &&
    typeof d.time === "number" &&
    isFinite(d.time) &&
    d.time >= 0 &&
    typeof d.chord === "string" &&
    d.chord.length > 0
  );
}

/**
 * Sanitize a raw (unknown) value into a Song.
 * Valid events are kept; invalid ones are silently dropped.
 * Returns null only when the top-level shape is entirely unrecognisable.
 */
export function parseSong(raw: unknown): Song | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;

  if (typeof d.id !== "string" || d.id.length === 0) return null;
  if (typeof d.title !== "string") return null;

  const loop = (() => {
    if (!d.loop || typeof d.loop !== "object") return undefined;
    const l = d.loop as Record<string, unknown>;
    if (
      typeof l.start !== "number" ||
      typeof l.end !== "number" ||
      typeof l.enabled !== "boolean"
    )
      return undefined;
    return { start: l.start, end: l.end, enabled: l.enabled };
  })();

  return {
    id: d.id,
    title: d.title || "（タイトルなし）",
    youtubeVideoId:
      typeof d.youtubeVideoId === "string" ? d.youtubeVideoId : "",
    lyrics: Array.isArray(d.lyrics) ? d.lyrics.filter(isLyricEvent) : [],
    chords: Array.isArray(d.chords) ? d.chords.filter(isChordEvent) : [],
    loop,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export type LoadResult = {
  songs: Song[];
  /** Non-empty when data was corrupt or partially discarded */
  warnings: string[];
};

export function loadSongsWithDiagnostics(): LoadResult {
  if (typeof window === "undefined") return { songs: [], warnings: [] };

  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return {
      songs: [],
      warnings: ["LocalStorage にアクセスできませんでした。"],
    };
  }

  if (!raw) return { songs: [], warnings: [] };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      songs: [],
      warnings: [
        "LocalStorage の JSON が破損していたため、曲データをリセットしました。",
      ],
    };
  }

  if (!Array.isArray(parsed)) {
    return {
      songs: [],
      warnings: [
        "LocalStorage のデータ形式が不正なため、曲データをリセットしました。",
      ],
    };
  }

  const songs: Song[] = [];
  const warnings: string[] = [];

  parsed.forEach((item, i) => {
    const song = parseSong(item);
    if (song) {
      songs.push(song);
    } else {
      warnings.push(
        `曲データ [${i}]（id: ${
          (item as Record<string, unknown>)?.id ?? "不明"
        }）が不正なためスキップしました。`
      );
    }
  });

  return { songs, warnings };
}

export function loadSongs(): Song[] {
  return loadSongsWithDiagnostics().songs;
}

export function saveSongs(songs: Song[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  } catch (e) {
    // QuotaExceededError など
    console.error("[storage] 保存に失敗しました:", e);
  }
}

export function saveSong(song: Song): void {
  const songs = loadSongs();
  const idx = songs.findIndex((s) => s.id === song.id);
  if (idx >= 0) {
    songs[idx] = song;
  } else {
    songs.push(song);
  }
  saveSongs(songs);
}

export function deleteSong(id: string): void {
  saveSongs(loadSongs().filter((s) => s.id !== id));
}
