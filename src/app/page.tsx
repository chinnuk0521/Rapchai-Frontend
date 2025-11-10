"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleContinueOrdering = () => {
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--rc-creamy-beige)] via-white to-[var(--rc-creamy-beige)] flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Logo / Café Name */}
        <div className="mb-8">
          <div className="flex flex-col items-center gap-4 mb-4">
            <img src="/logo-orange.svg" alt="RAPCHAI" className="h-24 w-24 md:h-32 md:w-32" />
            <h1 className="text-6xl md:text-8xl font-black tracking-wide text-[var(--rc-espresso-brown)]">
              RAPCHAI
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] mx-auto rounded-full"></div>
        </div>

        {/* Welcome Text / Tagline */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--rc-espresso-brown)] mb-4">
            Where Coffee Meets Beats
          </h2>
          <p className="text-xl md:text-2xl text-[var(--rc-text-secondary)] font-medium leading-relaxed">
            Healthy continental menu • Rap music events • Community vibes
          </p>
        </div>

        {/* Continue Ordering Button */}
        <button
          onClick={handleContinueOrdering}
          className="px-12 py-4 bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white text-xl font-bold rounded-xl hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          Continue Ordering
        </button>
      </div>
    </div>
  );
}
