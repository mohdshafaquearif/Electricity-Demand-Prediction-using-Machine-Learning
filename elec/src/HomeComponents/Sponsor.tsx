import React from 'react';
import Image from 'next/image';

const Sponsor = () => {
  return (
    <section className='relative overflow-hidden'>
      

      {/* Insights Section */}
      <div className='max-container padding-container py-14 text-center'>
        <h2 className='text-4xl font-bold mb-6 text-gray-800 animate-fadeIn'>
          Delhi Electricity Demand Insights
        </h2>
        <p className='mb-8 text-lg text-gray-600 animate-fadeIn delay-200'>
          Our advanced machine learning models predict electricity demand with high accuracy, enabling efficient power distribution and reducing outages. 
          Stay informed and help optimize energy consumption.
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12'>
          <div className='p-4 border rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl'>
            <h3 className='text-xl font-semibold text-gray-700'>95% Accuracy</h3>
            <p className='text-gray-500 mt-2'>Our model forecasts demand with over 95% accuracy, helping to prevent blackouts.</p>
          </div>
          <div className='p-4 border rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl'>
            <h3 className='text-xl font-semibold text-gray-700'>24/7 Monitoring</h3>
            <p className='text-gray-500 mt-2'>Real-time data collection and analysis for seamless electricity management.</p>
          </div>
          <div className='p-4 border rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl'>
            <h3 className='text-xl font-semibold text-gray-700'>Peak Load Alerts</h3>
            <p className='text-gray-500 mt-2'>Get notified during peak load times to save energy and reduce costs.</p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Sponsor;
