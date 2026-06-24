/**
 * Ukulele chord shapes for standard GCEA tuning.
 * frets: [G-string, C-string, E-string, A-string]  (absolute fret numbers)
 *   0 = open, -1 = muted, 1+ = fret number
 * baseFret: top fret shown in diagram (default 1).
 *           Display row = fret - baseFret + 1
 *
 * String notes:
 *   G: G G# A Bb B  C  Db D  Eb E  F  Gb G  (frets 0-12)
 *   C: C Db D Eb E  F  Gb G  Ab A  Bb B  C  (frets 0-12)
 *   E: E F  F# G  Ab A  Bb B  C  Db D  Eb E  (frets 0-12)
 *   A: A Bb B  C  Db D  Eb E  F  Gb G  Ab A  (frets 0-12)
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
  // G=G C=C E=E A(3)=C → C E G
  { name: "Cm",     frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3] },
  // G=G C(3)=Eb E(3)=G A(3)=C → C Eb G
  { name: "C7",     frets: [0, 0, 0, 1], fingers: [0, 0, 0, 1] },
  // G=G C=C E=E A(1)=Bb → C E G Bb
  { name: "Cmaj7",  frets: [0, 0, 0, 2], fingers: [0, 0, 0, 2] },
  // G=G C=C E=E A(2)=B → C E G B
  { name: "Cm7",    frets: [3, 3, 3, 3], fingers: [1, 1, 1, 1] },
  // G(3)=Bb C(3)=Eb E(3)=G A(3)=C → C Eb G Bb
  { name: "Csus2",  frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  // G=G C(2)=D E(3)=G A(3)=C → C D G
  { name: "Csus4",  frets: [0, 0, 1, 3], fingers: [0, 0, 1, 3] },
  // G=G C=C E(1)=F A(3)=C → C F G
  { name: "Cadd9",  frets: [0, 2, 0, 3], fingers: [0, 2, 0, 3] },
  // G=G C(2)=D E=E A(3)=C → C D E G

  // ── D ─────────────────────────────────────────────────────────────────────
  { name: "D",      frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0] },
  { name: "Dm",     frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0] },
  { name: "D7",     frets: [2, 2, 2, 3], fingers: [1, 1, 1, 2] },
  { name: "Dmaj7",  frets: [2, 2, 2, 4], fingers: [1, 1, 1, 4] },
  // G(2)=A C(2)=D E(2)=F# A(4)=Db/C# → D F# A C#
  { name: "Dm7",    frets: [2, 2, 1, 3], fingers: [2, 3, 1, 4] },
  // G(2)=A C(2)=D E(1)=F A(3)=C → D F A C
  { name: "Dsus2",  frets: [2, 2, 0, 0], fingers: [1, 2, 0, 0] },
  // G(2)=A C(2)=D E=E A=A → D E A
  { name: "Dsus4",  frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  // G=G C(2)=D E(3)=G A=A → D G A

  // ── E ─────────────────────────────────────────────────────────────────────
  { name: "E",      frets: [4, 4, 4, 2], fingers: [2, 3, 4, 1] },
  { name: "Em",     frets: [0, 4, 3, 2], fingers: [0, 4, 3, 2] },
  { name: "E7",     frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3] },
  { name: "Emaj7",  frets: [1, 3, 0, 2], fingers: [1, 3, 0, 2] },
  // G(1)=G# C(3)=Eb E=E A(2)=B → E G# B D#(=Eb)
  { name: "Em7",    frets: [0, 2, 0, 2], fingers: [0, 2, 0, 1] },
  // G=G C(2)=D E=E A(2)=B → E G B D
  { name: "Esus2",  frets: [4, 4, 2, 2], fingers: [3, 4, 1, 2] },
  // G(4)=B C(4)=E E(2)=F# A(2)=B → E F# B
  { name: "Esus4",  frets: [2, 4, 0, 2], fingers: [1, 3, 0, 2] },
  // G(2)=A C(4)=E E=E A(2)=B → E A B

  // ── F ─────────────────────────────────────────────────────────────────────
  { name: "F",      frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  { name: "Fm",     frets: [1, 0, 1, 3], fingers: [1, 0, 2, 4] },
  { name: "F7",     frets: [2, 3, 1, 3], fingers: [2, 3, 1, 4] },
  { name: "Fmaj7",  frets: [2, 4, 1, 3], fingers: [2, 4, 1, 3] },
  // G(2)=A C(4)=E E(1)=F A(3)=C → F A C E
  { name: "Fm7",    frets: [1, 3, 1, 3], fingers: [1, 3, 1, 3] },
  // G(1)=Ab C(3)=Eb E(1)=F A(3)=C → F Ab C Eb
  { name: "Fsus4",  frets: [3, 0, 1, 3], fingers: [3, 0, 1, 4] },
  // G(3)=Bb C=C E(1)=F A(3)=C → F Bb C
  { name: "F#",     frets: [3, 1, 2, 2], fingers: [3, 1, 2, 4] },
  // G(3)=Bb/A# C(1)=C# E(2)=F# A(2)=C# → F# A# C#
  { name: "F#m",    frets: [2, 1, 2, 0], fingers: [2, 1, 3, 0] },
  // G(2)=A C(1)=C# E(2)=F# A=A → F# A C#

  // ── G ─────────────────────────────────────────────────────────────────────
  { name: "G",      frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  { name: "Gm",     frets: [0, 2, 3, 1], fingers: [0, 2, 3, 1] },
  { name: "G7",     frets: [0, 2, 1, 2], fingers: [0, 2, 1, 3] },
  { name: "Gmaj7",  frets: [0, 2, 2, 2], fingers: [0, 1, 2, 3] },
  // G=G C(2)=D E(2)=F# A(2)=B → G B D F#
  { name: "Gm7",    frets: [0, 2, 1, 1], fingers: [0, 3, 1, 2] },
  // G=G C(2)=D E(1)=F A(1)=Bb → G Bb D F
  { name: "Gsus2",  frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  // G=G C(2)=D E(3)=G A=A → G A D
  { name: "Gsus4",  frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  // G=G C(2)=D E(3)=G A(3)=C → G C D
  { name: "G#m",    frets: [1, 3, 4, 2], fingers: [1, 3, 4, 2] },
  // G(1)=Ab C(3)=Eb E(4)=Ab A(2)=B → G# B D#(Eb)

  // ── A ─────────────────────────────────────────────────────────────────────
  { name: "A",      frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  { name: "Am",     frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0] },
  { name: "A7",     frets: [0, 1, 0, 0], fingers: [0, 1, 0, 0] },
  { name: "Amaj7",  frets: [1, 1, 0, 0], fingers: [2, 1, 0, 0] },
  // G(1)=G# C(1)=C# E=E A=A → A C# E G#
  { name: "Am7",    frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  // all open: G=G C=C E=E A=A → A C E G
  { name: "Asus2",  frets: [2, 4, 0, 2], fingers: [1, 3, 0, 2] },
  // G(2)=A C(4)=E E=E A(2)=B → A B E
  { name: "Asus4",  frets: [2, 2, 0, 0], fingers: [2, 1, 0, 0] },
  // G(2)=A C(2)=D E=E A=A → A D E

  // ── B ─────────────────────────────────────────────────────────────────────
  { name: "B",      frets: [4, 3, 2, 2], fingers: [4, 3, 1, 2] },
  { name: "Bm",     frets: [4, 2, 2, 2], fingers: [4, 1, 2, 3] },
  { name: "B7",     frets: [2, 3, 2, 2], fingers: [1, 3, 2, 4] },
  { name: "Bmaj7",  frets: [3, 3, 2, 2], fingers: [3, 4, 1, 2] },
  // G(3)=Bb/A# C(3)=Eb/D# E(2)=F# A(2)=B → B D# F# A#
  { name: "Bm7",    frets: [2, 2, 2, 2], fingers: [1, 1, 1, 1] },
  // barre 2: G(2)=A C(2)=D E(2)=F# A(2)=B → B D F# A

  // ── Bb / A# ───────────────────────────────────────────────────────────────
  { name: "Bb",     frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1] },
  // G(3)=Bb C(2)=D E(1)=F A(1)=Bb → Bb D F
  { name: "Bbm",    frets: [3, 1, 1, 1], fingers: [3, 1, 1, 1] },
  // G(3)=Bb C(1)=Db E(1)=F A(1)=Bb → Bb Db F
  { name: "Bb7",    frets: [1, 2, 1, 1], fingers: [1, 3, 1, 1] },
  // G(1)=Ab C(2)=D E(1)=F A(1)=Bb → Bb D F Ab
  { name: "Bbmaj7", frets: [3, 2, 1, 0], fingers: [3, 2, 1, 0] },
  // G(3)=Bb C(2)=D E(1)=F A=A → Bb D F A
  { name: "Bbm7",   frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1] },
  // barre 1: G(1)=Ab C(1)=Db E(1)=F A(1)=Bb → Bb Db F Ab

  // ── Db / C# ───────────────────────────────────────────────────────────────
  { name: "Db",     frets: [6, 5, 4, 4], fingers: [3, 2, 1, 1], baseFret: 4 },
  // G(6)=Db C(5)=F E(4)=Ab A(4)=Db → Db F Ab
  { name: "C#m",    frets: [1, 1, 0, 4], fingers: [1, 2, 0, 4] },
  // G(1)=G# C(1)=C# E=E A(4)=Db/C# → C# E G#
  { name: "Dbmaj7", frets: [1, 0, 1, 4], fingers: [1, 0, 2, 4] },
  // G(1)=Ab C=C E(1)=F A(4)=Db → Db F Ab C

  // ── Eb / D# ───────────────────────────────────────────────────────────────
  { name: "Eb",     frets: [0, 3, 3, 1], fingers: [0, 3, 4, 1] },
  // G=G C(3)=Eb E(3)=G A(1)=Bb → Eb G Bb
  { name: "Ebm",    frets: [3, 3, 2, 1], fingers: [4, 3, 2, 1] },
  // G(3)=Bb C(3)=Eb E(2)=Gb A(1)=Bb → Eb Gb Bb
  { name: "Eb7",    frets: [3, 3, 3, 4], fingers: [1, 1, 1, 2] },
  // G(3)=Bb C(3)=Eb E(3)=G A(4)=Db → Eb G Bb Db

  // ── Ab / G# ───────────────────────────────────────────────────────────────
  { name: "Ab",     frets: [5, 3, 4, 3], fingers: [4, 1, 3, 2], baseFret: 3 },
  // G(5)=C C(3)=Eb E(4)=Ab A(3)=C → Ab C Eb
  { name: "Abm",    frets: [1, 3, 4, 2], fingers: [1, 3, 4, 2] },
  // G(1)=Ab C(3)=Eb E(4)=Ab A(2)=B → Ab B Eb  (=G#m)
  { name: "Ab7",    frets: [1, 3, 2, 3], fingers: [1, 3, 2, 4] },
  // G(1)=Ab C(3)=Eb E(2)=Gb A(3)=C → Ab C Eb Gb
  { name: "Abmaj7", frets: [0, 3, 4, 3], fingers: [0, 2, 4, 1] },
  // G=G C(3)=Eb E(4)=Ab A(3)=C → Ab C Eb G
];

export const CHORD_NAMES = UKULELE_CHORDS.map((c) => c.name);

export function findChord(name: string): ChordShape | undefined {
  return UKULELE_CHORDS.find((c) => c.name === name);
}
