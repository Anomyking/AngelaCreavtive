import HeroSection      from "@/components/sections/HeroSection";
import ProductCatalogue from "@/components/sections/ProductCatalogue";
import HowItWorks       from "@/components/sections/HowItWorks";
import Testimonials     from "@/components/sections/Testimonials";
import BundlesSection   from "@/components/sections/BundlesSection";
import FAQSection       from "@/components/sections/FAQSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductCatalogue />
      <HowItWorks />
      <Testimonials />
      <BundlesSection />
      <FAQSection />
    </>
  );
}

