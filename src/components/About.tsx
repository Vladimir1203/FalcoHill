import { Leaf, Bike, TrendingUp } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import Gallery from './Gallery';

export default function About() {
  const highlights = [
    {
      icon: Leaf,
      label: 'Netaknuta priroda',
      description: 'Čist planinski vazduh i prelepi pejzaži tokom cele godine.'
    },
    {
      icon: Bike,
      label: 'Aktivan odmor',
      description: 'Skijanje zimi, šetnje, biciklizam i brojne aktivnosti leti.'
    },
    {
      icon: TrendingUp,
      label: 'Odmor i investicija',
      description: 'Vaš apartman na Kopaoniku – mesto za uživanje i dugoročnu vrednost.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">

        {/* O projektu */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 md:order-1">
            <RevealOnScroll direction="right">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                O Projektu
              </h2>
              <div className="w-20 h-1 bg-secondary mb-8"></div>
              <p className="text-lg text-slate-600 leading-relaxed mb-6 font-light">
                Falco Hill je savremeni apartmanski kompleks smešten u Vikend naselju Kopaonik, projektovan prema visokim standardima kvaliteta i funkcionalnosti.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed font-light">
                Projekat obuhvata <strong className="text-primary font-medium">37 pažljivo osmišljenih apartmana</strong>, recepciju, ski ostavu i podzemnu garažu, pružajući idealan spoj modernog dizajna, udobnosti i planinskog ambijenta. Zahvaljujući atraktivnoj lokaciji i kvalitetnoj gradnji, Falco Hill predstavlja izuzetan izbor za odmor, boravak tokom cele godine i dugoročnu investiciju.
              </p>
            </RevealOnScroll>
          </div>

          <div className="relative order-1 md:order-2">
            <RevealOnScroll direction="left" delay={200}>
              <div className="absolute -inset-4 bg-gradient-to-r from-accent to-secondary rounded-2xl opacity-10 blur-2xl"></div>
              <Gallery />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Kopaonik na dohvat ruke */}
        <RevealOnScroll>
          <div className="bg-primary rounded-3xl p-10 md:p-16 text-white">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-center">
              KOPAONIK NA DOHVAT RUKE
            </h2>
            <div className="w-20 h-1 bg-secondary mx-auto mb-8"></div>

            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="text-lg text-slate-300 leading-relaxed mb-6 font-light">
                Kopaonik je sinonim za čist vazduh, netaknutu prirodu i aktivan odmor tokom cele godine. Zimi privlači ljubitelje skijanja, dok leti pruža savršeno okruženje za beg od gradske gužve.
              </p>
              <p className="text-lg text-slate-200 leading-relaxed font-light">
                Falco Hill vam omogućava da već za cenu od oko <strong className="text-secondary">30.000 €</strong> postanete vlasnik apartmana na najpoznatijoj srpskoj planini i uživate u svim njenim prednostima, uz sigurnu investiciju za budućnost.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {highlights.map((item, index) => (
                <RevealOnScroll key={index} delay={index * 100} direction="up">
                  <div className="flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                    <item.icon size={36} className="text-secondary mb-4" />
                    <h3 className="font-heading font-bold text-lg mb-2">{item.label}</h3>
                    <p className="text-slate-400 text-sm font-light">{item.description}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
