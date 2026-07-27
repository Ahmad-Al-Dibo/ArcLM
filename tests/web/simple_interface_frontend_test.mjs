import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { JSDOM } = require("../../web/node_modules/jsdom");

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const htmlPath = resolve(root, "src/arclm/templates/index.html");
const html = readFileSync(htmlPath, "utf8").replace("{{ default_model_source }}", "Fake/Model");

const events = [
  {
    event_id: "event_001",
    operation_id: "model_load_abc",
    timestamp: "2026-07-26T20:00:00+00:00",
    category: "model",
    level: "info",
    stage: "loading_weights",
    message: "Loading model weight files.",
    progress: null,
    details: {}
  },
  {
    event_id: "event_002",
    operation_id: "model_load_abc",
    timestamp: "2026-07-26T20:00:01+00:00",
    category: "model",
    level: "debug",
    stage: "debug_probe",
    message: "Hidden unless debug is enabled.",
    progress: null,
    details: {}
  }
];

let activeStatus = {
  state: "loading",
  operation_id: "model_load_abc",
  model_source: "Fake/Model",
  message: "Loading model.",
  can_cancel: true,
  cancel_requested: false
};
let fetchCalls = [];
let sentMessages = 0;
let sentMessageContents = [];

class FakeEventSource {
  constructor(url) {
    this.url = url;
    this.listeners = {};
    FakeEventSource.instances.push(this);
  }
  addEventListener(type, callback) {
    this.listeners[type] = callback;
  }
  emit(type, payload, lastEventId = payload.event_id) {
    this.listeners[type]?.({ data: JSON.stringify(payload), lastEventId });
  }
  close() {
    this.closed = true;
  }
}
FakeEventSource.instances = [];

function jsonResponse(payload, ok = true) {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve(payload)
  });
}

const dom = new JSDOM(html, {
  url: "http://127.0.0.1:5000/",
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
  beforeParse(window) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
    window.navigator.clipboard = { writeText() {} };
    window.confirm = () => true;
    window.EventSource = FakeEventSource;
    window.fetch = async (path, options = {}) => {
      fetchCalls.push({ path: String(path), options });
      if (path === "/api/settings") {
        return jsonResponse({
          success: true,
          settings: {
            active_template_id: "basic-chat",
            appearance: { show_timestamps: false, show_token_counts: true, show_model_metadata: true },
            context: {},
            generation: {},
            privacy: {},
            agent: { mode: "chat" }
          }
        });
      }
      if (path === "/api/templates") {
        return jsonResponse({ success: true, templates: [{ id: "basic-chat", name: "Basic Chat", output: { type: "messages" } }] });
      }
      if (path === "/api/models/active") {
        return jsonResponse({
          success: true,
          active: {
            loaded: false,
            model_source: "Fake/Model",
            operation_status: activeStatus,
            capabilities: { streaming: false }
          }
        });
      }
      if (path === "/api/chats?q=" || String(path).startsWith("/api/chats?q=")) {
        return jsonResponse({ success: true, chats: [] });
      }
      if (path === "/api/chats" && options.method === "POST") {
        return jsonResponse({
          success: true,
          conversation: {
            id: "chat_1",
            title: "New chat",
            messages: [],
            chat_template_id: "basic-chat",
            context_settings: {},
            generation_settings: {}
          }
        });
      }
      if (path === "/api/chats" && options.method === "DELETE") {
        return jsonResponse({ success: true, deleted_count: 1, deleted_ids: ["chat_1"], sidecar_rows_deleted: 3 });
      }
      if (path === "/api/operations/events") {
        return jsonResponse({ success: true, events, status: activeStatus });
      }
      if (String(path).startsWith("/api/operations/events?after=")) {
        return jsonResponse({ success: true, events: [], status: activeStatus });
      }
      if (path === "/api/operations/status") {
        return jsonResponse({
          success: true,
          status: activeStatus,
          active: { loaded: activeStatus.state === "ready", model_source: "Fake/Model", capabilities: { streaming: false } }
        });
      }
      if (path === "/api/models/load") {
        activeStatus = {
          state: "loading",
          operation_id: "model_load_retry",
          model_source: "Fake/Model",
          message: "Retry loading.",
          can_cancel: true,
          cancel_requested: false
        };
        return jsonResponse({ success: true, operation_id: "model_load_retry", status: activeStatus });
      }
      if (String(path).startsWith("/api/operations/") && String(path).endsWith("/cancel")) {
        activeStatus = { ...activeStatus, state: "cancelled", can_cancel: false, cancel_requested: true };
        return jsonResponse({ success: true, status: activeStatus });
      }
      if (String(path).startsWith("/api/chats/") && String(path).endsWith("/messages")) {
        sentMessages += 1;
        const request = JSON.parse(options.body || "{}");
        sentMessageContents.push(request.content);
        const runId = `run_${sentMessages}`;
        const assistantId = `msg_assistant_${sentMessages}`;
        return jsonResponse({
          success: true,
          conversation: {
            id: "chat_1",
            title: "New chat",
            messages: [
              { id: `msg_user_${sentMessages}`, role: "user", content: request.content, status: "complete" },
              { id: assistantId, role: "assistant", content: "", status: "queued" }
            ],
            chat_template_id: "basic-chat"
          },
          generation_run: { id: runId, operation_id: `operation_${sentMessages}` },
          generation_request: { id: runId, status: "queued" },
          assistant_message: { id: assistantId, role: "assistant", content: "", status: "queued" },
          queue: { global_queued_count: 0, conversation_queued_count: 0 }
        });
      }
      return jsonResponse({ success: true });
    };
  }
});

const { window } = dom;

function delay(ms = 0) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

await new Promise(resolve => window.document.addEventListener("DOMContentLoaded", resolve));
await delay(30);

const evalInWindow = expression => window.eval(expression);

assert.match(window.document.getElementById("modelPill").textContent, /Loading/);
assert.equal(window.document.getElementById("composerInput").disabled, true);
assert.equal(window.document.getElementById("loadModelButton").disabled, true);
assert.equal(window.document.getElementById("cancelOperationButton").disabled, false);
assert.equal(window.document.getElementById("chatModeButton").classList.contains("active"), true);
await window.setConversationMode("agent", false);
assert.equal(window.document.getElementById("agentModeButton").classList.contains("active"), true);

evalInWindow('state.activeResponse = { operationId: null, stage: "Preparing request", startedAt: "2026-07-26T20:00:00+00:00" }');
const thinkingNode = window.renderMessage({ id: "pending_test", role: "assistant", content: "", status: "thinking", created_at: "2026-07-26T20:00:00+00:00" });
assert.match(thinkingNode.textContent, /Preparing request/);
assert.equal(thinkingNode.querySelectorAll(".thinking-dots span").length, 3);

const metricsNode = window.renderMessage({
  id: "metric_test",
  role: "assistant",
  content: "Done",
  status: "complete",
  model: { primary_device: "cuda:0", dtype: "float16" },
  generation_metadata: {
    token_metrics: { total_input_tokens: 10, input_token_count_type: "estimated", generated_output_tokens: 4 },
    response_metrics: { durations_ms: { total_duration_ms: 1250 }, tokens_per_second: 8 },
    agent: {
      tool_calls: [{ id: "tool_call_1", tool_name: "inspect_model", status: "completed", duration_ms: 25, permission_category: "pure", side_effect: "none" }],
      tool_results: [{ tool_call_id: "tool_call_1", structured_safe_result: { success: true, value: { primary_device: "cuda:0" } } }]
    }
  }
});
assert.match(metricsNode.textContent, /4 output tokens/);
assert.match(metricsNode.textContent, /inspect_model/);
assert.equal(metricsNode.querySelectorAll(".tool-card").length, 1);

window.renderTemplatePreview(
  {
    valid: true,
    token_count: 12,
    preview: [
      { role: "system", content: "System rules" },
      { role: "user", content: "Question" },
      { role: "assistant", content: "Answer" }
    ],
    errors: []
  },
  {
    name: "Role Cards",
    description: "Structured role preview.",
    roles: { system: "system", user: "user", assistant: "assistant" },
    input_mapping: { user_input_field: "content" },
    output: { type: "messages" }
  }
);
assert.equal(window.document.querySelectorAll("#templatePreview .preview-message").length, 3);
assert.match(window.document.getElementById("templatePreview").textContent, /system/);
assert.match(window.document.getElementById("templatePreview").textContent, /"role": "assistant"/);

const exactPrompt = "System: Rules\nUser: Question\nAssistant:";
window.renderTemplatePreview(
  { valid: true, token_count: 8, preview: exactPrompt, errors: [] },
  {
    name: "Formatted Prompt",
    roles: { user: "human", assistant: "model" },
    input_mapping: { user_input_field: "content" },
    output: { type: "formatted_text" }
  }
);
assert.match(window.document.querySelector("#templatePreview .preview-message").textContent, /prompt/);
assert.equal(window.document.querySelector("#templatePreview .preview-code").textContent, exactPrompt);

window.renderTemplatePreview(
  { valid: false, token_count: 0, preview: null, errors: [{ code: "template_placeholder_unknown", message: "Unknown placeholder(s): missing" }] },
  { name: "Invalid", roles: {}, input_mapping: {}, output: { type: "formatted_text" } }
);
assert.match(window.document.querySelector("#templatePreview .preview-issues").textContent, /template_placeholder_unknown/);

window.toggleTerminal(true);
assert.equal(window.document.getElementById("terminalDrawer").classList.contains("open"), true);
Object.defineProperty(window.document.getElementById("terminalBody"), "scrollHeight", { value: 120, configurable: true });
window.renderTerminalEvents();
assert.equal(window.document.getElementById("terminalBody").scrollTop, 120);
assert.match(window.document.getElementById("terminalBody").textContent, /loading_weights/);
assert.doesNotMatch(window.document.getElementById("terminalBody").textContent, /debug_probe/);

window.document.getElementById("showDebugEvents").checked = true;
window.renderTerminalEvents();
assert.match(window.document.getElementById("terminalBody").textContent, /debug_probe/);

FakeEventSource.instances[0].emit("operation", {
  event_id: "event_003",
  operation_id: "model_load_abc",
  timestamp: "2026-07-26T20:00:02+00:00",
  category: "model",
  level: "success",
  stage: "ready",
  message: "Model loaded and ready.",
  progress: null,
  details: {}
});
assert.match(window.document.getElementById("terminalBody").textContent, /Model loaded and ready/);

activeStatus = { ...activeStatus, state: "ready", can_cancel: false };
await window.refreshOperationStatus();
assert.match(window.document.getElementById("modelPill").textContent, /Ready/);
assert.equal(window.document.getElementById("composerInput").disabled, false);

activeStatus = {
  state: "error",
  operation_id: "model_load_error",
  model_source: "Fake/Model",
  message: "Model loading failed.",
  can_cancel: false,
  cancel_requested: false
};
await window.refreshOperationStatus();
assert.match(window.document.getElementById("modelPill").textContent, /Error/);
assert.equal(window.document.getElementById("loadModelButton").disabled, false);

await window.loadModel();
assert.match(window.document.getElementById("modelPill").textContent, /Loading/);
assert.equal(window.document.getElementById("terminalDrawer").classList.contains("open"), true);
assert.ok(fetchCalls.some(call => call.path === "/api/models/load"));

activeStatus = {
  state: "loading",
  operation_id: "model_load_cancel",
  model_source: "Fake/Model",
  message: "Loading model.",
  can_cancel: true,
  cancel_requested: false
};
await window.refreshOperationStatus();
await window.cancelActiveOperation();
assert.match(window.document.getElementById("modelPill").textContent, /Cancelled/);

activeStatus = {
  state: "ready",
  operation_id: "model_load_ready",
  model_source: "Fake/Model",
  message: "Ready.",
  can_cancel: false,
  cancel_requested: false
};
await window.refreshOperationStatus();
evalInWindow('state.activeResponse = null; state.activeGenerations = {};');
window.document.getElementById("composerInput").value = "Hello";
await window.sendMessage();
await delay(30);
assert.equal(sentMessages, 1);
assert.deepEqual(sentMessageContents, ["Hello"]);
window.handleGenerationEvent({
  generation_id: "run_1",
  operation_id: "operation_1",
  conversation_id: "chat_1",
  message_id: "msg_assistant_1",
  type: "generation_completed",
  sequence: 1,
  final_text: "Hi there"
});
await delay(30);

window.document.getElementById("composerInput").value = "First question?\nSecond question?\nThird question?";
await window.sendMessage();
await delay(30);
assert.equal(sentMessages, 2);
assert.deepEqual(sentMessageContents.slice(-1), ["First question?"]);
assert.match(window.document.getElementById("promptQueuePanel").textContent, /2 prompts staged/);
assert.match(window.document.getElementById("promptQueuePanel").textContent, /Second question/);
assert.match(window.document.getElementById("promptQueuePanel").textContent, /Third question/);

window.handleGenerationEvent({
  generation_id: "run_2",
  operation_id: "operation_2",
  conversation_id: "chat_1",
  message_id: "msg_assistant_2",
  type: "generation_completed",
  sequence: 1,
  final_text: "Answer one"
});
await delay(30);
assert.equal(sentMessages, 3);
assert.deepEqual(sentMessageContents.slice(-1), ["Second question?"]);
assert.match(window.document.getElementById("promptQueuePanel").textContent, /1 prompt staged/);

window.handleGenerationEvent({
  generation_id: "run_3",
  operation_id: "operation_3",
  conversation_id: "chat_1",
  message_id: "msg_assistant_3",
  type: "generation_completed",
  sequence: 1,
  final_text: "Answer two"
});
await delay(30);
assert.equal(sentMessages, 4);
assert.deepEqual(sentMessageContents.slice(-1), ["Third question?"]);
const messagesPane = window.document.getElementById("messagesPane");
Object.defineProperty(messagesPane, "scrollHeight", { value: 1000, configurable: true });
Object.defineProperty(messagesPane, "clientHeight", { value: 300, configurable: true });
messagesPane.scrollTop = 120;
evalInWindow('state.chatAutoScroll = false; state.currentChat.messages = [{ id: "old_user", role: "user", content: "Older message", status: "complete" }, { id: "old_assistant", role: "assistant", content: "Older answer", status: "streaming" }];');
window.renderConversation({ preserveAnimation: true });
assert.equal(messagesPane.scrollTop, 120);
assert.equal(window.document.getElementById("jumpLatestButton").classList.contains("hidden"), false);
window.jumpToLatest();
assert.equal(messagesPane.scrollTop, 1000);
assert.equal(window.document.getElementById("jumpLatestButton").classList.contains("hidden"), true);
assert.match(window.document.querySelector(".sidebar-footer").textContent, /Delete all chats/);
evalInWindow('state.chats = [{ id: "chat_1", title: "New chat", message_count: 2 }]; state.activeResponse = null; state.activeGenerations = {};');
await window.deleteAllChats();
assert.ok(fetchCalls.some(call => call.path === "/api/chats" && call.options.method === "DELETE"));
assert.match(window.document.getElementById("composerContext").textContent, /Mode: Agent|Mode: Chat/);

const source = readFileSync(htmlPath, "utf8");
assert.match(source, /@media \(max-width: 880px\)/);
assert.match(source, /\.terminal-drawer \{ left: 0; \}/);
assert.match(source, /prefers-reduced-motion: reduce/);
assert.match(source, /jumpLatestButton/);
assert.match(source, /scrollChatToBottomIfPinned/);
assert.match(source, /thinking-indicator/);
assert.match(source, /Agent/);
assert.match(source, /tool-card/);
assert.match(source, /response_metrics/);
assert.match(source, /--background:/);
assert.match(source, /--surface-elevated:/);
assert.match(source, /--border:/);
assert.match(source, /--text-primary:/);
assert.match(source, /--text-secondary:/);
assert.match(source, /--focus-ring:/);
assert.match(source, /--space-3:/);
assert.match(source, /--radius-md:/);
assert.match(source, /--shadow:/);
assert.doesNotMatch(source, /status === "streaming"/);
assert.doesNotMatch(source, /tokenAnimation/);
assert.match(source, /tokenRevealAnimation/);

window.clearInterval(evalInWindow("state.pollTimer"));
window.state?.eventSource?.close?.();
window.close();
process.exit(0);
