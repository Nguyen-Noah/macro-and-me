import React, { useState } from 'react';
import api from '../utils/api';

const ImageUpload = () => {
    const [inputText, setInputText] = useState('');
    const [nutritionInfo, setNutritionInfo] = useState('');

    const handleChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/upload', { text: inputText });
            setNutritionInfo(response.data.nutritionInfo);
        } catch (error) {
            console.error('Error submitting text:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputText}
                    onChange={handleChange}
                    placeholder="Enter text here"
                />
                <button type="submit">Send to OpenAI</button>
            </form>

            {nutritionInfo && (
                <div>
                    <h2>OpenAI response:</h2>
                    <p>{nutritionInfo}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
