export type Song = {
  id: string;
  title: string;
  youtubeVideoId: string;
  lyrics: LyricEvent[];
  chords: ChordEvent[];
  loop?: {
    start: number;
    end: number;
    enabled: boolean;
  };
};

export type LyricEvent = {
  id: string;
  time: number;
  text: string;
};

export type ChordEvent = {
  id: string;
  time: number;
  chord: string;
};

export type ViewMode = "edit" | "practice";
