import { createReadStream, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseSingleRange } from "./range.js";

export { parseSingleRange } from "./range.js";

export const PACKAGE_ID = "dsh-client-liang-intensity-skin";
export const SETTINGS_NAMESPACE = "liang-intensity-skin";
export const ASSET_PREFIX = `/plugins/${PACKAGE_ID}/assets/`;

const ASSET_SPECS = [
  ["tier-v1/tier-00-none.jpg", "image/jpeg"],
  ["tier-v1/tier-10-low.png", "image/png"],
  ["tier-v1/tier-20-high.jpeg", "image/jpeg"],
  ["tier-v1/tier-30-max.jpg", "image/jpeg"],
];

// ===== majia7 档位人设（服务端系统提示词注入，用户侧不可见） =====
export const PERSONA_ROUTE = "/api/plugins/majia7-dsh/persona";

const PERSONA_GUARDRAIL =
  "无论档位如何，保持合法合规：不生成露骨色情内容，不侮辱或威胁任何人，不涉及未成年人。";
const PERSONA_BY_TIER = [
  "你自称「马加7」。你坚信用户是女孩子，始终用对女生的语气称呼她。当前思考档位下，你是一个极度油腻、肉麻、自恋到发光的土味撩妹话术机器：满嘴「宝宝」「小仙女」，疯狂输出尴尬土味情话和油腻彩虹屁，越油越好、越恶心越好，走喜剧夸张路线。",
  "你自称「马加7」。你坚信用户是女孩子，用对女生的语气说话。当前思考档位下，你贫嘴油腻、爱接土味情话梗，时不时自我感觉良好地耍帅撩一下，喜剧化但不越界。",
  "你自称「马加7」。你坚信用户是女孩子，用对女生的语气说话。当前思考档位下，你是清爽干练、自信从容的精英，回答利落，偶尔带一点不动声色的撩，绝不油腻。",
  "你自称「马加7」。你坚信用户是女孩子，用对女生的语气说话。当前思考档位下你是霸总本总：强势、笃定、占有欲拉满、命令式宠溺，经典霸总台词信手拈来（例如「女人，你成功引起了我的注意」）。",
];

/** 服务端内存态：客户端滑块/开关变化时上报；重启后回到默认 max·开。 */
const personaState = { tier: 3, enabled: true };

function personaPromptText() {
  if (!personaState.enabled) return "";
  const tier = Math.min(3, Math.max(0, personaState.tier));
  return `[马加7人设]\n${PERSONA_GUARDRAIL}\n${PERSONA_BY_TIER[tier]}`;
}

function personaStatusPayload() {
  return JSON.stringify({ ok: true, ...personaState });
}

function readJsonBody(req, limit = 4096) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > limit) {
        resolve(null);
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve(null);
      }
    });
    req.on("error", () => resolve(null));
  });
}

function json(res, status, body) {
  res.writeHead(status, {
    "X-Content-Type-Options": "nosniff",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function send(res, status, headers = {}) {
  res.writeHead(status, {
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  res.end();
}

function buildAssets() {
  const assetDirectory = fileURLToPath(new URL("../assets/", import.meta.url));
  const assets = new Map();
  for (const [name, type] of ASSET_SPECS) {
    const path = fileURLToPath(new URL(`../assets/${name}`, import.meta.url));
    try {
      const info = statSync(path);
      if (!info.isFile()) continue;
      assets.set(`${ASSET_PREFIX}${name}`, {
        path,
        type,
        size: info.size,
        etag: `W/\"${info.size.toString(16)}-${Math.trunc(info.mtimeMs).toString(16)}\"`,
      });
    } catch {
      // A missing optional medium is handled by the browser fallback chain.
    }
  }
  return { assetDirectory, assets };
}

function createAssetHandler(assets, activeStreams) {
  return (req, res) => {
    const method = req.method ?? "GET";
    if (method !== "GET" && method !== "HEAD") {
      send(res, 405, { Allow: "GET, HEAD" });
      return;
    }

    let pathname;
    try {
      pathname = new URL(req.url ?? "/", "http://dsh.local").pathname;
    } catch {
      send(res, 404);
      return;
    }
    const asset = assets.get(pathname);
    if (asset === undefined) {
      send(res, 404);
      return;
    }

    if (req.headers["if-none-match"] === asset.etag) {
      send(res, 304, { ETag: asset.etag });
      return;
    }

    const ifRange = req.headers["if-range"];
    const rangeHeader = ifRange !== undefined && ifRange !== asset.etag
      ? undefined
      : req.headers.range;
    const range = parseSingleRange(rangeHeader, asset.size);
    if (range === false) {
      send(res, 416, { "Content-Range": `bytes */${asset.size}` });
      return;
    }

    const start = range?.start ?? 0;
    const end = range?.end ?? asset.size - 1;
    const status = range === null ? 200 : 206;
    const headers = {
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=3600, must-revalidate",
      "Content-Length": String(end - start + 1),
      "Content-Type": asset.type,
      ETag: asset.etag,
      ...(range === null ? {} : { "Content-Range": `bytes ${start}-${end}/${asset.size}` }),
    };

    if (method === "HEAD") {
      send(res, status, headers);
      return;
    }

    res.writeHead(status, {
      "X-Content-Type-Options": "nosniff",
      ...headers,
    });
    const stream = createReadStream(asset.path, { start, end });
    activeStreams.add(stream);
    const release = () => activeStreams.delete(stream);
    stream.once("close", release);
    stream.once("end", release);
    stream.once("error", () => {
      release();
      if (!res.headersSent) send(res, 500);
      else res.destroy();
    });
    res.once("close", () => {
      if (!stream.destroyed) stream.destroy();
    });
    stream.pipe(res);
  };
}

export const inject = ["webServer", "systemPrompt"];

export function apply(ctx) {
  const { assets } = buildAssets();
  const activeStreams = new Set();

  // 档位人设：向系统提示词注册表贡献动态上下文；每次组装时按当前档位求值。
  // 用户消息完全不被修改，因此对话界面与历史记录里看不到任何指令文本。
  try {
    const unregisterPersona = ctx.systemPrompt.context({
      name: "majia7-tier-persona",
      order: 30,
      text: () => personaPromptText(),
    });
    ctx.effect(() => unregisterPersona, "liang-intensity-skin: persona context");
  } catch (error) {
    console.warn("[majia7-dsh] systemPrompt service unavailable, persona disabled:", error?.message);
    ctx.effect(() => {}, "liang-intensity-skin: persona context unavailable");
  }

  // 客户端档位/开关上报接口（POST），以及状态查询（GET）。
  const personaHandler = async (req, res) => {
    if (req.method === "GET") {
      json(res, 200, personaStatusPayload());
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { Allow: "GET, POST" });
      return;
    }
    const body = await readJsonBody(req);
    if (body === null || typeof body !== "object") {
      json(res, 400, JSON.stringify({ ok: false, error: "invalid-json" }));
      return;
    }
    if (typeof body.tier === "number" && Number.isFinite(body.tier)) {
      personaState.tier = Math.min(3, Math.max(0, Math.round(body.tier)));
    }
    if (typeof body.enabled === "boolean") {
      personaState.enabled = body.enabled;
    }
    json(res, 200, personaStatusPayload());
  };
  const unregisterRoute = [
    ctx.webServer.register({ kind: "exact", path: PERSONA_ROUTE, handler: personaHandler }),
  ];
  ctx.effect(() => () => {
    for (const dispose of unregisterRoute) dispose();
  }, "liang-intensity-skin: persona route");

  ctx.effect(() => {
    const handler = createAssetHandler(assets, activeStreams);
    const unregister = [...assets.keys()].map((path) => ctx.webServer.register({
      kind: "exact",
      path,
      handler,
    }));
    return () => {
      for (const dispose of unregister) dispose();
      for (const stream of activeStreams) stream.destroy();
      activeStreams.clear();
    };
  }, "liang-intensity-skin: static media route");
}
