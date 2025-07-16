'use client'
import React, { useEffect, useRef } from 'react';
import Title from './Title';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination } from 'swiper/modules';
import * as echarts from 'echarts';

const ElectricityStats = () => {
  return (
    <section className='relative max-container padding-container flex flex-col gap-16 py-12 bg-white'>
      <Image className='absolute xs:bottom-[65%] xs:right-[5%] md:bottom-[70%] xl:right-0' src='/yellowx.png' alt='yellow object' width={100} height={100} />

      <div className='top'>
        <Title title='Electricity Stats' subtitle='Delhi Electricity Data Insights' />
      </div>

      <div className='bottom flex items-center justify-between'>
        <Swiper
          slidesPerView={3}
          spaceBetween={60}
          loop={true}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          breakpoints={{
            '@0.00': {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            '@0.75': {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            '@1.15': {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            '@1.60': {
              slidesPerView: 3,
              spaceBetween: 60,
            },
          }}
        >
          <SwiperSlide className='pb-12'>
            <ChartCard chartType='line' title='Consumption Over Time' data={lineChartData} />
          </SwiperSlide>
          <SwiperSlide>
            <ChartCard chartType='bar' title='Peak Demand by Area' data={barChartData} />
          </SwiperSlide>
          <SwiperSlide>
            <ChartCard chartType='pie' title='Energy Savings Contribution' data={pieChartData} />
          </SwiperSlide>
          <SwiperSlide>
            <ChartCard chartType='scatter' title='Temperature vs Demand' data={scatterChartData} />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

interface ChartCardProps {
  chartType: string;
  title: string;
  data: any;
}

const ChartCard = ({ chartType, title, data }: ChartCardProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);
      const chartOptions = getChartOptions(chartType, data);
      chartInstance.setOption(chartOptions);
      
      // Clean up on unmount
      return () => {
        chartInstance.dispose();
      };
    }
  }, [chartType, data]);

  return (
    <div className='bg-white text-black h-[500px] w-[340px] pb-4 rounded-3xl shadow-lg flex flex-col gap-4'>
      <div className='p-6'>
        <h3 className='font-bold text-lg'>{title}</h3>
      </div>
      <div ref={chartRef} className='h-[350px] px-4'></div>
    </div>
  );
};

// Function to get chart options based on the chart type
const getChartOptions = (chartType: string, data: any) => {
  switch (chartType) {
    case 'line':
      return {
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: data.xAxis,
          axisLine: {
            lineStyle: { color: '#333' },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: { color: '#333' },
          },
        },
        series: [
          {
            data: data.series,
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#FF6347', // Tomato color for line
            },
          },
        ],
        animationDuration: 2000,
      };
    case 'bar':
      return {
        tooltip: {
          trigger: 'item',
        },
        xAxis: {
          type: 'category',
          data: data.xAxis,
          axisLine: {
            lineStyle: { color: '#333' },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: { color: '#333' },
          },
        },
        series: [
          {
            data: data.series,
            type: 'bar',
            itemStyle: {
              color: '#4682B4', // Steel Blue color for bars
            },
          },
        ],
        animationDuration: 2000,
      };
    case 'pie':
      return {
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: data.series,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2,
            },
          },
        ],
        animationDuration: 2000,
      };
    case 'scatter':
      return {
        tooltip: {
          trigger: 'item',
        },
        xAxis: {
          type: 'category',
          data: data.xAxis,
          axisLine: {
            lineStyle: { color: '#333' },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: { color: '#333' },
          },
        },
        series: [
          {
            data: data.series,
            type: 'scatter',
            symbolSize: 10,
            itemStyle: {
              color: '#32CD32', // Lime Green color for scatter points
            },
          },
        ],
        animationDuration: 2000,
      };
    default:
      return {};
  }
};

// Mock data for charts
const lineChartData = {
  xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [820, 932, 901, 934, 1290, 1330],
};

const barChartData = {
  xAxis: ['Area 1', 'Area 2', 'Area 3', 'Area 4'],
  series: [500, 600, 700, 800],
};

const pieChartData = {
  series: [
    { value: 400, name: 'Residential' },
    { value: 335, name: 'Commercial' },
    { value: 310, name: 'Industrial' },
    { value: 234, name: 'Agriculture' },
  ],
};

const scatterChartData = {
  xAxis: ['20°C', '25°C', '30°C', '35°C', '40°C'],
  series: [300, 400, 500, 700, 800],
};

export default ElectricityStats;
