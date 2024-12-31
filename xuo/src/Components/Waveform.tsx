import React, { useEffect, useState } from 'react';

const Waveform: React.FC<{ isPlaying: boolean; lightestColor: string; darkestColor: string }> = ({ isPlaying, lightestColor, darkestColor }) => {
    const [animationValues, setAnimationValues] = useState<number[]>(Array(4).fill(0.5));

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setAnimationValues(animationValues.map(() => Math.random() * 1.2 + 0.4));
            }, 200);

            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    return (
        <div className="flex space-x-0.5">
            {animationValues.map((value, index) => (
                <div
                    key={index}
                    className="rounded-2xl"
                    style={{
                        width: '3px',
                        height: `${value * 12}px`,
                        transition: 'height 0.4s ease-in-out',
                        transform: 'translateY(-50%)',
                        background: `linear-gradient(to bottom, ${lightestColor} 25%, ${darkestColor})`,
                    }}
                />
            ))}
        </div>
    );
};

export default Waveform;
