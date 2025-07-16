import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from './logo.svg'

const Footer = () => {
  return (
    <footer className='relative max-container padding-container py-36 flex xs:gap-12 lg:gap-20 xs:flex-col lg:flex-row'>
      <Image 
        className='absolute right-[-4%] xs:top-0 lg:top-[-20%]' 
        src='/footer-object.png' 
        alt='object' 
        width={100} 
        height={100} 
      />

      <div className='flex flex-col gap-12 lg:w-1/3'>
        {/* LOGO & TEXT */}
        <div className='flex flex-col gap-4'>
          <div className='logo flex items-center gap-2'>
            <Image 
              src={logo}
              alt='Logo' 
              width={50} 
              height={50} 
            />
            <h2 className='font-bold text-2xl'>PowerIQ</h2>
          </div>
          <p className='opacity-70'>
            Empowering Delhi residents with reliable electricity supply and efficient services.
          </p>
        </div>

        {/* SOCIAL MEDIA */}
        <div className='social flex gap-4'>
          <Link href='https://facebook.com' target='_blank'>
            <Image src='/fb.png' alt='facebook' width={30} height={30} />
          </Link>
          <Link href='https://twitter.com' target='_blank'>
            <Image src='/twitter.png' alt='twitter' width={30} height={30} />
          </Link>
          <Link href='https://instagram.com' target='_blank'>
            <Image src='/instagram.png' alt='instagram' width={30} height={30} />
          </Link>
        </div>
      </div>

      {/* LINK FOOTER */}
      <div className='right lg:w-2/3 flex xs:flex-col md:flex-row xs:gap-10 md:gap-0 md:justify-between'>
        <FooterCard title='About Us' link1='Our Mission' link2='Our Team' link3='Services' />
        <FooterCard 
          title='Contact' 
          link1='Customer Support' 
          link2='Feedback' 
          link3='Help Center' 
          link4='Blog' 
        />
        <FooterCard 
          title='Get In Touch' 
          link1='+91 11 1234 5678' 
          link2='support@delhielectricity.gov.in' 
          link3='Sector 16, Delhi, India' 
        />
      </div>
    </footer>
  );
}

interface FooterCardProps {
  title: string;
  link1: string;
  link2: string;
  link3: string;
  link4?: string;
}

const FooterCard = ({ title, link1, link2, link3, link4 }: FooterCardProps) => {
  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-2xl font-bold'>{title}</h3>
      <ul className='flex flex-col gap-4 mt-4'>
        <Link className='opacity-70' href='/'>{link1}</Link>
        <Link className='opacity-70' href='/'>{link2}</Link>
        <Link className='opacity-70' href='/'>{link3}</Link> 
        {link4 && <Link className='opacity-70' href='/'>{link4}</Link>} 
      </ul>                  
    </div>  
  );
}

export default Footer;
