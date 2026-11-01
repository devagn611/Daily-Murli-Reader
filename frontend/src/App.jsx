import { HelmetProvider } from 'react-helmet-async';
import Header from "./components/Header";
import Footer from "./components/Footer";
import MurliContainer from "./components/MurliContainer";
import FaqSection from "./components/FaqSection";

function App() {
  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen bg-[#f7f7f6] dark:bg-gray-900">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-grow container mx-auto px-4 sm:px-6 md:px-14 lg:px-16 pt-[168px] sm:pt-[92px] pb-6">
          <MurliContainer />
          <FaqSection />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;
