import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are CleanDori, a non-judgmental Korean-language AI organizing coach with two internal personas.

Persona 1 — Professional Organizer:
- Identify visible clutter zones, usable surfaces, and item categories.
- Choose the easiest starting zone.
- Create practical 3 / 5 / 10 minute organizing missions.

Persona 2 — Gentle Behavioral Coach:
- Reduce shame and cognitive load.
- Do not diagnose. Do not infer mental illness from the image.
- Estimate possible organizing barriers only.
- Invite the user to self-check.
- Use autonomy-supportive, warm language.

HARD SAFETY RULES (never violate):
- Never say or imply ADHD, depression, anxiety, OCD, hoarding disorder, or any mental health diagnosis.
- Use only "possible organizing barriers" or "정리를 어렵게 만드는 실행 장벽".
- Do not shame the user. Do not call the room dirty. Do not tell the user to clean the whole room.
- If serious safety risks are visible or likely (fire hazard, blocked exits, mold, pests, structural risk), prioritize safety guidance and recommend trusted human or professional help.

LANGUAGE: All human-readable strings (gentle_summary, reason, message, mission steps, avoid items, if_then_rule, self_check_questions, preview_image_role, disclaimer) MUST be in Korean.

OUTPUT FORMAT: Output a single valid JSON object only. No markdown fences. No prose around it. The JSON MUST match this exact schema:

{
  "visible_cues": string[],
  "possible_barriers": [
    {
      "type": "visual_overload | no_clear_start | decision_fatigue | low_energy | shame_avoidance | attachment_difficulty | perfectionism | maintenance_failure | shared_space_ambiguity | safety_risk",
      "confidence": "low | medium | high",
      "reason": string
    }
  ],
  "self_check_questions": string[],
  "gentle_summary": string,
  "missions": { "3_min": string[], "5_min": string[], "10_min": string[] },
  "avoid": string[],
  "if_then_rule": string,
  "preview_image_role": string,
  "safety": { "risk_level": "normal | watch | high", "signals": string[], "message": string },
  "disclaimer": "이 안내는 정리 코칭이며 정신건강 진단이 아닙니다."
}`;

const MOCK_FALLBACK = {
  visible_cues: ["바닥에 쌓인 박스", "가구 위 잡화", "통로 일부 막힘"],
  possible_barriers: [
    {
      type: "visual_overload" as const,
      confidence: "high" as const,
      reason: "여러 박스와 물건이 한 시야에 들어와 어디서부터 시작할지 멈추기 쉬워 보입니다.",
    },
    {
      type: "no_clear_start" as const,
      confidence: "medium" as const,
      reason: "정리의 시작점이 한눈에 보이지 않습니다.",
    },
    {
      type: "decision_fatigue" as const,
      confidence: "medium" as const,
      reason: "각 물건마다 버릴지 보관할지 매번 판단해야 하는 상태로 보입니다.",
    },
  ],
  self_check_questions: [
    "지금 가장 부담스럽게 느껴지는 한 가지가 있나요?",
    "오늘 사용할 수 있는 에너지는 어느 정도인가요?",
  ],
  gentle_summary:
    "여러 물건이 섞여 있어서 어디서부터 시작할지 막막하게 느껴질 수 있어요. 전체를 치우지 않아도 괜찮아요. 지금은 한 구역만 회복해볼게요.",
  missions: {
    "3_min": [
      "바닥에 있는 종이·빈 포장재처럼 명백한 것만 한곳에 모으기",
      "박스 밖으로 나온 작은 물건 3개만 박스 안에 넣기",
      "기타 주변 통로가 보이면 바로 멈추기",
    ],
    "5_min": [],
    "10_min": [],
  },
  avoid: [
    "박스 전부 열기",
    "추억 물건 판단하기",
    "옷 정리 시작하기",
    "방 전체를 완성하려고 하기",
  ],
  if_then_rule:
    "만약 바닥에 새 물건을 내려놓게 되면, 그때는 먼저 '보류 박스' 하나에만 넣는다.",
  preview_image_role:
    "정리 후 미리보기는 완벽한 결과 약속이 아니라, 지금 공간에서 어수선함만 줄인 동기부여용 예시입니다.",
  safety: { risk_level: "normal" as const, signals: [] as string[], message: "" },
  disclaimer: "이 안내는 정리 코칭이며 정신건강 진단이 아닙니다.",
};

const BARRIER_TYPES = new Set([
  "visual_overload",
  "no_clear_start",
  "decision_fatigue",
  "low_energy",
  "shame_avoidance",
  "attachment_difficulty",
  "perfectionism",
  "maintenance_failure",
  "shared_space_ambiguity",
  "safety_risk",
]);
const CONFIDENCES = new Set(["low", "medium", "high"]);
const RISK_LEVELS = new Set(["normal", "watch", "high"]);

// Hard safety: never let any diagnostic / stigmatizing language through.
const BANNED_TERMS = [
  "adhd",
  "주의력결핍",
  "주의력 결핍",
  "우울증",
  "우울",
  "불안장애",
  "불안 장애",
  "강박장애",
  "강박 장애",
  "ocd",
  "저장강박",
  "저장 강박",
  "호더",
  "hoarding",
  "정신질환",
  "정신 질환",
  "정신과",
  "장애",
  "더러",
  "더럽",
  "지저분",
];

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");

const validateClaudeShape = (p: any): boolean => {
  if (!p || typeof p !== "object") return false;
  if (typeof p.gentle_summary !== "string" || !p.gentle_summary.trim()) return false;
  if (!isStringArray(p.visible_cues ?? [])) return false;
  if (!Array.isArray(p.possible_barriers) || p.possible_barriers.length === 0) return false;
  for (const b of p.possible_barriers) {
    if (!b || typeof b !== "object") return false;
    if (!BARRIER_TYPES.has(b.type)) return false;
    if (!CONFIDENCES.has(b.confidence)) return false;
    if (typeof b.reason !== "string") return false;
  }
  if (!isStringArray(p.self_check_questions ?? [])) return false;
  if (!p.missions || typeof p.missions !== "object") return false;
  if (!isStringArray(p.missions["3_min"]) || p.missions["3_min"].length === 0) return false;
  if (!isStringArray(p.avoid ?? [])) return false;
  if (typeof p.if_then_rule !== "string") return false;
  if (!p.safety || typeof p.safety !== "object") return false;
  if (!RISK_LEVELS.has(p.safety.risk_level)) return false;
  if (typeof p.safety.message !== "string") return false;
  return true;
};

const containsBannedTerm = (p: any): boolean => {
  const haystack = JSON.stringify(p).toLowerCase();
  return BANNED_TERMS.some((t) => haystack.includes(t));
};

const ALLOWED_MEDIA: Record<string, "image/jpeg" | "image/png" | "image/webp" | "image/gif"> = {
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/gif": "image/gif",
};

router.post("/claude-analysis", async (req, res): Promise<void> => {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  const { imageBase64, userState } = (req.body ?? {}) as {
    imageBase64?: string;
    userState?: string;
  };

  if (!apiKey) {
    req.log.info("ANTHROPIC_API_KEY missing — returning mock fallback");
    res.json({ ...MOCK_FALLBACK, source: "mock" });
    return;
  }

  try {
    let mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg";
    let data = imageBase64 ?? "";
    const dataUriMatch = /^data:([^;]+);base64,(.+)$/.exec(data);
    if (dataUriMatch) {
      mediaType = ALLOWED_MEDIA[dataUriMatch[1].toLowerCase()] ?? "image/jpeg";
      data = dataUriMatch[2];
    }

    if (!data) {
      req.log.info("No image provided — returning mock fallback");
      res.json({ ...MOCK_FALLBACK, source: "mock" });
      return;
    }

    const client = new Anthropic({ apiKey });
    const userText = `사용자 자기 응답: ${userState ?? "(미응답)"}\n첨부된 사진을 보고 시스템 지침대로 JSON 한 개만 출력하세요.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data },
            },
            { type: "text", text: userText },
          ],
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text content in Claude response");
    }

    let raw = textBlock.text.trim();
    raw = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(raw);

    if (!validateClaudeShape(parsed)) {
      throw new Error("Claude response did not match expected schema");
    }
    if (containsBannedTerm(parsed)) {
      throw new Error("Claude response contained disallowed diagnostic language");
    }

    res.json({ ...parsed, source: "claude" });
  } catch (err) {
    req.log.error(
      { err: err instanceof Error ? err.message : String(err) },
      "claude-analysis failed — falling back to mock",
    );
    res.json({ ...MOCK_FALLBACK, source: "mock" });
  }
});

export default router;
