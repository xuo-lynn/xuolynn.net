import AnimateOnScroll from "../Components/AnimateOnScroll";
import HoverVideo from "../Components/HoverVideo";
import VanillaTilt from 'vanilla-tilt';
import { useRef, useEffect } from 'react';

const About = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      const isMobile = window.innerWidth < 768; // 768px is the standard md breakpoint
      VanillaTilt.init(cardRef.current, {
        max: isMobile ? 1 : 5,
        speed: 200,
        glare: true,
        "max-glare": 0.1,
      });
    }
  }, []);

  return (
    <AnimateOnScroll>
      <div id="about" className="min-h-screen pt-20 flex justify-center items-center">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-white mb-8 relative after:content-[''] after:absolute after:top-1/2 after:ml-4 after:w-80 after:h-[1px] after:bg-white">/ about me</h1>
          
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div ref={cardRef} className="w-full md:w-3/4 p-7 shadow-2xl bg-black bg-opacity-45 backdrop-blur-md rounded-2xl">
              <p className="text-slate-400 text-lg md:text-2xl font-medium">I'm a <span className="text-white">junior software engineer</span> with previous back-end experience at <span className="text-red-500 font-semibold">Netflix </span><br className="hidden md:block" />
              and <span className="text-blue-500 font-semibold">Meta</span>. I'm currently working a contract position as a swift developer, and <br className="hidden md:block"/>
              about to start a masters in computer science. I've worked mainly on developing <br className="hidden md:block"/>
              <span className="text-white">back-end systems and APIs</span>, but I'm proficient with front-end, ML, and AI as well.</p>
              
              <p className="text-2xl text-white font-bold mt-5">Here's some of my tech stack:</p>

              <ul className="grid grid-cols-2 list-none gap-y-1 gap-x-1 md:w-[55%] mt-8">
                <li className="text-slate-400 text-lg md:text-2xl before:content-['▹'] before:text-blue-400 before:mr-2">Java</li>
                <li className="text-slate-400 text-lg md:text-2xl before:content-['▹'] before:text-blue-400 before:mr-2">React</li>
                <li className="text-slate-400 text-lg md:text-2xl before:content-['▹'] before:text-blue-400 before:mr-2">Python</li>
                <li className="text-slate-400 text-lg md:text-2xl before:content-['▹'] before:text-blue-400 before:mr-2">SpringBoot</li>
                <li className="text-slate-400 text-lg md:text-2xl before:content-['▹'] before:text-blue-400 before:mr-2">Typescript</li>
                <li className="text-slate-400 text-lg md:text-2xl before:content-['▹'] before:text-blue-400 before:mr-2">MySQL</li>
                <li className="text-slate-400 text-lg md:text-2xl before:content-['▹'] before:text-blue-400 before:mr-2">Swift</li>
                <li className="text-slate-400 text-lg md:text-2xl before:content-['▹'] before:text-blue-400 before:mr-2">Docker</li>
              </ul>
              <p className="text-slate-400 text-lg md:text-2xl font-medium mt-8">
                <strong className="text-white">Aside from my technical side</strong>, I identify as non-binary, and go by she/her pronouns. <br className="hidden md:block"/> I enjoy 
                playing video games and learning guitar. I'm around grandmaster rank in both <br className="hidden md:block"/> LoL and TFT, and <HoverVideo videoSrc="/riff.mp4">this</HoverVideo> is a song I'm currently learning if you know it! 
                Feel free to contact <br className="hidden md:block"/> me about job opportunities, or simply just to connect and chat.
              </p>
            </div>
            
            <div className="w-full md:w-1/4 flex flex-col items-center mt-8 md:mt-0 lg:pl-20">
              <img src="/kuromi.gif" alt="kuromi" className="w-48 md:w-64 pt-10 md:pt-20" />
              <p className="text-slate-400 text-xl md:text-2xl font-medium mt-8">I'll update this site as I <br/>progress in my career!</p>
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
};

export default About;
