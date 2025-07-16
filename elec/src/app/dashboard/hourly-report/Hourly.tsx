"use client";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactECharts from 'echarts-for-react';

interface WeatherData {
  Weekend: number;
  "temperature_2m (°C)": number;
  "relative_humidity_2m (%)": number;
  "precipitation (mm)": number;
  "rain (mm)": number;
  "cloud_cover (%)": number;
  "wind_speed_100m (km/h)": number;
  "direct_radiation (W/m²)": number;
  "is_day ()": number;
  date: number;
  month: number;
  season: number;
  hour: number;
  is_festival: boolean;
}

interface HourlyPrediction {
  hour: number;
  demand: number;
}

interface ModelData {
  predictions: HourlyPrediction[];
  totalDemand: number;
}

const API_KEY = "a41e1c074bb7041238ca24c0035b18da";

function HourlyMultiModel() {
  const [date, setDate] = useState("");
  const [isFestival, setIsFestival] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modelData, setModelData] = useState<{
    domestic: ModelData;
    commercial: ModelData;
    total: ModelData;
  }>({
    domestic: { predictions: [], totalDemand: 0 },
    commercial: { predictions: [], totalDemand: 0 },
    total: { predictions: [], totalDemand: 0 },
  });

  const [zoomLevel, setZoomLevel] = useState(100); // New state for zoom level

  const fetchWeatherData = async (date: string) => {
    const location = "Delhi";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get(apiUrl);
      const weather = response.data;

      return {
        temperature_2m: weather.main.temp,
        relative_humidity_2m: weather.main.humidity,
        precipitation: weather.rain?.["1h"] || 0,
        rain: weather.rain?.["1h"] || 0,
        cloud_cover: weather.clouds.all,
        wind_speed_100m: weather.wind.speed * 3.6,
        direct_radiation: 0,
        is_day: weather.sys.sunrise <= Date.now() / 1000 && weather.sys.sunset >= Date.now() / 1000 ? 1 : 0,
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  };

  const getSeason = (month: number) => {
    if (month >= 3 && month <= 5) return 0;
    if (month >= 6 && month <= 8) return 1;
    if (month >= 9 && month <= 11) return 2;
    return 3;
  };

  const isWeekend = (dateObj: Date) => {
    const day = dateObj.getDay();
    return day === 0 || day === 6 ? 1 : 0;
  };

  const sendToMLModel = async (formattedData: WeatherData, modelType: string) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/predict/${modelType}`, formattedData);
      const demand = response.data.predicted_hourly_demand;
      return typeof demand === 'number' ? demand : 0; // Ensure we always return a number
    } catch (error) {
      console.error(`Error sending data to Flask ML model (${modelType}):`, error);
      return 0; // Return 0 in case of error
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const dateObj = new Date(date);
      const month = dateObj.getMonth() + 1;
      const weekend = isWeekend(dateObj);
      const season = getSeason(month);

      const weatherData = await fetchWeatherData(date);

      const modelTypes = ["total", "domestic", "commercial"];
      const newModelData: any = {};

      for (const modelType of modelTypes) {
        const predictions: HourlyPrediction[] = [];
        let total = 0;

        for (let hour = 0; hour < 24; hour++) {
          const formattedData: WeatherData = {
            Weekend: weekend,
            "temperature_2m (°C)": weatherData.temperature_2m,
            "relative_humidity_2m (%)": weatherData.relative_humidity_2m,
            "precipitation (mm)": weatherData.precipitation,
            "rain (mm)": weatherData.rain,
            "cloud_cover (%)": weatherData.cloud_cover,
            "wind_speed_100m (km/h)": weatherData.wind_speed_100m,
            "direct_radiation (W/m²)": weatherData.direct_radiation,
            "is_day ()": hour >= 6 && hour < 18 ? 1 : 0,
            date: dateObj.getDate(),
            month: month,
            season: season,
            hour: hour,
            is_festival: isFestival,
          };

          const demand = await sendToMLModel(formattedData, modelType);
          predictions.push({ hour, demand });
          total += demand;
        }

        // Add 500 to each hourly demand for the "total" model
        if (modelType === "total") {
          predictions.forEach(pred => {
            pred.demand += 500;
          });
          total += 300; // Maintain original 300 addition
        }

        newModelData[modelType] = {
          predictions,
          totalDemand: total,
        };
      }

      setModelData(newModelData);
    } catch (error) {
      console.error("Error processing data:", error);
      toast.error("An error occurred while processing the data.");
    } finally {
      setIsLoading(false);
    }
  };

  const getChartOptions = (data: { [key: string]: ModelData }) => {
    const series = Object.entries(data).map(([modelType, modelData]) => ({
      name: modelType.charAt(0).toUpperCase() + modelType.slice(1),
      type: 'line',
      smooth: true,
      data: modelData.predictions.map(item => item.demand || 0),
    }));

    return {
      title: {
        text: '24-Hour Demand Prediction',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: Object.keys(data).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
        top: 'bottom',
      },
      xAxis: {
        type: 'category',
        data: Array.from({ length: 24 }, (_, i) => i),
        name: 'Hour',
      },
      yAxis: {
        type: 'value',
        name: 'Demand (kWh)',
        min: 0,
        max: 6000,
        interval: 500,
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: zoomLevel, // Adjust start based on zoomLevel
          end: 100,
        },
      ],
      series: series,
    };
  };

  const formatDemand = (demand: number | undefined) => {
    return demand !== undefined ? demand.toFixed(2) : 'N/A';
  };

  // Zoom in and out functions
  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 20, 100)); // Increase zoom level
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 20, 0)); // Decrease zoom level
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Multi-Model 24-Hour Demand Prediction
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Is Festival:</label>
            <input
              type="checkbox"
              checked={isFestival}
              onChange={(e) => setIsFestival(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Submit"}
          </button>
        </form>

        {modelData.domestic.predictions.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <button onClick={zoomOut} className="bg-gray-300 px-2 py-1 rounded">Zoom Out</button>
              <button onClick={zoomIn} className="bg-gray-300 px-2 py-1 rounded">Zoom In</button>
            </div>
            <ReactECharts
              option={getChartOptions(modelData)}
              style={{ height: '500px' }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(modelData).map(([modelType, data]) => (
            <div key={modelType} className="bg-gray-50 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 capitalize">{modelType} Model</h2>
              <p className="text-gray-600">Total Consumption: {formatDemand(data.totalDemand)} kWh</p>
              <table className="w-full mt-4">
                <thead>
                  <tr>
                    <th className="text-left">Hour</th>
                    <th className="text-right">Demand (kWh)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.predictions.map((prediction) => (
                    <tr key={prediction.hour}>
                      <td>{prediction.hour}</td>
                      <td className="text-right">{formatDemand(prediction.demand)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default HourlyMultiModel;
