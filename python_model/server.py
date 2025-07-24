from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
from flask_cors import CORS  # Import CORS

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Allow requests from http://localhost:3000

# Load the models and scalers
model1 = joblib.load('model1.pkl')
scaler1_x = joblib.load('scaler_X.pkl')
scaler1_y = joblib.load('scaler_y.pkl')

model2 = joblib.load('domesticfinalll.pkl')
scaler2_x = joblib.load('scaler_X_dom.pkl')
scaler2_y = joblib.load('scaler_y_dom.pkl')

model3 = joblib.load('commercialfinalll.pkl')
scaler3_x = joblib.load('scaler_X_com.pkl')
scaler3_y = joblib.load('scaler_y_com.pkl')

def process_request(data, model, scaler_x, scaler_y):
    # Extract values from the request data
    weekend = data.get('weekend', 0)
    temperature = data.get('temperature', 0)
    humidity = data.get('humidity', 0)
    precipitation = data.get('precipitation', 0)
    rain = data.get('rain', 0)
    cloud_cover = data.get('cloud_cover', 0)
    wind_speed = data.get('wind_speed', 0)
    direct_radiation = data.get('direct_radiation', 0)
    is_day = data.get('is_day', 0)
    date = data.get('date', 1)
    month = data.get('month', 1)
    season = data.get('season', 0)
    hour = data.get('hour', 0)
    is_festival = data.get('is_festival', 0)

    # Create a DataFrame from input data
    input_data = pd.DataFrame({
        'Weekend': [weekend],
        'temperature_2m (°C)': [temperature],
        'relative_humidity_2m (%)': [humidity],
        'precipitation (mm)': [precipitation],
        'rain (mm)': [rain],
        'cloud_cover (%)': [cloud_cover],
        'wind_speed_100m (km/h)': [wind_speed],
        'direct_radiation (W/m²)': [direct_radiation],
        'is_day ()': [is_day],
        'date': [date],
        'month': [month],
        'season': [season],
        'hour': [hour],
        'is_festival': [is_festival]
    })

    # Scale the input data using scaler_x
    scaled_input = scaler_x.transform(input_data)

    # Make prediction with scaled input
    scaled_prediction = model.predict(scaled_input)

    # Inverse transform the prediction using scaler_y
    prediction = scaler_y.inverse_transform(scaled_prediction.reshape(-1, 1))

    return float(prediction[0][0])

@app.route('/predict/total', methods=['POST'])
def predict_model1():
    try:
        data = request.json
        predicted_demand = process_request(data, model1, scaler1_x, scaler1_y)
        return jsonify({'predicted_hourly_demand': predicted_demand})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/predict/domestic', methods=['POST'])
def predict_model2():
    try:
        data = request.json
        predicted_demand = process_request(data, model2, scaler2_x, scaler2_y)
        return jsonify({'predicted_hourly_demand': predicted_demand})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/predict/commercial', methods=['POST'])
def predict_model3():
    try:
        data = request.json
        predicted_demand = process_request(data, model3, scaler3_x, scaler3_y)
        return jsonify({'predicted_hourly_demand': predicted_demand})
    except Exception as e:
        return jsonify({'error': str(e)})

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
