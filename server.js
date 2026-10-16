import express from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from "openai";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "SmartAtelier API" });
});

app.post("/api/identify", upload.single("photo"), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "OPENAI_API_KEY is not configured on the server." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Missing photo. Send it as multipart field named 'photo'." });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const base64 = req.file.buffer.toString("base64");
    const mime = req.file.mimetype || "image/jpeg";

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: "Identify the workshop/electronic/mechanical item in this photo. Return concise practical results: likely name, brand, model/reference if readable, category, visible specifications, confidence, and what extra photo or label would help. Do not invent unreadable details. Answer in French." },
          { type: "input_image", image_url: `data:${mime};base64,${base64}` }
        ]
      }]
    });

    res.json({ result: response.output_text || "Aucun résultat exploitable.", needsUserValidation: true });
  } catch (error) {
    console.error("Identification error:", error);
    res.status(500).json({ error: "Identification failed. Check server logs and API configuration." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`SmartAtelier API listening on ${port}`));
