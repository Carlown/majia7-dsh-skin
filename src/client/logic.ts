export const PREVIEW_MAX_FRAME = 240;
export const MAX_LEVEL = 30;

const LIANG_RANKS = ["小难梁", "牢梁", "梁子", "梁圣", "梁神", "梁祖"] as const;

export interface EffortLike {
  id: string;
  name: string;
  description?: string;
}

export interface Palette {
  level: number;
  stage: number;
  strength: number;
  page: string;
  base: string;
  layer1: string;
  layer2: string;
  layer3: string;
  sidebar: string;
  ink: string;
  secondary: string;
  tertiary: string;
  border: string;
  accent: string;
  accentHover: string;
  hover: string;
  portraitOpacity: string;
}

type Rgb = readonly [number, number, number];

interface PaletteStop {
  at: number;
  page: Rgb;
  surface: Rgb;
  surface2: Rgb;
  ink: Rgb;
  secondary: Rgb;
  accent: Rgb;
  portraitOpacity: number;
}

// 四档 UI 主题，与档位图同点切换（5/15/25 为界）：
// off=整体灰、low=原版 DeepSeek Harness 蓝、high=亮青、max=粉（页面 #E6DDDE）。
const TIER_UI_STOPS: readonly PaletteStop[] = [
  { at: 0, page: [224, 224, 226], surface: [240, 240, 242], surface2: [230, 230, 233], ink: [45, 45, 48], secondary: [124, 124, 130], accent: [110, 110, 118], portraitOpacity: 0.92 },
  { at: 10, page: [245, 246, 248], surface: [255, 255, 255], surface2: [245, 246, 247], ink: [30, 32, 38], secondary: [104, 110, 122], accent: [65, 118, 230], portraitOpacity: 0.93 },
  { at: 20, page: [240, 251, 250], surface: [252, 255, 254], surface2: [233, 247, 245], ink: [16, 54, 50], secondary: [94, 138, 132], accent: [11, 165, 164], portraitOpacity: 0.94 },
  { at: 30, page: [230, 221, 222], surface: [248, 242, 243], surface2: [238, 229, 231], ink: [61, 42, 47], secondary: [138, 110, 116], accent: [201, 85, 111], portraitOpacity: 0.94 },
];

export function tierIndexForLevel(level: number): number {
  const safe = Number.isFinite(level)
    ? Math.min(MAX_LEVEL, Math.max(0, level))
    : 0;
  if (safe < 5) return 0;
  if (safe < 15) return 1;
  if (safe < 25) return 2;
  return 3;
}

export function clampFrame(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(PREVIEW_MAX_FRAME, Math.max(0, Math.round(value)));
}

export function frameForEffort(index: number, count: number): number {
  if (count <= 1 || !Number.isFinite(index)) return 0;
  const safe = Math.min(count - 1, Math.max(0, Math.round(index)));
  return Math.round((safe / (count - 1)) * PREVIEW_MAX_FRAME);
}

export function nearestEffortIndex(frame: number, efforts: readonly EffortLike[]): number {
  if (efforts.length === 0) return -1;
  const safe = clampFrame(frame);
  let best = 0;
  let distance = Math.abs(safe - frameForEffort(0, efforts.length));
  for (let index = 1; index < efforts.length; index += 1) {
    const next = Math.abs(safe - frameForEffort(index, efforts.length));
    if (next < distance) {
      best = index;
      distance = next;
    }
  }
  return best;
}

export function selectedEffortIndex(
  efforts: readonly EffortLike[],
  selectedId?: string,
  defaultId?: string,
): number {
  const id = selectedId ?? defaultId;
  return id === undefined ? -1 : efforts.findIndex((effort) => effort.id === id);
}

export function portraitBlendForLevel(level: number, anchors: readonly number[]) {
  if (anchors.length === 0) return { lowerIndex: -1, upperIndex: -1, mix: 0 };
  const safeLevel = Number.isFinite(level)
    ? Math.min(anchors[anchors.length - 1], Math.max(anchors[0], level))
    : anchors[0];
  let upperIndex = anchors.findIndex((anchor) => anchor >= safeLevel);
  if (upperIndex < 0) upperIndex = anchors.length - 1;
  const lowerIndex = Math.max(0, upperIndex - (anchors[upperIndex] > safeLevel ? 1 : 0));
  const span = anchors[upperIndex] - anchors[lowerIndex];
  return {
    lowerIndex,
    upperIndex,
    mix: span === 0 ? 0 : (safeLevel - anchors[lowerIndex]) / span,
  };
}

export function liangRankForFrame(rawFrame: number): string {
  const level = (clampFrame(rawFrame) / PREVIEW_MAX_FRAME) * MAX_LEVEL;
  const index = level >= MAX_LEVEL ? LIANG_RANKS.length - 1 : Math.floor(level / 6);
  return LIANG_RANKS[Math.min(LIANG_RANKS.length - 1, Math.max(0, index))];
}

export function indicatorLabel(rawFrame: number, efforts: readonly EffortLike[]): string {
  const effort = efforts[nearestEffortIndex(rawFrame, efforts)];
  // 只显示档位本名（Off/Low/High/Max…），不再叠加“梁X”前缀。
  return effort === undefined
    ? liangRankForFrame(rawFrame)
    : effort.name;
}

function lerp(a: number, b: number, amount: number): number {
  return a + (b - a) * amount;
}

function mix(a: Rgb, b: Rgb, amount: number): Rgb {
  return [
    Math.round(lerp(a[0], b[0], amount)),
    Math.round(lerp(a[1], b[1], amount)),
    Math.round(lerp(a[2], b[2], amount)),
  ];
}

function rgb(value: Rgb, alpha = 1): string {
  return alpha === 1
    ? `rgb(${value[0]} ${value[1]} ${value[2]})`
    : `rgb(${value[0]} ${value[1]} ${value[2]} / ${alpha})`;
}

export function paletteForFrame(rawFrame: number): Palette {
  const frame = clampFrame(rawFrame);
  const level = (frame / PREVIEW_MAX_FRAME) * MAX_LEVEL;
  const tier = tierIndexForLevel(level);
  const ui = TIER_UI_STOPS[tier];
  const stage = tier === 3 ? 5 : tier;
  const page = ui.page;
  const surface = ui.surface;
  const surface2 = ui.surface2;
  const sidebar = mix(page, surface2, 0.25);
  const ink = ui.ink;
  const secondary = ui.secondary;
  const accent: Rgb = ui.accent;
  const accentHover = mix(accent, ink, 0.13);

  return {
    level,
    stage,
    strength: level / MAX_LEVEL,
    page: rgb(page),
    // Keep the shell readable while allowing the right-side portrait to remain
    // visibly present. Dense controls use the opaque layer tokens below.
    base: rgb(page, 0.28),
    layer1: rgb(surface, 0.94),
    layer2: rgb(surface2, 0.96),
    layer3: rgb(surface2, 0.99),
    sidebar: rgb(sidebar, 0.96),
    ink: rgb(ink),
    secondary: rgb(secondary),
    tertiary: rgb(mix(secondary, page, 0.28)),
    border: rgb(ink, 0.12),
    accent: rgb(accent),
    accentHover: rgb(accentHover),
    hover: rgb(ink, 0.07),
    portraitOpacity: String(ui.portraitOpacity),
  };
}
