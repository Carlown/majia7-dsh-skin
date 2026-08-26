import { describe, expect, it } from "vitest";
import {
  frameForEffort,
  indicatorLabel,
  nearestEffortIndex,
  paletteForFrame,
  portraitBlendForLevel,
  selectedEffortIndex,
} from "./logic";

const efforts = [
  { id: "off", name: "Off" },
  { id: "high", name: "High" },
  { id: "max", name: "Max" },
];

describe("滑动变祖 effort mapping", () => {
  it("spreads dynamic effort metadata across all 241 preview frames", () => {
    expect(frameForEffort(0, 3)).toBe(0);
    expect(frameForEffort(1, 3)).toBe(120);
    expect(frameForEffort(2, 3)).toBe(240);
    expect(nearestEffortIndex(119, efforts)).toBe(1);
    expect(nearestEffortIndex(181, efforts)).toBe(2);
  });

  it("recomputes anchors for two-level and five-level models", () => {
    expect([0, 1].map((index) => frameForEffort(index, 2))).toEqual([0, 240]);
    expect([0, 1, 2, 3, 4].map((index) => frameForEffort(index, 5))).toEqual([
      0, 60, 120, 180, 240,
    ]);
  });

  it("uses the provider default only when the current selection omits an effort", () => {
    expect(selectedEffortIndex(efforts, "max", "high")).toBe(2);
    expect(selectedEffortIndex(efforts, undefined, "high")).toBe(1);
    expect(selectedEffortIndex(efforts)).toBe(-1);
  });

  it("switches four tier palettes in step with the tier images", () => {
    // off=灰 / low=原版蓝 / high=亮青 / max=粉，切换点与档位图一致（5/15/25）。
    expect(paletteForFrame(0)).toMatchObject({ stage: 0, strength: 0 });
    expect(paletteForFrame(80)).toMatchObject({ stage: 1, level: 10 });
    expect(paletteForFrame(160)).toMatchObject({ stage: 2, level: 20 });
    expect(paletteForFrame(192)).toMatchObject({ stage: 2, level: 24 });
    expect(paletteForFrame(200)).toMatchObject({ stage: 5, level: 25 });
    expect(paletteForFrame(240)).toMatchObject({ stage: 5, strength: 1 });
    expect(paletteForFrame(0).accent).toBe("rgb(110 110 118)");
    expect(paletteForFrame(80).accent).toBe("rgb(65 118 230)");
    expect(paletteForFrame(160).accent).toBe("rgb(11 165 164)");
    expect(paletteForFrame(80).page).toBe("rgb(245 246 248)");
    expect(paletteForFrame(240).page).toBe("rgb(230 221 222)");
    expect(paletteForFrame(240).ink).toBe("rgb(61 42 47)");
    expect(paletteForFrame(240).accent).toBe("rgb(201 85 111)");
  });

  it("finds the nearest available portrait keys", () => {
    const anchors = [0, 6, 12, 15, 18, 24, 27, 30];
    expect(portraitBlendForLevel(0, anchors)).toEqual({ lowerIndex: 0, upperIndex: 0, mix: 0 });
    expect(portraitBlendForLevel(13.5, anchors)).toEqual({ lowerIndex: 2, upperIndex: 3, mix: 0.5 });
    expect(portraitBlendForLevel(31, anchors)).toEqual({ lowerIndex: 7, upperIndex: 7, mix: 0 });
  });

  it("labels the effort name, falling back to tier names when unbound", () => {
    expect(indicatorLabel(240, efforts)).toBe("Max");
    expect(indicatorLabel(119, efforts)).toBe("High");
    expect(indicatorLabel(240, [])).toBe("Max");
    expect(indicatorLabel(80, [])).toBe("Low");
    expect(indicatorLabel(0, [])).toBe("Off");
    expect(indicatorLabel(160, [])).toBe("High");
  });
});
