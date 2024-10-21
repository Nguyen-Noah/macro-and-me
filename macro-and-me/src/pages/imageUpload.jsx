import React, { useState } from 'react';
import api from '../utils/api';

const ImageUpload = () => {
    const [image, setImage] = useState(null);
    const [nutritionInfo, setNutritionInfo] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    const handleImageUpload = async () => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setNutritionInfo(response.data.nutritionInfo);
        } catch (error) {
            console.error('Error uploading image', error);
        }
    };

    return (
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button onClick={handleImageUpload}>Upload Image</button>
          {nutritionInfo && (
            <div>
              <h2>Estimated Nutrition Information:</h2>
              <p>{nutritionInfo}</p>
            </div>
          )}
        </div>
      );
};

export default ImageUpload;