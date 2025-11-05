"use client";
import { useState, useEffect } from "react";

export default function HomeFooter() {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTeamText, setShowTeamText] = useState(false);
  const [teamText, setTeamText] = useState("");
  const [teamIndex, setTeamIndex] = useState(0);
  
  const mainText = "Thanks for your visit";
  const teamTextFull = "- Team Rapchai";
  const typingSpeed = 100;

  useEffect(() => {
    // First phase: Type main text
    if (currentIndex < mainText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + mainText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === mainText.length && !showTeamText) {
      // Start team text after main text is complete
      setTimeout(() => {
        setShowTeamText(true);
      }, 500);
    }
  }, [currentIndex, mainText.length, showTeamText]);

  useEffect(() => {
    // Second phase: Type team text from right
    if (showTeamText && teamIndex < teamTextFull.length) {
      const timeout = setTimeout(() => {
        setTeamText(prev => prev + teamTextFull[teamIndex]);
        setTeamIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    }
  }, [showTeamText, teamIndex, teamTextFull]);

  return (
    <footer className="relative w-full h-screen bg-gradient-to-br from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] flex flex-col justify-center items-center overflow-hidden px-4 md:px-6">
      {/* Main Typing Animation */}
      <div className="text-center max-w-6xl mx-auto w-full">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-white mb-6 md:mb-8 leading-[1.1] tracking-tight px-4" style={{ 
          fontFamily: 'Inter, system-ui, sans-serif',
          textShadow: '2px 4px 20px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)',
          fontWeight: 900,
          letterSpacing: '-0.02em'
        }}>
          {displayText}
          {currentIndex < mainText.length && (
            <span className="animate-pulse text-[var(--rc-creamy-beige)]">|</span>
          )}
        </h2>
        
        {/* Team Text - Right aligned, smaller */}
        {showTeamText && (
          <div className="text-center md:text-right px-4">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white font-semibold" style={{ 
              textShadow: '1px 2px 10px rgba(0,0,0,0.4)',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}>
              {teamText}
              {teamIndex < teamTextFull.length && (
                <span className="animate-pulse text-[var(--rc-creamy-beige)]">|</span>
              )}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
