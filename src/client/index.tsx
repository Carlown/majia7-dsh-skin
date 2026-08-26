import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ClientContext, SnapshotStore } from "@deepseek-ai/dsh-client-runtime/client";
import type {} from "@deepseek-ai/dsh-client-ui-conversation/client";
import type {} from "@deepseek-ai/dsh-client-ui-settings/client";
import type {} from "@deepseek-ai/dsh-client-ui-model-selection/client";
import styles from "./skin.css";
import {
  PREVIEW_MAX_FRAME,
  frameForEffort,
  indicatorLabel,
  nearestEffortIndex,
  paletteForFrame,
  portraitBlendForLevel,
  selectedEffortIndex,
  type EffortLike,
} from "./logic";

const PACKAGE_ID = "dsh-client-liang-intensity-skin";
const LOCALE_NAMESPACE = "liang.skin";
const ASSET_PREFIX = `/plugins/${PACKAGE_ID}/assets`;
const FIRST_PORTRAIT_FILE = "tier-v1/tier-00-none.jpg";
const BIND_EFFORT_KEY = "dsh-liang-intensity-skin.bind-effort";
const BACKDROP_DEPTH_KEY = "dsh-liang-intensity-skin.backdrop-depth";
const PERSONA_KEY = "dsh-liang-intensity-skin.persona";
const PERSONA_ROUTE = "/api/plugins/majia7-dsh/persona";

// 档位人设：客户端只负责把当前档位/开关上报给服务端；
// 人设文本由服务端注入系统提示词，用户消息与界面完全不受影响。
const PERSONA_GUARDRAIL =
  "无论档位如何，保持合法合规：不生成露骨色情内容，不侮辱或威胁任何人，不涉及未成年人。";

// 四档爆改：none / low / high / max 四张档位图均匀锚定在 0–30 强度轴上；
// 就近吸附、思考等级绑定、外观开关等原有机制保持不变。
const PORTRAIT_ANCHORS = [
  { level: 0, file: "tier-v1/tier-00-none.jpg" },
  { level: 10, file: "tier-v1/tier-10-low.png" },
  { level: 20, file: "tier-v1/tier-20-high.jpeg" },
  { level: 30, file: "tier-v1/tier-30-max.jpg" },
] as const;

const ANCHOR_LEVELS = PORTRAIT_ANCHORS.map((anchor) => anchor.level);

interface SkinSettings {
  enabled: boolean;
  bindEffort: boolean;
  backdropDepth: number;
  persona: boolean;
}

interface PreferenceStore {
  getSnapshot(): SkinSettings;
  subscribe(listener: () => void): () => void;
  set(enabled: boolean): Promise<void>;
  setBindEffort(enabled: boolean): Promise<void>;
  setBackdropDepth(depth: number): Promise<void>;
  setPersona(enabled: boolean): Promise<void>;
  dispose(): void;
}

type NativeThemeId = "light" | "dark";

interface ThemeService {
  getTheme(): { preference: string };
  setTheme(id: NativeThemeId | "system"): void;
}

interface ModelSelection {
  provider: string;
  model: string;
  reasoningEffort?: string;
}

interface CatalogModel {
  id: string;
  reasoning?: {
    efforts: EffortLike[];
    defaultEffort?: string;
  };
}

interface ModelDirectoryState {
  current: ModelSelection | null;
  groups: readonly { id: string; models: CatalogModel[] }[];
  status: "idle" | "loading" | "ready" | "selecting" | "error";
  error: string | null;
}

interface ModelDirectory {
  store: SnapshotStore<ModelDirectoryState>;
  load(): Promise<unknown>;
  select(selection: ModelSelection): Promise<void>;
}

interface SliderProps {
  directory: SnapshotStore<ModelDirectoryState>;
  load: () => void;
  select: (selection: ModelSelection) => Promise<boolean>;
  presenter: SkinPresenter;
  scope: PreferenceStore;
}

interface SettingsRowProps {
  scope: PreferenceStore;
  presenter: SkinPresenter;
  theme: ThemeService;
  subscribeTheme: (listener: () => void) => () => void;
  t: (key: string) => string;
}

const cssVariables = [
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
  "--liang-portrait-opacity",
] as const;

class SkinPresenter {
  private readonly scope: PreferenceStore;
  private readonly theme: ThemeService;
  private readonly root: HTMLDivElement;
  private readonly portrait: HTMLImageElement;
  private readonly preloads: HTMLImageElement[];
  private portraitReady = false;
  private enabled = true;
  // Default to the max frame so the first paint after load is the dark shell;
  // starting at 0 flashed the light palette before the directory resolved.
  private frame = PREVIEW_MAX_FRAME;
  private pendingFrame = PREVIEW_MAX_FRAME;
  private raf = 0;
  private disposed = false;
  private unsubscribe: () => void;

  constructor(scope: PreferenceStore, theme: ThemeService) {
    this.scope = scope;
    this.theme = theme;
    this.root = document.createElement("div");
    this.root.className = "liang-skin-backdrop";
    this.root.dataset.plugin = PACKAGE_ID;
    // Show the first half-body frame immediately while the remaining frames
    // are fetched and decoded. A request being complete does not mean the
    // bitmap is ready for a tear-free first swap.
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

    // `new Image()` starts the requests, but the browser may still defer
    // decoding until the image is attached to the document. Wait for all
    // frames up front so the first slider interaction never reveals a blank
    // or half-painted frame.
    void Promise.all(this.preloads.map((image) => image.decode())).then(
      () => {
        if (this.disposed) return;
        this.portraitReady = true;
        this.root.dataset.media = "sequence";
        this.updatePortrait(paletteForFrame(this.frame).level);
      },
      () => {
        // Keep the already-visible first half-body frame if another optional
        // frame cannot be decoded. It is still a valid skin fallback.
      },
    );

    this.root.append(this.portrait);
    document.body.prepend(this.root);

    this.unsubscribe = scope.subscribe(() => this.syncSettings());
    this.syncSettings();
  }

  private readonly handleSequenceError = () => {
    if (this.portrait.src.endsWith(FIRST_PORTRAIT_FILE)) {
      this.root.dataset.media = "color";
      return;
    }
    this.portraitReady = false;
    this.portrait.src = `${ASSET_PREFIX}/${FIRST_PORTRAIT_FILE}`;
    this.root.dataset.media = "sequence";
  };

  private syncSettings() {
    this.setEnabled(this.scope.getSnapshot().enabled);
  }

  isEnabled() {
    return this.enabled;
  }

  getFrame() {
    return this.frame;
  }

  setEnabled(enabled: boolean) {
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

  setFrame(frame: number) {
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

  private applyFrame() {
    const palette = paletteForFrame(this.frame);
    const body = document.body;
    // Max 档现在是粉色浅壳，不再切换原生深色主题。
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
      Number(palette.portraitOpacity) * this.scope.getSnapshot().backdropDepth,
    ));
    this.updatePortrait(palette.level);
    // 档位变化时静默上报给服务端人设通道（用户无感知）。
    syncPersonaReport(this.scope);
  }

  syncNativeTheme(theme: NativeThemeId = "light") {
    if (!this.enabled || this.theme.getTheme().preference === theme) return;
    this.theme.setTheme(theme);
  }

  private updatePortrait(level: number) {
    if (!this.portraitReady) return;
    const { lowerIndex, upperIndex, mix } = portraitBlendForLevel(
      level,
      ANCHOR_LEVELS,
    );
    const lower = PORTRAIT_ANCHORS[lowerIndex];
    const upper = PORTRAIT_ANCHORS[upperIndex];
    const selected = mix >= 0.5 ? upper : lower;
    const source = `${ASSET_PREFIX}/${selected.file}`;
    if (this.portrait.getAttribute("src") !== source) this.portrait.src = source;
  }

  async choose(enabled: boolean) {
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
}

function modelReasoning(state: ModelDirectoryState) {
  const current = state.current;
  if (current === null) return null;
  const group = state.groups.find((item) => item.id === current.provider);
  const model = group?.models.find((item) => item.id === current.model);
  if (model?.reasoning === undefined) return null;
  return {
    selection: current,
    efforts: model.reasoning.efforts,
    defaultEffort: model.reasoning.defaultEffort,
  };
}

function LiangEffortSlider({ directory, load, select, presenter, scope }: SliderProps) {
  const state = useSyncExternalStore(
    (listener) => directory.subscribe(listener),
    () => directory.getSnapshot(),
  );
  const skin = useSyncExternalStore(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot(),
  );
  const reasoning = useMemo(() => modelReasoning(state), [state]);
  const efforts = reasoning?.efforts ?? [];
  const committedIndex = selectedEffortIndex(
    efforts,
    reasoning?.selection.reasoningEffort,
    reasoning?.defaultEffort,
  );
  // An unknown committed effort defaults to the max frame: a fresh
  // conversation paints the dark shell immediately instead of flashing the
  // light palette until the directory load resolves the real effort.
  const committedFrame = committedIndex < 0
    ? PREVIEW_MAX_FRAME
    : frameForEffort(committedIndex, efforts.length);
  const bindEffort = skin.bindEffort;
  const [frame, setFrame] = useState(() => bindEffort ? committedFrame : presenter.getFrame());
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const dragging = useRef(false);
  const dragStartFrame = useRef(frame);
  const enabled = skin.enabled;

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  useEffect(() => {
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

  const commit = async (rawFrame: number) => {
    if (!bindEffort) {
      dragging.current = false;
      setFrame(rawFrame);
      presenter.setFrame(rawFrame);
      return;
    }
    const targetIndex = nearestEffortIndex(rawFrame, efforts);
    const target = efforts[targetIndex];
    if (target === undefined) return;
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
      reasoningEffort: target.id,
    });
    setPending(false);
    if (!accepted) {
      setFailed(true);
      setFrame(committedFrame);
      presenter.setFrame(committedFrame);
    }
  };

  return (
    <div
      className="liang-effort-control"
      data-plugin={PACKAGE_ID}
      data-state={failed ? "error" : pending ? "pending" : "ready"}
      title={bindEffort ? previewEffort?.name : undefined}
    >
      {interacting && (
        <output
          className="liang-effort-control__tooltip"
          style={{ "--liang-slider-ratio": progressRatio } as React.CSSProperties}
        >
          {tooltipLabel}
        </output>
      )}
      <div className="liang-effort-control__ticks" aria-hidden="true">
        {efforts.map((effort, index) => (
          <i
            className="liang-effort-control__tick"
            key={effort.id}
            style={{ left: `${(frameForEffort(index, efforts.length) / PREVIEW_MAX_FRAME) * 100}%` }}
          />
        ))}
      </div>
      <input
        className="liang-effort-control__range"
        type="range"
        min={0}
        max={PREVIEW_MAX_FRAME}
        step={1}
        value={frame}
        disabled={pending || state.status === "selecting"}
        aria-label={bindEffort ? "思考等级" : "皮肤进度"}
        aria-valuetext={bindEffort ? previewEffort?.name ?? "" : tooltipLabel}
        onPointerDown={() => {
          dragging.current = true;
          dragStartFrame.current = frame;
          setInteracting(true);
        }}
        onInput={(event) => {
          dragging.current = true;
          const next = Number(event.currentTarget.value);
          setFrame(next);
          presenter.setFrame(next);
        }}
        onPointerUp={(event) => {
          setInteracting(false);
          void commit(Number(event.currentTarget.value));
        }}
        onPointerCancel={() => {
          setInteracting(false);
          dragging.current = false;
          setFrame(dragStartFrame.current);
          presenter.setFrame(dragStartFrame.current);
        }}
        onKeyUp={(event) => {
          setInteracting(false);
          if (event.key !== "Escape") void commit(Number(event.currentTarget.value));
        }}
        onBlur={(event) => {
          setInteracting(false);
          if (dragging.current) void commit(Number(event.currentTarget.value));
        }}
        onKeyDown={(event) => {
          setInteracting(true);
          if (event.key === "Escape" && !pending) {
            setInteracting(false);
            dragging.current = false;
            setFrame(dragStartFrame.current);
            presenter.setFrame(dragStartFrame.current);
          }
        }}
      />
    </div>
  );
}

type AppearanceChoice = NativeThemeId | "system" | "liang";

const APPEARANCE_CHOICES: readonly { id: AppearanceChoice; labelKey: string }[] = [
  { id: "light", labelKey: "appearance.light" },
  { id: "dark", labelKey: "appearance.dark" },
  { id: "system", labelKey: "appearance.system" },
  { id: "liang", labelKey: "appearance.liang" },
];

function NativeAppearanceIcon({ id }: { id: Exclude<AppearanceChoice, "liang"> }) {
  if (id === "light") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M11.3496 8C11.3496 6.14985 9.85015 4.65039 8 4.65039C6.14985 4.65039 4.65039 6.14985 4.65039 8C4.65039 9.85015 6.14985 11.3496 8 11.3496C9.85015 11.3496 11.3496 9.85015 11.3496 8ZM12.6504 8C12.6504 10.5681 10.5681 12.6504 8 12.6504C5.43188 12.6504 3.34961 10.5681 3.34961 8C3.34961 5.43188 5.43188 3.34961 8 3.34961C10.5681 3.34961 12.6504 5.43188 12.6504 8Z" fill="currentColor" />
        <path d="M8.65039 0.5V2.5H7.34961V0.5H8.65039Z" fill="currentColor" />
        <path d="M8.65039 13.5V15.5H7.34961V13.5H8.65039Z" fill="currentColor" />
        <path d="M3.15808 2.24035L4.57229 3.65456L3.6525 4.57435L2.23829 3.16014L3.15808 2.24035Z" fill="currentColor" />
        <path d="M12.3505 11.4327L13.7647 12.8469L12.8449 13.7667L11.4307 12.3525L12.3505 11.4327Z" fill="currentColor" />
        <path d="M2.24537 12.8469L3.65958 11.4327L4.57937 12.3525L3.16516 13.7667L2.24537 12.8469Z" fill="currentColor" />
        <path d="M11.4377 3.65455L12.852 2.24033L13.7718 3.16012L12.3575 4.57434L11.4377 3.65455Z" fill="currentColor" />
        <path d="M0.5 7.35461H2.5V8.6554H0.5L0.5 7.35461Z" fill="currentColor" />
        <path d="M13.5 7.35461H15.5V8.6554H13.5V7.35461Z" fill="currentColor" />
      </svg>
    );
  }

  if (id === "dark") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M13.2764 9.52324C12.5607 9.97754 11.7177 10.242 10.7812 10.242C8.11386 10.2419 5.95042 8.07997 5.9502 5.41289C5.9502 4.48128 6.21453 3.61071 6.67188 2.87285C4.30332 3.4658 2.54992 5.60845 2.5498 8.16093C2.5498 11.1712 4.99103 13.6102 8 13.6102C10.5383 13.6102 12.6709 11.8724 13.2764 9.52324ZM7.05078 5.41289C7.051 7.47224 8.72116 9.1423 10.7812 9.14238C11.9248 9.14238 12.887 8.63397 13.5781 7.8084C13.7266 7.63106 13.9701 7.56547 14.1875 7.64433C14.4049 7.72329 14.5497 7.9297 14.5498 8.16093C14.5498 11.7766 11.6161 14.7098 8 14.7098C4.38402 14.7098 1.4502 11.7792 1.4502 8.16093C1.45033 4.54322 4.3812 1.61015 8 1.61015C8.23027 1.61015 8.43585 1.75352 8.51562 1.96953C8.59536 2.18554 8.53241 2.42829 8.35742 2.57793C7.55573 3.26311 7.05078 4.27876 7.05078 5.41289Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12.1665 13.5811V14.7803H3.66651V13.5811H12.1665Z" fill="currentColor" />
      <path d="M13.4453 7.02379C13.4453 6.04702 13.4452 5.3616 13.3887 4.83434C13.3333 4.31828 13.2302 4.02378 13.0723 3.80309C12.9446 3.62475 12.7877 3.46883 12.6094 3.34117C12.3887 3.18328 12.0942 3.08007 11.5781 3.02477C11.0508 2.96829 10.3655 2.96715 9.38867 2.96715H6.61035C5.63359 2.96715 4.94816 2.96827 4.4209 3.02477C3.90486 3.0801 3.61034 3.18321 3.38965 3.34117C3.21143 3.46878 3.05534 3.62487 2.92774 3.80309C2.76977 4.02377 2.66667 4.3183 2.61133 4.83434C2.55483 5.3616 2.55371 6.04702 2.55371 7.02379C2.55371 8.0006 2.55485 8.68596 2.61133 9.21324C2.66663 9.72936 2.76983 10.0238 2.92774 10.2445C3.0554 10.4228 3.21131 10.5797 3.38965 10.7074C3.61034 10.8654 3.90484 10.9685 4.4209 11.0238C4.94816 11.0803 5.63359 11.0804 6.61035 11.0804H9.38867C10.3654 11.0804 11.0508 11.0803 11.5781 11.0238C12.0941 10.9685 12.3887 10.8652 12.6094 10.7074C12.7877 10.5797 12.9446 10.4229 13.0723 10.2445C13.2301 10.0238 13.3334 9.72927 13.3887 9.21324C13.4452 8.68596 13.4453 8.00058 13.4453 7.02379ZM14.6455 7.02379C14.6455 7.97428 14.646 8.73509 14.5811 9.34117C14.5149 9.95828 14.3756 10.4858 14.0479 10.9437C13.8436 11.229 13.5938 11.4788 13.3086 11.683C12.8507 12.0108 12.3232 12.15 11.7061 12.2162C11.1 12.2811 10.3391 12.2806 9.38867 12.2806H6.61035C5.66018 12.2806 4.89991 12.2811 4.29395 12.2162C3.67684 12.15 3.14935 12.0108 2.69141 11.683C2.40613 11.4788 2.15639 11.229 1.95215 10.9437C1.62436 10.4858 1.4841 9.95828 1.41797 9.34117C1.35305 8.73511 1.35449 7.97424 1.35449 7.02379C1.35449 6.07366 1.35308 5.31333 1.41797 4.70738C1.4841 4.09028 1.62436 3.56279 1.95215 3.10485C2.15638 2.81956 2.40613 2.56982 2.69141 2.36559C3.14935 2.03779 3.67684 1.89753 4.29395 1.83141C4.8999 1.76652 5.66022 1.76793 6.61035 1.76793H9.38867C10.3391 1.76793 11.1 1.76649 11.7061 1.83141C12.3232 1.89753 12.8507 2.03779 13.3086 2.36559C13.5939 2.56982 13.8436 2.81957 14.0479 3.10485C14.3756 3.56279 14.5149 4.09028 14.5811 4.70738C14.646 5.31335 14.6455 6.07362 14.6455 7.02379Z" fill="currentColor" />
    </svg>
  );
}

function AppearanceSkinRow({ scope, presenter, theme, subscribeTheme, t }: SettingsRowProps) {
  const snapshot = useSyncExternalStore(
    (listener) => scope.subscribe(listener),
    () => scope.getSnapshot(),
  );
  const preference = useSyncExternalStore(
    subscribeTheme,
    () => theme.getTheme().preference,
  );
  const selected = snapshot.enabled
    ? "liang"
    : preference === "light" || preference === "dark" || preference === "system"
      ? preference
      : "system";
  const [pending, setPending] = useState(false);

  const choose = async (next: AppearanceChoice) => {
    if (next === selected || pending) return;
    setPending(true);
    try {
      if (next === "liang") {
        await presenter.choose(true);
      } else {
        // Disable the custom skin first. This is intentionally unconditional:
        // it makes the native choice the only writer after this click, even if
        // the external preference store is one render behind.
        await presenter.choose(false);
        theme.setTheme(next);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="liang-settings-row" data-plugin={PACKAGE_ID}>
      <span className="liang-settings-row__title">{t("appearance.title")}</span>
      <div className="liang-settings-row__choices">
        {APPEARANCE_CHOICES.map(({ id, labelKey }) => (
          <button
            className={`liang-settings-row__choice${id === "liang" ? " liang-settings-row__choice--liang" : ""}`}
            type="button"
            aria-pressed={selected === id}
            disabled={pending}
            onClick={() => void choose(id)}
            key={id}
          >
            {id === "liang" ? (
              <span className="liang-settings-row__liang-icon" aria-hidden="true">◈</span>
            ) : (
              <NativeAppearanceIcon id={id} />
            )}
            {t(labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}

const NATIVE_APPEARANCE_GROUP = '[class*="_8HJdBW_group"]';
const NATIVE_APPEARANCE_ROW = '[class*="_8HJdBW_cubeRow"]';
const LIANG_APPEARANCE_BUTTON = "liang-appearance-choice";
const LIANG_BINDING_CONTROL = "liang-appearance-binding";
const LIANG_BINDING_INPUT = "liang-appearance-binding__input";

function installLiangAppearanceButton(scope: PreferenceStore, presenter: SkinPresenter) {
  let pending = false;
  const hookedNativeButtons = new Set<HTMLButtonElement>();
  const nativeClickHandlers = new Map<HTMLButtonElement, () => void>();

  const sync = () => {
    // 首选含主题方块的分组；找不到时退回第一个设置分组，保证控件始终有落点。
    const groups = [...document.querySelectorAll<HTMLElement>(NATIVE_APPEARANCE_GROUP)];
    const group = groups.find((node) => node.querySelector('[class*="_8HJdBW_themeCube"]'))
      ?? groups[0]
      ?? null;
    if (group === null) return;
    const row = group.querySelector<HTMLElement>(NATIVE_APPEARANCE_ROW);

    const snapshot = scope.getSnapshot();

    let customButton: HTMLButtonElement | null = null;
    if (row !== null) {
      customButton = row.querySelector<HTMLButtonElement>(`.${LIANG_APPEARANCE_BUTTON}`);
      if (customButton === null) {
      customButton = document.createElement("button");
      customButton.className = LIANG_APPEARANCE_BUTTON;
      customButton.type = "button";
      customButton.dataset.plugin = PACKAGE_ID;
      customButton.setAttribute("aria-label", "马加七皮肤");

      const icon = document.createElement("span");
      icon.className = "liang-appearance-choice__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "◈";

      const label = document.createElement("span");
      label.className = "liang-appearance-choice__label";
      label.textContent = "马加七皮肤";
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

    let bindingControl = group.querySelector<HTMLElement>(`.${LIANG_BINDING_CONTROL}`);
    if (!snapshot.enabled) {
      bindingControl?.remove();
      bindingControl = null;
    } else if (bindingControl === null) {
      bindingControl = document.createElement("label");
      bindingControl.className = LIANG_BINDING_CONTROL;
      bindingControl.dataset.plugin = PACKAGE_ID;

      const bindingCopy = document.createElement("span");
      bindingCopy.className = "liang-appearance-binding__copy";

      const bindingLabel = document.createElement("span");
      bindingLabel.className = "liang-appearance-binding__label";
      const bindingText = document.documentElement.lang.toLowerCase().startsWith("en")
        ? "Bind 马加七皮肤 slider to reasoning level"
        : "马加七皮肤 绑定思考等级";
      bindingLabel.textContent = bindingText;

      const bindingDescription = document.createElement("span");
      bindingDescription.className = "liang-appearance-binding__description";
      bindingDescription.id = "liang-appearance-binding-description";
      bindingDescription.textContent = document.documentElement.lang.toLowerCase().startsWith("en")
        ? "When off, the slider does not change the reasoning level."
        : "关闭之后滑块不联动思考等级";
      bindingCopy.append(bindingLabel, bindingDescription);

      const bindingInput = document.createElement("input");
      bindingInput.className = LIANG_BINDING_INPUT;
      bindingInput.type = "checkbox";
      bindingInput.setAttribute("role", "switch");
      bindingInput.setAttribute("aria-label", bindingText);
      bindingInput.setAttribute("aria-describedby", bindingDescription.id);
      bindingInput.addEventListener("change", () => {
        void scope.setBindEffort(bindingInput.checked).catch(() => sync());
      });

      bindingControl.append(bindingCopy, bindingInput);
      group.append(bindingControl);
    }

    if (bindingControl !== null) {
      const bindingInput = bindingControl.querySelector<HTMLInputElement>(`.${LIANG_BINDING_INPUT}`);
      if (bindingInput !== null) {
        bindingInput.checked = snapshot.bindEffort;
        bindingInput.setAttribute("aria-checked", String(snapshot.bindEffort));
        bindingInput.disabled = pending;
      }
    }

    // 背景深度调节：0–100% 控制右侧档位图/背景的显示强度，实时生效并持久化。
    let depthControl = group.querySelector<HTMLElement>(".liang-appearance-depth");
    if (!snapshot.enabled) {
      depthControl?.remove();
    } else {
      if (depthControl === null) {
        depthControl = document.createElement("label");
        depthControl.className = "liang-appearance-depth";
        depthControl.dataset.plugin = PACKAGE_ID;

        const depthLabel = document.createElement("span");
        depthLabel.className = "liang-appearance-depth__label";
        const depthText = document.documentElement.lang.toLowerCase().startsWith("en")
          ? "Backdrop depth"
          : "背景深度";
        depthLabel.textContent = depthText;

        const depthInput = document.createElement("input");
        depthInput.className = "liang-appearance-depth__input";
        depthInput.type = "range";
        depthInput.min = "0";
        depthInput.max = "100";
        depthInput.step = "5";
        depthInput.setAttribute("aria-label", depthText);

        const depthValue = document.createElement("output");
        depthValue.className = "liang-appearance-depth__value";

        depthInput.addEventListener("input", () => {
          depthValue.textContent = `${depthInput.value}%`;
          void scope.setBackdropDepth(Number(depthInput.value) / 100).catch(() => sync());
        });

        depthControl.append(depthLabel, depthInput, depthValue);
        group.append(depthControl);
      }
      const depthInput = depthControl.querySelector<HTMLInputElement>(".liang-appearance-depth__input");
      const depthValue = depthControl.querySelector<HTMLOutputElement>(".liang-appearance-depth__value");
      if (depthInput !== null && depthValue !== null) {
        const percent = Math.round(snapshot.backdropDepth * 100);
        depthInput.value = String(percent);
        // 仅在文本变化时写入：sync() 由 MutationObserver 驱动，
        // 每轮无条件改写子节点会触发“observer→sync→再改写”死循环，冻住设置面板。
        const text = `${percent}%`;
        if (depthValue.textContent !== text) depthValue.textContent = text;
        depthInput.disabled = pending;
      }
    }

    // 档位人设开关：低档油腻 · 高档霸总；自称马加7、用户是女生为恒定设定。
    let personaControl = group.querySelector<HTMLElement>(".liang-appearance-persona");
    if (!snapshot.enabled) {
      personaControl?.remove();
    } else {
      if (personaControl === null) {
        personaControl = document.createElement("label");
        personaControl.className = "liang-appearance-persona";
        personaControl.dataset.plugin = PACKAGE_ID;

        const personaLabel = document.createElement("span");
        personaLabel.className = "liang-appearance-persona__label";
        const personaText = document.documentElement.lang.toLowerCase().startsWith("en")
          ? "Tier persona (greasy → domineering CEO)"
          : "档位人设（低档油腻 · 高档霸总）";
        personaLabel.textContent = personaText;

        const personaInput = document.createElement("input");
        personaInput.className = "liang-appearance-persona__input";
        personaInput.type = "checkbox";
        personaInput.setAttribute("role", "switch");
        personaInput.setAttribute("aria-label", personaText);
        personaInput.addEventListener("change", () => {
          void scope.setPersona(personaInput.checked).catch(() => sync());
        });

        personaControl.append(personaLabel, personaInput);
        group.append(personaControl);
      }
      const personaInput = personaControl.querySelector<HTMLInputElement>(".liang-appearance-persona__input");
      if (personaInput !== null) {
        personaInput.checked = snapshot.persona;
        personaInput.setAttribute("aria-checked", String(snapshot.persona));
        personaInput.disabled = pending;
      }
    }

    for (const nativeButton of row !== null
      ? row.querySelectorAll<HTMLButtonElement>('[class*="_8HJdBW_themeCube"]')
      : []) {
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
    document.querySelectorAll(`.${LIANG_BINDING_CONTROL}`).forEach((control) => control.remove());
    document.querySelectorAll(".liang-appearance-depth").forEach((control) => control.remove());
    document.querySelectorAll(".liang-appearance-persona").forEach((control) => control.remove());
  };
}

export const inject = [
  "slots",
  "sessions",
  "modelDirectories",
  "locale",
  "theme",
];

function readBackdropDepth(): number {
  try {
    const raw = localStorage.getItem(BACKDROP_DEPTH_KEY);
    if (raw === null) return 1;
    const value = Number(raw);
    return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 1;
  } catch {
    return 1;
  }
}

let lastPersonaReportKey = "";

/** 把当前档位/开关上报给服务端（静默、幂等：状态未变则跳过）。 */
function syncPersonaReport(scope: PreferenceStore): void {
  const stage = document.body.dataset.liangStage ?? "5";
  const tier = stage === "5" ? 3 : Number(stage) || 0;
  const enabled = scope.getSnapshot().persona;
  const key = `${tier}:${enabled}`;
  if (key === lastPersonaReportKey) return;
  lastPersonaReportKey = key;
  void fetch(PERSONA_ROUTE, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ tier, enabled }),
  }).catch(() => {
    // 上报失败不影响界面；下次档位变化时会重试。
    lastPersonaReportKey = "";
  });
}

function createPreferenceStore(): PreferenceStore {
  // The market's active skin is the source of truth for whether this client
  // should be visible. The appearance switch is therefore scoped to this
  // client activation and must not survive switching away and back.
  try {
    localStorage.removeItem("dsh-liang-intensity-skin.enabled");
  } catch {
    // Storage may be unavailable; the in-memory default still enables Liang.
  }
  let snapshot: SkinSettings = {
    enabled: true,
    bindEffort: localStorage.getItem(BIND_EFFORT_KEY) !== "0",
    backdropDepth: readBackdropDepth(),
    persona: localStorage.getItem(PERSONA_KEY) !== "0",
  };
  const listeners = new Set<() => void>();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== BIND_EFFORT_KEY && event.key !== BACKDROP_DEPTH_KEY
      && event.key !== PERSONA_KEY) return;
    const next: SkinSettings = {
      enabled: snapshot.enabled,
      bindEffort: event.key === BIND_EFFORT_KEY
        ? event.newValue !== "0"
        : snapshot.bindEffort,
      backdropDepth: event.key === BACKDROP_DEPTH_KEY
        ? readBackdropDepth()
        : snapshot.backdropDepth,
      persona: event.key === PERSONA_KEY
        ? event.newValue !== "0"
        : snapshot.persona,
    };
    if (next.enabled === snapshot.enabled && next.bindEffort === snapshot.bindEffort
      && next.backdropDepth === snapshot.backdropDepth
      && next.persona === snapshot.persona) return;
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
    async setBindEffort(bindEffort) {
      if (bindEffort === snapshot.bindEffort) return;
      localStorage.setItem(BIND_EFFORT_KEY, bindEffort ? "1" : "0");
      snapshot = { ...snapshot, bindEffort };
      for (const listener of listeners) listener();
    },
    async setBackdropDepth(depth) {
      const clamped = Math.min(1, Math.max(0, Number.isFinite(depth) ? depth : 1));
      if (clamped === snapshot.backdropDepth) return;
      try {
        localStorage.setItem(BACKDROP_DEPTH_KEY, String(clamped));
      } catch {
        // Persistence is best-effort; the in-memory value still applies.
      }
      snapshot = { ...snapshot, backdropDepth: clamped };
      for (const listener of listeners) listener();
    },
    async setPersona(enabled) {
      if (enabled === snapshot.persona) return;
      try {
        localStorage.setItem(PERSONA_KEY, enabled ? "1" : "0");
      } catch {
        // Persistence is best-effort; the in-memory value still applies.
      }
      snapshot = { ...snapshot, persona: enabled };
      for (const listener of listeners) listener();
    },
    dispose() {
      window.removeEventListener("storage", onStorage);
      listeners.clear();
    },
  };
}

export function apply(ctx: ClientContext) {
  const style = document.createElement("style");
  style.dataset.plugin = PACKAGE_ID;
  style.textContent = styles;
  document.head.append(style);
  ctx.effect(() => () => style.remove(), "liang-intensity-skin: scoped styles");

  const scope = createPreferenceStore();
  ctx.effect(() => () => scope.dispose(), "liang-intensity-skin: appearance preference");
  const theme = ctx.get("theme") as ThemeService;
  const presenter = new SkinPresenter(scope, theme);
  ctx.effect(() => () => presenter.dispose(), "liang-intensity-skin: backdrop presenter");
  ctx.effect(
    () => installLiangAppearanceButton(scope, presenter),
    "liang-intensity-skin: native appearance extension",
  );
  ctx.effect(
    () => ctx.locale.register(LOCALE_NAMESPACE, {
    zh: {
      "appearance.title": "外观",
      "appearance.light": "浅色",
      "appearance.dark": "深色",
      "appearance.system": "跟随系统",
      "appearance.liang": "马加七皮肤",
    },
    en: {
      "appearance.title": "Appearance",
      "appearance.light": "Light",
      "appearance.dark": "Dark",
      "appearance.system": "System",
      "appearance.liang": "马加七皮肤",
    },
    }), "liang-intensity-skin: settings locale");

  ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
    name: "conversation.input.right",
    id: "liang-intensity-control",
    order: 10,
    inject: (sessionId: string) => {
      const available = ctx.sessions.subagentAddress(sessionId) === undefined;
      const directory = ctx.modelDirectories.directoryFor(sessionId) as ModelDirectory;
      return {
        directory: directory.store,
        presenter,
        scope,
        load: () => {
          if (available) void directory.load().catch(() => undefined);
        },
        select: (selection: ModelSelection) => available
          ? directory.select(selection).then(() => true, () => false)
          : Promise.resolve(false),
      };
    },
  }, LiangEffortSlider));
}
