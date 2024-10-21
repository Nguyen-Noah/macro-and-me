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
        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Image = imageBuffer.toString('base64');

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text:": "What is in this image?"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ]
                },
            ],
        });

        console.log(nutritionInfo)

        const nutritionInfo = response.choices[0].message.content;
        res.json({ nutritionInfo });
    } catch (error) {
        res.status(500).json({ error: 'Error processing image' });
    }
});

export default router;