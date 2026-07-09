import { useState } from 'react';
import { Car, ZoomIn, X } from 'lucide-react';

export default function Parking() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const PARKING_IMAGES = [
    {
      src: "stanovi/prizemlje-parking.png",
      title: "Spoljašnji Parking",
      desc: "Raspored parking mesta u prizemlju",
      tag: "Prizemlje"
    },
    {
      src: "stanovi/suteren-parking.png",
      title: "Garažna Etaža",
      desc: "Raspored garažnih mesta i ostava",
      tag: "Suteren"
    }
  ];

  return (
    <section id="parking" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Parking i Garaža
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Bezbednost vašeg vozila je naš prioritet.
            kliknite na mapu za uvećani prikaz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left Side: Stats/Info */}
          <div className="space-y-8">
            <div className="bg-surface p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Car size={120} />
              </div>

              <h3 className="font-heading text-2xl font-bold text-primary mb-8 relative z-10">Kapaciteti objekta</h3>

              <div className="grid gap-4">
                {/* VIP Spot Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-200 shadow-sm transition-all hover:shadow-md">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-bl-full -mr-4 -mt-4"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-amber-100/50 rounded-xl border border-amber-100">
                        <Car size={28} className="text-amber-600" />
                      </div>
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-wide whitespace-nowrap">
                        4 mesta
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-slate-800 text-lg mb-3">VIP Garažna mesta</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">Zasebne jedinice</span>
                      <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">Rolo vrata</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Standard Spots */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-secondary/10 rounded-lg">
                        <div className="w-5 h-5 rounded-full border-2 border-secondary"></div>
                      </div>
                      <span className="bg-slate-50 text-slate-600 text-xs font-bold px-2 py-1 rounded-full border border-slate-100 whitespace-nowrap">
                        13 mesta
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-slate-700 text-base mb-1">Standardna garažna</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Unutra</p>
                  </div>

                  {/* Exterior Spots */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-slate-100 rounded-lg">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-400"></div>
                      </div>
                      <span className="bg-slate-50 text-slate-600 text-xs font-bold px-2 py-1 rounded-full border border-slate-100 whitespace-nowrap">
                        11 mesta
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-slate-700 text-base mb-1">Spoljašnji parking</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Napolju</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Maps */}
          <div className="space-y-6">
            {PARKING_IMAGES.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img.src)}
                className="relative group cursor-zoom-in rounded-2xl overflow-hidden shadow-lg border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Image */}
                <div className="aspect-[16/9] w-full bg-slate-50 relative">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="text-white drop-shadow-md" size={48} />
                  </div>
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 mb-2 text-[10px] font-bold uppercase tracking-widest text-white bg-secondary rounded-full shadow-sm">
                      {img.tag}
                    </span>
                    <h4 className="text-white font-heading font-bold text-xl">{img.title}</h4>
                    <p className="text-slate-200 text-sm hidden sm:block">{img.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>

          <img
            src={selectedImage}
            alt="Full size view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
