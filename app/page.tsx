import Approach from "@/components/Approach";
import ClosingCta from "@/components/ClosingCta";
import EnquiryDrawer from "@/components/EnquiryDrawer";
import FeaturedDevelopment from "@/components/FeaturedDevelopment";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LandToPlots from "@/components/LandToPlots";
import Location from "@/components/Location";
import MasterPlan from "@/components/MasterPlan";
import PlotDiscovery from "@/components/PlotDiscovery";
import { RevealController } from "@/components/ui";
import { SiteProvider } from "@/lib/site-state";

export default function Home() {
  return (
    <SiteProvider>
      <div className="relative overflow-x-clip">
        <Header />
        <main>
          <Hero />
          <FeaturedDevelopment />
          <LandToPlots />
          <MasterPlan />
          <PlotDiscovery />
          <Location />
          <Approach />
          <ClosingCta />
        </main>
        <Footer />
        <EnquiryDrawer />
      </div>
      <RevealController />
    </SiteProvider>
  );
}
