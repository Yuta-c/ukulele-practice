import { describe, it, expect } from "vitest";
import { findCurrent } from "@/lib/eventUtils";

type E = { id: string; time: number };

function ev(time: number): E {
  return { id: String(time), time };
}

describe("findCurrent — empty array", () => {
  it("returns index -1 and nulls for an empty array", () => {
    const result = findCurrent([], 5);
    expect(result.index).toBe(-1);
    expect(result.current).toBeNull();
    expect(result.nextItem).toBeNull();
  });
});

describe("findCurrent — before first event", () => {
  const events = [ev(10), ev(20), ev(30)];

  it("returns index -1 when time is before all events", () => {
    const result = findCurrent(events, 5);
    expect(result.index).toBe(-1);
    expect(result.current).toBeNull();
    expect(result.nextItem).toEqual(ev(10));
  });
});

describe("findCurrent — exact match", () => {
  const events = [ev(10), ev(20), ev(30)];

  it("matches the event whose time equals the query time", () => {
    const result = findCurrent(events, 20);
    expect(result.index).toBe(1);
    expect(result.current).toEqual(ev(20));
    expect(result.nextItem).toEqual(ev(30));
  });

  it("matches the first event exactly", () => {
    const result = findCurrent(events, 10);
    expect(result.index).toBe(0);
    expect(result.current).toEqual(ev(10));
    expect(result.nextItem).toEqual(ev(20));
  });
});

describe("findCurrent — between events", () => {
  const events = [ev(10), ev(20), ev(30)];

  it("returns the preceding event when between two events", () => {
    const result = findCurrent(events, 15);
    expect(result.index).toBe(0);
    expect(result.current).toEqual(ev(10));
    expect(result.nextItem).toEqual(ev(20));
  });

  it("returns the last event when past all events", () => {
    const result = findCurrent(events, 99);
    expect(result.index).toBe(2);
    expect(result.current).toEqual(ev(30));
    expect(result.nextItem).toBeNull();
  });
});

describe("findCurrent — single element", () => {
  const events = [ev(5)];

  it("returns the single event when time >= its time", () => {
    const result = findCurrent(events, 5);
    expect(result.current).toEqual(ev(5));
    expect(result.nextItem).toBeNull();
  });

  it("returns null when time < the single event", () => {
    const result = findCurrent(events, 0);
    expect(result.current).toBeNull();
    expect(result.nextItem).toEqual(ev(5));
  });
});

describe("findCurrent — time = 0", () => {
  it("matches an event at time 0", () => {
    const events = [ev(0), ev(10)];
    const result = findCurrent(events, 0);
    expect(result.index).toBe(0);
    expect(result.current).toEqual(ev(0));
  });
});

describe("findCurrent — large array performance check", () => {
  it("handles 1000 events without issue", () => {
    const events = Array.from({ length: 1000 }, (_, i) => ev(i * 0.5));
    const result = findCurrent(events, 249.75);
    // 249.75 / 0.5 = 499.5 → index 499 (time 249.5)
    expect(result.index).toBe(499);
    expect(result.current?.time).toBeCloseTo(249.5);
    expect(result.nextItem?.time).toBeCloseTo(250.0);
  });
});
