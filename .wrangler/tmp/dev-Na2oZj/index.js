var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/ideas.ts
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var TITLE_MAX = 200;
var TEXT_MAX = 5e3;
function rowToIdea(row) {
  return {
    id: row.id,
    title: row.title,
    text: row.text,
    updated: row.updated === 1,
    time: row.time
  };
}
__name(rowToIdea, "rowToIdea");
var ValidationError = class extends Error {
  static {
    __name(this, "ValidationError");
  }
};
function requireString(value, field, max) {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} is required and must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new ValidationError(`${field} cannot be empty`);
  }
  if (trimmed.length > max) {
    throw new ValidationError(`${field} cannot be longer than ${max} characters`);
  }
  return trimmed;
}
__name(requireString, "requireString");
function normaliseTime(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  return Date.now();
}
__name(normaliseTime, "normaliseTime");
function parseCreate(body) {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("body must be a JSON object");
  }
  const raw = body;
  if (typeof raw.id !== "string" || !UUID_RE.test(raw.id)) {
    throw new ValidationError("id is required and must be a uuid");
  }
  return {
    id: raw.id,
    title: requireString(raw.title, "title", TITLE_MAX),
    text: requireString(raw.text, "text", TEXT_MAX),
    time: normaliseTime(raw.time)
  };
}
__name(parseCreate, "parseCreate");
function parseUpdate(body) {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("body must be a JSON object");
  }
  const raw = body;
  return {
    title: requireString(raw.title, "title", TITLE_MAX),
    text: requireString(raw.text, "text", TEXT_MAX),
    time: normaliseTime(raw.time)
  };
}
__name(parseUpdate, "parseUpdate");

// worker/index.ts
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
__name(json, "json");
function error(message, status) {
  return json({ error: message }, status);
}
__name(error, "error");
async function readBody(request) {
  try {
    return await request.json();
  } catch {
    throw new ValidationError("body must be valid JSON");
  }
}
__name(readBody, "readBody");
async function listIdeas(env) {
  const { results } = await env.DB.prepare(
    "SELECT id, title, text, updated, time FROM ideas ORDER BY time DESC"
  ).all();
  return json((results ?? []).map(rowToIdea));
}
__name(listIdeas, "listIdeas");
async function createIdea(request, env) {
  const idea = parseCreate(await readBody(request));
  const existing = await env.DB.prepare("SELECT id FROM ideas WHERE id = ?").bind(idea.id).first();
  if (existing) {
    return error("an idea with that id already exists", 409);
  }
  await env.DB.prepare(
    "INSERT INTO ideas (id, title, text, time, updated) VALUES (?, ?, ?, ?, 0)"
  ).bind(idea.id, idea.title, idea.text, idea.time).run();
  return json({ ...idea, updated: false }, 201);
}
__name(createIdea, "createIdea");
async function updateIdea(request, env, id) {
  const payload = parseUpdate(await readBody(request));
  const row = await env.DB.prepare(
    "UPDATE ideas SET title = ?, text = ?, time = ?, updated = 1 WHERE id = ? RETURNING id, title, text, updated, time"
  ).bind(payload.title, payload.text, payload.time, id).first();
  if (!row) return error("no idea with that id", 404);
  return json(rowToIdea(row));
}
__name(updateIdea, "updateIdea");
async function deleteIdea(env, id) {
  const row = await env.DB.prepare(
    "DELETE FROM ideas WHERE id = ? RETURNING id"
  ).bind(id).first();
  if (!row) return error("no idea with that id", 404);
  return new Response(null, { status: 204 });
}
__name(deleteIdea, "deleteIdea");
async function handleApi(request, env, path) {
  const method = request.method.toUpperCase();
  if (path === "/api/ideas") {
    if (method === "GET") return listIdeas(env);
    if (method === "POST") return createIdea(request, env);
    return error("method not allowed", 405);
  }
  const match = path.match(/^\/api\/ideas\/([^/]+)$/);
  if (match) {
    const id = decodeURIComponent(match[1]);
    if (method === "PUT") return updateIdea(request, env, id);
    if (method === "DELETE") return deleteIdea(env, id);
    return error("method not allowed", 405);
  }
  return error("not found", 404);
}
__name(handleApi, "handleApi");
var worker_default = {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (!path.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }
    try {
      return await handleApi(request, env, path);
    } catch (cause) {
      if (cause instanceof ValidationError) {
        return error(cause.message, 400);
      }
      console.error("idea-board api failure", cause);
      return error("internal server error", 500);
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error2 = reduceError(e);
    const body = JSON.stringify(error2);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-LcT6E9/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-LcT6E9/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
