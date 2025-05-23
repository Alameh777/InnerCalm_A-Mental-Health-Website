import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load data
try:
    df = pd.read_csv('data.csv')
    print("✅ Data loaded successfully!")
except FileNotFoundError:
    print("❌ Error: data.csv not found!")
    exit()

# Convert string booleans to actual booleans
bool_cols = ['trained', 'social_interaction', 'ate_healthy', 
            'spent_time_outside', 'meditated', 'enough_sleep_week',
            'suicidal_thoughts']

for col in bool_cols:
    df[col] = df[col].map({True: True, False: False, 'True': True, 'False': False})

# Encode labels
le = LabelEncoder()
df['result'] = le.fit_transform(df['result'])

# Train model
try:
    X = df.drop('result', axis=1)
    y = df['result']
    model = DecisionTreeClassifier()
    model.fit(X, y)
    print("✅ Model trained successfully!")
except Exception as e:
    print(f"❌ Training failed: {e}")
    exit()

# Save model
try:
    joblib.dump({
        'model': model,
        'label_encoder': le,
        'feature_names': list(X.columns),
        'bool_cols': bool_cols
    }, 'mood_model.pkl')
    print("✅ Model saved as mood_model.pkl!")
except Exception as e:
    print(f"❌ Saving failed: {e}")