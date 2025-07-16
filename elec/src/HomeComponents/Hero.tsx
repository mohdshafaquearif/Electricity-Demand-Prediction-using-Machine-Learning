"use client";
import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const Hero = () => {
  const { data: session } = useSession()

  return (
    <section id="hero" className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900'>
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6'>
          Delhi: Electricity Demand Predictions
        </h1>
        <p className='text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto'>
          Machine learning models to predict electricity demands on hourly, daily, weekly and monthly basis.
        </p>
        <div className='flex justify-center gap-4 flex-wrap'>
          {session ? (
            <Link href="/dashboard" className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105'>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <button className='bg-white text-blue-900 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100'>
                Sign Up
              </button>
              <button className='bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-white/10'>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero