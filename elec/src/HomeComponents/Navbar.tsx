"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { NAV_LINKS } from '@/utils/constants'
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid"
import logo from './logo.svg'

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`transition-all duration-300 fixed w-full z-50 ${
      scrolled ? 'bg-blue-900 shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className='flex items-center'>
            <Link href='/' className='flex items-center gap-2'>
              <Image src={logo} alt='logo' width={40} height={40}/>
              <h2 className='font-bold text-lg text-white'>PowerIQ</h2>
            </Link>            
          </div>

          <div className='hidden lg:flex items-center gap-8'>
            {NAV_LINKS.map((link) => (
              <Link 
                href={link.href} 
                key={link.key} 
                className='text-sm font-medium text-white hover:text-gray-300 transition-colors'
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className='hidden lg:flex items-center gap-4'>
            {session ? (
              <>
                <Link href="/dashboard" className='text-sm font-medium text-white hover:text-gray-300 transition-colors'>
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut()}
                  className='bg-white text-blue-900 hover:bg-gray-100 font-medium py-2 px-4 rounded-full transition-colors'
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
              <Link href="/auth/login">
                <button className='text-white hover:text-gray-300 font-medium transition-colors'>
                  Login
                </button></Link>
                <Link href="/auth/signup">
                <button className='bg-white text-blue-900 hover:bg-gray-100 font-medium py-2 px-4 rounded-full transition-colors'>
                  Sign Up
                </button></Link>
              </>
            )}
          </div>         

          <div className="lg:hidden">
            <button 
              onClick={() => setNavbarOpen(!navbarOpen)}
              className='text-white p-2'
            >
              {navbarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div> 
        </div>
      </div>

      {/* Mobile menu */}
      {navbarOpen && (
        <div className="lg:hidden bg-blue-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link 
                href={link.href} 
                key={link.key}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800"
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link 
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800">
                  Login
                </button>
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-white text-blue-900 hover:bg-gray-100">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar