
// Main Site Composition
import MenuSitePublic from '../../../Components/Utils/MenuSitePublic/MenuSitePublic';
import HeroSection from './Sections/HeroSection/HeroSection';
import ServicesSection from './Sections/ServicesSection/ServicesSection';
import AboutSection from './Sections/AboutSection/AboutSection';
import InfrastructureSection from './Sections/InfrastructureSection/InfrastructureSection';
import ProcessSection from './Sections/ProcessSection/ProcessSection';
import TeamSection from './Sections/TeamSection/TeamSection';
import FooterSection from './Sections/FooterSection/FooterSection';

export default function MainSite() {
    return (
        <div>
            {/* Navigation Overlay */}
            <MenuSitePublic />

            <main>
                <HeroSection />
                <ServicesSection />
                <AboutSection />
                <InfrastructureSection />
                <ProcessSection />
                <TeamSection />
            </main>

            <FooterSection />
        </div>
    );
}