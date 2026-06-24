"use client";

import { useState, useEffect } from "react";
import { findChordVariants } from "@/lib/ukuleleChords";

const VARIANT_STORAGE_KEY = "ukulele_chord_variants";

function loadVariantPrefs(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(VARIANT_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveVariantPref(chordName: string, idx: number) {
  if (typeof window === "undefined") return;
  try {
    const prefs = loadVariantPrefs();
    if (idx === 0) {
      delete prefs[chordName];
    } else {
      prefs[chordName] = idx;
    }
    localStorage.setItem(VARIANT_STORAGE_KEY, JSON.stringify(prefs));
  } catch {}
}

// ── Layout constants ──────────────────────────────────────────────────────────
const MARGIN_X = 14;
const MARGIN_TOP = 20; // space for open/muted indicators
const MARGIN_BOTTOM = 16; // space for string labels
const STRING_SPACING = 14;
const FRET_SPACING = 13;
const NUM_STRINGS = 4;
const NUM_FRETS = 5;
const DOT_RADIUS = 5;
const NUT_HEIGHT = 4;

const GRID_W = STRING_SPACING * (NUM_STRINGS - 1);
const GRID_H = FRET_SPACING * NUM_FRETS;
const SVG_W = MARGIN_X * 2 + GRID_W;
const SVG_H = MARGIN_TOP + NUT_HEIGHT + GRID_H + MARGIN_BOTTOM;

function sx(stringIndex: number) {
  return MARGIN_X + stringIndex * STRING_SPACING;
}

function fy(fret: number) {
  return MARGIN_TOP + NUT_HEIGHT + (fret - 1) * FRET_SPACING + FRET_SPACING / 2;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  chordName: string;
  size?: "sm" | "md" | "lg";
}

const SCALE: Record<string, number> = { sm: 0.8, md: 1, lg: 1.4 };

export default function ChordDiagram({ chordName, size = "md" }: Props) {
  const variants = findChordVariants(chordName);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const saved = loadVariantPrefs()[chordName] ?? 0;
    setIdx(Math.min(saved, Math.max(0, variants.length - 1)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chordName]);

  function changeIdx(next: number) {
    setIdx(next);
    saveVariantPref(chordName, next);
  }

  const scale = SCALE[size] ?? 1;
  const w = SVG_W * scale;
  const h = SVG_H * scale;

  if (variants.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-500 text-xs"
        style={{ width: w, height: h }}
      >
        {chordName}
      </div>
    );
  }

  const chord = variants[Math.min(idx, variants.length - 1)];
  const hasVariants = variants.length > 1;
  const baseFret = chord.baseFret ?? 1;
  const nutY = MARGIN_TOP;
  const gridStartY = nutY + NUT_HEIGHT;

  return (
    <div className="inline-flex flex-col items-center gap-0.5">
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`${chord.name} chord diagram`}
      >
        {/* ── Fret lines ── */}
        {Array.from({ length: NUM_FRETS + 1 }, (_, i) => (
          <line
            key={`fret-${i}`}
            x1={MARGIN_X}
            y1={gridStartY + i * FRET_SPACING}
            x2={MARGIN_X + GRID_W}
            y2={gridStartY + i * FRET_SPACING}
            stroke="#6b7280"
            strokeWidth={0.8}
          />
        ))}

        {/* ── Strings ── */}
        {Array.from({ length: NUM_STRINGS }, (_, i) => (
          <line
            key={`str-${i}`}
            x1={sx(i)}
            y1={gridStartY}
            x2={sx(i)}
            y2={gridStartY + GRID_H}
            stroke="#9ca3af"
            strokeWidth={0.8}
          />
        ))}

        {/* ── Nut or baseFret label ── */}
        {baseFret === 1 ? (
          <rect
            x={MARGIN_X}
            y={nutY}
            width={GRID_W}
            height={NUT_HEIGHT}
            fill="#e5e7eb"
            rx={1}
          />
        ) : (
          <text
            x={MARGIN_X - 2}
            y={gridStartY + FRET_SPACING / 2 + 3}
            fill="#9ca3af"
            fontSize={8}
            textAnchor="end"
          >
            {baseFret}fr
          </text>
        )}

        {/* ── Open / muted indicators ── */}
        {chord.frets.map((fret, i) => {
          const x = sx(i);
          const y = MARGIN_TOP - 7;
          if (fret === -1) {
            return (
              <g key={`ind-${i}`}>
                <line x1={x - 3} y1={y - 3} x2={x + 3} y2={y + 3} stroke="#ef4444" strokeWidth={1.5} strokeLinecap="round" />
                <line x1={x + 3} y1={y - 3} x2={x - 3} y2={y + 3} stroke="#ef4444" strokeWidth={1.5} strokeLinecap="round" />
              </g>
            );
          } else if (fret === 0) {
            return (
              <circle key={`ind-${i}`} cx={x} cy={y} r={3.5} fill="none" stroke="#d1d5db" strokeWidth={1.2} />
            );
          }
          return null;
        })}

        {/* ── Finger dots ── */}
        {chord.frets.map((fret, i) => {
          if (fret <= 0) return null;
          const relativeFret = fret - baseFret + 1;
          if (relativeFret < 1 || relativeFret > NUM_FRETS) return null;
          const cx = sx(i);
          const cy = fy(relativeFret);
          const fingerNumber = chord.fingers?.[i];
          return (
            <g key={`dot-${i}`}>
              <circle cx={cx} cy={cy} r={DOT_RADIUS} fill="#3b82f6" />
              {fingerNumber != null && fingerNumber > 0 && (
                <text x={cx} y={cy + 3.5} fill="white" fontSize={7} fontWeight="bold" textAnchor="middle">
                  {fingerNumber}
                </text>
              )}
            </g>
          );
        })}

        {/* ── String labels ── */}
        {["G", "C", "E", "A"].map((label, i) => (
          <text key={`lbl-${i}`} x={sx(i)} y={SVG_H - 3} fill="#6b7280" fontSize={8} textAnchor="middle">
            {label}
          </text>
        ))}
      </svg>

      {/* ── Variant switcher ── */}
      {hasVariants && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeIdx((idx - 1 + variants.length) % variants.length)}
            className="text-gray-400 hover:text-white text-xs px-1 leading-none"
            aria-label="前の押さえ方"
          >
            ◀
          </button>
          <div className="flex gap-0.5">
            {variants.map((_, i) => (
              <button
                key={i}
                onClick={() => changeIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === idx ? "bg-blue-400" : "bg-gray-600 hover:bg-gray-400"
                }`}
                aria-label={`押さえ方 ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => changeIdx((idx + 1) % variants.length)}
            className="text-gray-400 hover:text-white text-xs px-1 leading-none"
            aria-label="次の押さえ方"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
