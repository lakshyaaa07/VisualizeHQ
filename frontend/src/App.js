import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Change here
import Header from "./sections/Header.js";
import Hero from "./sections/Hero.js";
import Features from "./sections/Features.js";
import Pricing from "./sections/Pricing.js";
import Faq from "./sections/Faq.js";
import Testimonials from "./sections/Testimonials.js";
import Download from "./sections/Download.js";
import Contact from "./sections/Contact.js";
import Footer from "./sections/Footer.js";
import NotFound from "./sections/NotFound.js";
import HypnoticLoader from "./components/HypnoticLoader.js";
import AuthContext, { AuthProvider } from "./components/AuthContext.js";

const App = () => {
  const [loading, setLoading] = useState(true);
  // const {username} =useContext(AuthContext)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Loader will show for 3 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  return (
    <main className="overflow-hidden">
        {loading ? (
          <HypnoticLoader 
          loadingText="Welcome to Vizora, where your data comes to life!" 
          />
        ) : (
          <AuthProvider>
          <>

             <Header />
            <Hero />
            <Features />
            <Pricing />
            <Faq />
            <Testimonials />
            <Download />
            <Footer />
          </>
          </AuthProvider>
        )}
      </main>
  );
};

export default App;
