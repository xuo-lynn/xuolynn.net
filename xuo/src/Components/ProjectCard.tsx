import React, { useRef, useEffect } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { FaFolder, FaGithub } from 'react-icons/fa';

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, techStack, githubLink }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      const isMobile = window.innerWidth < 768; // 768px is the standard md breakpoint
      VanillaTilt.init(cardRef.current, {
        max: isMobile ? 1 : 5,
        speed: 10,
        glare: true,
        "max-glare": 0.1,
      });
    }
    
  }, []);

  return (
    <a 
      href={githubLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-transform hover:scale-105"
    >
      <div ref={cardRef} className="relative p-7 m-4 shadow-2xl bg-black bg-opacity-45 backdrop-blur-md max-w-md rounded-2xl flex flex-col min-h-[310px] cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-400">
            <FaFolder size={30} />
          </div>
          <div className="text-gray-400">
            <FaGithub size={30} />
          </div>
        </div>
        <h2 className="text-slate-300 text-3xl font-semibold mb-2 pt-2">{title}</h2>
        <p className="text-slate-400 text-lg mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {techStack.map((tech, index) => (
            <span key={index} className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
