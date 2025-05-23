import joblib
import pandas as pd

# Load model
model = joblib.load('your_model.pkl')

# Create test data (MUST match FEATURE_ORDER and data types)
test_data = {
    'sleep_hours': 7,
    'trained': True,
    'mood': 3,
    'stress_level': 2,
    'water_liters': 1.5,
    'caffeine_cups': 2,
    'social_interaction': True,
    'screen_hours': 8,
    'ate_healthy': False,
    'spent_time_outside': True,
    'meditated': False,
    'work_study_hours': 9,
    'enough_sleep_week': True,
    'physical_tiredness': 2,
    'mental_tiredness': 3,
    'motivation_level': 4,
    'suicidal_thoughts': False
}

# Convert to DataFrame
df = pd.DataFrame([test_data.values()], columns=test_data.keys())
df[BOOL_COLUMNS] = df[BOOL_COLUMNS].astype(bool).astype(int)

# Make prediction
pred = model.predict(df)
prob = model.predict_proba(df)

print(f"Prediction: {pred[0]} | Confidence: {prob[0].max():.2f}")