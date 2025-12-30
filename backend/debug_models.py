import pickle
import os
import sys
from pathlib import Path

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from predictions.utils import ML_MODELS_DIR

def inspect_models():
    print(f"Checking models in: {ML_MODELS_DIR}")
    
    scaler_path = ML_MODELS_DIR / 'scaler.pkl'
    if not scaler_path.exists():
        print("Scaler not found!")
        return

    try:
        with open(scaler_path, 'rb') as f:
            scaler = pickle.load(f)
        
        print(f"\nScaler Type: {type(scaler)}")
        if hasattr(scaler, 'n_features_in_'):
            print(f"Expected Features: {scaler.n_features_in_}")
        if hasattr(scaler, 'feature_names_in_'):
            print("Feature Names Expected:")
            for i, name in enumerate(scaler.feature_names_in_):
                print(f"{i}: {name}")
        else:
            print("Scaler does not store feature names.")
            
    except Exception as e:
        print(f"Error loading scaler: {e}")

if __name__ == "__main__":
    inspect_models()
