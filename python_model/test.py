import requests

url = 'http://127.0.0.1:5000/predict'

data = {
    "weekend": 1,
    "temperature": 25,
    "humidity": 80,
    "precipitation": 0.5,
    "rain": 0,
    "cloud_cover": 20,
    "wind_speed": 15,
    "direct_radiation": 100,
    "is_day": 1,
    "date": 17,
    "month": 9,
    "season": 1,
    "hour": 12,
    "is_festival": 0
}

response = requests.post(url, json=data)

if response.status_code == 200:
    print('Prediction:', response.json())
else:
    print('Error:', response.json())
