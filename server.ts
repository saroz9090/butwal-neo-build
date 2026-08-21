import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let genAIClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Trailing slash normalization middleware to prevent redirect loops for GSC and bots
  app.use((req, res, next) => {
    if (req.path.length > 1 && req.path.endsWith('/')) {
      const queryIndex = req.url.indexOf('?');
      const queryString = queryIndex !== -1 ? req.url.substring(queryIndex) : '';
      req.url = req.path.slice(0, -1) + queryString;
    }
    next();
  });

  // High-Speed Gemini AI Chat Route
  app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Valid message string is required" });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: message,
        config: {
          systemInstruction: "You are the instant expert engineering & construction AI consultant for 'Butwal Construction and Builders' (Headquarters: Butwal-11, Kalikanagar) and 'Dang Construction and Builders' (Dang Valley: Ghorahi, Tulsipur, Lamahi). Provide fast, concise, accurate, professional guidance regarding house construction costs (NPR 3,300-6,000/sq.ft), NBC 105:2020 earthquake building codes, 2D/3D floor planning, Vastu guidelines, municipality approvals (Naksha Pass), materials (Fe 500D TMT steel, OPC/PPC cement), and turnkey services. Keep answers concise, clear, and direct."
        }
      });
      
      res.json({ reply: response.text || "Hello! How can I assist with your construction project in Butwal or Dang?" });
    } catch (error) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: 'index.html', extensions: ['html'] }));
    app.get('*all', (req, res) => {
      res.status(200).sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
