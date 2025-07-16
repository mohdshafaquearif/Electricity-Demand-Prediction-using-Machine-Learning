// pages/RULModel.tsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RULData {
  temperature: number;
  pressure: number;
  flow_rate: number;
  vibration: number;
  motor_current: number;
  operating_hours: number;
}

interface RULResponse {
  status: string;
  rul_result: string;
  input_data: RULData;
}

function RULModel() {
  const [formData, setFormData] = useState<RULData>({
    temperature: 45.0,
    pressure: 100.0,
    flow_rate: 2.5,
    vibration: 0.15,
    motor_current: 12.0,
    operating_hours: 1000
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RULResponse | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post<RULResponse>(
        'http://127.0.0.1:8000/rul/',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setResult(response.data);
      toast.success("RUL prediction completed!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to predict RUL");
    } finally {
      setIsLoading(false);
    }
  };

  const getParameterUnit = (parameter: string): string => {
    const units: { [key: string]: string } = {
      temperature: '°C',
      pressure: 'PSI',
      flow_rate: 'm³/s',
      vibration: 'mm/s',
      motor_current: 'A',
      operating_hours: 'hrs'
    };
    return units[parameter] || '';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer position="top-right" />
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Equipment Remaining Useful Life (RUL) Prediction
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>🔄 RUL Analysis</span>
          </div>
        </div>

        {/* Parameter Input Form */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">System Parameters</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      step="0.01"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="absolute right-3 top-2 text-gray-400">
                      {getParameterUnit(key)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
                ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full" />
                  Processing...
                </div>
              ) : "Predict RUL"}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-blue-900">
                    RUL Prediction Result
                  </h3>
                  <div className="mt-2 text-sm text-blue-800">
                    <p className="font-medium">{result.rul_result}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parameter Summary */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Input Parameters Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(result.input_data).map(([key, value]) => (
                  <div key={key} className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">{key.replace(/_/g, ' ').toUpperCase()}</span>
                    <p className="text-lg font-semibold">
                      {Array.isArray(value) ? value[0] : value} {getParameterUnit(key)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RULModel;