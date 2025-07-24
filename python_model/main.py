from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import MinMaxScaler
from flask_cors import CORS
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load the total model and scalers
total_model = joblib.load('model1.pkl')
total_scaler_X = joblib.load('scaler_X.pkl')
total_scaler_y = joblib.load('scaler_y.pkl')

# Load the commercial model and scalers
commercial_model = joblib.load('commercialfinalll.pkl')
commercial_scaler_X = joblib.load('scaler_X_com.pkl')
commercial_scaler_y = joblib.load('scaler_y_com.pkl')

# Load the domestic model and scalers
domestic_model = joblib.load('domesticfinalll.pkl')
domestic_scaler_X = joblib.load('scaler_X_dom.pkl')
domestic_scaler_y = joblib.load('scaler_y_dom.pkl')

def prepare_input_data(data):
    # Convert the date string to a day of the year
    date_str = data.get('date', '2024-01-01')  # Default to a valid date if not provided
    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
    day_of_year = date_obj.timetuple().tm_yday
    
    return pd.DataFrame({
        'Weekend': [data.get('weekend', 0)],
        'temperature_2m (°C)': [data.get('temperature', 0)],
        'relative_humidity_2m (%)': [data.get('humidity', 0)],
        'precipitation (mm)': [data.get('precipitation', 0)],
        'rain (mm)': [data.get('rain', 0)],
        'cloud_cover (%)': [data.get('cloud_cover', 0)],
        'wind_speed_100m (km/h)': [data.get('wind_speed', 0)],
        'direct_radiation (W/m²)': [data.get('direct_radiation', 0)],
        'is_day ()': [data.get('is_day', 0)],
        'day_of_year': [day_of_year],  # Use day_of_year instead of date
        'month': [date_obj.month],  # Extract month from the date
        'season': [data.get('season', 0)],
        'hour': [data.get('hour', 0)],
        'is_festival': [data.get('is_festival', 0)]
    })

def predict(model, scaler_X, scaler_y, input_data):
    # Get the feature names the model was trained on
    model_features = scaler_X.get_feature_names_out()
    
    # Filter input_data to only include features the model expects
    input_data_filtered = input_data[model_features]
    
    X_scaled = scaler_X.transform(input_data_filtered)
    y_scaled = model.predict(X_scaled)
    y_pred = scaler_y.inverse_transform(y_scaled.reshape(-1, 1))
    return float(y_pred[0][0])

@app.route('/predict/total', methods=['POST'])
def predict_total_demand():
    try:
        data = request.json
        input_data = prepare_input_data(data)
        predicted_demand = predict(total_model, total_scaler_X, total_scaler_y, input_data)
        return jsonify({
            'predicted_total_hourly_demand': predicted_demand
        })
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/predict/commercial', methods=['POST'])
def predict_commercial_demand():
    try:
        data = request.json
        input_data = prepare_input_data(data)
        predicted_demand = predict(commercial_model, commercial_scaler_X, commercial_scaler_y, input_data)
        return jsonify({
            'predicted_commercial_hourly_demand': predicted_demand
        })
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/predict/domestic', methods=['POST'])
def predict_domestic_demand():
    try:
        data = request.json
        input_data = prepare_input_data(data)
        predicted_demand = predict(domestic_model, domestic_scaler_X, domestic_scaler_y, input_data)
        return jsonify({
            'predicted_domestic_hourly_demand': predicted_demand
        })
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)