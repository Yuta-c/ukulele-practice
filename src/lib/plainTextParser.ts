/**
 * Plain-text chord sheet parser (no timestamps).
 *
 * Supported line formats:
 *   [Am] 歌詞テキスト      ChordPro-like bracket notation
 *   Am   歌詞テキスト      space-separated: first word is chord
 *   Am                    chord only
 *   歌詞テキストのみ       lyric only (no chord detected)
 *
 * Lines starting with # or // are treated as comments and skipped.
 * Blank lines are skipped.
 */

export type TapItem = {
  chord?: string;
  lyric?: string;
};

/**
 * Heuristic: is a word (ASCII-only, ≤10 chars) a chord name?
 *
 * Chord names look like: C, Am, Cmaj7, G7, F#m, Bb, Am/E …
 * They always start with A-G and contain only [b#a-zA-Z0-9/].
 * Japanese lyrics never start this way so false positives are rare.
 */
function looksLikeChord(word: string): boolean {
  if (word.length === 0 || word.length > 10) return false;
  return /^[A-G][b#]?[a-zA-Z0-9/#]*$/.test(word);
}

export function parsePlainText(text: string): TapItem[] {
  const items: TapItem[] = [];

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("#") || line.startsWith("//")) continue;

    // ── Format 1: [ChordName] lyric text ────────────────────────────────────
    const bracketMatch = line.match(/^\[([A-Ga-g][^\]]*)\]\s*(.*)/);
    if (bracketMatch) {
      const chord = bracketMatch[1].trim() || undefined;
      const lyric = bracketMatch[2].trim() || undefined;
      if (chord !== undefined || lyric !== undefined) {
        items.push({ chord, lyric });
      }
      continue;
    }

    // ── Format 2: ChordName lyric text (or chord only) ──────────────────────
    const firstSpaceIdx = line.search(/\s/);
    const firstWord =
      firstSpaceIdx >= 0 ? line.slice(0, firstSpaceIdx) : line;

    if (looksLikeChord(firstWord)) {
      const chord = firstWord;
      const lyric =
        firstSpaceIdx >= 0
          ? line.slice(firstSpaceIdx).trim() || undefined
          : undefined;
      items.push({ chord, lyric });
      continue;
    }

    // ── Lyric only ───────────────────────────────────────────────────────────
    items.push({ lyric: line });
  }

  return items;
}
