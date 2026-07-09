import { Building2, ArrowUpDown, Car, Package } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import Gallery from './Gallery';

export default function About() {
  const features = [
    { icon: Building2, label: '28 stanova', description: 'Različite strukture' },
    { icon: ArrowUpDown, label: 'Lift', description: 'Na svim spratovima' },
    { icon: Car, label: 'Garaža', description: 'Garažna i parking mesta' },
    { icon: Package, label: 'Podrumi', description: 'Uz svaki stan' }
  ];

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <RevealOnScroll direction="right">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                O Projektu
              </h2>
              <div className="w-20 h-1 bg-secondary mb-8"></div>

              <p className="text-lg text-slate-600 leading-relaxed mb-6 font-light">
                Novi stambeni objekat u Raški, u investiciji kompanije Tik Invest, projektovan je
                prema savremenim standardima stanovanja, sa posebnim akcentom na funkcionalnost,
                kvalitet gradnje i dugoročnu vrednost.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-10 font-light">
                Objekat se sastoji od ukupno <strong className="text-primary font-medium">28 stanova</strong> različitih struktura, sa liftom
                koji povezuje sve etaže, garažnim mestima u suterenu, kao i parkingom na otvorenom.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <RevealOnScroll key={index} delay={index * 100} direction="up" className="h-full">
                    <div
                      className="group text-center p-6 bg-surface rounded-xl border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-secondary/30 h-full"
                    >
                      <feature.icon size={40} className="mx-auto mb-4 text-accent transition-transform duration-300 group-hover:scale-110" />
                      <h3 className="font-heading font-bold text-primary mb-1 text-lg">{feature.label}</h3>
                      <p className="text-sm text-slate-500">{feature.description}</p>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          <div className="relative order-1 md:order-2">
            <RevealOnScroll direction="left" delay={200}>
              <div className="absolute -inset-4 bg-gradient-to-r from-accent to-secondary rounded-2xl opacity-10 blur-2xl"></div>
              <Gallery />
              {/* Decoration */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
