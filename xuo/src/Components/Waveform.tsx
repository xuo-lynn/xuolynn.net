import React, { useEffect, useState } from 'react';

const Waveform: React.FC<{ isPlaying: boolean; color?: string }> = ({ isPlaying, color = 'white' }) => {
    const [animationValues, setAnimationValues] = useState<number[]>(Array(4).fill(0.5));

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setAnimationValues(animationValues.map(() => Math.random() * 1.2 + 0.5));
            }, 200);

            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    return (
        <div className="flex space-x-1">
            {animationValues.map((value, index) => (
                <div
                    key={index}
                    className="rounded-2xl"
                    style={{
                        width: '3px',
                        height: `${value * 13}px`,
                        transition: 'height 0.3s ease-in-out',
                        transform: 'translateY(-50%)',
                        background: `linear-gradient(to bottom, white, ${color})`,
                    }}
                />
            ))}
        </div>
    );
};

export default Waveform;
