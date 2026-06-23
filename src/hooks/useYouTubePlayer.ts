"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Song } from "@/lib/types";

// ── Minimal YouTube IFrame API type definitions ──────────────────────────────

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  setPlaybackRate(rate: number): void;
  getPlaybackRate(): number;
  getAvailablePlaybackRates(): number[];
  loadVideoById(videoId: string): void;
  cueVideoById(videoId: string): void;
  destroy(): void;
}

interface YTPlayerOptions {
  height?: string | number;
  width?: string | number;
  videoId?: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: { data: number; target: YTPlayer }) => void;
    onError?: (event: { data: number }) => void;
  };
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

// ── YouTube API loader (singleton) ────────────────────────────────────────────

type ApiState = "not-loaded" | "loading" | "ready";
let ytApiState: ApiState = "not-loaded";
const ytReadyCallbacks: Array<() => void> = [];

function ensureYouTubeApiLoaded(onReady: () => void): void {
  if (ytApiState === "ready") {
    onReady();
    return;
  }
  ytReadyCallbacks.push(onReady);
  if (ytApiState === "loading") return;

  ytApiState = "loading";
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(script);

  window.onYouTubeIframeAPIReady = () => {
    ytApiState = "ready";
    ytReadyCallbacks.forEach((cb) => cb());
    ytReadyCallbacks.length = 0;
  };
}

// ── Public interfaces ─────────────────────────────────────────────────────────

export interface PlayerState {
  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  availableRates: number[];
}

export interface PlayerControls {
  play(): void;
  pause(): void;
  toggle(): void;
  seekTo(time: number): void;
  seekBy(delta: number): void;
  setPlaybackRate(rate: number): void;
  loadVideo(videoId: string): void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

const DEFAULT_RATES = [0.5, 0.75, 1, 1.25];
const PLAYING_STATE = 1;
const PAUSED_STATE = 2;
const ENDED_STATE = 0;

/**
 * How many seconds before the loop end-point we actually seek back.
 * Absorbs the ~100 ms polling interval so the jump feels seamless.
 */
const LOOP_SEEK_MARGIN = 0.08;

export function useYouTubePlayer(
  containerId: string,
  loop: Song["loop"]
): { state: PlayerState; controls: PlayerControls } {
  const playerRef = useRef<YTPlayer | null>(null);
  const isPlayingRef = useRef(false);
  const isReadyRef = useRef(false);
  const pendingVideoIdRef = useRef<string | null>(null);
  const loopRef = useRef(loop);
  // Track whether we just seeked to loop start so we don't double-trigger
  const loopJustSeekedRef = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [availableRates, setAvailableRates] = useState<number[]>(DEFAULT_RATES);

  // Keep loop ref in sync without re-creating the player
  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  // Callback is stable since containerId never changes in practice
  const initPlayer = useMemo(() => () => {
    if (!document.getElementById(containerId)) return;

    playerRef.current = new window.YT.Player(containerId, {
      height: "100%",
      width: "100%",
      playerVars: {
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (event) => {
          isReadyRef.current = true;
          setIsReady(true);

          const rates = event.target.getAvailablePlaybackRates();
          if (rates.length) setAvailableRates(rates);

          if (pendingVideoIdRef.current) {
            event.target.cueVideoById(pendingVideoIdRef.current);
            pendingVideoIdRef.current = null;
          }
        },
        onStateChange: (event) => {
          if (event.data === PLAYING_STATE) {
            isPlayingRef.current = true;
            setIsPlaying(true);
            setDuration(event.target.getDuration());
            const rates = event.target.getAvailablePlaybackRates();
            if (rates.length) setAvailableRates(rates);
          } else if (
            event.data === PAUSED_STATE ||
            event.data === ENDED_STATE
          ) {
            isPlayingRef.current = false;
            setIsPlaying(false);
          }
        },
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load the YouTube API once on mount
  useEffect(() => {
    ensureYouTubeApiLoaded(initPlayer);
  }, [initPlayer]);

  // Poll current time; enforce loop boundaries with margin for smooth looping
  useEffect(() => {
    const id = setInterval(() => {
      if (!playerRef.current || !isReadyRef.current) return;
      try {
        const t = playerRef.current.getCurrentTime();
        setCurrentTime(t);

        const l = loopRef.current;
        if (l?.enabled && isPlayingRef.current) {
          // Seek LOOP_SEEK_MARGIN seconds before the nominal end so that by
          // the time the next poll fires we are already back at loop start.
          if (t >= l.end - LOOP_SEEK_MARGIN && !loopJustSeekedRef.current) {
            loopJustSeekedRef.current = true;
            playerRef.current.seekTo(l.start, true);
          } else if (t < l.end - LOOP_SEEK_MARGIN * 2) {
            // Reset flag once we're safely before the end point
            loopJustSeekedRef.current = false;
          }
        }
      } catch {
        // player might not be ready yet
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  // Stable controls — use refs internally so deps stay empty
  const controls = useMemo<PlayerControls>(
    () => ({
      play: () => playerRef.current?.playVideo(),
      pause: () => playerRef.current?.pauseVideo(),
      toggle: () => {
        if (isPlayingRef.current) {
          playerRef.current?.pauseVideo();
        } else {
          playerRef.current?.playVideo();
        }
      },
      seekTo: (time: number) => {
        playerRef.current?.seekTo(time, true);
        setCurrentTime(time);
      },
      seekBy: (delta: number) => {
        const now = playerRef.current?.getCurrentTime() ?? 0;
        const next = Math.max(0, now + delta);
        playerRef.current?.seekTo(next, true);
        setCurrentTime(next);
      },
      setPlaybackRate: (rate: number) => {
        playerRef.current?.setPlaybackRate(rate);
        setPlaybackRateState(rate);
      },
      loadVideo: (videoId: string) => {
        if (isReadyRef.current && playerRef.current) {
          playerRef.current.cueVideoById(videoId);
        } else {
          pendingVideoIdRef.current = videoId;
        }
      },
    }),
    [] // intentionally empty: controls use refs internally
  );

  return {
    state: { isReady, isPlaying, currentTime, duration, playbackRate, availableRates },
    controls,
  };
}
