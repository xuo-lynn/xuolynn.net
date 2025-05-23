import AnimateOnScroll from "../Components/AnimateOnScroll";
import Project from "../Components/ProjectCard";
import Cinamoroll from "../Components/Cinamoroll";
const Projects = () => {
  return (
    <AnimateOnScroll>
      <div id="projects" className="pt-7 flex justify-center items-start">
        <div className="container mx-auto px-4 pt-24 pb-0">
          <h1 className="text-5xl font-bold text-white mb-4 mt-4 relative after:content-[''] after:absolute after:top-1/2 after:ml-4 after:w-80 after:h-[1px] after:bg-white">
            / projects
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
          <Project 
              title="Spotify Wrapped Mini" 
              description="View your Spotify stats before year-end! Just wanted to get familiar with Spotify API before I start work there lol." 
              techStack={["Java", "SpringBoot", "Spotify API", "OAuth2", "React", "Tailwind", "NextJS",]}
              githubLink="https://github.com/xuo-lynn/wrapped-mini"
            />
            <Project 
              title="Store Management System" 
              description="Inventory, sales, database management, etc. Basically Square if it never got to its A-series funding." 
              techStack={["Java", "SpringBoot", "MySQL", "GraphQL", "Docker", "RestAPI", "AWS"]}
              githubLink="https://github.com/xuo-lynn/Point-Of-Sale-System"
            />
            <Project 
              title="Discord Music API Bot" 
              description="Discord kinda shut down most of their music bots, so I just made my own. Also, I ran out of AWS credits and had to retire it." 
              techStack={["Python", "Discord.py", "Discord API", "Youtube API", "AWS"]}
              githubLink="https://github.com/xuo-lynn/discord-melody-bot"
            />
            <Project 
              title="Dynamic Island for MacOS" 
              description="Made a dynamic island UI app for MacOS. Utilizes Swift and System APIs to pull media info. The framework import took me like 5 hours to debug." 
              techStack={["Swift", "SwiftUI", "Objective-C", "System API"]}
              githubLink="https://github.com/xuo-lynn/DynaNotch"
            />
            <Project 
              title="ChessAI with Neural Net" 
              description="Trained with neural net and dataset. Worse than Stockfish, but probably better than most people." 
              techStack={["Python", "Tensorflow", "Keras", "Chess.py", "Machine Learning"]}
              githubLink="https://github.com/xuo-lynn/neural-network-chess-engine"
            />
            <div className="relative">
              <Cinamoroll />
              <p className="absolute inset-0 flex flex-col justify-center items-center pt-[160px] text-lg text-gray-400 text-center mt-2">
                Built and designed by xuo<br/>
                All rights reserved ©
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
};

export default Projects;
