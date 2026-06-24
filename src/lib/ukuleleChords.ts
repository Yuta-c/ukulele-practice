/**
 * Ukulele chord shapes for standard GCEA tuning.
 * frets: [G-string, C-string, E-string, A-string]  (absolute fret numbers)
 *   0 = open, -1 = muted, 1+ = fret number
 * baseFret: top fret shown in diagram (default 1).
 *           Display row = fret - baseFret + 1
 *
 * String notes at each fret:
 *   G: G(0) G#(1) A(2) Bb(3) B(4) C(5) Db(6) D(7) Eb(8) E(9) F(10) Gb(11)
 *   C: C(0) Db(1) D(2) Eb(3) E(4)  F(5) Gb(6) G(7) Ab(8) A(9) Bb(10) B(11)
 *   E: E(0) F(1)  F#(2) G(3) Ab(4) A(5) Bb(6) B(7) C(8)  Db(9) D(10) Eb(11)
 *   A: A(0) Bb(1) B(2)  C(3) Db(4) D(5) Eb(6) E(7) F(8)  Gb(9) G(10) Ab(11)
 */
export type ChordShape = {
  name: string;
  frets: [number, number, number, number];
  fingers?: [number, number, number, number];
  baseFret?: number;
};

export const UKULELE_CHORDS: ChordShape[] = [
  // ── C ─────────────────────────────────────────────────────────────────────
  { name: "C",      frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  { name: "Cm",     frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3] },
  { name: "C7",     frets: [0, 0, 0, 1], fingers: [0, 0, 0, 1] },
  { name: "Cmaj7",  frets: [0, 0, 0, 2], fingers: [0, 0, 0, 2] },
  // G=G C=C E=E A(2)=B → C E G B ✓
  { name: "Cm7",    frets: [3, 3, 3, 3], fingers: [1, 1, 1, 1] },
  // barre3: Bb Eb G C → C Eb G Bb ✓
  { name: "Csus2",  frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  // G C(2)=D E(3)=G A(3)=C → C D G ✓
  { name: "Csus4",  frets: [0, 0, 1, 3], fingers: [0, 0, 1, 3] },
  // G C E(1)=F A(3)=C → C F G ✓
  { name: "Cadd9",  frets: [0, 2, 0, 3], fingers: [0, 2, 0, 3] },
  // G C(2)=D E A(3)=C → C D E G ✓
  { name: "Caug",   frets: [1, 0, 0, 3], fingers: [1, 0, 0, 3] },
  // G(1)=G# C E A(3)=C → C E G# ✓

  // ── D ─────────────────────────────────────────────────────────────────────
  { name: "D",      frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0] },
  { name: "Dm",     frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0] },
  { name: "D7",     frets: [2, 2, 2, 3], fingers: [1, 1, 1, 2] },
  { name: "Dmaj7",  frets: [2, 2, 2, 4], fingers: [1, 1, 1, 4] },
  // G(2)=A C(2)=D E(2)=F# A(4)=C# → D F# A C# ✓
  { name: "Dm7",    frets: [2, 2, 1, 3], fingers: [2, 3, 1, 4] },
  // G(2)=A C(2)=D E(1)=F A(3)=C → D F A C ✓
  { name: "Dsus2",  frets: [2, 2, 0, 0], fingers: [1, 2, 0, 0] },
  // G(2)=A C(2)=D E A → D E A ✓
  { name: "Dsus4",  frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  // G C(2)=D E(3)=G A → D G A ✓
  { name: "Daug",   frets: [3, 2, 2, 1], fingers: [4, 2, 3, 1] },
  // G(3)=Bb C(2)=D E(2)=F# A(1)=Bb → D F# Bb ✓

  // ── E ─────────────────────────────────────────────────────────────────────
  { name: "E",      frets: [4, 4, 4, 2], fingers: [2, 3, 4, 1] },
  // G(4)=B C(4)=E E(4)=Ab? No: E(4)=Ab=G# A(2)=B → E G# B ✓
  { name: "Em",     frets: [0, 4, 3, 2], fingers: [0, 4, 3, 2] },
  { name: "E7",     frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3] },
  // G(1)=G# C(2)=D E A(2)=B → E G# B D ✓
  { name: "Emaj7",  frets: [1, 3, 0, 2], fingers: [1, 3, 0, 2] },
  // G(1)=G# C(3)=Eb E A(2)=B → E G# B D# ✓
  { name: "Em7",    frets: [0, 2, 0, 2], fingers: [0, 2, 0, 1] },
  // G C(2)=D E A(2)=B → E G B D ✓
  { name: "Esus2",  frets: [4, 4, 2, 2], fingers: [3, 4, 1, 2] },
  // G(4)=B C(4)=E E(2)=F# A(2)=B → E F# B ✓
  { name: "Esus4",  frets: [2, 4, 0, 2], fingers: [1, 3, 0, 2] },
  // G(2)=A C(4)=E E A(2)=B → E A B ✓
  { name: "Eaug",   frets: [1, 0, 0, 3], fingers: [1, 0, 0, 3] },
  // G(1)=G#=Ab C E A(3)=C → E G# C = Eaug ✓ (same voicing as Caug)

  // ── F ─────────────────────────────────────────────────────────────────────
  { name: "F",      frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  { name: "Fm",     frets: [1, 0, 1, 3], fingers: [1, 0, 2, 4] },
  // G(1)=Ab C E(1)=F A(3)=C → F Ab C ✓
  { name: "F7",     frets: [2, 3, 1, 3], fingers: [2, 3, 1, 4] },
  { name: "Fmaj7",  frets: [2, 4, 1, 3], fingers: [2, 4, 1, 3] },
  // G(2)=A C(4)=E E(1)=F A(3)=C → F A C E ✓
  { name: "Fm7",    frets: [1, 3, 1, 3], fingers: [1, 3, 1, 3] },
  // G(1)=Ab C(3)=Eb E(1)=F A(3)=C → F Ab C Eb ✓
  { name: "Fsus4",  frets: [3, 0, 1, 3], fingers: [3, 0, 1, 4] },
  // G(3)=Bb C E(1)=F A(3)=C → F Bb C ✓
  { name: "Faug",   frets: [2, 1, 1, 0], fingers: [3, 1, 2, 0] },
  // G(2)=A C(1)=Db E(1)=F A → F A Db ✓  (Db=C#)
  { name: "F#",     frets: [3, 1, 2, 1], fingers: [3, 1, 2, 1] },
  // G(3)=Bb C(1)=Db E(2)=F# A(1)=Bb → F# Bb Db ✓  (Bb=A#, Db=C#)
  { name: "F#m",    frets: [2, 1, 2, 0], fingers: [2, 1, 3, 0] },
  // G(2)=A C(1)=Db E(2)=F# A → F# A Db ✓  (Db=C#)

  // ── G ─────────────────────────────────────────────────────────────────────
  { name: "G",      frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  { name: "Gm",     frets: [0, 2, 3, 1], fingers: [0, 2, 3, 1] },
  { name: "G7",     frets: [0, 2, 1, 2], fingers: [0, 2, 1, 3] },
  { name: "Gmaj7",  frets: [0, 2, 2, 2], fingers: [0, 1, 2, 3] },
  // G C(2)=D E(2)=F# A(2)=B → G B D F# ✓
  { name: "Gm7",    frets: [0, 2, 1, 1], fingers: [0, 3, 1, 2] },
  // G C(2)=D E(1)=F A(1)=Bb → G Bb D F ✓
  { name: "Gsus2",  frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  // G C(2)=D E(3)=G A → G A D ✓
  { name: "Gsus4",  frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  // G C(2)=D E(3)=G A(3)=C → G C D ✓
  { name: "Gaug",   frets: [0, 3, 3, 2], fingers: [0, 3, 4, 1] },
  // G C(3)=Eb E(3)=G A(2)=B → G B Eb ✓  (Eb=D#)
  { name: "Gdim",   frets: [0, 1, 3, 1], fingers: [0, 1, 3, 1] },
  // G C(1)=Db E(3)=G A(1)=Bb → G Bb Db ✓
  { name: "G#m",    frets: [1, 3, 4, 2], fingers: [1, 3, 4, 2] },
  // G(1)=Ab C(3)=Eb E(4)=Ab A(2)=B → Ab B Eb ✓

  // ── A ─────────────────────────────────────────────────────────────────────
  { name: "A",      frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  { name: "Am",     frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0] },
  { name: "A7",     frets: [0, 1, 0, 0], fingers: [0, 1, 0, 0] },
  { name: "Amaj7",  frets: [1, 1, 0, 0], fingers: [2, 1, 0, 0] },
  // G(1)=G# C(1)=C# E A → A C# E G# ✓
  { name: "Am7",    frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  // all open → A C E G ✓
  { name: "Asus2",  frets: [2, 4, 0, 2], fingers: [1, 3, 0, 2] },
  // G(2)=A C(4)=E E A(2)=B → A B E ✓
  { name: "Asus4",  frets: [2, 2, 0, 0], fingers: [2, 1, 0, 0] },
  // G(2)=A C(2)=D E A → A D E ✓
  { name: "Aaug",   frets: [2, 1, 1, 0], fingers: [3, 1, 2, 0] },
  // G(2)=A C(1)=Db E(1)=F A → A Db F ✓  (same triad as Faug/C#aug)

  // ── B ─────────────────────────────────────────────────────────────────────
  { name: "B",      frets: [4, 3, 2, 2], fingers: [4, 3, 1, 2] },
  { name: "Bm",     frets: [4, 2, 2, 2], fingers: [4, 1, 2, 3] },
  { name: "B7",     frets: [2, 3, 2, 2], fingers: [1, 3, 2, 4] },
  { name: "Bmaj7",  frets: [3, 3, 2, 2], fingers: [3, 4, 1, 2] },
  // G(3)=Bb C(3)=Eb E(2)=F# A(2)=B → B D# F# A# ✓
  { name: "Bm7",    frets: [2, 2, 2, 2], fingers: [1, 1, 1, 1] },
  // barre2: A D F# B → B D F# A ✓
  { name: "Bdim",   frets: [4, 2, 1, 2], fingers: [4, 2, 1, 3] },
  // G(4)=B C(2)=D E(1)=F A(2)=B → B D F ✓

  // ── Bb / A# ───────────────────────────────────────────────────────────────
  { name: "Bb",     frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1] },
  // G(3)=Bb C(2)=D E(1)=F A(1)=Bb → Bb D F ✓
  { name: "Bbm",    frets: [3, 1, 1, 1], fingers: [3, 1, 1, 1] },
  // G(3)=Bb C(1)=Db E(1)=F A(1)=Bb → Bb Db F ✓
  { name: "Bb7",    frets: [1, 2, 1, 1], fingers: [1, 3, 1, 1] },
  // G(1)=Ab C(2)=D E(1)=F A(1)=Bb → Bb D F Ab ✓
  { name: "Bbmaj7", frets: [3, 2, 1, 0], fingers: [3, 2, 1, 0] },
  // G(3)=Bb C(2)=D E(1)=F A=A → Bb D F A ✓
  { name: "Bbm7",   frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1] },
  // barre1: Ab Db F Bb → Bb Db F Ab ✓

  // ── Db / C# ───────────────────────────────────────────────────────────────
  { name: "Db",     frets: [6, 5, 4, 4], fingers: [3, 2, 1, 1], baseFret: 4 },
  // G(6)=Db C(5)=F E(4)=Ab A(4)=Db → Db F Ab ✓
  { name: "C#m",    frets: [1, 1, 0, 4], fingers: [1, 2, 0, 4] },
  // G(1)=G# C(1)=C# E A(4)=C# → C# E G# ✓
  { name: "Dbmaj7", frets: [1, 0, 1, 4], fingers: [1, 0, 2, 4] },
  // G(1)=Ab C E(1)=F A(4)=Db → Db F Ab C ✓

  // ── Eb / D# ───────────────────────────────────────────────────────────────
  { name: "Eb",     frets: [0, 3, 3, 1], fingers: [0, 3, 4, 1] },
  // G C(3)=Eb E(3)=G A(1)=Bb → Eb G Bb ✓
  { name: "Ebm",    frets: [3, 3, 2, 1], fingers: [4, 3, 2, 1] },
  // G(3)=Bb C(3)=Eb E(2)=Gb A(1)=Bb → Eb Gb Bb ✓
  { name: "Eb7",    frets: [3, 3, 3, 4], fingers: [1, 1, 1, 2] },
  // G(3)=Bb C(3)=Eb E(3)=G A(4)=Db → Eb G Bb Db ✓

  // ── Ab / G# ───────────────────────────────────────────────────────────────
  { name: "Ab",     frets: [5, 3, 4, 3], fingers: [4, 1, 3, 2], baseFret: 3 },
  // G(5)=C C(3)=Eb E(4)=Ab A(3)=C → Ab C Eb ✓
  { name: "Abm",    frets: [1, 3, 4, 2], fingers: [1, 3, 4, 2] },
  // G(1)=Ab C(3)=Eb E(4)=Ab A(2)=B → Ab B Eb ✓  (=G#m)
  { name: "Ab7",    frets: [1, 3, 2, 3], fingers: [1, 3, 2, 4] },
  // G(1)=Ab C(3)=Eb E(2)=Gb A(3)=C → Ab C Eb Gb ✓
  { name: "Abmaj7", frets: [0, 3, 4, 3], fingers: [0, 2, 4, 1] },
  // G C(3)=Eb E(4)=Ab A(3)=C → Ab C Eb G ✓
];

export const CHORD_NAMES = UKULELE_CHORDS.map((c) => c.name);

export function findChord(name: string): ChordShape | undefined {
  return UKULELE_CHORDS.find((c) => c.name === name);
}

/**
 * Alternative voicings per chord name (simpler or different position).
 * findChordVariants() always returns [primary, ...alternatives].
 */
const CHORD_ALTERNATIVES: Record<string, ChordShape[]> = {
  // E major: standard [4,4,4,2] → open-string friendly alternative
  // G(1)=G# C(4)=E E A(2)=B → E G# B ✓  (open E and A strings)
  "E": [{ name: "E", frets: [1, 4, 0, 2], fingers: [1, 4, 0, 2] }],

  // Esus4: standard [2,4,0,2] → 2 open strings
  // G(4)=B C(4)=E E A → E A B ✓
  "Esus4": [{ name: "Esus4", frets: [4, 4, 0, 0], fingers: [2, 1, 0, 0] }],

  // Eb: open G voicing → full 3-barre approach
  // G(3)=Bb C(3)=Eb E(3)=G A(1)=Bb → Eb G Bb ✓
  "Eb": [{ name: "Eb", frets: [3, 3, 3, 1], fingers: [2, 3, 4, 1] }],

  // Fmaj7: 4-finger stretch [2,4,1,3] → A string open (C省略)
  // G(2)=A C(4)=E E(1)=F A=open → F A E ✓ (partial)
  "Fmaj7": [{ name: "Fmaj7", frets: [2, 4, 1, 0], fingers: [2, 3, 1, 0] }],

  // Em: standard [0,4,3,2] requires 3 fingers in awkward positions
  // G open C(4)=E E open A(2)=B → E G B ✓ (2 fingers only)
  "Em": [{ name: "Em", frets: [0, 4, 0, 2], fingers: [0, 2, 0, 1] }],

  // F7: standard [2,3,1,3] → open A string (drop 5th)
  // G(2)=A C(3)=Eb E(1)=F A open → F A Eb ✓ (shell: root+3rd+7th)
  "F7": [{ name: "F7", frets: [2, 3, 1, 0], fingers: [2, 3, 1, 0] }],

  // Fm7: standard [1,3,1,3] hard split-barre → shell voicing (mute G)
  // G muted C(3)=Eb E(1)=F A(3)=C → F C Eb (index@E1, ring barre C&A@3)
  "Fm7": [{ name: "Fm7", frets: [-1, 3, 1, 3], fingers: [0, 2, 1, 2] }],

  // Bb: standard [3,2,1,1] → shell voicing muting G (index barre E&A@1, middle@C2)
  // G muted C(2)=D E(1)=F A(1)=Bb → Bb D F ✓ (2 finger positions)
  "Bb": [{ name: "Bb", frets: [-1, 2, 1, 1], fingers: [0, 2, 1, 1] }],

  // B: standard [4,3,2,2] 4 fingers → index barre E&A@2, ring@C3 (mute G)
  // G muted C(3)=Eb=D# E(2)=F# A(2)=B → B D# F# ✓ (2 finger positions)
  "B": [{ name: "B", frets: [-1, 3, 2, 2], fingers: [0, 3, 1, 1] }],

  // Bm: standard [4,2,2,2] ring@G4 + barre@2 → just barre bottom 3 strings (mute G)
  // G muted C(2)=D E(2)=F# A(2)=B → B D F# ✓ (1-finger barre)
  "Bm": [{ name: "Bm", frets: [-1, 2, 2, 2], fingers: [0, 1, 1, 1] }],

  // C#m: open position stretch → barre at 4th fret (cleaner for some)
  // G(6)=C# C(4)=E E(4)=G# A(4)=C# → C# E G# ✓
  "C#m": [{ name: "C#m", frets: [6, 4, 4, 4], fingers: [3, 1, 1, 1], baseFret: 4 }],

  // F#: standard [3,1,2,1] is already the simplest shape. No change.

  // Ab: high barre baseFret=3 → first position
  // G(1)=Ab C(3)=Eb E(4)=Ab A(3)=C → Ab C Eb ✓
  "Ab": [{ name: "Ab", frets: [1, 3, 4, 3], fingers: [1, 2, 4, 3] }],

  // Db: barre at 4th fret → first position stretch
  // G(1)=Ab C(1)=Db E(1)=F A(4)=Db → Db F Ab ✓
  "Db": [{ name: "Db", frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4] }],

  // G#m / Abm: second position barre alternative
  // G(4)=B C(3)=Eb E(4)=Ab A(2)=B → Ab B Eb ✓
  "G#m": [{ name: "G#m", frets: [4, 3, 4, 2], fingers: [3, 2, 4, 1], baseFret: 2 }],
  "Abm": [{ name: "Abm", frets: [4, 3, 4, 2], fingers: [3, 2, 4, 1], baseFret: 2 }],
};

export function findChordVariants(name: string): ChordShape[] {
  const primary = findChord(name);
  if (!primary) return [];
  const alts = CHORD_ALTERNATIVES[name] ?? [];
  return [primary, ...alts];
}
