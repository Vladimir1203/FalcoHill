import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Location from './components/Location';
import Apartments from './components/Apartments';
import Parking from './components/Parking';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Location />
      <Apartments />
      <Parking />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
