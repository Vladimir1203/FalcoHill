import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react';

const images = [
    "zgrada/zgrada1.png",
    "zgrada/zgrada2.png",
    "zgrada/zgrada3.png",
    "zgrada/zgrada4.png",
    "zgrada/zgrada5.png",
    "zgrada/zgrada6.png",
    "zgrada/zgrada7.png"
];

export default function Gallery() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    // Swipe hint state
    const [showSwipeHint, setShowSwipeHint] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto-play logic
    useEffect(() => {
        if (!isPaused) {
            timerRef.current = setInterval(nextSlide, 5000); // Slow, 5s interval
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPaused, nextSlide]);

    // Turn off swipe hint after 3 seconds
    useEffect(() => {
        const hintTimer = setTimeout(() => {
            setShowSwipeHint(false);
        }, 3000);
        return () => clearTimeout(hintTimer);
    }, []);

    // Touch handlers for swipe
    const onTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        setShowSwipeHint(false); // Hide hint on interaction
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();

        // Resume autoplay after a delay
        setTimeout(() => setIsPaused(false), 2000);
    };

    return (
        <div
            className="relative w-full h-[300px] md:h-[600px] bg-slate-50 md:rounded-2xl overflow-hidden shadow-xl group border-y md:border border-slate-200"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Swipe Hint Overlay (Mobile Only) */}
            {showSwipeHint && (
                <div className="absolute inset-0 z-40 md:hidden pointer-events-none flex items-center justify-center bg-black/10 transition-opacity duration-500">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-lg animate-pulse">
                        <Hand size={32} className="text-primary animate-bounce-horizontal" />
                    </div>
                </div>
            )}

            {/* Main Slider Track */}
            <div className="absolute inset-0">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {/* 1. Blurred Background Layer - fills the frame */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-110 saturate-100 transform translate-z-0"
                            style={{ backgroundImage: `url(${img})` }}
                        ></div>

                        {/* 2. Lightening overlay for soft look */}
                        <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>

                        {/* 3. Main Image - contained, pristine */}
                        <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
                            <img
                                src={img}
                                alt={`Tik Invest Gallery ${index + 1}`}
                                className="w-full h-full object-contain drop-shadow-xl rounded-lg transform transition-transform duration-700 hover:scale-[1.01]"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-md text-primary hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-md border border-slate-100"
                aria-label="Previous slide"
            >
                <ChevronLeft size={28} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-md text-primary hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-md border border-slate-100"
                aria-label="Next slide"
            >
                <ChevronRight size={28} />
            </button>

            {/* Indicators (Dots) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                        className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex
                            ? 'w-8 bg-primary shadow-sm'
                            : 'w-2 bg-slate-300/80 hover:bg-slate-400'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Custom Animation Style for Hand */}
            <style>{`
                @keyframes bounce-horizontal {
                    0%, 100% { transform: translateX(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
                    50% { transform: translateX(25%); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
                }
                .animate-bounce-horizontal {
                    animation: bounce-horizontal 1.5s infinite;
                }
            `}</style>
        </div>
    );
}
