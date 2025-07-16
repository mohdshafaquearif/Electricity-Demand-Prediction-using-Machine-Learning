import React from 'react';
import Title from './Title';
import Image from 'next/image';

const Features = () => {
  return (
    <section className='max-container padding-container py-20 gap-16 flex md:flex-row xs:flex-col'>
      {/* LEFT */}
      <div className='xs:w-full md:w-1/2 flex flex-col gap-8'>
        <div className='top'>
          <Title title='Key Features' subtitle='Empowering Delhi Residents' />
          <p className='mt-8 opacity-50'>
            Discover the best services offered by the Delhi government to enhance your daily life.
          </p>
        </div>
        <div className='bottom'>
          <FeaturesCard 
            icon='/eicon1.png' 
            title='Reliable Electricity Supply' 
            subtitle='Ensuring uninterrupted power for all' 
          />
          <FeaturesCard 
            icon='/eicon2.png' 
            title='Schedule Power Usage' 
            subtitle='Manage your electricity consumption effectively' 
          />
          <FeaturesCard 
            icon='/eicon3.png' 
            title='Get Discounts on Bills' 
            subtitle='Access special offers and subsidies' 
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className='pt-14 relative right flex xs:w-full md:w-1/2'>
        {/* <Image 
          className='absolute xs:w-[230px] sm:w-[280px] lg:w-[320px] xs:left-[25%] xs:bottom-[70%] sm:left-[33%] sm:bottom-[72%]' 
          src='/electricity-icon.png' 
          alt='Delhi Electricity' 
          width={320} 
          height={320} 
        /> */}
        <Image 
          className='z-20 w-[60%] h-[90%]' 
          src='/emain-feature.png' 
          alt='Main Feature' 
          width={500} 
          height={500} 
        />
        {/* <Image 
          className='z-30 absolute w-[50%] h-[65%] top-[45%] left-[30%]' 
          src='/feature-illustration.png' 
          alt='Feature Illustration' 
          width={500} 
          height={500} 
        /> */}
        <div className='z-40 absolute xs:left-[25%] top-[14%] sm:left-[35%] rounded-5xl py-3 px-6 bg-white shadow flex items-center gap-2'>
          <Image className='xs:w-[20px] md:w-[30px]' src='/icon-map.png' alt='map' width={30} height={30} />
          <p className='xs:text-[12px] lg:text-lg font-bold'>A Vision for Sustainable Delhi</p>
        </div>
      </div>
    </section>
  );
}

interface FeatureProps {
  icon: string;
  title: string;
  subtitle: string;
}

const FeaturesCard = ({ icon, title, subtitle }: FeatureProps) => {
  return (
    <div className='flex items-center xs:w-full xl:w-3/4 gap-4 p-6 rounded-3xl border hover:shadow-lg transition duration-300'>
      <div className='left'>
        <Image src={icon} alt='icon' width={80} height={80} />
      </div>

      <div>
        <h4 className='text-2xl font-semibold'>{title}</h4>
        <p className='text-lg opacity-50'>{subtitle}</p>
      </div>
    </div>
  );
}

export default Features;
