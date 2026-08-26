import { describe, expect, it } from "vitest";
import { apply, PERSONA_ROUTE } from "./index.js";

function makeCtx() {
  const routes = new Map();
  let personaProvider;
  const ctx = {
    webServer: {
      register(route) {
        routes.set(route.path, route.handler);
        return () => routes.delete(route.path);
      },
    },
    systemPrompt: {
      context(contribution) {
        personaProvider = contribution.text;
        return () => {};
      },
    },
    effect(fn) {
      // 立即执行注册类副作用，保持与 cordis 相近的生命周期语义。
      fn();
    },
  };
  return { ctx, routes, getProvider: () => personaProvider };
}

function callHandler(handler, method, bodyObj) {
  const chunks = bodyObj === undefined ? [] : [JSON.stringify(bodyObj)];
  const req = {
    method,
    on(event, fn) {
      if (event === "data") chunks.forEach(fn);
      if (event === "end") fn();
    },
  };
  let status = 0;
  let text = "";
  const res = {
    writeHead(code) {
      status = code;
    },
    end(body) {
      text = body ?? "";
    },
  };
  return Promise.resolve(handler(req, res)).then(() => ({ status, text }));
}

describe("majia7 tier persona (server side)", () => {
  it("registers the persona route and a dynamic prompt context", () => {
    const c = makeCtx();
    apply(c.ctx);
        expect(c.routes.has(PERSONA_ROUTE)).toBe(true);
    expect(typeof c.getProvider()).toBe("function");
    // 默认状态：max · 开启。
    expect(c.getProvider()()).toContain("[马加7人设]");
    expect(c.getProvider()()).toContain("霸总");
    expect(c.getProvider()()).toContain("自称「马加7」");
    expect(c.getProvider()()).toContain("女孩子");
  });

  it("follows reported tier and enable toggle", async () => {
    const c = makeCtx();
    apply(c.ctx);
    const handler = c.routes.get(PERSONA_ROUTE);

    await callHandler(handler, "POST", { tier: 0, enabled: true });
    expect(c.getProvider()()).toContain("油腻");

    await callHandler(handler, "POST", { tier: 2, enabled: true });
    expect(c.getProvider()()).toContain("清爽干练");

    await callHandler(handler, "POST", { tier: 20 });
    expect(c.getProvider()()).toContain("霸总"); // 越界档位被钳制到 max

    await callHandler(handler, "POST", { enabled: false });
    expect(c.getProvider()()).toBe("");

    await callHandler(handler, "POST", { enabled: true, tier: 3 });
    expect(c.getProvider()()).toContain("霸总");

    const status = await callHandler(handler, "GET");
    expect(status.status).toBe(200);
    expect(JSON.parse(status.text)).toEqual({ ok: true, tier: 3, enabled: true });
  });

  it("answers 400 for malformed json bodies", async () => {
    const c = makeCtx();
    apply(c.ctx);
    const handler = c.routes.get(PERSONA_ROUTE);
    const req = {
      method: "POST",
      on(event, fn) {
        if (event === "data") fn("{not-json");
        if (event === "end") fn();
      },
    };
    let status = 0;
    const res = { writeHead(code) { status = code; }, end() {} };
    await handler(req, res);
    expect(status).toBe(400);
  });
});
