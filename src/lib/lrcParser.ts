import { v4 as uuidv4 } from "uuid";
import { LyricEvent, ChordEvent } from "./types";

export type ParseResult = {
  lyrics: LyricEvent[];
  chords: ChordEvent[];
};

/**
 * Parse LRC-style text.
 * Supported line format: [MM:SS.cc][ChordName] Lyric text
 * Chord is optional. Lyric is optional.
 * Example: [00:12.40][Am] 歌詞の1行目
 */
export function parseLrc(text: string): ParseResult {
  const lyrics: LyricEvent[] = [];
  const chords: ChordEvent[] = [];

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    // Match timestamp [MM:SS.cc]
    const timeMatch = line.match(/^\[(\d{1,2}):(\d{2})\.(\d{2})\]/);
    if (!timeMatch) continue;

    const minutes = parseInt(timeMatch[1], 10);
    const seconds = parseInt(timeMatch[2], 10);
    const centiseconds = parseInt(timeMatch[3], 10);
    const time = minutes * 60 + seconds + centiseconds / 100;

    // Trim leading whitespace that may appear between timestamp and chord/text
    let rest = line.slice(timeMatch[0].length).trimStart();

    // Match optional chord [ChordName]
    const chordMatch = rest.match(/^\[([A-Ga-g][^\]]*)\]/);
    if (chordMatch) {
      chords.push({ id: uuidv4(), time, chord: chordMatch[1] });
      rest = rest.slice(chordMatch[0].length).trimStart();
    }

    if (rest) {
      lyrics.push({ id: uuidv4(), time, text: rest });
    }
  }

  lyrics.sort((a, b) => a.time - b.time);
  chords.sort((a, b) => a.time - b.time);

  return { lyrics, chords };
}

function padTime(n: number, len: number) {
  return n.toString().padStart(len, "0");
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.round((seconds % 1) * 100);
  return `[${padTime(m, 2)}:${padTime(s, 2)}.${padTime(cs, 2)}]`;
}

export function exportToLrc(
  lyrics: LyricEvent[],
  chords: ChordEvent[]
): string {
  type Row = { time: number; chord?: string; lyric?: string };
  const rows: Row[] = [];

  for (const l of lyrics) {
    rows.push({ time: l.time, lyric: l.text });
  }

  // Try to merge chords that share the exact same time as a lyric row
  for (const c of chords) {
    const existing = rows.find((r) => Math.abs(r.time - c.time) < 0.02);
    if (existing) {
      existing.chord = c.chord;
    } else {
      rows.push({ time: c.time, chord: c.chord });
    }
  }

  rows.sort((a, b) => a.time - b.time);

  return rows
    .map((r) => {
      const ts = formatTime(r.time);
      const chord = r.chord ? `[${r.chord}]` : "";
      const space = chord && r.lyric ? " " : "";
      return `${ts}${chord}${space}${r.lyric ?? ""}`.trimEnd();
    })
    .join("\n");
}
