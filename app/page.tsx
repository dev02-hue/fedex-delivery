import BusinessSolutionsSection from "./components/BusinessSolutionsSection";
import GlobalCoverageSection from "./components/GlobalCoverageSection";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import ShippingToolsSection from "./components/ShippingToolsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import TrackingSection from "./components/TrackingSection";

 
export default function Home() {
  return (
 <div>
  <HeroSection />
  <ServicesSection />
  <TrackingSection />
  <ShippingToolsSection />
  <BusinessSolutionsSection />
  <GlobalCoverageSection />
  <TestimonialsSection />
 </div>
    
  );
}
