import React, { useState } from 'react';
import api from '../../../utils/api';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [nutritionInfo, setNutritionInfo] = useState('');
    const [image, setImage] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);

        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleTextChange = (e) => {
        setTextInput(e.target.value);
    }

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('text', textInput);

        try {
            const response = await api.post('/upload', formData);
            setNutritionInfo(response.data.nutritionInfo);
        } catch (error) {
            console.error('Error submitting text:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    accept='image/*'
                    onChange={handleFileChange}
                    placeholder="Enter text here"
                />
                <input 
                    type="text"
                    placeholder='Optional: Add reference labels here'
                    value={textInput}
                    onChange={handleTextChange}
                />
                <button type="submit">Send to OpenAI</button>
            </form>

            {image && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Image Preview:</h3>
                    <img 
                        src={image} 
                        alt="Selected Preview" 
                        style={{ maxWidth: '100%', maxHeight: '300px', border: '1px solid #ccc' }} 
                    />
                </div>
            )}
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