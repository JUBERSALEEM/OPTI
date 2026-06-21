import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required but. Ensure it is set in Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API route for financial intelligence
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { prompt, state } = req.body;
    const client = getGeminiClient();

    const formattedState = JSON.stringify(state, null, 2);

    const systemInstruction = `You are "Flow AI", an elite fintech wealth coach embedded in the "Finance Flow" app.
Analyze the user's financial profile (ledgers, savings goals, investment portfolios, crypto holdings) and provide ultra-precise, human-friendly financial suggestions, insights, or custom budgets.
Use bullet points, bold percentages, and professional markdown styling. Keep it snappy and highly visual. Mention the user's localization currency. Avoid empty generalizations.`;

    const contents = `User current state:
${formattedState}

User Question/Request:
${prompt}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "I was unable to analyze your data at this moment. Please verify your ledger entry details and try again.";
    res.json({ text });
  } catch (error: any) {
    console.error('Gemini Server API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process Gemini request' });
  }
});

// App environment routing
async function init() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Finance Flow server running on http://0.0.0.0:${PORT}`);
  });
}

init().catch((err) => {
  console.error('Server boot failure:', err);
});
