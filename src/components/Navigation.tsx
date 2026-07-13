import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const menuItems = [
    { label: 'O projektu', id: 'about' },
    { label: 'Lokacija', id: 'location' },
    { label: 'Stanovi', id: 'apartments' },
    { label: 'Parking', id: 'parking' },
    { label: 'Cene', id: 'pricing' },
    { label: 'Kontakt', id: 'contact' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/90 backdrop-blur-md shadow-lg py-2 text-slate-700'
        : 'bg-transparent py-4 text-white'
        }`}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="logo.png"
              alt="FalcoHill"
              className="h-32 w-auto transition-all duration-300"
            />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative hover:text-primary transition-colors font-medium text-sm tracking-wide uppercase ${isScrolled ? 'text-slate-700' : 'text-white'}`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary-light transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg font-medium text-sm"
            >
              <Phone size={16} />
              <span>Pozovite nas</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 hover:text-primary transition-colors ${isScrolled ? 'text-slate-700' : 'text-white'}`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
            }`}
        >
          <div className="py-6 px-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors font-medium rounded-lg"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
