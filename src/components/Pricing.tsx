import { Euro, Building2, FileText, Landmark, Scale } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

export default function Pricing() {
  const features = [
    { icon: Building2, text: 'Kupovina direktno od investitora' },
    { icon: FileText, text: 'Uredna dokumentacija' },
    { icon: Landmark, text: 'Plaćanje isključivo preko računa' },
    { icon: Scale, text: 'Notarska obrada' }
  ];

  return (
    <section id="pricing" className="py-24 bg-primary text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-light/20 skew-x-12 transform translate-x-1/4"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <RevealOnScroll>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Cene i Uslovi
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light">
              Transparentni uslovi i jednostavan proces kupovine direktno od investitora.
            </p>
          </RevealOnScroll>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Price Card */}
            <RevealOnScroll direction="right">
              <div className="bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl p-8 md:p-12 text-center shadow-2xl transform transition-transform hover:scale-[1.02] relative group">
                <div className="absolute inset-0 bg-black/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Euro size={56} className="mx-auto mb-6 text-white opacity-90" />
                <div className="text-sm font-bold uppercase tracking-widest text-white/80 mb-2">Početna cena</div>
                <div className="text-6xl md:text-7xl font-heading font-bold mb-2">1,250 €</div>
                <div className="text-2xl opacity-90 font-light">+ PDV / m²</div>
                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-white/90 text-sm">Mogućnost povrata PDV-a za kupce prve nekretnine</p>
                </div>
              </div>
            </RevealOnScroll>

            {/* Features Card */}
            <RevealOnScroll direction="left" delay={200}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-4 flex-grow">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                      <div className="p-3 bg-secondary/20 rounded-lg">
                        <feature.icon size={24} className="text-secondary" />
                      </div>
                      <span className="text-lg font-light tracking-wide">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Removed "Specijalna pogodnost" block as per user request */}
              </div>
            </RevealOnScroll>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 italic">
              * Prodaja se vrši u skladu sa svim zakonskim propisima nakon pribavljanja pravosnažne građevinske dozvole.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
