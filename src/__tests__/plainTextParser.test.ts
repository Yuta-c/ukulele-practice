import { describe, it, expect } from "vitest";
import { parsePlainText } from "@/lib/plainTextParser";

describe("parsePlainText — bracket format", () => {
  it("parses [Chord] lyric", () => {
    const items = parsePlainText("[Am] 秋の空");
    expect(items).toHaveLength(1);
    expect(items[0].chord).toBe("Am");
    expect(items[0].lyric).toBe("秋の空");
  });

  it("parses [Chord] with no lyric", () => {
    const items = parsePlainText("[G7]");
    expect(items).toHaveLength(1);
    expect(items[0].chord).toBe("G7");
    expect(items[0].lyric).toBeUndefined();
  });

  it("parses chord with baseFret-style e.g. [F#m]", () => {
    const items = parsePlainText("[F#m] テスト");
    expect(items[0].chord).toBe("F#m");
    expect(items[0].lyric).toBe("テスト");
  });
});

describe("parsePlainText — space-separated format", () => {
  it("parses ChordName lyric (space-separated)", () => {
    const items = parsePlainText("Am 秋の空");
    expect(items).toHaveLength(1);
    expect(items[0].chord).toBe("Am");
    expect(items[0].lyric).toBe("秋の空");
  });

  it("parses chord-only line (no lyric after space)", () => {
    const items = parsePlainText("C");
    expect(items).toHaveLength(1);
    expect(items[0].chord).toBe("C");
    expect(items[0].lyric).toBeUndefined();
  });

  it("treats Japanese-only line as lyric (no chord)", () => {
    const items = parsePlainText("歌詞テキストのみ");
    expect(items).toHaveLength(1);
    expect(items[0].chord).toBeUndefined();
    expect(items[0].lyric).toBe("歌詞テキストのみ");
  });
});

describe("parsePlainText — comment and blank lines", () => {
  it("skips blank lines", () => {
    const items = parsePlainText("Am\n\nF\n\nG");
    expect(items).toHaveLength(3);
  });

  it("skips lines starting with #", () => {
    const items = parsePlainText("# コメント\nAm 歌詞");
    expect(items).toHaveLength(1);
    expect(items[0].chord).toBe("Am");
  });

  it("skips lines starting with //", () => {
    const items = parsePlainText("// コメント\nF 歌詞");
    expect(items).toHaveLength(1);
    expect(items[0].chord).toBe("F");
  });
});

describe("parsePlainText — multi-line input", () => {
  it("parses a realistic chord sheet", () => {
    const input = [
      "# ヴァース",
      "[Am] 秋の空",
      "[F] 風吹いて",
      "G7",
      "歌詞テキスト",
    ].join("\n");
    const items = parsePlainText(input);
    expect(items).toHaveLength(4);
    expect(items[0]).toEqual({ chord: "Am", lyric: "秋の空" });
    expect(items[1]).toEqual({ chord: "F", lyric: "風吹いて" });
    expect(items[2]).toEqual({ chord: "G7", lyric: undefined });
    expect(items[3]).toEqual({ chord: undefined, lyric: "歌詞テキスト" });
  });
});

describe("parsePlainText — edge cases", () => {
  it("returns empty array for empty string", () => {
    expect(parsePlainText("")).toHaveLength(0);
  });

  it("returns empty array for whitespace-only string", () => {
    expect(parsePlainText("   \n  \n")).toHaveLength(0);
  });

  it("does not treat long words as chords", () => {
    const items = parsePlainText("ABCDEFGHIJK lyrics");
    expect(items[0].chord).toBeUndefined();
    expect(items[0].lyric).toBe("ABCDEFGHIJK lyrics");
  });

  it("does not treat non-A-G start as chord", () => {
    const items = parsePlainText("Hello world");
    expect(items[0].chord).toBeUndefined();
    expect(items[0].lyric).toBe("Hello world");
  });

  it("handles slash chords like Am/E", () => {
    const items = parsePlainText("Am/E 歌詞");
    expect(items[0].chord).toBe("Am/E");
    expect(items[0].lyric).toBe("歌詞");
  });

  it("handles Bb chord", () => {
    const items = parsePlainText("Bb テスト");
    expect(items[0].chord).toBe("Bb");
  });
});
