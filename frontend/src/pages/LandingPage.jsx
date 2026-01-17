import Navbar from "../components/landingpage/Navbar"; 
import Hero from "../components/landingpage/Hero";
import StatsBar from "../components/landingpage/stats";
import CoreCapabilities from "../components/landingpage/Features";
import RiskZones from "../components/landingpage/RiskZones";
import CTA from "../components/landingpage/CTA";
import Footer from "../components/landingpage/Footer";


const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero/>
      <StatsBar/>
      <CoreCapabilities/>
      <RiskZones/>
      <CTA/> 
      <Footer/>
    </>
  );
};

export default LandingPage;
