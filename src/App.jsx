import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { Services } from './components/Services';
import { MedicalTransport } from './components/MedicalTransport';
import { AirportTransfers } from './components/AirportTransfers';
import { VehicleGallery } from './components/VehicleGallery';
import { BookingForm } from './components/BookingForm';
import { ServiceArea } from './components/ServiceArea';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-surface-light text-navy-900 font-sans selection:bg-gold-400 selection:text-navy-950 pb-16 sm:pb-0">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        {/* Le bloc "taxi conventionné" est remonté juste après le Hero : c'est la
            première vraie photo de service, elle est donc visible très tôt sur mobile. */}
        <MedicalTransport />
        <Services />
        <AirportTransfers />
        <ServiceArea />
        <VehicleGallery />
        <BookingForm />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
