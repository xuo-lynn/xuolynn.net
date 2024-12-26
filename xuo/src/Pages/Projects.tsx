import AnimateOnScroll from "../Components/AnimateOnScroll";
import Project from "../Components/ProjectCard";

const Projects = () => {
  return (
    <AnimateOnScroll>
      <div id="projects" className="min-h-screen pt-5 flex justify-center items-start">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-white mb-8 relative after:content-[''] after:absolute after:top-1/2 after:ml-4 after:w-80 after:h-[1px] after:bg-white">
            / projects
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
            <Project 
              title="Dynamic Island for MacOS" 
              description="Made a dynamic island UI app for MacOS. Utilizes Swift and System APIs to pull media info. The framework import took me like 5 hours to debug." 
              techStack={["Swift", "SwiftUI", "Objective-C", "System API"]}
              githubLink="https://github.com/xuo-lynn/DynaNotch"
            />
            <Project 
              title="Discord Music API Bot" 
              description="Discord kinda shut down most of their music bots, so I just made my own. Also, I ran out of AWS credits and had to retire it." 
              techStack={["Python", "Discord.py", "Discord API", "Youtube API", "AWS"]}
              githubLink="https://github.com/xuo-lynn/discord-melody-bot"
            />
            <Project 
              title="Store Management System" 
              description="Inventory, sales, database management, etc. Basically Square if it never got to its A-series funding." 
              techStack={["Java", "SpringBoot", "MySQL", "Docker", "RestAPI", "AWS"]}
              githubLink="https://github.com/xuo-lynn/Point-Of-Sale-System"
            />
            <Project 
              title="ChessAI with Neural Net" 
              description="Trained with neural net and dataset. Worse than Stockfish, but probably better than most people." 
              techStack={["Python", "Tensorflow", "Keras", "Chess.py", "Machine Learning"]}
              githubLink="https://github.com/xuo-lynn/neural-network-chess-engine"
            />
            <Project 
              title="Portfolio Website" 
              description="Website you're currently on. Just a fun way for me showcase my career and skills!" 
              techStack={["Typescript", "React", "NodeJS", "ThreeJS", "TailwindCSS", "Lanyard", "Web Sockets"]}
              githubLink="https://github.com/xuo-lynn/xuo"
            />
            <div>
              <img className="pt-6 w-60 mx-auto" src="/mocha.gif" alt="mocha" />
              <p className="pt-2 text-lg text-gray-400 text-center mt-2">
                Thanks for visiting!<br/>
                Built and designed by xuo.<br/>
                All rights reserved. ©
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
};

export default Projects;
