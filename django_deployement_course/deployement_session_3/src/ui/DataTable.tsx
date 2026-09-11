import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useInstant } from "@/motion/instant";
import { accentByTone, type Tone } from "@/design/tokens";

/**
 * Comparison table.
 *
 * The Evolve kit has no table: `BulletList`, `CardGrid` and `AnalogyMap` all
 * break a row into independent tiles, which is exactly wrong for the slides
 * that teach *by* the column alignment — "Problem 1 vs Problem 2",
 * "VM vs Container", "requirement vs how it's met". Those need the eye to run
 * down a column.
 *
 * Built from the same vocabulary as the rest of the kit (`rounded-card`,
 * `border-line`, `shadow-card-soft`, `accentByTone`) so it reads as native.
 *
 * ENTRANCE
 * The table assembles itself on arrival, with no click anywhere in it: the
 * header labels come in first, left to right, and only once the header has
 * landed do the data rows drop in one after another, top to bottom. That is the
 * order the table is read in, so the motion teaches the reading path instead of
 * fighting it — you see WHAT the columns are before you are given anything to
 * put in them.
 *
 * It is deliberately not a click-driven build. A table is a single exhibit that
 * happens to have parts; making the presenter click through five rows turns one
 * idea into five beats. The whole thing is on screen inside two seconds.
 */

/** Beat map for the entrance, in seconds. */
const HEAD_START = 0.15;
const HEAD_STEP = 0.07;
const ROW_STEP = 0.13;
const EASE = [0.22, 1, 0.36, 1] as const;

export interface TableColumn {
  label: ReactNode;
  /** Relative width. Defaults to 1. */
  weight?: number;
  /**
   * Right-align this column, header and body together. For a column of NUMBERS
   * only (sizes, counts, durations), where the digits line up by place value and
   * the eye compares magnitudes down the column.
   *
   * Everything else is left-aligned and there is no opt-out, which is the point
   * of the next comment.
   */
  numeric?: boolean;
  /**
   * @deprecated No longer applied. Kept so existing decks keep compiling.
   *
   * Centring row data was reported on the "Two Runtimes, Not One" slide: with
   * `Frontend` and `Backend` centred, each cell started at a different x, so the
   * reader had to re-find the start of every value instead of running one eye
   * line down the column — which is the only reason that slide is a table rather
   * than three cards. Alignment is now a property of the DATA (numbers right,
   * everything else left), not something a call site chooses per column, so a
   * table cannot be authored into that state again. Use `numeric` for a column
   * of numbers.
   */
  align?: "left" | "center";
  /** Renders the whole column at reduced opacity — the "parked / later" column. */
  dim?: boolean;
}

export type TableRow = ReactNode[];

export function DataTable({
  columns,
  rows,
  tone = "brand",
  /** 1-based row numbers to emphasize. */
  highlight = [],
  compact = false,
  className = "",
}: {
  columns: TableColumn[];
  rows: TableRow[];
  tone?: Tone;
  highlight?: number[];
  compact?: boolean;
  className?: string;
}) {
  /* On an instant jump (Ctrl+arrow) the rest of the slide snaps to its final
     state, so the table must too: a lone cascading table would be the only thing
     moving on an otherwise still slide. */
  const instant = useInstant()
  const color = accentByTone[tone];
  const hl = new Set(highlight);
  const grid = columns.map((c) => `${c.weight ?? 1}fr`).join(" ");
  const pad = compact ? "px-5 py-2.5" : "px-5 py-3.5";
  /** When the last header label has settled, and the rows may start. */
  const headerEnd = HEAD_START + (columns.length - 1) * HEAD_STEP + 0.35;

  return (
    <div
      className={`overflow-hidden rounded-card border border-line bg-white shadow-card-soft ${className}`}
    >
      {/* Header — labels arrive first, left to right */}
      <div
        className="grid items-end gap-x-2"
        style={{ gridTemplateColumns: grid, background: `${color}0f` }}
      >
        {columns.map((c, i) => (
          <motion.div
            key={i}
            initial={instant ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: c.dim ? 0.5 : 1, y: 0 }}
            transition={{
              delay: HEAD_START + i * HEAD_STEP,
              duration: 0.45,
              ease: EASE,
            }}
            className={`${pad} font-heading text-body-sm font-bold uppercase tracking-wider ${
              c.numeric ? "text-right" : "text-left"
            }`}
            style={{ color }}
          >
            {c.label}
          </motion.div>
        ))}
      </div>

      {/*
        Rows are timed off the header rather than staggered by a parent group:
        the delay is computed per row, so the cascade always starts after the
        last header label has landed no matter how many columns there are, and it
        never waits on a click or on a parent's reveal state.
      */}
      <div className="block">
        {rows.map((row, r) => (
          <motion.div
            key={r}
            className="grid items-center gap-x-2 border-t border-line"
            style={{
              gridTemplateColumns: grid,
              background: hl.has(r + 1)
                ? `${color}0a`
                : r % 2
                  ? "#FBFDFF"
                  : undefined,
            }}
            initial={instant ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: headerEnd + r * ROW_STEP,
              duration: 0.5,
              ease: EASE,
            }}
          >
            {row.map((cell, c) => {
              const col = columns[c];
              return (
                <div
                  key={c}
                  /* The header above and the cell below share ONE alignment,
                     read off the same column. They used to be able to disagree,
                     because each read `align` separately. */
                  className={`${pad} text-body-sm leading-snug ${
                    col?.numeric ? "text-right" : "text-left"
                  } ${c === 0 ? "font-semibold text-ink" : "text-body"}`}
                  style={col?.dim ? { opacity: 0.45 } : undefined}
                >
                  {cell}
                </div>
              );
            })}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
