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
        {/* Hiérarchie de la page, alignée sur l'activité réelle du client :
            taxi conventionné -> établissements de santé -> zone -> services
            secondaires -> réservation. La photo "hôpital" arrive donc en
            premier, immédiatement après le Hero. */}
        <MedicalTransport />
        <ServiceArea />
        <Services />
        <AirportTransfers />
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
