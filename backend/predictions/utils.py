"""
ML Model Utilities for Student Dropout Prediction

This module handles loading of pre-trained ML models and provides
the prediction interface for the API.
"""

import os
import pickle
import numpy as np
from pathlib import Path

# Path to the ML models directory
ML_MODELS_DIR = Path(__file__).parent / 'ml_models'

# Global variables to store loaded models (singleton pattern)
_model = None
_scaler = None
_label_encoder = None

# Feature names in the exact order expected by the model
FEATURE_NAMES = [
    'Marital status',
    'Application mode',
    'Application order',
    'Course',
    'Daytime/evening attendance',
    'Previous qualification',
    'Nacionality',
    "Mother's qualification",
    "Father's qualification",
    "Mother's occupation",
    "Father's occupation",

    'Displaced',
    'Educational special needs',
    'Debtor',
    'Tuition fees up to date',
    'Gender',
    'Scholarship holder',
    'Age at enrollment',
    'International',
    'Curricular units 1st sem (credited)',
    'Curricular units 1st sem (enrolled)',
    'Curricular units 1st sem (evaluations)',
    'Curricular units 1st sem (approved)',
    'Curricular units 1st sem (grade)',
    'Curricular units 1st sem (without evaluations)',
    'Curricular units 2nd sem (credited)',
    'Curricular units 2nd sem (enrolled)',
    'Curricular units 2nd sem (evaluations)',
    'Curricular units 2nd sem (approved)',
    'Curricular units 2nd sem (grade)',
    'Curricular units 2nd sem (without evaluations)',
    'Unemployment rate',
    'Inflation rate',
    'GDP',
    'Grade_Trend',  # Engineered feature: 2nd sem grade - 1st sem grade
]


def load_models():
    """
    Load the ML models from pickle files.
    Models are loaded only once and cached globally.
    """
    global _model, _scaler, _label_encoder
    
    if _model is None:
        model_path = ML_MODELS_DIR / 'edupredict_model.pkl'
        if model_path.exists():
            with open(model_path, 'rb') as f:
                _model = pickle.load(f)
        else:
            raise FileNotFoundError(f"Model file not found at {model_path}")
    
    if _scaler is None:
        scaler_path = ML_MODELS_DIR / 'scaler.pkl'
        if scaler_path.exists():
            with open(scaler_path, 'rb') as f:
                _scaler = pickle.load(f)
        else:
            raise FileNotFoundError(f"Scaler file not found at {scaler_path}")
    
    if _label_encoder is None:
        encoder_path = ML_MODELS_DIR / 'label_encoder.pkl'
        if encoder_path.exists():
            with open(encoder_path, 'rb') as f:
                _label_encoder = pickle.load(f)
        else:
            raise FileNotFoundError(f"Label encoder file not found at {encoder_path}")
    
    return _model, _scaler, _label_encoder


def get_models():
    """Get the loaded models, loading them if necessary."""
    global _model, _scaler, _label_encoder
    if _model is None or _scaler is None or _label_encoder is None:
        load_models()
    return _model, _scaler, _label_encoder


def predict_student_status(data: dict) -> dict:
    """
    Predict student dropout status based on input features.
    
    Args:
        data: Dictionary containing the 36 raw feature values.
              Keys should match the feature names in the dataset.
    
    Returns:
        Dictionary with:
            - 'predicted_class': The predicted class name (Dropout/Enrolled/Graduate)
            - 'dropout_probability': Probability of dropout (float 0-1)
            - 'all_probabilities': Dict of all class probabilities
    """
    try:
        model, scaler, label_encoder = get_models()
    except FileNotFoundError as e:
        return {
            'error': str(e),
            'predicted_class': None,
            'dropout_probability': None,
        }
    
    # Calculate the engineered feature: Grade_Trend
    grade_1st_sem = data.get('Curricular units 1st sem (grade)', 0)
    grade_2nd_sem = data.get('Curricular units 2nd sem (grade)', 0)
    grade_trend = grade_2nd_sem - grade_1st_sem
    
    # Build the feature array in the correct order
    features = []
    for feature_name in FEATURE_NAMES[:-1]:  # All except Grade_Trend
        value = data.get(feature_name, 0)
        features.append(float(value) if value is not None else 0.0)
    
    # Add the engineered feature
    features.append(grade_trend)
    
    # Convert to numpy array and reshape for single prediction
    features_array = np.array(features).reshape(1, -1)
    
    # Scale the features
    features_scaled = scaler.transform(features_array)
    
    # Make prediction
    prediction = model.predict(features_scaled)[0]
    probabilities = model.predict_proba(features_scaled)[0]
    
    # Decode the prediction
    predicted_class = label_encoder.inverse_transform([prediction])[0]
    
    # Get class names and their probabilities
    class_names = label_encoder.classes_
    prob_dict = {class_names[i]: float(probabilities[i]) for i in range(len(class_names))}
    
    # Get dropout probability (class 0 is typically "Dropout")
    dropout_idx = list(class_names).index('Dropout') if 'Dropout' in class_names else 0
    dropout_probability = float(probabilities[dropout_idx])
    
    return {
        'predicted_class': predicted_class,
        'dropout_probability': dropout_probability,
        'all_probabilities': prob_dict,
        'grade_trend': grade_trend,
    }


def check_models_available() -> bool:
    """Check if all required model files are present."""
    required_files = ['edupredict_model.pkl', 'scaler.pkl', 'label_encoder.pkl']
    return all((ML_MODELS_DIR / f).exists() for f in required_files)
