import { useEffect, useMemo, useState } from "react";
import { X, ArrowRight, Layers, Maximize2 } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import apartmentsData from "../data/apartments.json";

interface Room { name: string; area: string; }
interface Apartment {
    id: string;
    label: string;
    floor: string;
    type: string;
    typeDesc: string;
    size: string;
    rooms: Room[];
    image?: string;
    status?: 'available' | 'reserved';
    coords?: { ground?: number[]; upper?: number[]; };
}

const FLOOR_IMAGES = {
    ground: "stanovi/prizemlje_fh.png",
    upper:  "stanovi/sprat1_fh.png",
};

const VIEWBOX = {
    ground: { w: 2048, h: 1552 },
    upper:  { w: 2048, h: 1552 },
};

const TYPE_COLORS: Record<string, string> = {
    "Panorama Falco Suite": "bg-amber-50 text-amber-700 border-amber-200",
    "Sky Terrace Studio":   "bg-sky-50 text-sky-700 border-sky-200",
    "Sky Family Suite":     "bg-violet-50 text-violet-700 border-violet-200",
    "Falco View Studio":    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Falco Family Suite":   "bg-rose-50 text-rose-700 border-rose-200",
    "Falco Smart Studio":   "bg-slate-50 text-slate-600 border-slate-200",
    "Falco Family Studio":  "bg-orange-50 text-orange-700 border-orange-200",
    "Falco Terrace Studio": "bg-teal-50 text-teal-700 border-teal-200",
};

export default function Apartments() {
    const [activeFloor, setActiveFloor] = useState<'ground' | 'upper'>('ground');
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [selected, setSelected] = useState<Apartment | null>(null);
    const [hideReserved, setHideReserved] = useState(false);

    const apartments = useMemo(() => apartmentsData as Apartment[], []);

    // Apartments visible on current floor (have coords for this floor)
    const visibleApts = useMemo(() =>
        apartments.filter(a => a.coords?.[activeFloor] && a.coords[activeFloor]!.length > 0),
        [apartments, activeFloor]
    );

    const hovered = hoveredId ? apartments.find(a => a.id === hoveredId) : null;

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const coordsToPoints = (coords: number[]) => {
        const pts: string[] = [];
        for (let i = 0; i < coords.length; i += 2) {
            pts.push(`${coords[i]},${coords[i + 1]}`);
        }
        return pts.join(" ");
    };

    const getBBoxCenter = (coords: number[]) => {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (let i = 0; i < coords.length; i += 2) {
            minX = Math.min(minX, coords[i]);
            maxX = Math.max(maxX, coords[i]);
            minY = Math.min(minY, coords[i + 1]);
            maxY = Math.max(maxY, coords[i + 1]);
        }
        return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    };

    const formatPrice = (apt: Apartment) => {
        const ppm = activeFloor === 'ground' ? 1250 : 1350;
        const n = parseFloat(apt.size.replace(/[^\d.]/g, ''));
        if (!n) return null;
        return (n * ppm).toLocaleString('de-DE', { maximumFractionDigits: 0 }) + ' €';
    };

    const groundCount = 20;
    const upperCount  = 17;

    return (
        <>
            <section id="apartments" className="py-24 bg-surface overflow-hidden">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <RevealOnScroll>
                            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                                Raspored apartmana
                            </h2>
                            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
                                Odaberite etažu i istražite dostupne apartmane.{" "}
                                <span className="text-secondary font-medium">Kliknite na apartman</span> za detalje.
                            </p>
                        </RevealOnScroll>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <RevealOnScroll delay={200} direction="up">

                            {/* Floor toggle */}
                            <div className="flex flex-col items-center gap-4 mb-8">
                                <div className="bg-white p-1.5 rounded-full shadow-lg border border-slate-100 flex items-center gap-1">
                                    <button
                                        onClick={() => setActiveFloor('ground')}
                                        className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 flex items-center gap-2 ${
                                            activeFloor === 'ground'
                                                ? 'bg-primary text-white shadow-md'
                                                : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                                        }`}
                                    >
                                        <Layers size={18} />
                                        Prizemlje
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeFloor === 'ground' ? 'bg-white/20' : 'bg-slate-100'}`}>
                                            {groundCount}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setActiveFloor('upper')}
                                        className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 flex items-center gap-2 ${
                                            activeFloor === 'upper'
                                                ? 'bg-primary text-white shadow-md'
                                                : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                                        }`}
                                    >
                                        <Layers size={18} className="rotate-180" />
                                        1. sprat
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${activeFloor === 'upper' ? 'bg-white/20' : 'bg-slate-100'}`}>
                                            {upperCount}
                                        </span>
                                    </button>
                                </div>

                                {/* Controls row */}
                                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={hideReserved}
                                            onChange={e => setHideReserved(e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-slate-600">Sakrij rezervisane</span>
                                    </label>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                                            <span className="text-slate-500">Rezervisan</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                            <span className="text-slate-500">Slobodan</span>
                                        </div>
                                    </div>
                                    <div className="text-slate-400 border-l border-slate-200 pl-4">
                                        Inf. cena:{" "}
                                        <span className="font-medium text-slate-600">
                                            {activeFloor === 'ground' ? '1.250' : '1.350'} €/m²
                                        </span>
                                        <span className="text-xs ml-1">bez PDV-a</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floor plan with SVG overlay */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-100">
                                <div className="relative w-full" style={{ aspectRatio: `${VIEWBOX[activeFloor].w}/${VIEWBOX[activeFloor].h}` }}>
                                    <img
                                        key={activeFloor}
                                        src={FLOOR_IMAGES[activeFloor]}
                                        alt={activeFloor === 'ground' ? 'Prizemlje' : '1. sprat'}
                                        className="w-full h-full object-contain block transition-opacity duration-500"
                                    />

                                    <svg
                                        className="absolute inset-0 w-full h-full"
                                        viewBox={`0 0 ${VIEWBOX[activeFloor].w} ${VIEWBOX[activeFloor].h}`}
                                        preserveAspectRatio="xMidYMid meet"
                                    >
                                        <defs>
                                            <radialGradient id="hoverGrad" cx="50%" cy="50%" r="50%">
                                                <stop offset="0%"   stopColor="rgb(250,204,21)" stopOpacity="0.55" />
                                                <stop offset="60%"  stopColor="rgb(250,204,21)" stopOpacity="0.20" />
                                                <stop offset="100%" stopColor="rgb(250,204,21)" stopOpacity="0" />
                                            </radialGradient>
                                            <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                                                <line x1="0" y1="0" x2="0" y2="8" stroke="#94a3b8" strokeWidth="2" />
                                            </pattern>
                                        </defs>

                                        {visibleApts.map(apt => {
                                            const coords = apt.coords![activeFloor]!;
                                            const reserved = apt.status === 'reserved';
                                            const hidden   = reserved && hideReserved;
                                            if (hidden) return null;

                                            const isHovered = hoveredId === apt.id;
                                            const pts = coordsToPoints(coords);
                                            const { x: cx, y: cy } = getBBoxCenter(coords);

                                            return (
                                                <g
                                                    key={apt.id}
                                                    className={reserved ? 'cursor-not-allowed' : 'cursor-pointer'}
                                                    onMouseEnter={() => !reserved && setHoveredId(apt.id)}
                                                    onMouseLeave={() => setHoveredId(null)}
                                                    onClick={() => !reserved && setSelected(apt)}
                                                >
                                                    {/* Base fill */}
                                                    <polygon
                                                        points={pts}
                                                        fill={reserved ? 'rgba(71,85,105,0.45)' : 'transparent'}
                                                        stroke="transparent"
                                                    />

                                                    {/* Hatch for reserved */}
                                                    {reserved && (
                                                        <polygon points={pts} fill="url(#hatch)" opacity="0.4" />
                                                    )}

                                                    {/* Hover glow */}
                                                    {!reserved && (
                                                        <polygon
                                                            points={pts}
                                                            fill={isHovered ? 'url(#hoverGrad)' : 'transparent'}
                                                            stroke={isHovered ? 'rgba(250,204,21,0.8)' : 'transparent'}
                                                            strokeWidth={isHovered ? 1.5 : 0}
                                                            style={{
                                                                filter: isHovered ? 'drop-shadow(0 0 8px rgba(250,204,21,0.5))' : 'none',
                                                                transition: 'all 0.25s ease'
                                                            }}
                                                        />
                                                    )}

                                                    {/* Label - only for reserved */}
                                                    {reserved && (
                                                    <text
                                                        x={cx} y={cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                        fontSize={7}
                                                        fontWeight="bold"
                                                        fontFamily="sans-serif"
                                                        fill="white"
                                                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                                                    >
                                                        REZ.
                                                    </text>
                                                    )}
                                                </g>
                                            );
                                        })}
                                    </svg>

                                    {/* Hover tooltip */}
                                    {hovered && (
                                        <div className="absolute bottom-4 left-4 pointer-events-none animate-fade-in">
                                            <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-xl shadow-xl border-l-4 border-secondary">
                                                <div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Apartman</div>
                                                <div className="text-xl font-bold text-primary font-heading">{hovered.label}</div>
                                                <div className="text-sm text-slate-500">{hovered.type}</div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1 text-secondary font-medium text-sm">
                                                        <Maximize2 size={13} />{hovered.size}
                                                    </span>
                                                    {formatPrice(hovered) && (
                                                        <span className="text-slate-600 text-sm">≈ {formatPrice(hovered)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center mt-4 text-slate-400 text-xs">
                                * Prikazane površine su neto površine stambenih jedinica
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* MODAL */}
            {selected && (
                <div
                    className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className={`relative bg-white rounded-2xl shadow-2xl w-full animate-slide-up flex flex-col md:flex-row overflow-hidden ${selected.image ? 'max-w-7xl' : 'max-w-lg'}`}
                        style={{ maxHeight: '95vh' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-slate-500 hover:text-primary hover:bg-white shadow-sm transition-all z-10"
                            onClick={() => setSelected(null)}
                        >
                            <X size={22} />
                        </button>

                        {/* Slika apartmana - lijeva strana */}
                        {selected.image && (
                            <div className="w-full md:w-1/2 flex-shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden">
                                <img
                                    src={selected.image}
                                    alt={selected.label}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        {/* Desna strana - detalji */}
                        <div className={`${selected.image ? 'w-full md:w-1/2' : 'w-full'} flex flex-col overflow-y-auto`}>

                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-primary/5 to-transparent">
                            <div className="flex items-start justify-between pr-8 mb-3">
                                <div>
                                    <h3 className="text-3xl font-heading font-bold text-primary">{selected.label}</h3>
                                    <p className="text-slate-500 text-sm mt-0.5">{selected.typeDesc}</p>
                                </div>
                                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${TYPE_COLORS[selected.type] ?? ''}`}>
                                    {selected.type}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4">
                                <div className="bg-white rounded-lg px-4 py-2 border border-slate-100 shadow-sm">
                                    <div className="text-xs text-slate-400 uppercase tracking-wider">Etaža</div>
                                    <div className="font-semibold text-primary">{selected.floor}</div>
                                </div>
                                <div className="bg-white rounded-lg px-4 py-2 border border-slate-100 shadow-sm">
                                    <div className="text-xs text-slate-400 uppercase tracking-wider">Površina</div>
                                    <div className="font-semibold text-primary">{selected.size}</div>
                                </div>
                                {formatPrice(selected) && (
                                    <div className="bg-secondary/10 rounded-lg px-4 py-2 border border-secondary/20 shadow-sm">
                                        <div className="text-xs text-secondary/70 uppercase tracking-wider">Inf. cena</div>
                                        <div className="font-semibold text-secondary">≈ {formatPrice(selected)}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Room list */}
                        <div className="p-6">
                            <h4 className="font-heading font-semibold text-primary mb-4 flex items-center gap-2">
                                <Layers size={18} className="text-secondary" />
                                Struktura prostorija
                            </h4>
                            <div className="rounded-xl border border-slate-100 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Prostorija</th>
                                            <th className="px-4 py-3 text-right">Površina</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {selected.rooms.map((room, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50">
                                                <td className="px-4 py-3 font-medium text-slate-700">{room.name}</td>
                                                <td className="px-4 py-3 text-right text-slate-600 font-mono">{room.area}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-50 font-semibold">
                                            <td className="px-4 py-3 text-primary">Ukupno</td>
                                            <td className="px-4 py-3 text-right text-primary font-mono">{selected.size}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 mt-auto">
                            <button
                                onClick={() => {
                                    setSelected(null);
                                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full py-4 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group font-medium text-lg"
                            >
                                Pošalji upit za ovaj apartman
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        </div>{/* end desna strana */}
                    </div>
                </div>
            )}
        </>
    );
}
