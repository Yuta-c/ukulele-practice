export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();

  // Already a bare video ID (11 alphanumeric chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);

    // youtube.com/watch?v=ID
    const v = url.searchParams.get("v");
    if (v && v.length === 11) return v;

    // youtu.be/ID
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1).split("?")[0];
      if (id && id.length === 11) return id;
    }

    // youtube.com/embed/ID
    if (url.pathname.startsWith("/embed/")) {
      const id = url.pathname.split("/embed/")[1]?.split("?")[0];
      if (id && id.length === 11) return id;
    }

    // youtube.com/shorts/ID
    if (url.pathname.startsWith("/shorts/")) {
      const id = url.pathname.split("/shorts/")[1]?.split("?")[0];
      if (id && id.length === 11) return id;
    }

    // youtube.com/live/ID
    if (url.pathname.startsWith("/live/")) {
      const id = url.pathname.split("/live/")[1]?.split("?")[0];
      if (id && id.length === 11) return id;
    }
  } catch {
    // Not a valid URL — fall through to regex
  }

  const match = trimmed.match(
    /(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}
