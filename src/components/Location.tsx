import { MapPin, Wifi, ShoppingBag } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

export default function Location() {
  const advantages = [
    {
      icon: MapPin,
      title: 'Mirna zona',
      description: 'Porodično okruženje, bez gradske buke'
    },
    {
      icon: Wifi,
      title: 'Dobra povezanost',
      description: 'Brz i jednostavan pristup glavnim saobraćajnicama'
    },
    {
      icon: ShoppingBag,
      title: 'Blizina sadržaja',
      description: 'Prodavnice i osnovne usluge u neposrednoj blizini'
    }
  ];

  return (
    <section id="location" className="py-24 bg-surface-dark relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="md:w-1/2">
            <RevealOnScroll direction="right">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                Savršena Lokacija <br />
                <span className="text-secondary">za Vaš Dom</span>
              </h2>
              <div className="w-20 h-1 bg-accent mb-8"></div>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Objekat je zamišljen kao mirna porodična zgrada, idealna za udoban
                svakodnevni život. Nalazi se u vikend naselju na Kopaoniku,
                koje pruža dobar balans između privatnosti i dostupnosti.
              </p>
            </RevealOnScroll>
          </div>

          <div className="md:w-1/2 grid gap-4">
            {advantages.map((advantage, index) => (
              <RevealOnScroll key={index} delay={index * 100} direction="left">
                <div
                  className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 group"
                >
                  <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <advantage.icon size={24} className="text-accent" />
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-primary text-lg mb-1">
                      {advantage.title}
                    </h4>
                    <p className="text-slate-500 text-sm">
                      {advantage.description}
                    </p>
                  </div>

                  {/* Arrow removed as per user request */}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <RevealOnScroll delay={300} direction="up">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px] border-4 border-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d500!2d20.758676743545312!3d43.27622589059995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ssr!2srs!4v1700000000000!5m2!1ssr!2srs"
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokacija objekta – Vikend naselje, Kopaonik"
            />

            {/* suptilan overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>

            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
              <div className="flex items-center gap-2 text-primary font-bold mb-1">
                <MapPin size={18} className="text-accent" />
                <span>Vikend naselje, Kopaonik</span>
              </div>
              <p className="text-xs text-slate-500">Kliknite na mapu za navigaciju</p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
