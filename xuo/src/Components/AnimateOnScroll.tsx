import { useEffect, useRef, ReactNode } from 'react';

interface AnimateOnScrollProps {
  children: ReactNode;
}

const AnimateOnScroll = ({ children }: AnimateOnScrollProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            entry.target.classList.remove('opacity-0', 'translate-y-20');
          } else {
            if (window.innerWidth > 768) {
              entry.target.classList.remove('opacity-100');
              entry.target.classList.add('opacity-0', 'translate-y-20');
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={elementRef} 
      className="opacity-0 translate-y-20 transition-all duration-1000 ease-out"
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;
