import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Header from "./components/Header";
import Footer from "./components/Footer";
import MurliContainer from "./components/MurliContainer";
import FaqSection from "./components/FaqSection";

function App() {
  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MurliContainer />
          <FaqSection />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;
