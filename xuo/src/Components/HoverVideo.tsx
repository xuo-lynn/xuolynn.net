import React, { useState } from 'react';

interface HoverVideoProps {
  children: React.ReactNode;
  videoSrc: string;
  style?: React.CSSProperties;
}

const HoverVideo: React.FC<HoverVideoProps> = ({ children, videoSrc, style }) => {
  const [isHovered, setIsHovered] = useState(false);

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
          className="fixed bottom-8 left-[400px] rounded-lg shadow-lg"
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