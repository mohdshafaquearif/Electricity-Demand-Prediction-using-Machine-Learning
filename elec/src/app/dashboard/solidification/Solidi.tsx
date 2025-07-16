"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactECharts from 'echarts-for-react';

interface PredictionResponse {
  message: string;
  prediction: number;
  result_dict?: {
    [key: string]: string;
  };
}

function SolidificationModel() {
  const [dateTime, setDateTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formattedDateTime = encodeURIComponent(dateTime);
      
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/solidificationAPI/',
        params: {
          time_w: formattedDateTime
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.data) {
        setResult(response.data);
        toast.success("Prediction received successfully!");
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error("Error fetching prediction:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getChartOptions = () => {
    if (!result?.result_dict) return null;

    const data = Object.entries(result.result_dict).map(([percentage, message]) => ({
      percentage: parseInt(percentage),
      temperature: parseFloat(message.match(/-?\d+\.\d+/)![0])
    }));

    return {
      title: {
        text: 'Temperature Prevention by Turbine Shutdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}% Turbines OFF: {c}°C Prevention'
      },
      xAxis: {
        type: 'category',
        name: 'Turbines Shutdown Percentage',
        data: data.map(item => `${item.percentage}%`)
      },
      yAxis: {
        type: 'value',
        name: 'Temperature Prevention (°C)'
      },
      series: [{
        data: data.map(item => item.temperature),
        type: 'bar',
        color: '#4F46E5',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}°C'
        }
      }]
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer position="top-right" />
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Solidification Prediction Model
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="datetime" className="block text-sm font-medium text-gray-700">
              Select Date and Time
            </label>
            <input
              type="datetime-local"
              id="datetime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                Processing...
              </div>
            ) : "Get Prediction"}
          </button>
        </form>

        {result && (
          <div className="mt-6 space-y-6">
            {/* Status Alert */}
            <div className={`p-4 rounded-lg ${result.prediction > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {result.prediction > 0 ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">
                    {result.message}
                  </h3>
                  <div className="mt-2 text-sm">
                    Temperature Change: <span className="font-bold">{result.prediction.toFixed(2)}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.result_dict && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Preventive Measures</h3>
                
                {/* Chart */}
                <div className="h-96 w-full">
                  <ReactECharts option={getChartOptions()} style={{ height: '100%' }} />
                </div>

                {/* Detailed Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.result_dict).map(([percentage, message]) => (
                    <div key={percentage} className="p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-900">
                        {percentage}% Turbine Shutdown
                      </h4>
                      <p className="mt-1 text-sm text-indigo-700">{message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SolidificationModel;