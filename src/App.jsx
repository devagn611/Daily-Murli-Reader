import React from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import MurliContainer from "./components/MurliContainer"; // Assuming MurliContainer is in this path

function App() {
  return (
    <>
      <Header />
      <MurliContainer /> {/* Include the MurliContainer here */}
      <Footer />
    </>
  );
}

export default App;