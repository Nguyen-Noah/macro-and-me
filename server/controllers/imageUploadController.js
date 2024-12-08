import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const Nutrition = z.object({
    name:z.string(),
    calories: z.number(),
    fat: z.number(),
    carbohydrates: z.number(),
    protein: z.number()
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(500).json({ error: 'No file uploaded' });
        }
        const image = req.file;
        const text = req.body.text;

        console.log(text)

        const mimeType = image.mimetype;
        const base64Image = image.buffer.toString('base64');

        console.log('Sending to OpenAI...');
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `${text}`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`
                            }
                        }
                    ]
                },
            ],
            response_format: zodResponseFormat(Nutrition, 'nutrition')
        });

        const nutritionInfo = response.choices[0].message.content;
        res.json({ nutritionInfo });
    } catch (error) {
        res.status(500).json({ error: 'Error processing image' });
    }
};