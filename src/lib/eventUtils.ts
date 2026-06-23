/**
 * Time-event utilities shared across components.
 * Extracted so they can be unit-tested independently.
 */

/** Find the active event at `time` using binary search (O(log n)). */
export function findCurrent<T extends { time: number }>(
  events: T[],
  time: number
): { current: T | null; nextItem: T | null; index: number } {
  if (events.length === 0) return { current: null, nextItem: null, index: -1 };

  let lo = 0;
  let hi = events.length - 1;
  let idx = -1;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (events[mid].time <= time) {
      idx = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return {
    current: idx >= 0 ? events[idx] : null,
    nextItem: idx + 1 < events.length ? events[idx + 1] : null,
    index: idx,
  };
}
