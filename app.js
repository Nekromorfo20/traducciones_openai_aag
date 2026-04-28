// Importar dependencias
import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

//Cargar express
const app = express();
const PORT = process.env.PORT || 3000;

// Servir frontend (index.html)
app.use("/", express.static("public"));

// Middleware para procesar json y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Instancia de OpenAI y pasar Api Key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/traducir", async (req, res) => {
    const { text, targetLang } = req.body;
    
    // Prompts de sistema y usuario
    const promptSystem1 = "Eres un traductor profesional."; // Rol
    const promptSystem2 = "Solo puedes responder con una traducción directa del texto que el usuario te envie."
                          + "Cualquier otra respuesta o conversación está prohibida."; // Prohibiciones

    const promptUser = `Traduce el siguiente texto al ${targetLang}: ${text}`; // Mensaje del usuario

    // Llamar al LLM o modelo de OpenAI
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: promptSystem1 },
                { role: "system", content: promptSystem2 },
                { role: "user", content: promptUser }
            ],
            max_tokens: 500,
            response_format: { type: "text" }
        });

        const translatedText = completion.choices[0].message.content;
        return res.status(200).json({ translatedText });

    } catch(error) {
        console.log(error);
        res.status(500).json({ error: "Error al traducir" });
    }
});

// Servir el backend
app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});