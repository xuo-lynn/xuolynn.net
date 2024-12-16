import React, { useState, useRef, useEffect } from 'react';

interface HoverVideoProps {
  children: React.ReactNode;
  videoSrc: string;
  style?: React.CSSProperties;
}

const HoverVideo: React.FC<HoverVideoProps> = ({ children, videoSrc, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = 0.05;
  }, [isHovered]);

  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer text-white"
      >
        {children}
      </span>
      {isHovered && (
        <video
          ref={videoRef}
          className="fixed bottom-8 left-[240px] rounded-lg shadow-lg"
          style={style}
          width="200"
          autoPlay
          loop
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </span>
  );
};

export default HoverVideo;