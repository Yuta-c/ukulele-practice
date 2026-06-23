import { describe, it, expect } from "vitest";
import { parseLrc, exportToLrc } from "@/lib/lrcParser";

describe("parseLrc", () => {
  it("parses a line with both chord and lyric", () => {
    const { lyrics, chords } = parseLrc("[00:12.40][Am] 歌詞の1行目");
    expect(chords).toHaveLength(1);
    expect(chords[0].chord).toBe("Am");
    expect(chords[0].time).toBeCloseTo(12.4);
    expect(lyrics).toHaveLength(1);
    expect(lyrics[0].text).toBe("歌詞の1行目");
    expect(lyrics[0].time).toBeCloseTo(12.4);
  });

  it("parses a line with chord only (no lyric text)", () => {
    const { lyrics, chords } = parseLrc("[00:15.00][G7]");
    expect(chords).toHaveLength(1);
    expect(chords[0].chord).toBe("G7");
    expect(lyrics).toHaveLength(0);
  });

  it("parses a line with lyric only (no chord)", () => {
    const { lyrics, chords } = parseLrc("[00:20.00] テキストだけ");
    expect(lyrics).toHaveLength(1);
    expect(lyrics[0].text).toBe("テキストだけ");
    expect(chords).toHaveLength(0);
  });

  it("parses minutes correctly", () => {
    const { lyrics } = parseLrc("[01:02.50] テスト");
    expect(lyrics[0].time).toBeCloseTo(62.5);
  });

  it("skips blank lines", () => {
    const input = "[00:01.00][C] 一行目\n\n[00:02.00][F] 二行目";
    const { chords } = parseLrc(input);
    expect(chords).toHaveLength(2);
  });

  it("skips lines without a timestamp", () => {
    const { lyrics, chords } = parseLrc("これはタイムスタンプなし\n[00:05.00][Am] 有効な行");
    expect(lyrics).toHaveLength(1);
    expect(chords).toHaveLength(1);
  });

  it("returns events sorted by time", () => {
    const input = [
      "[00:30.00][G] 三番目",
      "[00:10.00][Am] 一番目",
      "[00:20.00][F] 二番目",
    ].join("\n");
    const { chords } = parseLrc(input);
    expect(chords[0].chord).toBe("Am");
    expect(chords[1].chord).toBe("F");
    expect(chords[2].chord).toBe("G");
  });

  it("assigns unique IDs to each event", () => {
    const input = "[00:01.00][C] 一\n[00:02.00][Am] 二";
    const { chords } = parseLrc(input);
    expect(chords[0].id).not.toBe(chords[1].id);
  });

  it("handles an empty string", () => {
    const { lyrics, chords } = parseLrc("");
    expect(lyrics).toHaveLength(0);
    expect(chords).toHaveLength(0);
  });

  it("handles multi-line real-world input", () => {
    const input = [
      "[00:12.40][Am] 歌詞の1行目",
      "[00:15.80][F] 歌詞の2行目",
      "[00:20.00][C] 歌詞の3行目",
      "[00:24.50][G7] 歌詞の4行目",
    ].join("\n");
    const { lyrics, chords } = parseLrc(input);
    expect(lyrics).toHaveLength(4);
    expect(chords).toHaveLength(4);
    expect(lyrics[2].text).toBe("歌詞の3行目");
    expect(chords[3].chord).toBe("G7");
  });
});

describe("exportToLrc", () => {
  it("exports a lyric-only event correctly", () => {
    const lyrics = [{ id: "1", time: 5.0, text: "テスト" }];
    const result = exportToLrc(lyrics, []);
    expect(result).toContain("[00:05.00]");
    expect(result).toContain("テスト");
  });

  it("exports a chord-only event correctly", () => {
    const chords = [{ id: "1", time: 10.0, chord: "Am" }];
    const result = exportToLrc([], chords);
    expect(result).toContain("[00:10.00]");
    expect(result).toContain("[Am]");
  });

  it("merges chord and lyric at the same timestamp", () => {
    const lyrics = [{ id: "1", time: 12.4, text: "歌詞" }];
    const chords = [{ id: "2", time: 12.4, chord: "Am" }];
    const result = exportToLrc(lyrics, chords);
    // Only one line should be produced
    expect(result.trim().split("\n")).toHaveLength(1);
    expect(result).toContain("[Am]");
    expect(result).toContain("歌詞");
  });

  it("round-trips through parseLrc", () => {
    const original = [
      "[00:05.00][C] 一行目",
      "[00:10.00][Am] 二行目",
    ].join("\n");
    const { lyrics, chords } = parseLrc(original);
    const exported = exportToLrc(lyrics, chords);
    const re = parseLrc(exported);
    expect(re.lyrics.map((l) => l.text)).toEqual(["一行目", "二行目"]);
    expect(re.chords.map((c) => c.chord)).toEqual(["C", "Am"]);
    expect(re.chords[0].time).toBeCloseTo(5.0);
  });
});
