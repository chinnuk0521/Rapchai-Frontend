"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import { IMG } from "../lib/images";
import { useState, useEffect } from "react";

export default function HeroSlider() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const slides = [
    {
      title: "Welcome to Rapchai",
      subtitle: "Bangalore's first cafe focussed on community building.",
      cta: { label: "Order Now", href: "https://wa.me/918792896633", external: true },
      bgUrl: IMG.hero1,
    },
    {
      title: "Where Coffee Meets Beats",
      subtitle: "Cozy, vibrant and affordable cafe experience.",
      cta: { label: "View Menu", href: "/menu" },
      bgUrl: IMG.hero2,
    },
    {
      title: "Rap Night Live",
      subtitle: "Open mics and community cyphers every week.",
      cta: { label: "View Events", href: "/events" },
      bgUrl: IMG.hero3,
    },
  ];

  const scrollToNext = () => {
    const heroHeight = window.innerHeight;
    window.scrollTo({
      top: heroHeight,
      behavior: 'smooth'
    });
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <section className="relative w-full h-screen overflow-hidden">
        <div className="relative h-screen w-full bg-gradient-to-br from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-xl uppercase tracking-[0.2em] opacity-95 font-semibold text-[var(--rc-creamy-beige)] mb-6">Rapchai</div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">Welcome to Rapchai</h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-white font-semibold mb-10 max-w-4xl mx-auto leading-relaxed">Bangalore's first cafe focussed on community building.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Swiper 
        modules={[Autoplay, Pagination]}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        navigation={false}
        className="h-full w-full"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className={`relative h-screen w-full bg-cover bg-center bg-fixed`} style={{ backgroundImage: `url(${s.bgUrl})` }}>
              <div className="absolute inset-0 bg-[var(--rc-espresso-brown)]/40" />
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center text-white max-w-6xl mx-auto px-4">
                  <div className="flex flex-col items-center gap-3 mb-6">
                    <img src="/logo-orange.svg" alt="RAPCHAI" className="h-16 w-16 md:h-20 md:w-20 opacity-95" />
                    <div className="text-xl uppercase tracking-[0.2em] opacity-95 font-semibold text-[var(--rc-creamy-beige)] letter-spacing-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Rapchai</div>
                  </div>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight" style={{ 
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textShadow: '2px 4px 20px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)',
                    fontWeight: 900,
                    letterSpacing: '-0.02em'
                  }}>{s.title}</h1>
                  <p className="text-xl sm:text-2xl lg:text-3xl text-white font-semibold mb-10 max-w-4xl mx-auto leading-relaxed" style={{ 
                    textShadow: '1px 2px 10px rgba(0,0,0,0.4)',
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}>{s.subtitle}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {s.cta.external ? (
                      <a 
                        href={s.cta.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block rounded-full bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white px-10 py-5 text-xl font-extrabold tracking-wide uppercase hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all transform hover:scale-110 shadow-2xl hover:shadow-[0_8px_30px_rgba(255,107,53,0.4)]"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        {s.cta.label}
                      </a>
                    ) : (
                      <Link 
                        href={s.cta.href} 
                        className="inline-block rounded-full bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white px-10 py-5 text-xl font-extrabold tracking-wide uppercase hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all transform hover:scale-110 shadow-2xl hover:shadow-[0_8px_30px_rgba(255,107,53,0.4)]"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        {s.cta.label}
                      </Link>
                    )}
                    <Link 
                      href="/menu" 
                      className="inline-block rounded-full border-3 border-white text-white px-10 py-5 text-xl font-extrabold tracking-wide uppercase hover:bg-white hover:text-[var(--rc-espresso-brown)] transition-all transform hover:scale-110 backdrop-blur-sm bg-white/10"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      View Menu
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <button 
                  onClick={scrollToNext}
                  className="flex flex-col items-center text-white/80 hover:text-white transition-colors group"
                >
                  <span className="text-sm font-medium mb-2">Scroll to explore</span>
                  <div className="animate-bounce">
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          width: 14px;
          height: 14px;
          margin: 0 8px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: var(--rc-orange);
          transform: scale(1.3);
          box-shadow: 0 0 15px rgba(255, 107, 53, 0.6);
        }
      `}</style>
    </section>
  );
}


