/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */
import 'react-native-url-polyfill/auto';

// eslint-disable-next-line @typescript-eslint/no-require-imports
global.TextEncoder = require('text-encoding').TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-require-imports
global.TextDecoder = require('text-encoding').TextDecoder;

// ---------------------------------------------------------------------------
// Polyfills de APIs Web necessárias para MSW 2.x no React Native (Hermes)
//
// O MSW 2.x importa interceptadores de WebSocket que usam:
//   class WebSocketOverride extends EventTarget { ... }
//   class CancelableMessageEvent extends MessageEvent { ... }
//   class CloseEvent extends Event { ... }
//
// Hermes não implementa nenhuma dessas — precisamos polyfill tudo ANTES
// que o metro require() resolva os módulos do MSW.
// ---------------------------------------------------------------------------

// ── EventTarget ─────────────────────────────────────────────────────────────
if (typeof global.EventTarget === 'undefined') {
  // @ts-expect-error
  global.EventTarget = class EventTarget {
    private _listeners: Map<string, Set<{ listener: Function; options?: any }>>;

    constructor() {
      this._listeners = new Map();
    }

    addEventListener(
      type: string,
      listener: Function | null,
      options?: any,
    ): void {
      if (!listener) return;

      if (!this._listeners.has(type)) {
        this._listeners.set(type, new Set());
      }

      const entry = { listener, options };
      this._listeners.get(type)!.add(entry);

      // Suporte a AbortSignal (usado internamente pelo MSW)
      const signal = options?.signal as AbortSignal | undefined;
      if (signal) {
        signal.addEventListener('abort', () => {
          this._listeners.get(type)?.delete(entry);
        });
      }
    }

    removeEventListener(
      type: string,
      listener: Function | null,
      _options?: any,
    ): void {
      if (!listener) return;
      const bucket = this._listeners.get(type);
      if (!bucket) return;

      for (const entry of bucket) {
        if (entry.listener === listener) {
          bucket.delete(entry);
          break;
        }
      }
    }

    dispatchEvent(event: any): boolean {
      const type: string = event.type;
      const bucket = this._listeners.get(type);
      if (!bucket) return true;

      for (const entry of Array.from(bucket)) {
        // once
        if (entry.options === true || entry.options?.once) {
          bucket.delete(entry);
        }

        try {
          if (typeof entry.listener === 'function') {
            entry.listener.call(this, event);
          } else if (
            entry.listener &&
            typeof (entry.listener as any).handleEvent === 'function'
          ) {
            (entry.listener as any).handleEvent(event);
          }
        } catch (err) {
          console.error('[EventTarget polyfill] listener error:', err);
        }
      }

      return !(event as any).defaultPrevented;
    }

    /** Auxiliar interno para o MSW — retorna quantidade de listeners */
    listenerCount(type: string): number {
      return this._listeners.get(type)?.size ?? 0;
    }
  };
}

// ── Event ───────────────────────────────────────────────────────────────────
if (typeof global.Event === 'undefined') {
  // @ts-expect-error
  global.Event = class Event {
    public type: string;
    public cancelable: boolean;
    public defaultPrevented: boolean;
    public target: any;
    public currentTarget: any;

    constructor(type: string, init?: any) {
      this.type = type;
      this.cancelable = init?.cancelable ?? false;
      this.defaultPrevented = false;
      this.target = null;
      this.currentTarget = null;
    }

    preventDefault(): void {
      if (this.cancelable) {
        this.defaultPrevented = true;
      }
    }

    stopPropagation(): void {
      /* noop */
    }
    stopImmediatePropagation(): void {
      /* noop */
    }
  };
}

// ── MessageEvent ────────────────────────────────────────────────────────────
if (typeof global.MessageEvent === 'undefined') {
  // @ts-expect-error
  global.MessageEvent = class MessageEvent extends (global.Event as any) {
    public data: any;
    public origin: string;
    public lastEventId: string;

    constructor(type: string, init?: any) {
      super(type, init);
      this.data = init?.data ?? null;
      this.origin = init?.origin ?? '';
      this.lastEventId = init?.lastEventId ?? '';
    }
  };
}

// ── CloseEvent ──────────────────────────────────────────────────────────────
if (typeof global.CloseEvent === 'undefined') {
  // @ts-expect-error
  global.CloseEvent = class CloseEvent extends (global.Event as any) {
    public code: number;
    public reason: string;
    public wasClean: boolean;

    constructor(type: string, init?: any) {
      super(type, init);
      this.code = init?.code ?? 0;
      this.reason = init?.reason ?? '';
      this.wasClean = init?.wasClean ?? false;
    }
  };
}

// ── BroadcastChannel (stub — MSW pode verificar existência) ─────────────────
if (typeof global.BroadcastChannel === 'undefined') {
  // @ts-expect-error
  global.BroadcastChannel = class BroadcastChannel {
    public name: string;
    constructor(name: string) {
      this.name = name;
    }
    postMessage(_data: unknown): void {
      /* noop */
    }
    close(): void {
      /* noop */
    }
    addEventListener(): void {
      /* noop */
    }
    removeEventListener(): void {
      /* noop */
    }
  };
}

// ── XMLHttpRequestUpload ─────────────────────────────────────────────────────────
if (typeof global.XMLHttpRequestUpload === 'undefined') {
  // @ts-expect-error
  global.XMLHttpRequestUpload = class XMLHttpRequestUpload extends (
    (global.EventTarget as any)
  ) {
    /* stub */
  };
}

// ── Patch: getAllResponseHeaders (Evitar crash do @mswjs/interceptors) ──────
if (typeof global.XMLHttpRequest !== 'undefined') {
  const originalGetAllResponseHeaders =
    global.XMLHttpRequest.prototype.getAllResponseHeaders;
  global.XMLHttpRequest.prototype.getAllResponseHeaders = function () {
    const headers = originalGetAllResponseHeaders.call(this);
    return headers === null || headers === undefined ? '' : headers;
  };
}

console.log(
  '[MSW] Polyfills loaded (EventTarget, Event, MessageEvent, CloseEvent, XMLHttpRequestUpload)',
);
