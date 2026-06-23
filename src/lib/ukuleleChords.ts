/**
 * Ukulele chord shapes for standard GCEA tuning.
 * frets: [G-string, C-string, E-string, A-string]
 *   0 = open string
 *  -1 = muted (not played)
 *   n = fret number (1-based)
 * baseFret: lowest fret shown (default 1). Use for chords that start above fret 4.
 */
export type ChordShape = {
  name: string;
  /** [G, C, E, A] string fret positions */
  frets: [number, number, number, number];
  /** Which finger uses each string (0=none, 1-4=finger). Optional hint. */
  fingers?: [number, number, number, number];
  /** Fret number at the top of the diagram (default 1) */
  baseFret?: number;
};

export const UKULELE_CHORDS: ChordShape[] = [
  // ── C family ──
  { name: "C",  frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  { name: "Cm", frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3] },
  { name: "C7", frets: [0, 0, 0, 1], fingers: [0, 0, 0, 1] },

  // ── D family ──
  { name: "D",  frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0] },
  { name: "Dm", frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0] },
  { name: "D7", frets: [2, 2, 2, 3], fingers: [1, 1, 1, 2] },

  // ── E family ──
  { name: "E",  frets: [4, 4, 4, 2], fingers: [2, 3, 4, 1], baseFret: 1 },
  { name: "Em", frets: [0, 4, 3, 2], fingers: [0, 4, 3, 2] },
  { name: "E7", frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3] },

  // ── F family ──
  { name: "F",  frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  { name: "Fm", frets: [1, 0, 1, 3], fingers: [1, 0, 2, 4] },
  { name: "F7", frets: [2, 3, 1, 3], fingers: [2, 3, 1, 4] },

  // ── G family ──
  { name: "G",  frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  { name: "Gm", frets: [0, 2, 3, 1], fingers: [0, 2, 3, 1] },
  { name: "G7", frets: [0, 2, 1, 2], fingers: [0, 2, 1, 3] },

  // ── A family ──
  { name: "A",  frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  { name: "Am", frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0] },
  { name: "A7", frets: [0, 1, 0, 0], fingers: [0, 1, 0, 0] },

  // ── B family ──
  { name: "B",  frets: [4, 3, 2, 2], fingers: [4, 3, 1, 2], baseFret: 1 },
  { name: "Bm", frets: [4, 2, 2, 2], fingers: [4, 1, 2, 3], baseFret: 1 },
  { name: "B7", frets: [2, 3, 2, 2], fingers: [1, 3, 2, 4] },
];

export const CHORD_NAMES = UKULELE_CHORDS.map((c) => c.name);

export function findChord(name: string): ChordShape | undefined {
  return UKULELE_CHORDS.find((c) => c.name === name);
}
