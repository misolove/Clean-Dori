import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();

const ALLOWED_MEDIA: Record<string, string> = {
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/gif": "image/gif",
};

router.post("/gemini-clean-preview", async (req, res): Promise<void> => {
  const apiKey = process.env["GEMINI_API_KEY"];
  const { imageBase64, prompt } = (req.body ?? {}) as {
    imageBase64?: string;
    prompt?: string;
  };

  if (!apiKey) {
    req.log.info("GEMINI_API_KEY missing — returning mock fallback");
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
    let mimeType = "image/jpeg";
    let data = imageBase64;
    const dataUriMatch = /^data:([^;]+);base64,(.+)$/.exec(data);
    if (dataUriMatch) {
      mimeType = ALLOWED_MEDIA[dataUriMatch[1].toLowerCase()] ?? "image/jpeg";
      data = dataUriMatch[2];
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data } },
            { text: prompt },
          ],
        },
      ],
    });

    const parts = response?.candidates?.[0]?.content?.parts ?? [];
    let outImage: { mimeType: string; data: string } | null = null;
    for (const p of parts) {
      const inline = (p as any).inlineData;
      if (inline && typeof inline.data === "string" && inline.data.length > 0) {
        outImage = {
          mimeType: typeof inline.mimeType === "string" ? inline.mimeType : "image/png",
          data: inline.data,
        };
        break;
      }
    }

    if (!outImage) {
      throw new Error("No image returned from Gemini");
    }

    if (outImage.data === data) {
      throw new Error("Gemini returned the input image unchanged");
    }

    res.json({
      source: "gemini",
      imageBase64: `data:${outImage.mimeType};base64,${outImage.data}`,
    });
  } catch (err) {
    req.log.error(
      { err: err instanceof Error ? err.message : String(err) },
      "gemini-clean-preview failed — returning mock fallback",
    );
    res.json({ source: "mock", reason: "generation_failed" });
  }
});

export default router;
