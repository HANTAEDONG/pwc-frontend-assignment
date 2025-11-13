const { TextEncoder, TextDecoder } = require("util");
const {
  ReadableStream,
  WritableStream,
  TransformStream,
} = require("stream/web");
const {
  MessageChannel,
  MessagePort,
  MessageEvent,
  BroadcastChannel,
} = require("worker_threads");

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost";
}

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}

if (!globalThis.ReadableStream) {
  globalThis.ReadableStream = ReadableStream;
}

if (!globalThis.WritableStream) {
  globalThis.WritableStream = WritableStream;
}

if (!globalThis.TransformStream) {
  globalThis.TransformStream = TransformStream;
}

if (!globalThis.MessageChannel) {
  globalThis.MessageChannel = MessageChannel;
}

if (!globalThis.MessagePort) {
  globalThis.MessagePort = MessagePort;
}

if (!globalThis.MessageEvent) {
  globalThis.MessageEvent = MessageEvent;
}

if (!globalThis.BroadcastChannel) {
  globalThis.BroadcastChannel = BroadcastChannel;
}

try {
  const { fetch: undiciFetch, Headers, Request, Response } = require("undici");
  globalThis.fetch = undiciFetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
} catch {}

export {};
