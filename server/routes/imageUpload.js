import e from "express";
import multer from "multer";
import fs from 'fs';
import OpenAI from 'openai';

const router = e.Router();

const upload = multer({ dest: 'uploads/' });
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const query = req.body.text;
        console.log(req.body.text)

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    "role": "user",
                    "content": query
                },
            ],
        });

        console.log(response)

        const nutritionInfo = response.choices[0].message.content;
        res.json({ nutritionInfo });
    } catch (error) {
        res.status(500).json({ error: 'Error processing image' });
    }
});

export default router;