import { Router, type IRouter } from "express";
import OpenAI, { toFile } from "openai";

const router: IRouter = Router();

const ALLOWED_MEDIA: Record<string, { mime: string; ext: string }> = {
  "image/jpeg": { mime: "image/jpeg", ext: "jpg" },
  "image/jpg": { mime: "image/jpeg", ext: "jpg" },
  "image/png": { mime: "image/png", ext: "png" },
  "image/webp": { mime: "image/webp", ext: "webp" },
};

router.post("/openai-clean-preview", async (req, res): Promise<void> => {
  const baseURL = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"];
  const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"];

  const { imageBase64, prompt } = (req.body ?? {}) as {
    imageBase64?: string;
    prompt?: string;
  };

  if (!baseURL || !apiKey) {
    req.log.info("OpenAI proxy env vars missing — returning mock fallback");
    res.json({ source: "mock", reason: "missing_key" });
    return;
  }

  if (!imageBase64 || typeof imageBase64 !== "string") {
    req.log.info("No image provided — returning mock fallback");
    res.json({ source: "mock", reason: "missing_image" });
    return;
  }

  if (!prompt || typeof prompt !== "string") {
    req.log.info("No prompt provided — returning mock fallback");
    res.json({ source: "mock", reason: "missing_prompt" });
    return;
  }

  try {
    let inputMime = "image/jpeg";
    let data = imageBase64;
    const dataUriMatch = /^data:([^;]+);base64,(.+)$/.exec(data);
    if (dataUriMatch) {
      inputMime = dataUriMatch[1].toLowerCase();
      data = dataUriMatch[2];
    }
    const mapped = ALLOWED_MEDIA[inputMime] ?? { mime: "image/png", ext: "png" };
    const buffer = Buffer.from(data, "base64");
    const file = await toFile(buffer, `input.${mapped.ext}`, { type: mapped.mime });

    const client = new OpenAI({ apiKey, baseURL });
    const response = await client.images.edit({
      model: "gpt-image-1",
      image: file,
      prompt,
      size: "1024x1024",
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64 || typeof b64 !== "string" || b64.length === 0) {
      throw new Error("No image returned from OpenAI");
    }

    if (b64 === data) {
      throw new Error("OpenAI returned the input image unchanged");
    }

    res.json({
      source: "openai",
      imageBase64: `data:image/png;base64,${b64}`,
    });
  } catch (err) {
    req.log.error(
      { err: err instanceof Error ? err.message : String(err) },
      "openai-clean-preview failed — returning mock fallback",
    );
    res.json({ source: "mock", reason: "generation_failed" });
  }
});

export default router;
