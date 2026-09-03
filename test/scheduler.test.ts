import { describe, expect, it } from "vitest";
import {
  decideFinalResponse,
  decideHeartbeat,
  shouldEvaluateFinalResponse,
  shouldEvaluateHeartbeat,
} from "../src/scheduler.js";
import type { ShadowDefinition } from "../src/types.js";

const shadow = (
  id: string,
  probability = 1,
  trigger: ShadowDefinition["trigger"] = ["heartbeat"],
): ShadowDefinition => ({
  id,
  name: id,
  enabled: true,
  debug: false,
  activationProbability: probability,
  trigger,
  activeForModels: ["openai/gpt"],
  tools: [],
  prompt: id,
  filePath: `${id}.md`,
});

describe("shouldEvaluateHeartbeat", () => {
  it("suppresses pure conversation turns", () => {
    expect(shouldEvaluateHeartbeat([])).toBe(false);
  });

  it("allows turns that completed Main tool work", () => {
    expect(shouldEvaluateHeartbeat([{ toolName: "read" }])).toBe(true);
  });
});

describe("shouldEvaluateFinalResponse", () => {
  it("accepts an agent run ending with final assistant text", () => {
    expect(
      shouldEvaluateFinalResponse([
        { role: "user", content: "task" },
        { role: "assistant", content: [{ type: "text", text: "Done." }] },
      ]),
    ).toBe(true);
  });

  it("rejects tool-only, empty, and aborted endings", () => {
    expect(
      shouldEvaluateFinalResponse([
        { role: "assistant", content: [{ type: "toolCall", name: "read" }] },
      ]),
    ).toBe(false);
    expect(
      shouldEvaluateFinalResponse([
        { role: "assistant", content: [{ type: "text", text: "  " }] },
      ]),
    ).toBe(false);
    expect(shouldEvaluateFinalResponse([])).toBe(false);
  });
});

describe("decideHeartbeat", () => {
  it("rolls independently and caps selected shadows", () => {
    const rolls = [0.1, 0.1, 0.2, 0.3, 0.8, 0.4];
    const result = decideHeartbeat({
      heartbeatProbability: 1 / 3,
      availableSlots: 2,
      shadows: [shadow("a"), shadow("b"), shadow("c")],
      activeShadowIds: new Set(),
      mainModelId: "openai/gpt",
      random: () => rolls.shift() ?? 0,
    });
    expect(result.activated).toHaveLength(2);
    expect(result.candidates).toHaveLength(3);
  });

  it("does nothing when heartbeat misses", () => {
    const result = decideHeartbeat({
      heartbeatProbability: 0.3,
      availableSlots: 2,
      shadows: [shadow("a")],
      activeShadowIds: new Set(),
      mainModelId: "openai/gpt",
      random: () => 0.5,
    });
    expect(result.activated).toEqual([]);
  });

  it("reports running-excluded and model-filtered shadows", () => {
    const result = decideHeartbeat({
      heartbeatProbability: 1,
      availableSlots: 2,
      shadows: [shadow("a"), shadow("b")],
      activeShadowIds: new Set(["a"]),
      mainModelId: "other/model",
      random: () => 0.1,
    });
    expect(result.runningExcluded).toEqual(["a"]);
    expect(result.modelFiltered).toEqual(["b"]);
    expect(result.activated).toEqual([]);
    expect(result.candidates).toEqual([]);
  });
});

describe("decideFinalResponse", () => {
  it("activates every matching final-response shadow without probability rolls", () => {
    const result = decideFinalResponse({
      shadows: [
        shadow("heartbeat"),
        shadow("final-a", 0, ["final_response"]),
        shadow("final-b", 0, ["heartbeat", "final_response"]),
      ],
      mainModelId: "openai/gpt",
    });
    expect(result.activated.map(({ shadow }) => shadow.id)).toEqual([
      "final-a",
      "final-b",
    ]);
    expect(result.candidates.every(({ selected }) => selected)).toBe(true);
  });

  it("still applies enabled and model filters", () => {
    const disabled = {
      ...shadow("disabled", 1, ["final_response"]),
      enabled: false,
    };
    const otherModel = {
      ...shadow("other", 1, ["final_response"]),
      activeForModels: ["other/model"],
    };
    const result = decideFinalResponse({
      shadows: [disabled, otherModel],
      mainModelId: "openai/gpt",
    });
    expect(result.activated).toEqual([]);
    expect(result.modelFiltered).toEqual(["other"]);
  });
});
