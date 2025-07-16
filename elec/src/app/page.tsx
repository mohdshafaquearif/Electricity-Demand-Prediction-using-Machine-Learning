import ElectricityStats from "@/HomeComponents/Destination";
import Features from "@/HomeComponents/Features";
import Hero from "@/HomeComponents/Hero";
import Services from "@/HomeComponents/Services";
import Sponsor from "@/HomeComponents/Sponsor";
import ElectricityStatsSection from "@/HomeComponents/TravelPoint";
import DelhiPowerMap from "@/HomeComponents/DelhiPowerMap";
import Navbar from '@/HomeComponents/Navbar';
import Footer from '@/HomeComponents/Footer';
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Sponsor />
      <Services />
      <DelhiPowerMap />
      <ElectricityStats />
      <ElectricityStatsSection />
      <Features />
      <Footer />
      <ToastContainer />
    </>
  );
}
