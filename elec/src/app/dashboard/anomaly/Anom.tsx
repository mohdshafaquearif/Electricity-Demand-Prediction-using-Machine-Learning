// pages/AnomalyModel.tsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SystemDiagram from '@/components/SystemDiagram';
import Image from 'next/image';

interface AnomalyData {
  CL_out_temp: number;
  Fluid_temp_at_3V_in: number;
  HT_out_fluid_temp: number;
  HE_fluid_in_temp: number;
  HE_fluid_out_temp: number;
  CT_in_Fluid_temp: number;
  CT_out_fluid_temp: number;
  CL_in_fluid_temp: number;
}

interface AnomalyResponse {
  status: string;
  anomaly_result: string;
  input_data: AnomalyData;
}

function AnomalyModel() {
  const [formData, setFormData] = useState<AnomalyData>({
    CL_out_temp: 25.0,
    Fluid_temp_at_3V_in: 24.0,
    HT_out_fluid_temp: 24.0,
    HE_fluid_in_temp: 26.0,
    HE_fluid_out_temp: 29.0,
    CT_in_Fluid_temp: 30.0,
    CT_out_fluid_temp: 28.0,
    CL_in_fluid_temp: 32.0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnomalyResponse | null>(null);

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
      const response = await axios.post<AnomalyResponse>(
        'http://127.0.0.1:8000/anomaly/',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setResult(response.data);
      
      if (response.data.anomaly_result.includes("NO ANOMALY")) {
        toast.success("No anomalies detected!");
      } else {
        toast.warning("Anomalies detected in the system!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to check anomalies");
    } finally {
      setIsLoading(false);
    }
  };

  const getAnomalyList = (anomalyResult: string) => {
    return anomalyResult.split('\n').filter(line => line.trim().length > 0);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer position="top-right" />
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Fluid Temperature Anomaly Detection System
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>🔴 Live Monitoring</span>
          </div>
        </div>

        {/* Temperature Input Form */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Temperature Sensors Input</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      step="0.1"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="absolute right-3 top-2 text-gray-400">°C</span>
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
              ) : "Check Anomalies"}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Status Alert */}
            <div className={`p-4 rounded-lg border ${
              result.anomaly_result.includes("NO ANOMALY") 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {result.anomaly_result.includes("NO ANOMALY") ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">
                    {result.anomaly_result.includes("NO ANOMALY") ? 
                      "System Operating Normally" : 
                      "System Anomalies Detected"
                    }
                  </h3>
                  <div className="mt-2 text-sm space-y-1">
                    {getAnomalyList(result.anomaly_result).map((anomaly, index) => (
                      <div key={index} className="font-medium">
                        {anomaly}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* System Visualization */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">System Visualization</h3>
              <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                <SystemDiagram
                  anomalies={getAnomalyList(result.anomaly_result)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnomalyModel;