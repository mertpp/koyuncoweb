import type { BlockWeight, EditorialPattern } from "./types";

export type EditorialColumnSpan = 2 | 3 | 4 | 5 | 7 | 10;

export const EDITORIAL_LAYOUTS = {
  HERO: [10],
  DUAL_EQUAL: [5, 5],
  FEATURE_LEFT: [7, 3],
  FEATURE_RIGHT: [3, 7],
  TRIO: [4, 3, 3],
  SIGNALS: [2, 2, 2, 2, 2],
  QUOTE: [10],
} as const satisfies Record<EditorialPattern, readonly EditorialColumnSpan[]>;

export const COL_SPAN_CLASS = {
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  7: "lg:col-span-7",
  10: "lg:col-span-10",
} as const satisfies Record<EditorialColumnSpan, string>;

export const EDITORIAL_PATTERN_RULES = {
  HERO: ["hero"],
  DUAL_EQUAL: ["feature", "feature"],
  FEATURE_LEFT: ["feature", "supporting"],
  FEATURE_RIGHT: ["supporting", "feature"],
  TRIO: ["supporting", "minor", "minor"],
  SIGNALS: ["minor", "minor", "minor", "minor", "minor"],
  QUOTE: ["feature"],
} as const satisfies Record<EditorialPattern, readonly BlockWeight[]>;
