import { useEffect, useMemo, useState } from "react";
import { X, ArrowRight, Layers } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

import apartmentsData from "../data/apartments.json";

// Types for the new data structure

interface Room {
    name: string;
    area: string;
}

interface Apartment {
    id: string;
    label: string;
    floor: string;
    size: string;
    net_area?: string;
    rooms?: Room[];
    image: string; // Now a direct string filename in JSON
    coords: {
        ground?: number[];
        upper?: number[];
    };
    status?: 'available' | 'reserved' | {
        ground?: 'available' | 'reserved';
        level1?: 'available' | 'reserved';
        level2?: 'available' | 'reserved';
        level3?: 'available' | 'reserved';
    };
}

export default function FloorPlan() {
    // State for main category (Ground vs Upper)
    const [activeCategory, setActiveCategory] = useState<'ground' | 'upper'>('ground');
    // State for specific upper level (1, 2, 3)
    const [upperLevel, setUpperLevel] = useState<1 | 2 | 3>(1);
    // State for hiding reserved apartments
    const [hideReserved, setHideReserved] = useState(false);

    // Main floor plan images
    const FLOOR_IMAGES = {
        ground: "stanovi/prizemlje.png",
        level1: "stanovi/sprat1-1.png",
        level2: "stanovi/sprat1-1.png",
        level3: "stanovi/sprat1-1.png"
    };

    // Current active image based on state
    const currentImage = activeCategory === 'ground'
        ? FLOOR_IMAGES.ground
        : FLOOR_IMAGES[`level${upperLevel}` as keyof typeof FLOOR_IMAGES];

    // Pricing configuration
    const PRICE_PER_SQM = {
        ground: 1250,
        level1: 1350,
        level2: 1400,
        level3: 1450
    };

    // Helper to get current effective price floor key
    const currentPriceKey = activeCategory === 'ground' ? 'ground' : `level${upperLevel}` as 'level1' | 'level2' | 'level3';

    const getPriceForApartment = (apt: Apartment, floor: keyof typeof PRICE_PER_SQM) => {
        // Parse size string e.g. "54.20 m²" -> 54.20
        const sizeNum = parseFloat(apt.size.replace(',', '.').replace(/[^\d.]/g, ''));
        const pricePerSqm = PRICE_PER_SQM[floor];
        if (!sizeNum || !pricePerSqm) return null;
        return (sizeNum * pricePerSqm).toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\./g, ','); // Format with , as thousand separator
    };

    // Global offset for overlay adjustment (if needed)
    const Y_OFFSET = -12;

    const apartments = useMemo(() => apartmentsData as Apartment[], []);

    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [selected, setSelected] = useState<Apartment | null>(null);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelected(null);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const coordsToPoints = (coords: number[]) => {
        const pts = [];
        for (let i = 0; i < coords.length; i += 2) {
            pts.push(`${coords[i]},${coords[i + 1] + Y_OFFSET}`);
        }
        return pts.join(" ");
    };

    const getLabelPosition = (apt: Apartment, currentCoords: number[]) => {
        // Special case for Stan 8: use Stan 1's position (from Ground floor)
        if (apt.id === 'stan8') {
            const stan1 = apartments.find(a => a.id === 'stan1');
            if (stan1 && stan1.coords.ground) {
                return getBoundingBoxCenter(stan1.coords.ground);
            }
        }

        return getBoundingBoxCenter(currentCoords);
    };

    const getBoundingBoxCenter = (coords: number[]) => {
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (let i = 0; i < coords.length; i += 2) {
            const x = coords[i];
            const y = coords[i + 1];
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }

        return {
            x: (minX + maxX) / 2,
            y: ((minY + maxY) / 2) + Y_OFFSET
        };
    };

    // Filter apartments that are visible on the current active floor
    // Coordinates key: 'ground' for Ground, 'upper' for ALL upper levels
    const currentCoordsKey = activeCategory === 'ground' ? 'ground' : 'upper';

    const visibleApartments = apartments.filter(apt =>
        apt.coords && apt.coords[currentCoordsKey] !== undefined
    );

    const hovered = hoveredId
        ? apartments.find((a) => a.id === hoveredId)
        : null;

    // Helper to get apartment image based on context
    const getApartmentImage = (apt: Apartment) => {
        if (apt.image) return `stanovi/${apt.image}`;
        return "";
    };

    // Calculate dynamic apartment number
    const getDynamicApartmentNumber = (id: string, category: 'ground' | 'upper', level: number) => {
        let slotIndex = parseInt(id.replace('stan', ''));
        // Special mapping: Stan 8 occupies the same slot as Stan 1 but on upper floors
        if (id === 'stan8') slotIndex = 1;

        const displayOffset = category === 'ground' ? 0 : (level * 7);
        return slotIndex + displayOffset;
    };

    const getStatusForCurrentLevel = (apt: Apartment) => {
        if (!apt.status) return 'available';

        // If status is a simple string, it applies globally (legacy/simple support)
        if (typeof apt.status === 'string') return apt.status;

        // If status is an object, look up specific floor
        const levelKey = activeCategory === 'ground' ? 'ground' : `level${upperLevel}`;
        return (apt.status as any)[levelKey] || 'available';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'reserved': return '#475569'; // slate-600 (Previously used for sold)
            default: return 'transparent';
        }
    };

    // ... (rendering logic same until modal) ...

    /* Note: I am not replacing the big SVG rendering block here, assuming it stays same. 
       I will only use replace_file_content on the interfaces (top) and the modal (bottom).
       BUT since replace_file_content replaces a single block, I have to be careful.
       The user asked to update interfaces AND modal. They are far apart in file.
       I should use MULTI_replace or two calls.
       The prompt guidelines say: "To edit multiple, non-adjacent lines... make a single call to [multi_replace]".
       I will use multi_replace.
    */

    return (
        <>
            <section id="apartments" className="py-24 bg-surface overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <RevealOnScroll>
                            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                                Raspored stanova
                            </h2>
                            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
                                Odaberite nivo i istražite dostupne stanove. <br />
                                <span className="text-secondary font-medium">Kliknite na stan</span> za više detalja i pregled osnove.
                            </p>
                        </RevealOnScroll>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <RevealOnScroll delay={200} direction="up">
                            {/* Floor Toggle Controls - Hierarchical */}
                            <div className="flex flex-col items-center gap-6 mb-10">
                                {/* Primary Level Selection (Prizemlje vs Spratovi) */}
                                <div className="bg-white p-1.5 rounded-full shadow-lg border border-slate-100 flex items-center">
                                    <button
                                        onClick={() => setActiveCategory('ground')}
                                        className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 flex items-center gap-2 ${activeCategory === 'ground'
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                                            }`}
                                    >
                                        <Layers size={18} />
                                        Prizemlje
                                    </button>
                                    <button
                                        onClick={() => setActiveCategory('upper')}
                                        className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 flex items-center gap-2 ${activeCategory === 'upper'
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                                            }`}
                                    >
                                        <Layers size={18} className="rotate-180" />
                                        Spratovi
                                    </button>
                                </div>

                                {/* Secondary Level Selection (Specific Floors) - Only visible if 'Upper' is active */}
                                <div className={`
                                    transition-all duration-500 ease-in-out overflow-hidden
                                    ${activeCategory === 'upper' ? 'max-h-20 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'}
                                `}>
                                    <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-slate-200/60 flex gap-2">
                                        {[1, 2, 3].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setUpperLevel(level as 1 | 2 | 3)}
                                                className={`
                                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200
                                                    ${upperLevel === level
                                                        ? 'bg-secondary text-white shadow-sm transform scale-110'
                                                        : 'text-slate-500 hover:bg-slate-100'
                                                    }
                                                `}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-6 mb-6">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={hideReserved}
                                        onChange={(e) => setHideReserved(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-slate-600">Sakrij podatke o rezervisanim stanovima</span>
                                </label>
                                <div className="flex gap-4 text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                                        <span className="text-slate-600">Rezervisan</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full border-2 border-primary"></div>
                                        <span className="text-slate-600">Slobodan</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Info Panel */}
                            <div className="flex justify-center mb-6">
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-500 font-light">
                                    <span>Informativna cena:</span>
                                    <span className="font-medium text-slate-700">{PRICE_PER_SQM[currentPriceKey].toLocaleString('de-DE').replace('.', ',')} €/m²</span>
                                    <span className="text-xs text-slate-400 border-l border-slate-200 pl-2 ml-1">bez PDV-a</span>
                                </div>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-100 transform transition-all duration-300 hover:shadow-3xl">
                                {/* Dynamic Background Image */}
                                <div className="relative aspect-[554/524] w-full">
                                    <img
                                        src={currentImage}
                                        alt={`Prikaz ${activeCategory === 'ground' ? 'prizemlja' : `sprata ${upperLevel}`}`}
                                        className="w-full h-full object-contain block transition-all duration-500"
                                    />

                                    {/* SVG Overlay */}
                                    <svg
                                        className="absolute inset-0 w-full h-full"
                                        viewBox="0 0 554 524"
                                        preserveAspectRatio="xMidYMid meet"
                                    >
                                        <defs>
                                            <filter id="hoverBlur" x="-25%" y="-25%" width="150%" height="150%">
                                                <feGaussianBlur stdDeviation="5" />
                                            </filter>
                                            <radialGradient id="apartmentHoverGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                                <stop offset="0%" stopColor="rgb(250, 204, 21)" stopOpacity="0.5" /> {/* yellow-400 (Golden) */}
                                                <stop offset="60%" stopColor="rgb(250, 204, 21)" stopOpacity="0.15" />
                                                <stop offset="100%" stopColor="rgb(250, 204, 21)" stopOpacity="0" />
                                            </radialGradient>
                                            <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                                                <path d="M -1,2 l 6,0" stroke="#cbd5e1" strokeWidth="1" />
                                                <rect width="8" height="8" fill="transparent" />
                                            </pattern>
                                        </defs>

                                        {visibleApartments.map((apt) => {
                                            const isHovered = hoveredId === apt.id;
                                            const coords = apt.coords[currentCoordsKey]!; // We filtered for this

                                            const status = getStatusForCurrentLevel(apt);
                                            const isReserved = status === 'reserved' && !hideReserved;

                                            const getAdjustedPosition = () => {
                                                const pos = getLabelPosition(apt, coords);
                                                // Shift 'stan1' (and 'stan8' which follows it) slightly right
                                                if (apt.id === 'stan1' || apt.id === 'stan8') {
                                                    return { ...pos, x: pos.x + 40 };
                                                }
                                                return pos;
                                            }
                                            const c = getAdjustedPosition();

                                            // Strict floor logic check
                                            if (apt.id === 'stan1' && activeCategory !== 'ground') return null;
                                            if (apt.id === 'stan8' && activeCategory !== 'upper') return null;

                                            // Dynamic Numbering Logic
                                            const displayNumber = getDynamicApartmentNumber(apt.id, activeCategory, upperLevel);

                                            return (
                                                <g
                                                    key={apt.id}
                                                    className={`group transition-all duration-300 ${isReserved ? 'cursor-not-allowed' : 'cursor-pointer'
                                                        }`}
                                                    onMouseEnter={() => !isReserved && setHoveredId(apt.id)}
                                                    onMouseLeave={() => setHoveredId(null)}
                                                    onClick={() => !isReserved && setSelected(apt)}
                                                    style={{
                                                        transformBox: "fill-box",
                                                        transformOrigin: "center",
                                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                                    }}
                                                    transform={isHovered && !isReserved ? "scale(1.01)" : "scale(1)"}
                                                >
                                                    {/* Hit Area (Base) */}
                                                    <polygon
                                                        points={coordsToPoints(coords)}
                                                        className="transition-all duration-300"
                                                        style={{
                                                            fill: isReserved ? 'rgba(71, 85, 105, 0.7)' : 'transparent',
                                                            stroke: "transparent"
                                                        }}
                                                    />

                                                    {/* Pattern Overlay for Reserved */}
                                                    {isReserved && (
                                                        <polygon
                                                            points={coordsToPoints(coords)}
                                                            style={{ fill: 'url(#diagonalHatch)', pointerEvents: 'none' }}
                                                        />
                                                    )}

                                                    {/* Hover Effect - Only for Available */}
                                                    {!isReserved && (
                                                        <polygon
                                                            points={coordsToPoints(coords)}
                                                            className="transition-all duration-500 ease-out"
                                                            style={{
                                                                fill: isHovered ? "url(#apartmentHoverGradient)" : "transparent",
                                                                stroke: "transparent",
                                                                strokeWidth: "0",
                                                                filter: isHovered ? "drop-shadow(0 0 15px rgba(250, 204, 21, 0.4))" : "none"
                                                            }}
                                                        />
                                                    )}

                                                    {/* Status Badge */}
                                                    {isReserved && (
                                                        <circle
                                                            cx={c.x + 15}
                                                            cy={c.y - 15}
                                                            r="4"
                                                            fill="#64748b"
                                                            className="drop-shadow-sm"
                                                        />
                                                    )}

                                                    {/* Apartment Label */}
                                                    <text
                                                        x={c.x}
                                                        y={c.y}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                        transform={isReserved ? `rotate(20 ${c.x} ${c.y})` : undefined}
                                                        className={`select-none pointer-events-none font-heading font-bold transition-all duration-500 ${isReserved
                                                            ? "fill-white text-[10px] uppercase tracking-wider opacity-100"
                                                            : isHovered
                                                                ? "fill-primary text-xl opacity-100"
                                                                : "fill-slate-900/40 text-lg opacity-0"
                                                            }`}
                                                    >
                                                        {isReserved ? 'REZERVISANO' : displayNumber}
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                </div>

                                {hovered && (
                                    <div className="absolute bottom-6 left-6 animate-fade-in pointer-events-none">
                                        <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-xl shadow-xl border-l-4 border-secondary">
                                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Izabrano</div>
                                            <div className="text-2xl font-bold text-primary font-heading flex items-center gap-2">
                                                {`Stan ${getDynamicApartmentNumber(hovered.id, activeCategory, upperLevel)}`}
                                            </div>
                                            <div className="text-secondary font-medium">
                                                {hovered.size}
                                            </div>
                                            {(() => {
                                                const price = getPriceForApartment(hovered, currentPriceKey);
                                                return price ? (
                                                    <div className="text-slate-600 font-medium text-lg mt-1 border-t border-slate-100 pt-1">
                                                        ≈ {price} €
                                                    </div>
                                                ) : null;
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="text-center mt-6 text-slate-400 text-sm">
                                * Prikazani nameštaj i oprema su informativnog karaktera
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* MODAL */}
            {selected && (
                <div
                    className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute z-10 top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-slate-500 hover:text-primary hover:bg-white shadow-sm transition-all duration-300"
                            onClick={() => setSelected(null)}
                        >
                            <X size={24} />
                        </button>

                        {/* LEFT: Image */}
                        <div className="w-full md:w-1/2 bg-slate-50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                            <img
                                src={getApartmentImage(selected)}
                                alt={selected.label}
                                className="w-full h-auto max-h-[40vh] md:max-h-[70vh] object-contain drop-shadow-xl"
                            />
                        </div>

                        {/* RIGHT: Details */}
                        <div className="w-full md:w-1/2 flex flex-col h-auto md:h-full md:overflow-y-auto">
                            {/* Header */}
                            <div className="p-6 md:p-8 border-b border-slate-100 bg-white sticky top-0 z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-3xl font-heading font-bold text-primary">
                                        {`Stan ${getDynamicApartmentNumber(selected.id, activeCategory, upperLevel)}`}
                                    </h3>
                                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wider">
                                        {selected.floor === 'BOTH' ? 'Prizemlje / Sprat' : selected.floor}
                                    </span>
                                </div>
                                <div className="flex gap-6 mt-4">
                                    <div>
                                        <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">Ukupno</div>
                                        <div className="text-2xl font-bold text-slate-700">{selected.size}</div>
                                    </div>
                                    {selected.net_area && (
                                        <div>
                                            <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">Neto (97%)</div>
                                            <div className="text-2xl font-bold text-secondary">{selected.net_area}</div>
                                        </div>
                                    )}
                                    {(() => {
                                        const price = getPriceForApartment(selected, currentPriceKey);
                                        return price ? (
                                            <div>
                                                <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">Cena</div>
                                                <div className="text-2xl font-bold text-slate-700">≈ {price} €</div>
                                            </div>
                                        ) : null;
                                    })()}</div>
                            </div>

                            {/* Scrollable Content: Room List */}
                            <div className="p-6 md:p-8">
                                <h4 className="font-heading font-semibold text-lg text-primary mb-4 flex items-center gap-2">
                                    <Layers size={20} className="text-secondary" />
                                    Struktura prostorija
                                </h4>

                                {selected.rooms && (
                                    <div className="rounded-xl border border-slate-100 overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-500 font-medium uppercase tracking-wider text-xs">
                                                <tr>
                                                    <th className="px-4 py-3">Prostorija</th>
                                                    <th className="px-4 py-3 text-right">Površina</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {selected.rooms.map((room, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-slate-700">{room.name}</td>
                                                        <td className="px-4 py-3 text-right text-slate-600 font-mono">{room.area}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 mt-auto">
                                <button
                                    onClick={() => {
                                        setSelected(null);
                                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full py-4 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group font-medium text-lg"
                                >
                                    Pošalji upit za ovaj stan
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
