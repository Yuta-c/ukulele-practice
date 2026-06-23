import { describe, it, expect } from "vitest";
import { extractVideoId } from "@/lib/urlParser";

const ID = "dQw4w9WgXcQ"; // 11-char test ID

describe("extractVideoId", () => {
  it("returns the ID as-is when input is already an 11-char ID", () => {
    expect(extractVideoId(ID)).toBe(ID);
  });

  it("extracts from a standard watch URL", () => {
    expect(extractVideoId(`https://www.youtube.com/watch?v=${ID}`)).toBe(ID);
  });

  it("extracts from a watch URL with extra query params", () => {
    expect(
      extractVideoId(`https://www.youtube.com/watch?v=${ID}&t=42s&feature=share`)
    ).toBe(ID);
  });

  it("extracts from a youtu.be short URL", () => {
    expect(extractVideoId(`https://youtu.be/${ID}`)).toBe(ID);
  });

  it("extracts from a youtu.be URL with query params", () => {
    expect(extractVideoId(`https://youtu.be/${ID}?si=abc123`)).toBe(ID);
  });

  it("extracts from an embed URL", () => {
    expect(
      extractVideoId(`https://www.youtube.com/embed/${ID}`)
    ).toBe(ID);
  });

  it("extracts from a Shorts URL", () => {
    expect(
      extractVideoId(`https://www.youtube.com/shorts/${ID}`)
    ).toBe(ID);
  });

  it("extracts from a live URL", () => {
    expect(
      extractVideoId(`https://www.youtube.com/live/${ID}`)
    ).toBe(ID);
  });

  it("handles leading/trailing whitespace", () => {
    expect(extractVideoId(`  ${ID}  `)).toBe(ID);
    expect(
      extractVideoId(`  https://youtu.be/${ID}  `)
    ).toBe(ID);
  });

  it("returns null for an empty string", () => {
    expect(extractVideoId("")).toBeNull();
  });

  it("returns null for an invalid URL", () => {
    expect(extractVideoId("not-a-url")).toBeNull();
  });

  it("returns null for a URL with no video ID", () => {
    expect(extractVideoId("https://www.youtube.com/")).toBeNull();
  });

  it("returns null for an ID shorter than 11 chars", () => {
    expect(extractVideoId("dQw4w9W")).toBeNull();
  });
});
