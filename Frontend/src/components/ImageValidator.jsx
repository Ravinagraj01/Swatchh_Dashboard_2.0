import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { toast } from 'react-toastify';

const ImageValidator = ({ image, onValidationComplete }) => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (model && image) {
      validateImage();
    }
  }, [model, image]);

  const loadModel = async () => {
    try {
      // Load MobileNet model for general image classification
      const loadedModel = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
      setModel(loadedModel);
      setLoading(false);
    } catch (err) {
      console.error('Error loading model:', err);
      setError('Failed to load image validation model');
      setLoading(false);
      // If model fails to load, allow the process to continue
      onValidationComplete(true);
    }
  };

  const preprocessImage = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const tensor = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .expandDims();
        resolve(tensor);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  };

  const validateImage = async () => {
    try {
      setLoading(true);
      const tensor = await preprocessImage(image);
      
      // Get predictions
      const predictions = await model.predict(tensor).data();
      
      // Get top 3 predictions
      const top3 = Array.from(predictions)
        .map((p, i) => ({ probability: p, className: i }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3);

      // Check if any of the top predictions are related to trash or garbage
      const trashRelatedTerms = ['trash', 'garbage', 'waste', 'rubbish', 'litter', 'debris'];
      const isTrashImage = top3.some(pred => 
        trashRelatedTerms.some(term => 
          pred.className.toString().toLowerCase().includes(term)
        )
      );

      if (!isTrashImage) {
        toast.error('Please upload a valid image of trash. The current image does not appear to be trash-related.');
        onValidationComplete(false);
      } else {
        toast.success('Image validated successfully!');
        onValidationComplete(true);
      }
    } catch (err) {
      console.error('Error validating image:', err);
      setError('Failed to validate image');
      // If validation fails, allow the process to continue
      onValidationComplete(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Validating image...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  return null;
};

export default ImageValidator; 