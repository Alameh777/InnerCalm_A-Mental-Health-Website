from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from datetime import datetime, timedelta

app = Flask(__name__)
# Configure CORS to allow requests from your frontend
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173"],  # Add your frontend URLs
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Load model artifacts
artifacts = joblib.load('mood_model.pkl')
model = artifacts['model']
le = artifacts['label_encoder']
feature_names = artifacts['feature_names']
bool_cols = artifacts['bool_cols']

# Mood state mapping
MOOD_STATES = {
    1: "Bad mental state",
    2: "Struggling",
    3: "Balanced",
    4: "Positive",
    5: "Cheerful"
}

# Key factors to compare
KEY_FACTORS = {
    'sleep_hours': 'sleep',
    'water_liters': 'water intake',
    'trained': 'exercise',
    'meditated': 'meditation',
    'social_interaction': 'social interaction'
}

def compare_with_previous(current_data, previous_data):
    improvements = []
    
    for factor, description in KEY_FACTORS.items():
        if factor in current_data and factor in previous_data:
            current = current_data[factor]
            previous = previous_data[factor]
            
            if isinstance(current, bool):
                if current and not previous:
                    improvements.append(f"Started {description}")
            else:
                if current > previous:
                    improvements.append(f"Increased {description}")
                elif current < previous:
                    improvements.append(f"Decreased {description}")
    
    return improvements

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json
        
        # Create ordered feature array
        features = [data[col] for col in feature_names]
        
        # Convert to DataFrame
        df = pd.DataFrame([features], columns=feature_names)
        
        # Convert boolean columns
        df[bool_cols] = df[bool_cols].astype(bool).astype(int)
        
        # Make prediction
        prediction = model.predict(df)
        probability = model.predict_proba(df)[0].max()
        
        # Get mood state
        mood_level = data.get('mood', 3)  # Default to 3 if not provided
        mood_state = MOOD_STATES.get(mood_level, "Unknown")
        
        # Prepare response
        response = {
            'prediction': le.inverse_transform(prediction)[0],
            'confidence': float(probability),
            'mood_state': mood_state,
            'mood_level': mood_level,
            'timestamp': datetime.now().isoformat(),
            'status': 'success'
        }
        
        # If previous data is provided, add comparison
        if 'previous_data' in data:
            improvements = compare_with_previous(data, data['previous_data'])
            response['improvements'] = improvements
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)