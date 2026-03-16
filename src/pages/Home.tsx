import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Philosophy from '../components/Philosophy';
import CoreValues from '../components/CoreValues';
import Projects from '../components/Projects';
import ContactCTA from '../components/ContactCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <CoreValues />
        <Projects />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
