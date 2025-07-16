import React from 'react';
import Title from './Title';
import Image from 'next/image';

const Services = () => {
  return (
    <section className='relative max-container padding-container flex md:flex-row xs:flex-col py-10 md:h-[420px] xs:h-full gap-8'>
      {/* Left Section with Title */}
      <div className='left xs:w-full md:w-2/5 py-4 flex flex-col justify-center'>
        <Title title='Know' subtitle='Why we are known for best?' />
      </div>

      {/* Right Section with Service Cards */}
      <div className='right xs:w-full md:w-3/5 py-4 px-4 flex gap-8 items-start hide-scrollbar overflow-x-auto'>
        <ServiceCard
          icon='/destination.png'
          title='Accurate Demand Prediction'
          subtitle='Predict power demand with 95% accuracy using cutting-edge AI models.'
        />
        <ServiceCard
          icon='/booking.png'
          title='Real-time Monitoring'
          subtitle='Monitor electricity consumption and forecast load at any time.'
        />
        <ServiceCard
          icon='/cloudy.png'
          title='Weather Impact Insights'
          subtitle='Understand how weather patterns impact electricity demand.'
        />
      </div>
    </section>
  );
};

interface ServiceCardProps {
  icon: string;
  title: string;
  subtitle: string;
}

const ServiceCard = ({ icon, title, subtitle }: ServiceCardProps) => {
  return (
    <div className='bg-[#01161B] text-white h-full w-full xs:py-10 md:py-0 min-w-[250px] rounded-3xl shadow-lg px-8 flex flex-col gap-12 items-center justify-center transform transition-all hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r from-[#1A3A4A] to-[#01161B] duration-300'>
      {/* Animated Icon */}
      <div className='animate-bounce'>
        <Image src={icon} alt='icon' width={50} height={50} />
      </div>

      {/* Card Content */}
      <div className='flex flex-col items-center gap-3'>
        <h3 className='text-lg font-bold'>{title}</h3>
        <p className='text-[14px] text-center text-gray-400'>{subtitle}</p>
      </div>
    </div>
  );
};

export default Services;
