import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const HF_TOKEN = process.env.HF_TOKEN;
const MODEL_ID = "unitary/toxic-bert";
const API_URL = `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`;

// ---- HEALTH CHECK ROUTE ----
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "English Toxic Detection API Running (HF API Mode)",
        model: MODEL_ID
    });
});

// ---- TOXIC DETECTION ROUTE (HF API) ----
app.post("/detect-toxic", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({ error: "text_required" });
        }

        if (!HF_TOKEN) {
            return res.status(500).json({
                error: "config_error",
                message: "HF_TOKEN is missing in .env file"
            });
        }

        // Call Hugging Face API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: text }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("HF API Error:", errorData);

            // Handle loading state
            if (errorData.error && errorData.error.includes("loading")) {
                return res.status(503).json({
                    error: "model_loading",
                    message: "Model is loading, please try again in a few seconds."
                });
            }

            return res.status(response.status).json({
                error: "api_error",
                message: errorData.error || "Error from Hugging Face API"
            });
        }

        const result = await response.json();
        // Result is typically [[{label, score}, ...]] or [{label, score}]

        // Parse Output to match expected format
        // unitary/toxic-bert returns a list of labels with scores.
        // We need to convert it to { toxic: 0.9, severe_toxic: 0.1, ... }

        // Flatten if nested array
        const scoresList = Array.isArray(result[0]) ? result[0] : result;

        const scores = {
            toxic: 0.0,
            severe_toxic: 0.0,
            obscene: 0.0,
            threat: 0.0,
            insult: 0.0,
            identity_hate: 0.0
        };

        scoresList.forEach(item => {
            const label = item.label;
            const score = item.score;

            // Map labels if necessary (usually they match or are 'toxic', 'severe_toxic' etc)
            if (label === 'toxic') scores.toxic = score;
            else if (label === 'severe_toxic') scores.severe_toxic = score;
            else if (label === 'obscene') scores.obscene = score;
            else if (label === 'threat') scores.threat = score;
            else if (label === 'insult') scores.insult = score;
            else if (label === 'identity_hate') scores.identity_hate = score;
        });

        return res.json(scores);

    } catch (error) {
        console.error("Server Error:", error.message);
        return res.status(500).json({
            error: "internal_server_error",
            message: error.message
        });
    }
});

// ---- START SERVER ----
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Node.js Server running on http://localhost:${PORT}`);
    console.log(`🔗 Using Hugging Face API: ${MODEL_ID}`);
});
