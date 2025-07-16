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

interface DailyPrediction {
  date: string;
  predictions: HourlyPrediction[];
  totalDemand: number;
}

interface ModelData {
  predictions: DailyPrediction[];
  totalWeeklyDemand: number;
}

const API_KEY = "a41e1c074bb7041238ca24c0035b18da";

function WeeklyMultiModel() {
  const [startDate, setStartDate] = useState("");
  const [festivals, setFestivals] = useState<boolean[]>(Array(7).fill(false));
  const [isLoading, setIsLoading] = useState(false);
  const [modelData, setModelData] = useState<{
    domestic: ModelData;
    commercial: ModelData;
    total: ModelData;
  }>({
    domestic: { predictions: [], totalWeeklyDemand: 0 },
    commercial: { predictions: [], totalWeeklyDemand: 0 },
    total: { predictions: [], totalWeeklyDemand: 0 },
  });

  const [zoomLevel, setZoomLevel] = useState(100);

  const fetchWeatherData = async (date: string) => {
    const location = "Delhi";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get(apiUrl);
      const forecast = response.data.list;

      const dateForecast = forecast.filter((item: any) => 
        item.dt_txt.startsWith(date)
      );

      const dayForecast = dateForecast.length > 0 ? dateForecast : forecast.slice(0, 8);

      return dayForecast.map((item: any) => ({
        hour: new Date(item.dt * 1000).getHours(),
        temperature_2m: item.main.temp,
        relative_humidity_2m: item.main.humidity,
        precipitation: item.rain?.["3h"] || 0,
        rain: item.rain?.["3h"] || 0,
        cloud_cover: item.clouds.all,
        wind_speed_100m: item.wind.speed * 3.6,
        direct_radiation: 0,
        is_day: item.sys.pod === 'd' ? 1 : 0,
      }));
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
      return typeof demand === 'number' ? demand : 0;
    } catch (error) {
      console.error(`Error sending data to Flask ML model (${modelType}):`, error);
      return 0;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const startDateObj = new Date(startDate);
      const modelTypes = ["total", "domestic", "commercial"];
      const newModelData: any = {};

      for (const modelType of modelTypes) {
        const weeklyPredictions: DailyPrediction[] = [];
        let totalWeeklyDemand = 0;

        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const currentDate = new Date(startDateObj);
          currentDate.setDate(startDateObj.getDate() + dayOffset);

          const formattedDate = currentDate.toISOString().split('T')[0];
          const month = currentDate.getMonth() + 1;
          const weekend = isWeekend(currentDate);
          const season = getSeason(month);
          const isFestival = festivals[dayOffset];

          const weatherData = await fetchWeatherData(formattedDate);

          const dailyPredictions: HourlyPrediction[] = [];
          let dailyTotal = 0;

          for (let hour = 0; hour < 24; hour++) {
            const hourWeather = weatherData.find(w => w.hour === hour) || weatherData[0];
            
            const formattedData: WeatherData = {
              Weekend: weekend,
              "temperature_2m (°C)": hourWeather.temperature_2m,
              "relative_humidity_2m (%)": hourWeather.relative_humidity_2m,
              "precipitation (mm)": hourWeather.precipitation,
              "rain (mm)": hourWeather.rain,
              "cloud_cover (%)": hourWeather.cloud_cover,
              "wind_speed_100m (km/h)": hourWeather.wind_speed_100m,
              "direct_radiation (W/m²)": hourWeather.direct_radiation,
              "is_day ()": hourWeather.is_day,
              date: currentDate.getDate(),
              month: month,
              season: season,
              hour: hour,
              is_festival: isFestival,
            };

            const demand = await sendToMLModel(formattedData, modelType);
            dailyPredictions.push({ hour, demand });
            dailyTotal += demand;
          }

          if (modelType === "total") {
            dailyPredictions.forEach(pred => {
              pred.demand += 500;
            });
            dailyTotal += 12000; // 500 * 24 hours
          }

          weeklyPredictions.push({
            date: formattedDate,
            predictions: dailyPredictions,
            totalDemand: dailyTotal,
          });

          totalWeeklyDemand += dailyTotal;
        }

        newModelData[modelType] = {
          predictions: weeklyPredictions,
          totalWeeklyDemand: totalWeeklyDemand,
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

  const getHourlyChartOptions = (data: { [key: string]: ModelData }) => {
    const series = Object.entries(data).map(([modelType, modelData]) => ({
      name: modelType.charAt(0).toUpperCase() + modelType.slice(1),
      type: 'line',
      smooth: true,
      data: modelData.predictions.flatMap(day => 
        day.predictions.map((item, index) => [
          `${day.date} ${index}:00`,
          item.demand || 0
        ])
      ),
    }));

    return {
      title: {
        text: 'Weekly Hourly Demand Prediction',
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
        data: data.total.predictions.flatMap(day => 
          Array.from({ length: 24 }, (_, i) => `${day.date} ${i}:00`)
        ),
        name: 'Date and Hour',
        axisLabel: {
          formatter: (value: string) => {
            const [date, time] = value.split(' ');
            return time === '0:00' ? date : '';
          },
          interval: 23,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Demand (kWh)',
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: zoomLevel,
          end: 100,
        },
      ],
      series: series,
    };
  };

  const getDailyChartOptions = (data: { [key: string]: ModelData }) => {
    const series = Object.entries(data).map(([modelType, modelData]) => ({
      name: modelType.charAt(0).toUpperCase() + modelType.slice(1),
      type: 'bar',
      data: modelData.predictions.map(day => day.totalDemand),
    }));

    return {
      title: {
        text: 'Daily Total Demand',
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
        data: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        name: 'Day',
      },
      yAxis: {
        type: 'value',
        name: 'Total Demand (kWh)',
      },
      series: series,
    };
  };

  const formatDemand = (demand: number | undefined) => {
    return demand !== undefined ? demand.toFixed(2) : 'N/A';
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 20, 100));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 20, 0));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Weekly Multi-Model Demand Prediction
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Festival Days:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {festivals.map((isFestival, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isFestival}
                      onChange={(e) => {
                        const newFestivals = [...festivals];
                        newFestivals[index] = e.target.checked;
                        setFestivals(newFestivals);
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Day {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Submit"}
          </button>
        </form>

        {modelData.domestic.predictions.length > 0 && (
          <div className="space-y-10">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-between mb-4">
                <button onClick={zoomOut} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">Zoom Out</button>
                <button onClick={zoomIn} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">Zoom In</button>
              </div>
              <ReactECharts
                option={getHourlyChartOptions(modelData)}
                style={{ height: '500px' }}
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <ReactECharts
                option={getDailyChartOptions(modelData)}
                style={{ height: '500px' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(modelData).map(([modelType, data]) => (
                <div key={modelType} className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">{modelType} Model</h2>
                  <p className="text-lg text-gray-600 mb-4">Total Weekly Consumption: {formatDemand(data.totalWeeklyDemand)} kWh</p>
                  <div className="max-h-96 overflow-y-auto">
                  {data.predictions.map((day, index) => (
                      <div key={day.date} className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
                        <h3 className="font-semibold text-lg mb-2">{day.date} {festivals[index] ? '(Festival)' : ''}</h3>
                        <p className="text-gray-600 mb-2">Daily Total: {formatDemand(day.totalDemand)} kWh</p>
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="text-left py-2 px-4">Hour</th>
                              <th className="text-right py-2 px-4">Demand (kWh)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.predictions.map((prediction) => (
                              <tr key={prediction.hour} className="hover:bg-gray-50">
                                <td className="py-2 px-4">{prediction.hour}</td>
                                <td className="text-right py-2 px-4">{formatDemand(prediction.demand)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default WeeklyMultiModel;