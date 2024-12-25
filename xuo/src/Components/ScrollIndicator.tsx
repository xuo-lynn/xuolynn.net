import React, { useState, useEffect } from 'react';

interface ScrollIndicatorProps {
  targetId: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ targetId }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = () => {
    const element = document.getElementById(targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      setIsVisible(rect.top > 100);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTarget = () => {
    const element = document.getElementById(targetId);
    if (element) {
      const offset = -90;
      const topPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
  };

  return (
    <button 
      onClick={scrollToTarget}
      className={`fixed bottom-8 right-8 text-white/40 animate-bounce hover:text-white/60 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-8 w-8" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={3} 
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </button>
  );
};

export default ScrollIndicator; 