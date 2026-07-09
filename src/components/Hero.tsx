import { Building2, ArrowUpDown, Car, Package } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center bg-primary overflow-hidden py-20 px-4">
      {/* Background Image with optimized overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="hero.jpeg"
          alt="Modern Residential Building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90"></div>
      </div>

      <div className="relative z-10 container text-center text-white px-4 animate-fade-in">
        <div className="mb-6 md:mb-10 animate-slide-up mt-16 md:mt-24">
          <img
            src="logo.png"
            alt="Tik Invest"
            className="h-24 md:h-48 w-auto mx-auto mb-4 md:mb-8 drop-shadow-2xl filter brightness-0 invert"
          />
        </div>

        <h1 className="font-heading text-2xl md:text-5xl lg:text-6xl font-light mb-4 md:mb-6 leading-tight tracking-tight">
          SAVREMENI STAMBENI <br />
          <span className="text-secondary font-medium">OBJEKAT U RAŠKI</span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-300 text-base md:text-xl font-light mb-8 md:mb-12 tracking-wide">
          Vaš novi dom, gde se udobnost susreće sa modernim dizajnom.
        </p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8">
          {[
            { icon: Building2, label: 'P+3 Spratnost' },
            { icon: ArrowUpDown, label: 'Moderni Lift' },
            { icon: Car, label: 'Garažna Mesta' },
            { icon: Package, label: 'Parking' },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-2 md:px-6 md:py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:bg-white/10 transition-colors cursor-default"
            >
              <feature.icon className="text-accent w-5 h-5" />
              <span className="font-heading text-sm md:text-base tracking-wide">{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => document.getElementById('apartments')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg transition-all duration-300 border border-white/20"
          >
            Pogledajte stanove
          </button>
        </div>
      </div>


    </section>
  );
}
