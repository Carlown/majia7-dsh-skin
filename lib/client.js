window.__ModuleLoader__.load({id:"dsh-client-majia7-skin",factory:(require)=>{var module={exports:{}};var exports=module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");

// src/client/skin.css
var skin_default = `.liang-skin-backdrop {\r
  position: fixed;\r
  z-index: 0;\r
  inset: 0;\r
  overflow: hidden;\r
  pointer-events: none;\r
  background: var(--liang-page, transparent);\r
  opacity: 0;\r
  transition: opacity 220ms ease, background-color 180ms linear;\r
}\r
\r
body[data-liang-skin="on"] .liang-skin-backdrop {\r
  opacity: 1;\r
}\r
\r
.liang-skin-backdrop img {\r
  position: absolute;\r
  top: 50%;\r
  right: 0;\r
  display: block;\r
  width: min(42vw, 720px);\r
  height: 100vh;\r
  object-fit: cover;\r
  object-position: 50% 42%;\r
  opacity: var(--liang-portrait-opacity, 0.45);\r
  transform: translateY(-50%);\r
  filter: none;\r
  mask-image: linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 20%) 10%, black 30%, black 100%);\r
  transition: filter 180ms linear;\r
}\r
\r
.liang-skin-backdrop img {\r
  display: none;\r
}\r
\r
.liang-skin-backdrop[data-media="sequence"] .liang-skin-sequence-frame {\r
  display: block;\r
  opacity: var(--liang-portrait-opacity, 0.82);\r
}\r
\r
.liang-skin-backdrop[data-media="color"] img {\r
  display: none;\r
}\r
\r
.liang-skin-backdrop::after {\r
  position: absolute;\r
  inset: 0;\r
  content: "";\r
  background: linear-gradient(90deg, var(--liang-page, transparent) 0 28%, transparent 57% 100%);\r
}\r
\r
body[data-liang-skin="on"] {\r
  --dsw-alias-bg-base: var(--liang-bg-base) !important;\r
  --dsw-alias-bg-layer-1: var(--liang-layer-1) !important;\r
  --dsw-alias-bg-layer-2: var(--liang-layer-2) !important;\r
  --dsw-alias-bg-layer-3: var(--liang-layer-3) !important;\r
  --dsw-specific-sidebar-fill: var(--liang-sidebar) !important;\r
  --dsw-alias-label-primary: var(--liang-ink) !important;\r
  --dsw-alias-label-primary-dimmed: var(--liang-ink) !important;\r
  --dsw-alias-label-secondary: var(--liang-secondary) !important;\r
  --dsw-alias-label-tertiary: var(--liang-tertiary) !important;\r
  --dsw-alias-label-caption: var(--liang-tertiary) !important;\r
  --dsw-alias-border-l1: var(--liang-border) !important;\r
  --dsw-alias-border-l2-darkmode-thin: var(--liang-border) !important;\r
  --dsw-alias-border-l2: var(--liang-border) !important;\r
  --dsw-alias-border-l3: var(--liang-border) !important;\r
  --dsw-alias-button-primary-fill: var(--liang-accent) !important;\r
  --dsw-alias-button-primary-hover: var(--liang-accent-hover) !important;\r
  --dsw-alias-button-info-fill: var(--liang-accent) !important;\r
  --dsw-alias-button-info-hover: var(--liang-accent-hover) !important;\r
  --dsw-alias-state-business-primary: var(--liang-accent) !important;\r
  /* \u8BBE\u7F6E\u9875/\u5DE5\u5177\u6761\u6309\u94AE\u539F\u503C\u662F\u4E2D\u6027\u7070\uFF08#54555780 \u7B49\uFF09\uFF0C\u5168\u90E8\u6539\u6302\u6863\u4F4D\u5F3A\u8C03\u8272\u3002 */\r
  --dsw-alias-button-primary-dimmed: color-mix(in srgb, var(--liang-accent) 16%, var(--liang-layer-2)) !important;\r
  --dsw-alias-button-tool-bar-fill: color-mix(in srgb, var(--liang-accent) 32%, transparent) !important;\r
  --dsw-alias-button-tool-bar-fill-invisible: color-mix(in srgb, var(--liang-accent) 14%, transparent) !important;\r
  --dsw-alias-button-tool-bar-hover: color-mix(in srgb, var(--liang-accent) 22%, transparent) !important;\r
  --dsw-alias-button-ghost-active-border: var(--liang-accent) !important;\r
  --dsw-alias-button-ghost-active-fill: var(--liang-hover) !important;\r
  --dsw-alias-button-ghost-active-hover: var(--liang-hover) !important;\r
  --dsw-alias-interactive-bg-hover: var(--liang-hover) !important;\r
  --dsw-alias-interactive-bg-active: var(--liang-hover) !important;\r
  --dsw-alias-button-elevated-fill: var(--liang-layer-1) !important;\r
  --dsw-alias-button-floating-fill: var(--liang-layer-2) !important;\r
  --dsw-alias-button-floating-hover: var(--liang-layer-3) !important;\r
  --dsw-alias-interactive-bg-hover-solid: var(--liang-layer-2) !important;\r
  --dsw-specific-bubble: var(--liang-layer-2) !important;\r
  --dsw-specific-input-major: var(--liang-layer-1) !important;\r
  --dsw-specific-menu: var(--liang-layer-3) !important;\r
  --dsw-specific-selector: var(--liang-layer-2) !important;\r
  --dsw-alias-markdown-citation: var(--liang-layer-2) !important;\r
  --dsw-alias-markdown-code-block-banner: var(--liang-layer-1) !important;\r
  --dsw-alias-markdown-code-block: var(--liang-layer-1) !important;\r
  --dsw-alias-markdown-code-segment-selected: var(--liang-layer-2) !important;\r
  --dsw-alias-markdown-code-segment-unselected: var(--liang-layer-1) !important;\r
  --dsw-alias-markdown-inline-code: var(--liang-layer-2) !important;\r
  --dsw-alias-markdown-placeholder: var(--liang-layer-1) !important;\r
  --dsw-alias-markdown-tag: var(--liang-layer-2) !important;\r
  background: var(--liang-page) !important;\r
}\r
\r
body[data-liang-skin="on"]:is(\r
  [data-liang-stage="0"],\r
  [data-liang-stage="1"],\r
  [data-liang-stage="2"],\r
  [data-liang-stage="3"]\r
) {\r
  /* \u6D45\u8272\u4E09\u6863\u540C\u6837\u8BA9\u54C1\u724C/\u6309\u94AE\u8DDF\u968F\u5F53\u524D\u6863\u4F4D\u5F3A\u8C03\u8272\uFF08\u7070/\u84DD/\u4EAE\u9752\uFF09\uFF0C\u4E0D\u518D\u5199\u6B7B\u539F\u7248\u84DD\u9ED1\u3002 */\r
  --dsw-alias-brand-primary-new-colorprimary-new-color: var(--liang-accent) !important;\r
  --dsw-alias-brand-primary: var(--liang-accent) !important;\r
  --dsw-alias-brand-text: var(--liang-accent) !important;\r
  --dsw-alias-button-primary-fill: var(--liang-accent) !important;\r
  --dsw-alias-button-primary-hover: var(--liang-accent-hover) !important;\r
  --dsw-alias-button-info-fill: var(--liang-accent) !important;\r
  --dsw-alias-button-info-hover: var(--liang-accent-hover) !important;\r
  --dsw-alias-state-business-primary: var(--liang-accent) !important;\r
  --dsw-alias-label-primary-inverted: rgb(255 255 255) !important;\r
  --dsw-alias-button-elevated-fill: rgb(255 255 255) !important;\r
  --dsw-alias-button-floating-fill: rgb(255 255 255) !important;\r
  --dsw-alias-button-floating-hover: var(--liang-layer-2) !important;\r
  --dsw-alias-interactive-bg-hover-solid: var(--liang-layer-2) !important;\r
  --dsw-specific-bubble: var(--liang-layer-2) !important;\r
  --dsw-specific-input-major: rgb(255 255 255) !important;\r
  --dsw-specific-menu: rgb(255 255 255) !important;\r
  --dsw-specific-selector: var(--liang-layer-2) !important;\r
}\r
\r
body[data-liang-skin="on"][data-liang-stage="5"] {\r
  --dsw-alias-brand-primary-new-colorprimary-new-color: #c9556f !important;\r
  --dsw-alias-brand-primary: #c9556f !important;\r
  --dsw-alias-brand-text: #db8fa5 !important;\r
  --dsw-alias-button-info-fill: #c9556f !important;\r
  --dsw-alias-button-info-hover: #db8fa5 !important;\r
  --dsw-alias-state-business-primary: #c9556f !important;\r
  --dsw-alias-bg-module-platform: var(--liang-layer-3) !important;\r
  --dsw-specific-sidebar-nav-item-active: var(--liang-layer-3) !important;\r
  --dsw-specific-sidebar-nav-item-hover: var(--liang-hover) !important;\r
}\r
\r
/* The low-intensity skin is light by default, but it must not turn a dark\r
   Harness document into a light surface. Keep the skin's portrait progression\r
   while switching the shared UI layers back to a readable charcoal palette. */\r
body[data-liang-skin="on"][data-ds-dark-theme]:is(\r
  [data-liang-stage="0"],\r
  [data-liang-stage="1"],\r
  [data-liang-stage="2"],\r
  [data-liang-stage="3"]\r
) {\r
  --liang-page: rgb(17 17 17) !important;\r
  --liang-bg-base: rgb(17 17 17 / 42%) !important;\r
  --liang-layer-1: rgb(30 27 25 / 94%) !important;\r
  --liang-layer-2: rgb(41 35 30 / 96%) !important;\r
  --liang-layer-3: rgb(41 35 30 / 99%) !important;\r
  --liang-sidebar: rgb(23 20 18 / 96%) !important;\r
  --liang-ink: rgb(244 241 232) !important;\r
  --liang-secondary: rgb(184 180 169) !important;\r
  --liang-tertiary: rgb(137 134 126) !important;\r
  --liang-border: rgb(244 241 232 / 15%) !important;\r
  --liang-hover: rgb(244 241 232 / 9%) !important;\r
  --dsw-alias-brand-primary: var(--liang-accent) !important;\r
  --dsw-alias-brand-text: var(--liang-accent) !important;\r
  --dsw-alias-button-primary-fill: var(--liang-accent) !important;\r
  --dsw-alias-button-primary-hover: var(--liang-accent-hover) !important;\r
  --dsw-alias-button-info-fill: var(--liang-accent) !important;\r
  --dsw-alias-button-info-hover: var(--liang-accent-hover) !important;\r
  --dsw-alias-state-business-primary: var(--liang-accent) !important;\r
  --dsw-alias-button-elevated-fill: var(--liang-layer-1) !important;\r
  --dsw-alias-button-floating-fill: var(--liang-layer-2) !important;\r
  --dsw-alias-button-floating-hover: var(--liang-layer-3) !important;\r
  --dsw-alias-interactive-bg-hover-solid: var(--liang-layer-2) !important;\r
  --dsw-specific-bubble: var(--liang-layer-2) !important;\r
  --dsw-specific-input-major: var(--liang-layer-1) !important;\r
  --dsw-specific-menu: var(--liang-layer-3) !important;\r
  --dsw-specific-selector: var(--liang-layer-2) !important;\r
  background: var(--liang-page) !important;\r
}\r
\r
body[data-liang-skin="on"][data-ds-dark-theme]:is(\r
  [data-liang-stage="0"],\r
  [data-liang-stage="1"],\r
  [data-liang-stage="2"],\r
  [data-liang-stage="3"]\r
) .liang-skin-backdrop {\r
  background: var(--liang-page) !important;\r
}\r
\r
body[data-liang-skin="on"][data-ds-dark-theme]:is(\r
  [data-liang-stage="0"],\r
  [data-liang-stage="1"],\r
  [data-liang-stage="2"],\r
  [data-liang-stage="3"]\r
) .liang-skin-backdrop::after {\r
  background: linear-gradient(90deg, var(--liang-page) 0 28%, transparent 57% 100%);\r
}\r
\r
/* The host renders the running-turn label as a clipped blue text gradient.\r
   Retarget only that gradient's color tokens in the custom dark skin; keep\r
   the host's text clipping and shimmer behavior, and leave light mode alone. */\r
body[data-liang-skin="on"][data-liang-stage="5"] [class*="_turnStatus"] {\r
  --dsw-static-deepseek-500: #c9556f !important;\r
  --dsw-static-deepseek-200: #db8fa5 !important;\r
}\r
\r
body[data-liang-skin="on"][data-liang-stage="5"] [class*="_turnStatusClock"] {\r
  color: #c9556f !important;\r
  -webkit-text-fill-color: #c9556f !important;\r
}\r
\r
/* Preserve the wordmark badge contrast in the low-intensity shell. */\r
body[data-liang-skin="on"]:is(\r
  [data-liang-stage="0"],\r
  [data-liang-stage="1"],\r
  [data-liang-stage="2"],\r
  [data-liang-stage="3"]\r
) button[aria-label="\u65B0\u5EFA\u4F1A\u8BDD"] svg[viewBox="0 0 182 24"] > rect[width="52"] {\r
  fill: var(--liang-accent) !important;\r
}\r
\r
body[data-liang-skin="on"]:is(\r
  [data-liang-stage="0"],\r
  [data-liang-stage="1"],\r
  [data-liang-stage="2"],\r
  [data-liang-stage="3"]\r
) button[aria-label="\u65B0\u5EFA\u4F1A\u8BDD"] svg[viewBox="0 0 182 24"] > g[clip-path*="badge"] path {\r
  fill: rgb(249 250 251) !important;\r
}\r
\r
body[data-liang-skin="on"][data-liang-stage="5"] button[aria-label="\u65B0\u5EFA\u4F1A\u8BDD"] svg[viewBox="0 0 182 24"] > rect[width="52"] {\r
  fill: #c9556f !important;\r
}\r
\r
body[data-liang-skin="on"][data-liang-stage="5"] button[aria-label="\u65B0\u5EFA\u4F1A\u8BDD"] svg[viewBox="0 0 182 24"] > g[clip-path*="badge"] path {\r
  fill: #fff7f9 !important;\r
}\r
\r
body[data-liang-skin="on"][data-liang-stage="5"] [aria-label^="\u9009\u62E9\u6A21\u578B"] > span:nth-of-type(2) {\r
  color: #db8fa5 !important;\r
}\r
\r
body[data-liang-skin="on"][data-liang-stage="5"] [class*="heroGlow"] ellipse {\r
  fill: #c9556f !important;\r
  fill-opacity: 0.16 !important;\r
}\r
\r
body[data-liang-skin="on"][data-liang-stage="5"] span[class*="_previewBadge"] {\r
  color: #ffffff !important;\r
  background: #c9556f !important;\r
}\r
\r
/* \u53D1\u9001\u6309\u94AE\uFF1A\u6240\u6709\u6863\u4F4D\u90FD\u7528\u5F53\u524D\u5F3A\u8C03\u8272\u586B\u5145\uFF0C\u60AC\u505C\u52A0\u6DF1\uFF0C\u7981\u7528\u534A\u900F\u660E\u3002 */\r
body[data-liang-skin="on"] button[aria-label="\u53D1\u9001\u6D88\u606F"] {\r
  background: var(--liang-accent) !important;\r
  color: #ffffff !important;\r
}\r
\r
body[data-liang-skin="on"] button[aria-label="\u53D1\u9001\u6D88\u606F"]:hover:not(:disabled) {\r
  background: var(--liang-accent-hover) !important;\r
}\r
\r
body[data-liang-skin="on"][data-liang-stage="5"] button[aria-label="\u53D1\u9001\u6D88\u606F"]:disabled {\r
  opacity: 0.62;\r
}\r
\r
body[data-liang-skin="on"]:is(\r
  [data-liang-stage="0"],\r
  [data-liang-stage="1"],\r
  [data-liang-stage="2"],\r
  [data-liang-stage="3"]\r
) button[aria-label="\u53D1\u9001\u6D88\u606F"]:disabled {\r
  color: rgb(255 255 255 / 92%) !important;\r
  background: color-mix(in srgb, var(--liang-accent) 42%, transparent) !important;\r
  opacity: 1;\r
}\r
\r
body[data-liang-skin="on"] > #root {\r
  position: relative;\r
  z-index: 1;\r
  background: transparent !important;\r
}\r
\r
body[data-liang-skin="on"] button,\r
body[data-liang-skin="on"] input,\r
body[data-liang-skin="on"] textarea {\r
  transition: color 160ms linear, background-color 160ms linear, border-color 160ms linear;\r
}\r
\r
/* The composer card has a native theme-mode fill, so keep its surface and\r
   readable ink aligned with the active Liang palette. */\r
body[data-liang-skin="on"]:is(\r
  [data-liang-stage="0"],\r
  [data-liang-stage="1"],\r
  [data-liang-stage="2"],\r
  [data-liang-stage="3"]\r
) [data-composer-card="true"] {\r
  border-color: var(--liang-border) !important;\r
  color: var(--liang-ink) !important;\r
  background: var(--liang-layer-1) !important;\r
  box-shadow: 0 8px 28px rgb(20 22 20 / 8%);\r
}\r
\r
body[data-liang-skin="on"]:is(\r
  [data-liang-stage="0"],\r
  [data-liang-stage="1"],\r
  [data-liang-stage="2"],\r
  [data-liang-stage="3"]\r
) [data-composer-card="true"] :is(textarea, button, [data-input-mirror="true"]) {\r
  color: var(--liang-ink) !important;\r
  caret-color: var(--liang-accent) !important;\r
}\r
\r
body[data-liang-skin="on"]:is(\r
  [data-liang-stage="0"],\r
  [data-liang-stage="1"],\r
  [data-liang-stage="2"],\r
  [data-liang-stage="3"]\r
) [data-composer-card="true"] textarea::placeholder {\r
  color: var(--liang-tertiary) !important;\r
  opacity: 1;\r
}\r
\r
.liang-effort-control {\r
  --liang-control-accent: var(--dsw-alias-brand-primary-new-colorprimary-new-color, #4176e6);\r
  --liang-control-rail: var(--dsw-alias-border-l3, rgb(0 0 0 / 16%));\r
  position: relative;\r
  display: flex;\r
  width: 124px;\r
  height: 28px;\r
  align-items: center;\r
  margin: 0 3px;\r
  overflow: visible;\r
}\r
\r
body[data-liang-skin="on"] .liang-effort-control {\r
  --liang-control-accent: var(--liang-secondary);\r
  --liang-control-rail: color-mix(in srgb, var(--liang-secondary) 28%, transparent);\r
}\r
\r
.liang-effort-control__ticks {\r
  position: absolute;\r
  z-index: 0;\r
  inset: 0 10px;\r
  pointer-events: none;\r
}\r
\r
.liang-effort-control__ticks::before {\r
  position: absolute;\r
  top: 50%;\r
  right: 0;\r
  left: 0;\r
  height: 1px;\r
  content: "";\r
  background: var(--liang-control-rail);\r
  transform: translateY(-50%);\r
}\r
\r
.liang-effort-control__tooltip {\r
  position: absolute;\r
  z-index: 4;\r
  bottom: calc(100% + 7px);\r
  left: calc(10px + (100% - 20px) * var(--liang-slider-ratio));\r
  min-width: max-content;\r
  padding: 5px 8px;\r
  border: 1px solid var(--liang-border, rgb(0 0 0 / 12%));\r
  border-radius: 7px;\r
  color: var(--liang-ink, #171816);\r
  background: var(--liang-layer-1, #fff);\r
  box-shadow: 0 5px 16px rgb(0 0 0 / 16%);\r
  font-size: 11px;\r
  font-weight: 600;\r
  line-height: 16px;\r
  letter-spacing: 0.01em;\r
  pointer-events: none;\r
  transform: translateX(-50%);\r
  white-space: nowrap;\r
}\r
\r
.liang-effort-control__tooltip::after {\r
  position: absolute;\r
  top: 100%;\r
  left: 50%;\r
  width: 7px;\r
  height: 7px;\r
  content: "";\r
  background: inherit;\r
  transform: translate(-50%, -4px) rotate(45deg);\r
}\r
\r
.liang-effort-control__tick {\r
  position: absolute;\r
  top: 50%;\r
  width: 1px;\r
  height: 7px;\r
  background: var(--liang-control-accent);\r
  opacity: 0.42;\r
  transform: translate(-50%, -50%);\r
}\r
\r
.liang-effort-control__range {\r
  position: relative;\r
  z-index: 1;\r
  width: calc(100% - 7px);\r
  height: 28px;\r
  margin: 0 3.5px;\r
  cursor: ew-resize;\r
  appearance: none;\r
  background: transparent;\r
  touch-action: pan-y;\r
}\r
\r
.liang-effort-control__range:disabled {\r
  cursor: progress;\r
  opacity: 0.58;\r
}\r
\r
.liang-effort-control__range::-webkit-slider-runnable-track {\r
  height: 1px;\r
  border-radius: 1px;\r
  background: transparent;\r
}\r
\r
.liang-effort-control__range::-webkit-slider-thumb {\r
  width: 13px;\r
  height: 13px;\r
  margin-top: -6px;\r
  border: 1.5px solid color-mix(in srgb, var(--liang-control-accent) 72%, transparent);\r
  border-radius: 50%;\r
  appearance: none;\r
  background: radial-gradient(circle, var(--liang-control-accent) 0 2px, color-mix(in srgb, var(--liang-control-accent) 22%, var(--dsw-alias-bg-layer-1, #fff)) 2.5px);\r
  box-shadow: 0 1px 4px rgb(0 0 0 / 14%);\r
}\r
\r
body[data-liang-skin="on"] .liang-effort-control__range::-webkit-slider-thumb {\r
  width: 13px;\r
  height: 13px;\r
  margin-top: -6px;\r
  border-color: color-mix(in srgb, var(--liang-control-accent) 72%, transparent);\r
  background: radial-gradient(circle, var(--liang-control-accent) 0 2px, color-mix(in srgb, var(--liang-control-accent) 22%, var(--liang-layer-1)) 2.5px);\r
}\r
\r
.liang-effort-control__range::-moz-range-track {\r
  height: 1px;\r
  background: transparent;\r
}\r
\r
.liang-effort-control__range::-moz-range-progress {\r
  height: 1px;\r
  background: transparent;\r
}\r
\r
.liang-effort-control__range::-moz-range-thumb {\r
  width: 11px;\r
  height: 11px;\r
  border: 1.5px solid color-mix(in srgb, var(--liang-control-accent) 72%, transparent);\r
  border-radius: 50%;\r
  background: color-mix(in srgb, var(--liang-control-accent) 24%, var(--dsw-alias-bg-layer-1, #fff));\r
}\r
\r
.liang-effort-control__range:focus-visible {\r
  outline: none;\r
}\r
\r
.liang-effort-control[data-state="error"] {\r
  --liang-control-accent: var(--dsw-alias-state-error-primary, #e43c3c);\r
}\r
\r
.liang-appearance-choice {\r
  box-sizing: border-box;\r
  border: 1px solid var(--dsw-alias-border-l2);\r
  flex: 180px;\r
  flex-direction: column;\r
  justify-content: center;\r
  align-items: center;\r
  gap: 4px;\r
  padding: 20px 32px;\r
  border-radius: 16px;\r
  font: inherit;\r
  color: var(--dsw-alias-label-primary);\r
  cursor: pointer;\r
  background: transparent;\r
  font-size: 14px;\r
  line-height: 22px;\r
  display: flex;\r
}\r
\r
[class*="_8HJdBW_cubeRow"]:has(.liang-appearance-choice) {\r
  display: grid;\r
  grid-template-columns: repeat(4, minmax(0, 1fr));\r
}\r
\r
.liang-appearance-choice:hover:not([aria-pressed="true"]) {\r
  background: var(--dsw-alias-interactive-bg-hover);\r
}\r
\r
.liang-appearance-choice[aria-pressed="true"] {\r
  border-color: var(--liang-accent);\r
  background: var(--liang-accent);\r
}\r
\r
.liang-appearance-choice__icon {\r
  display: block;\r
  flex: 0 0 16px;\r
  width: 16px;\r
  height: 16px;\r
  color: currentColor;\r
  font-size: 16px;\r
  line-height: 16px;\r
}\r
\r
.liang-appearance-choice__label {\r
  display: block;\r
}\r
\r
/* Keep the host's three theme cubes untouched. These rules only style the\r
   fourth button that is appended to the host cube row. */\r
.liang-appearance-choice:disabled {\r
  cursor: progress;\r
  opacity: 0.7;\r
}\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
/* \u80CC\u666F\u6DF1\u5EA6\u8C03\u8282\u884C\uFF1A\u4E0E\u7ED1\u5B9A\u5F00\u5173\u540C\u7EC4\uFF0C\u6ED1\u5757\u5B9E\u65F6\u63A7\u5236 --liang-portrait-opacity\u3002 */\r
.liang-appearance-depth {\r
  display: flex;\r
  width: 100%;\r
  align-items: center;\r
  gap: 10px;\r
  margin-top: 8px;\r
  font-size: 13px;\r
  color: var(--dsw-alias-label-primary, inherit);\r
}\r
\r
.liang-appearance-depth__label {\r
  flex: 0 0 auto;\r
  min-width: 0;\r
  overflow: hidden;\r
  text-overflow: ellipsis;\r
  white-space: nowrap;\r
}\r
\r
.liang-appearance-depth__input {\r
  flex: 1 1 auto;\r
  min-width: 120px;\r
  height: 20px;\r
  margin: 0;\r
  cursor: pointer;\r
  accent-color: var(--liang-accent);\r
}\r
\r
.liang-appearance-depth__input:disabled {\r
  cursor: progress;\r
  opacity: 0.7;\r
}\r
\r
.liang-appearance-depth__value {\r
  flex: 0 0 42px;\r
  text-align: right;\r
  font-variant-numeric: tabular-nums;\r
  color: var(--dsw-alias-label-secondary, var(--liang-secondary));\r
  font-size: 12px;\r
}\r
\r
/* \u8BBE\u7F6E\uFF08\u9F7F\u8F6E\uFF09\u7B49\u4FA7\u680F\u64CD\u4F5C\u6309\u94AE\u8DDF\u968F\u6863\u4F4D\u5F3A\u8C03\u8272\uFF1Bsvg \u901A\u5E38\u7EE7\u627F currentColor\u3002 */\r
body[data-liang-skin="on"] button[aria-label="\u8BBE\u7F6E"],\r
body[data-liang-skin="on"] button[aria-label*="\u8BBE\u7F6E"],\r
body[data-liang-skin="on"] [aria-label^="\u8BBE\u7F6E"] {\r
  color: var(--liang-accent) !important;\r
}\r
\r
body[data-liang-skin="on"] button[aria-label="\u8BBE\u7F6E"]:hover,\r
body[data-liang-skin="on"] button[aria-label*="\u8BBE\u7F6E"]:hover {\r
  color: var(--liang-accent-hover) !important;\r
}\r
\r
\r
/* \u6863\u4F4D\u4EBA\u8BBE\u5F00\u5173\u884C\uFF1A\u4E0E\u7ED1\u5B9A/\u6DF1\u5EA6\u540C\u7EC4\u3002 */\r
.liang-appearance-persona {\r
  display: flex;\r
  width: 100%;\r
  align-items: center;\r
  gap: 10px;\r
  margin-top: 8px;\r
  font-size: 13px;\r
}\r
\r
.liang-appearance-persona__label {\r
  flex: 1 1 auto;\r
  min-width: 0;\r
  overflow: hidden;\r
  text-overflow: ellipsis;\r
  white-space: nowrap;\r
}\r
\r
.liang-appearance-persona__input {\r
  flex: 0 0 36px;\r
  width: 36px;\r
  height: 20px;\r
  margin: 0;\r
  cursor: pointer;\r
  accent-color: var(--liang-accent);\r
}\r
\r
.liang-appearance-persona__input:disabled {\r
  cursor: progress;\r
  opacity: 0.7;\r
}\r
\r
@media (max-width: 760px) {\r
  .liang-effort-control {\r
    width: 92px;\r
  }\r
\r
  .liang-skin-backdrop img {\r
    right: -18vw;\r
    width: 92vw;\r
    opacity: calc(var(--liang-portrait-opacity, 0.45) * 0.72);\r
  }\r
\r
}\r
\r
@media (prefers-reduced-motion: reduce) {\r
  .liang-skin-backdrop,\r
  .liang-skin-backdrop img,\r
  body[data-liang-skin="on"] button,\r
  body[data-liang-skin="on"] input,\r
  body[data-liang-skin="on"] textarea {\r
    transition: none;\r
  }\r
}\r
`;

// src/client/logic.ts
var PREVIEW_MAX_FRAME = 240;
var MAX_LEVEL = 30;
var TIER_UI_STOPS = [
  { at: 0, page: [224, 224, 226], surface: [240, 240, 242], surface2: [230, 230, 233], ink: [45, 45, 48], secondary: [124, 124, 130], accent: [110, 110, 118], portraitOpacity: 0.92 },
  { at: 10, page: [245, 246, 248], surface: [255, 255, 255], surface2: [245, 246, 247], ink: [30, 32, 38], secondary: [104, 110, 122], accent: [65, 118, 230], portraitOpacity: 0.93 },
  { at: 20, page: [240, 251, 250], surface: [252, 255, 254], surface2: [233, 247, 245], ink: [16, 54, 50], secondary: [94, 138, 132], accent: [11, 165, 164], portraitOpacity: 0.94 },
  { at: 30, page: [230, 221, 222], surface: [248, 242, 243], surface2: [238, 229, 231], ink: [61, 42, 47], secondary: [138, 110, 116], accent: [201, 85, 111], portraitOpacity: 0.94 }
];
function tierIndexForLevel(level) {
  const safe = Number.isFinite(level) ? Math.min(MAX_LEVEL, Math.max(0, level)) : 0;
  if (safe < 5) return 0;
  if (safe < 15) return 1;
  if (safe < 25) return 2;
  return 3;
}
function clampFrame(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(PREVIEW_MAX_FRAME, Math.max(0, Math.round(value)));
}
function frameForEffort(index, count) {
  if (count <= 1 || !Number.isFinite(index)) return 0;
  const safe = Math.min(count - 1, Math.max(0, Math.round(index)));
  return Math.round(safe / (count - 1) * PREVIEW_MAX_FRAME);
}
function nearestEffortIndex(frame, efforts) {
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
function selectedEffortIndex(efforts, selectedId, defaultId) {
  const id = selectedId ?? defaultId;
  return id === void 0 ? -1 : efforts.findIndex((effort) => effort.id === id);
}
function portraitBlendForLevel(level, anchors) {
  if (anchors.length === 0) return { lowerIndex: -1, upperIndex: -1, mix: 0 };
  const safeLevel = Number.isFinite(level) ? Math.min(anchors[anchors.length - 1], Math.max(anchors[0], level)) : anchors[0];
  let upperIndex = anchors.findIndex((anchor) => anchor >= safeLevel);
  if (upperIndex < 0) upperIndex = anchors.length - 1;
  const lowerIndex = Math.max(0, upperIndex - (anchors[upperIndex] > safeLevel ? 1 : 0));
  const span = anchors[upperIndex] - anchors[lowerIndex];
  return {
    lowerIndex,
    upperIndex,
    mix: span === 0 ? 0 : (safeLevel - anchors[lowerIndex]) / span
  };
}
var TIER_LABELS = ["Off", "Low", "High", "Max"];
function indicatorLabel(rawFrame, efforts) {
  const effort = efforts[nearestEffortIndex(rawFrame, efforts)];
  if (effort !== void 0) return effort.name;
  const frame = clampFrame(rawFrame);
  const tier = tierIndexForLevel(frame / PREVIEW_MAX_FRAME * MAX_LEVEL);
  return TIER_LABELS[tier];
}
function lerp(a, b, amount) {
  return a + (b - a) * amount;
}
function mix(a, b, amount) {
  return [
    Math.round(lerp(a[0], b[0], amount)),
    Math.round(lerp(a[1], b[1], amount)),
    Math.round(lerp(a[2], b[2], amount))
  ];
}
function rgb(value, alpha = 1) {
  return alpha === 1 ? `rgb(${value[0]} ${value[1]} ${value[2]})` : `rgb(${value[0]} ${value[1]} ${value[2]} / ${alpha})`;
}
function paletteForFrame(rawFrame) {
  const frame = clampFrame(rawFrame);
  const level = frame / PREVIEW_MAX_FRAME * MAX_LEVEL;
  const tier = tierIndexForLevel(level);
  const ui = TIER_UI_STOPS[tier];
  const stage = tier === 3 ? 5 : tier;
  const page = ui.page;
  const surface = ui.surface;
  const surface2 = ui.surface2;
  const sidebar = mix(page, surface2, 0.25);
  const ink = ui.ink;
  const secondary = ui.secondary;
  const accent = ui.accent;
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
    portraitOpacity: String(ui.portraitOpacity)
  };
}

// src/client/index.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var PACKAGE_ID = "dsh-client-majia7-skin";
var LOCALE_NAMESPACE = "liang.skin";
var ASSET_PREFIX = `/plugins/${PACKAGE_ID}/assets`;
var FIRST_PORTRAIT_FILE = "tier-v1/tier-00-none.jpg";
var BACKDROP_DEPTH_KEY = "dsh-liang-intensity-skin.backdrop-depth";
var PERSONA_KEY = "dsh-liang-intensity-skin.persona";
var PERSONA_ROUTE = "/api/plugins/majia7-dsh/persona";
var PORTRAIT_ANCHORS = [
  { level: 0, file: "tier-v1/tier-00-none.jpg" },
  { level: 10, file: "tier-v1/tier-10-low.png" },
  { level: 20, file: "tier-v1/tier-20-high.jpeg" },
  { level: 30, file: "tier-v1/tier-30-max.jpg" }
];
var ANCHOR_LEVELS = PORTRAIT_ANCHORS.map((anchor) => anchor.level);
var cssVariables = [
  "--liang-strength",
  "--liang-page",
  "--liang-bg-base",
  "--liang-layer-1",
  "--liang-layer-2",
  "--liang-layer-3",
  "--liang-sidebar",
  "--liang-ink",
  "--liang-secondary",
  "--liang-tertiary",
  "--liang-border",
  "--liang-accent",
  "--liang-accent-hover",
  "--liang-hover",
  "--liang-portrait-opacity"
];
var SkinPresenter = class {
  scope;
  theme;
  root;
  portrait;
  preloads;
  portraitReady = false;
  enabled = true;
  // Default to the max frame so the first paint after load is the dark shell;
  // starting at 0 flashed the light palette before the directory resolved.
  frame = PREVIEW_MAX_FRAME;
  pendingFrame = PREVIEW_MAX_FRAME;
  raf = 0;
  disposed = false;
  unsubscribe;
  constructor(scope, theme) {
    this.scope = scope;
    this.theme = theme;
    this.root = document.createElement("div");
    this.root.className = "liang-skin-backdrop";
    this.root.dataset.plugin = PACKAGE_ID;
    this.root.dataset.media = "sequence";
    this.root.setAttribute("aria-hidden", "true");
    this.portrait = document.createElement("img");
    this.portrait.className = "liang-skin-sequence-frame";
    this.portrait.alt = "";
    this.portrait.draggable = false;
    this.portrait.decoding = "async";
    this.portrait.src = `${ASSET_PREFIX}/${FIRST_PORTRAIT_FILE}`;
    this.portrait.addEventListener("error", this.handleSequenceError);
    this.preloads = PORTRAIT_ANCHORS.map(({ file }) => {
      const image = new Image();
      image.loading = "eager";
      image.decoding = "async";
      image.src = `${ASSET_PREFIX}/${file}`;
      return image;
    });
    void Promise.all(this.preloads.map((image) => image.decode())).then(
      () => {
        if (this.disposed) return;
        this.portraitReady = true;
        this.root.dataset.media = "sequence";
        this.updatePortrait(paletteForFrame(this.frame).level);
      },
      () => {
      }
    );
    this.root.append(this.portrait);
    document.body.prepend(this.root);
    this.unsubscribe = scope.subscribe(() => this.syncSettings());
    this.syncSettings();
  }
  handleSequenceError = () => {
    if (this.portrait.src.endsWith(FIRST_PORTRAIT_FILE)) {
      this.root.dataset.media = "color";
      return;
    }
    this.portraitReady = false;
    this.portrait.src = `${ASSET_PREFIX}/${FIRST_PORTRAIT_FILE}`;
    this.root.dataset.media = "sequence";
  };
  syncSettings() {
    this.setEnabled(this.scope.getSnapshot().enabled);
  }
  isEnabled() {
    return this.enabled;
  }
  getFrame() {
    return this.frame;
  }
  setEnabled(enabled) {
    this.enabled = enabled;
    if (enabled) {
      if (!this.root.isConnected) document.body.prepend(this.root);
      document.body.dataset.liangSkin = "on";
      this.applyFrame();
    } else {
      this.root.remove();
      delete document.body.dataset.liangSkin;
      delete document.body.dataset.liangStage;
      for (const name of cssVariables) document.body.style.removeProperty(name);
    }
  }
  setFrame(frame) {
    this.pendingFrame = Math.min(PREVIEW_MAX_FRAME, Math.max(0, Math.round(frame)));
    this.frame = this.pendingFrame;
    if (!this.enabled) return;
    if (this.raf !== 0) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.frame = this.pendingFrame;
      this.applyFrame();
    });
  }
  applyFrame() {
    const palette = paletteForFrame(this.frame);
    const body = document.body;
    this.syncNativeTheme("light");
    body.dataset.liangStage = String(palette.stage);
    body.style.setProperty("--liang-strength", String(palette.strength));
    body.style.setProperty("--liang-page", palette.page);
    body.style.setProperty("--liang-bg-base", palette.base);
    body.style.setProperty("--liang-layer-1", palette.layer1);
    body.style.setProperty("--liang-layer-2", palette.layer2);
    body.style.setProperty("--liang-layer-3", palette.layer3);
    body.style.setProperty("--liang-sidebar", palette.sidebar);
    body.style.setProperty("--liang-ink", palette.ink);
    body.style.setProperty("--liang-secondary", palette.secondary);
    body.style.setProperty("--liang-tertiary", palette.tertiary);
    body.style.setProperty("--liang-border", palette.border);
    body.style.setProperty("--liang-accent", palette.accent);
    body.style.setProperty("--liang-accent-hover", palette.accentHover);
    body.style.setProperty("--liang-hover", palette.hover);
    body.style.setProperty("--liang-portrait-opacity", String(
      Number(palette.portraitOpacity) * this.scope.getSnapshot().backdropDepth
    ));
    this.updatePortrait(palette.level);
    syncPersonaReport(this.scope);
  }
  syncNativeTheme(theme = "light") {
    if (!this.enabled || this.theme.getTheme().preference === theme) return;
    this.theme.setTheme(theme);
  }
  updatePortrait(level) {
    if (!this.portraitReady) return;
    const { lowerIndex, upperIndex, mix: mix2 } = portraitBlendForLevel(
      level,
      ANCHOR_LEVELS
    );
    const lower = PORTRAIT_ANCHORS[lowerIndex];
    const upper = PORTRAIT_ANCHORS[upperIndex];
    const selected = mix2 >= 0.5 ? upper : lower;
    const source = `${ASSET_PREFIX}/${selected.file}`;
    if (this.portrait.getAttribute("src") !== source) this.portrait.src = source;
  }
  async choose(enabled) {
    this.setEnabled(enabled);
    try {
      await this.scope.set(enabled);
    } catch (error) {
      this.syncSettings();
      throw error;
    }
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.unsubscribe();
    if (this.raf !== 0) cancelAnimationFrame(this.raf);
    this.portrait.removeEventListener("error", this.handleSequenceError);
    for (const image of this.preloads) image.src = "";
    this.root.remove();
    document.body.removeAttribute("data-liang-skin");
    delete document.body.dataset.liangStage;
    for (const name of cssVariables) document.body.style.removeProperty(name);
  }
};
function modelReasoning(state) {
  const current = state.current;
  if (current === null) return null;
  const group = state.groups.find((item) => item.id === current.provider);
  const model = group?.models.find((item) => item.id === current.model);
  if (model?.reasoning === void 0) return null;
  return {
    selection: current,
    efforts: model.reasoning.efforts,
    defaultEffort: model.reasoning.defaultEffort
  };
}
function LiangEffortSlider({ directory, load, select, presenter, scope }) {
  const state = (0, import_react.useSyncExternalStore)(
    (listener) => directory.subscribe(listener),
    () => directory.getSnapshot()
  );
  const skin = (0, import_react.useSyncExternalStore)(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot()
  );
  const reasoning = (0, import_react.useMemo)(() => modelReasoning(state), [state]);
  const efforts = reasoning?.efforts ?? [];
  const committedIndex = selectedEffortIndex(
    efforts,
    reasoning?.selection.reasoningEffort,
    reasoning?.defaultEffort
  );
  const committedFrame = committedIndex < 0 ? PREVIEW_MAX_FRAME : frameForEffort(committedIndex, efforts.length);
  const bindEffort = skin.bindEffort;
  const [frame, setFrame] = (0, import_react.useState)(() => bindEffort ? committedFrame : presenter.getFrame());
  const [pending, setPending] = (0, import_react.useState)(false);
  const [failed, setFailed] = (0, import_react.useState)(false);
  const [interacting, setInteracting] = (0, import_react.useState)(false);
  const dragging = (0, import_react.useRef)(false);
  const dragStartFrame = (0, import_react.useRef)(frame);
  const enabled = skin.enabled;
  (0, import_react.useEffect)(() => {
    if (enabled) load();
  }, [enabled, load]);
  (0, import_react.useEffect)(() => {
    if (!bindEffort || dragging.current || pending) return;
    setFrame(committedFrame);
    presenter.setFrame(committedFrame);
  }, [bindEffort, committedFrame, pending, presenter]);
  if (!enabled) return null;
  if (bindEffort && (reasoning === null || efforts.length < 2)) return null;
  const previewIndex = nearestEffortIndex(frame, efforts);
  const previewEffort = efforts[previewIndex];
  const progressRatio = frame / PREVIEW_MAX_FRAME;
  const tooltipLabel = indicatorLabel(frame, bindEffort ? efforts : []);
  const commit = async (rawFrame) => {
    if (!bindEffort) {
      dragging.current = false;
      setFrame(rawFrame);
      presenter.setFrame(rawFrame);
      return;
    }
    const targetIndex = nearestEffortIndex(rawFrame, efforts);
    const target = efforts[targetIndex];
    if (target === void 0) return;
    const targetFrame = frameForEffort(targetIndex, efforts.length);
    dragging.current = false;
    setFrame(targetFrame);
    presenter.setFrame(targetFrame);
    if (targetIndex === committedIndex || pending) return;
    setPending(true);
    setFailed(false);
    const accepted = await select({
      provider: reasoning.selection.provider,
      model: reasoning.selection.model,
      reasoningEffort: target.id
    });
    setPending(false);
    if (!accepted) {
      setFailed(true);
      setFrame(committedFrame);
      presenter.setFrame(committedFrame);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "liang-effort-control",
      "data-plugin": PACKAGE_ID,
      "data-state": failed ? "error" : pending ? "pending" : "ready",
      title: bindEffort ? previewEffort?.name : void 0,
      children: [
        interacting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "output",
          {
            className: "liang-effort-control__tooltip",
            style: { "--liang-slider-ratio": progressRatio },
            children: tooltipLabel
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "liang-effort-control__ticks", "aria-hidden": "true", children: efforts.map((effort, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "i",
          {
            className: "liang-effort-control__tick",
            style: { left: `${frameForEffort(index, efforts.length) / PREVIEW_MAX_FRAME * 100}%` }
          },
          effort.id
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            className: "liang-effort-control__range",
            type: "range",
            min: 0,
            max: PREVIEW_MAX_FRAME,
            step: 1,
            value: frame,
            disabled: pending || state.status === "selecting",
            "aria-label": bindEffort ? "\u601D\u8003\u7B49\u7EA7" : "\u76AE\u80A4\u8FDB\u5EA6",
            "aria-valuetext": bindEffort ? previewEffort?.name ?? "" : tooltipLabel,
            onPointerDown: () => {
              dragging.current = true;
              dragStartFrame.current = frame;
              setInteracting(true);
            },
            onInput: (event) => {
              dragging.current = true;
              const next = Number(event.currentTarget.value);
              setFrame(next);
              presenter.setFrame(next);
            },
            onPointerUp: (event) => {
              setInteracting(false);
              void commit(Number(event.currentTarget.value));
            },
            onPointerCancel: () => {
              setInteracting(false);
              dragging.current = false;
              setFrame(dragStartFrame.current);
              presenter.setFrame(dragStartFrame.current);
            },
            onKeyUp: (event) => {
              setInteracting(false);
              if (event.key !== "Escape") void commit(Number(event.currentTarget.value));
            },
            onBlur: (event) => {
              setInteracting(false);
              if (dragging.current) void commit(Number(event.currentTarget.value));
            },
            onKeyDown: (event) => {
              setInteracting(true);
              if (event.key === "Escape" && !pending) {
                setInteracting(false);
                dragging.current = false;
                setFrame(dragStartFrame.current);
                presenter.setFrame(dragStartFrame.current);
              }
            }
          }
        )
      ]
    }
  );
}
var NATIVE_APPEARANCE_GROUP = '[class*="_8HJdBW_group"]';
var NATIVE_APPEARANCE_ROW = '[class*="_8HJdBW_cubeRow"]';
var LIANG_APPEARANCE_BUTTON = "liang-appearance-choice";
function installLiangAppearanceButton(scope, presenter) {
  let pending = false;
  const hookedNativeButtons = /* @__PURE__ */ new Set();
  const nativeClickHandlers = /* @__PURE__ */ new Map();
  const sync = () => {
    const groups = [...document.querySelectorAll(NATIVE_APPEARANCE_GROUP)];
    const group = groups.find((node) => node.querySelector('[class*="_8HJdBW_themeCube"]')) ?? groups[0] ?? null;
    if (group === null) return;
    const row = group.querySelector(NATIVE_APPEARANCE_ROW);
    const snapshot = scope.getSnapshot();
    let customButton = null;
    if (row !== null) {
      customButton = row.querySelector(`.${LIANG_APPEARANCE_BUTTON}`);
      if (customButton === null) {
        customButton = document.createElement("button");
        customButton.className = LIANG_APPEARANCE_BUTTON;
        customButton.type = "button";
        customButton.dataset.plugin = PACKAGE_ID;
        customButton.setAttribute("aria-label", "\u9A6C\u52A0\u4E03\u76AE\u80A4");
        const icon = document.createElement("span");
        icon.className = "liang-appearance-choice__icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "\u25C8";
        const label = document.createElement("span");
        label.className = "liang-appearance-choice__label";
        label.textContent = "\u9A6C\u52A0\u4E03\u76AE\u80A4";
        customButton.append(icon, label);
        customButton.addEventListener("click", () => {
          if (pending || scope.getSnapshot().enabled) return;
          pending = true;
          sync();
          void presenter.choose(true).finally(() => {
            pending = false;
            sync();
          });
        });
      }
    }
    if (row !== null && customButton !== null) {
      if (customButton.parentElement !== row) row.append(customButton);
      customButton.disabled = pending;
      customButton.setAttribute("aria-pressed", String(snapshot.enabled));
    }
    let depthControl = group.querySelector(".liang-appearance-depth");
    if (!snapshot.enabled) {
      depthControl?.remove();
    } else {
      if (depthControl === null) {
        depthControl = document.createElement("label");
        depthControl.className = "liang-appearance-depth";
        depthControl.dataset.plugin = PACKAGE_ID;
        const depthLabel = document.createElement("span");
        depthLabel.className = "liang-appearance-depth__label";
        const depthText = document.documentElement.lang.toLowerCase().startsWith("en") ? "Backdrop depth" : "\u80CC\u666F\u6DF1\u5EA6";
        depthLabel.textContent = depthText;
        const depthInput2 = document.createElement("input");
        depthInput2.className = "liang-appearance-depth__input";
        depthInput2.type = "range";
        depthInput2.min = "0";
        depthInput2.max = "100";
        depthInput2.step = "5";
        depthInput2.setAttribute("aria-label", depthText);
        const depthValue2 = document.createElement("output");
        depthValue2.className = "liang-appearance-depth__value";
        depthInput2.addEventListener("input", () => {
          depthValue2.textContent = `${depthInput2.value}%`;
          void scope.setBackdropDepth(Number(depthInput2.value) / 100).catch(() => sync());
        });
        depthControl.append(depthLabel, depthInput2, depthValue2);
        group.append(depthControl);
      }
      const depthInput = depthControl.querySelector(".liang-appearance-depth__input");
      const depthValue = depthControl.querySelector(".liang-appearance-depth__value");
      if (depthInput !== null && depthValue !== null) {
        const percent = Math.round(snapshot.backdropDepth * 100);
        depthInput.value = String(percent);
        const text = `${percent}%`;
        if (depthValue.textContent !== text) depthValue.textContent = text;
        depthInput.disabled = pending;
      }
    }
    let personaControl = group.querySelector(".liang-appearance-persona");
    if (!snapshot.enabled) {
      personaControl?.remove();
    } else {
      if (personaControl === null) {
        personaControl = document.createElement("label");
        personaControl.className = "liang-appearance-persona";
        personaControl.dataset.plugin = PACKAGE_ID;
        const personaLabel = document.createElement("span");
        personaLabel.className = "liang-appearance-persona__label";
        const personaText = document.documentElement.lang.toLowerCase().startsWith("en") ? "Tier persona (greasy \u2192 domineering CEO)" : "\u6863\u4F4D\u4EBA\u8BBE\uFF08\u4F4E\u6863\u6CB9\u817B \xB7 \u9AD8\u6863\u9738\u603B\uFF09";
        personaLabel.textContent = personaText;
        const personaInput2 = document.createElement("input");
        personaInput2.className = "liang-appearance-persona__input";
        personaInput2.type = "checkbox";
        personaInput2.setAttribute("role", "switch");
        personaInput2.setAttribute("aria-label", personaText);
        personaInput2.addEventListener("change", () => {
          void scope.setPersona(personaInput2.checked).catch(() => sync());
        });
        personaControl.append(personaLabel, personaInput2);
        group.append(personaControl);
      }
      const personaInput = personaControl.querySelector(".liang-appearance-persona__input");
      if (personaInput !== null) {
        personaInput.checked = snapshot.persona;
        personaInput.setAttribute("aria-checked", String(snapshot.persona));
        personaInput.disabled = pending;
      }
    }
    for (const nativeButton of row !== null ? row.querySelectorAll('[class*="_8HJdBW_themeCube"]') : []) {
      if (hookedNativeButtons.has(nativeButton)) continue;
      hookedNativeButtons.add(nativeButton);
      const handleNativeClick = () => {
        if (pending || !scope.getSnapshot().enabled) return;
        pending = true;
        sync();
        void presenter.choose(false).finally(() => {
          pending = false;
          sync();
        });
      };
      nativeClickHandlers.set(nativeButton, handleNativeClick);
      nativeButton.addEventListener("click", handleNativeClick, { capture: true });
    }
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.body, { childList: true, subtree: true });
  const unsubscribe = scope.subscribe(sync);
  sync();
  return () => {
    observer.disconnect();
    unsubscribe();
    for (const [nativeButton, handleNativeClick] of nativeClickHandlers) {
      nativeButton.removeEventListener("click", handleNativeClick, { capture: true });
    }
    document.querySelectorAll(`.${LIANG_APPEARANCE_BUTTON}`).forEach((button) => button.remove());
    document.querySelectorAll(".liang-appearance-depth").forEach((control) => control.remove());
    document.querySelectorAll(".liang-appearance-persona").forEach((control) => control.remove());
  };
}
var inject = [
  "slots",
  "sessions",
  "modelDirectories",
  "locale",
  "theme"
];
function readBackdropDepth() {
  try {
    const raw = localStorage.getItem(BACKDROP_DEPTH_KEY);
    if (raw === null) return 1;
    const value = Number(raw);
    return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 1;
  } catch {
    return 1;
  }
}
var lastPersonaReportKey = "";
function syncPersonaReport(scope) {
  const stage = document.body.dataset.liangStage ?? "5";
  const tier = stage === "5" ? 3 : Number(stage) || 0;
  const enabled = scope.getSnapshot().persona;
  const key = `${tier}:${enabled}`;
  if (key === lastPersonaReportKey) return;
  lastPersonaReportKey = key;
  void fetch(PERSONA_ROUTE, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ tier, enabled })
  }).catch(() => {
    lastPersonaReportKey = "";
  });
}
function createPreferenceStore() {
  try {
    localStorage.removeItem("dsh-liang-intensity-skin.enabled");
  } catch {
  }
  let snapshot = {
    enabled: true,
    bindEffort: true,
    backdropDepth: readBackdropDepth(),
    persona: localStorage.getItem(PERSONA_KEY) !== "0"
  };
  const listeners = /* @__PURE__ */ new Set();
  const onStorage = (event) => {
    if (event.key !== BACKDROP_DEPTH_KEY && event.key !== PERSONA_KEY) return;
    const next = {
      enabled: snapshot.enabled,
      backdropDepth: event.key === BACKDROP_DEPTH_KEY ? readBackdropDepth() : snapshot.backdropDepth,
      persona: event.key === PERSONA_KEY ? event.newValue !== "0" : snapshot.persona
    };
    if (next.enabled === snapshot.enabled && next.bindEffort === snapshot.bindEffort && next.backdropDepth === snapshot.backdropDepth && next.persona === snapshot.persona) return;
    snapshot = next;
    for (const listener of listeners) listener();
  };
  window.addEventListener("storage", onStorage);
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async set(enabled) {
      if (enabled === snapshot.enabled) return;
      snapshot = { ...snapshot, enabled };
      for (const listener of listeners) listener();
    },
    async setBackdropDepth(depth) {
      const clamped = Math.min(1, Math.max(0, Number.isFinite(depth) ? depth : 1));
      if (clamped === snapshot.backdropDepth) return;
      try {
        localStorage.setItem(BACKDROP_DEPTH_KEY, String(clamped));
      } catch {
      }
      snapshot = { ...snapshot, backdropDepth: clamped };
      for (const listener of listeners) listener();
    },
    async setPersona(enabled) {
      if (enabled === snapshot.persona) return;
      try {
        localStorage.setItem(PERSONA_KEY, enabled ? "1" : "0");
      } catch {
      }
      snapshot = { ...snapshot, persona: enabled };
      for (const listener of listeners) listener();
    },
    dispose() {
      window.removeEventListener("storage", onStorage);
      listeners.clear();
    }
  };
}
function apply(ctx) {
  const style = document.createElement("style");
  style.dataset.plugin = PACKAGE_ID;
  style.textContent = skin_default;
  document.head.append(style);
  ctx.effect(() => () => style.remove(), "liang-intensity-skin: scoped styles");
  const scope = createPreferenceStore();
  ctx.effect(() => () => scope.dispose(), "liang-intensity-skin: appearance preference");
  const theme = ctx.get("theme");
  const presenter = new SkinPresenter(scope, theme);
  ctx.effect(() => () => presenter.dispose(), "liang-intensity-skin: backdrop presenter");
  ctx.effect(
    () => installLiangAppearanceButton(scope, presenter),
    "liang-intensity-skin: native appearance extension"
  );
  ctx.effect(
    () => ctx.locale.register(LOCALE_NAMESPACE, {
      zh: {
        "appearance.title": "\u5916\u89C2",
        "appearance.light": "\u6D45\u8272",
        "appearance.dark": "\u6DF1\u8272",
        "appearance.system": "\u8DDF\u968F\u7CFB\u7EDF",
        "appearance.liang": "\u9A6C\u52A0\u4E03\u76AE\u80A4"
      },
      en: {
        "appearance.title": "Appearance",
        "appearance.light": "Light",
        "appearance.dark": "Dark",
        "appearance.system": "System",
        "appearance.liang": "\u9A6C\u52A0\u4E03\u76AE\u80A4"
      }
    }),
    "liang-intensity-skin: settings locale"
  );
  ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
    name: "conversation.input.right",
    id: "liang-intensity-control",
    order: 10,
    inject: (sessionId) => {
      const available = ctx.sessions.subagentAddress(sessionId) === void 0;
      const directory = ctx.modelDirectories.directoryFor(sessionId);
      return {
        directory: directory.store,
        presenter,
        scope,
        load: () => {
          if (available) void directory.load().catch(() => void 0);
        },
        select: (selection) => available ? directory.select(selection).then(() => true, () => false) : Promise.resolve(false)
      };
    }
  }, LiangEffortSlider));
}
return module.exports;}});
//# sourceMappingURL=client.js.map
