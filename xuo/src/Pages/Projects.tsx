import AnimateOnScroll from "../Components/AnimateOnScroll";
import Project from "../Components/ProjectCard";

const Projects = () => {
  return (
    <AnimateOnScroll>
      <div id="projects" className="min-h-screen pt-5 flex justify-center items-start">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-white mb-8 relative after:content-[''] after:absolute after:top-1/2 after:ml-4 after:w-80 after:h-[1px] after:bg-white">/ projects</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
          <Project 
              title="Apple Vision Pro AI  " 
              description="Utilizes RealityKit API to create smart image viewer. Probably not helping blind people yet, since Apple doesn't let developers access the camera stream." 
              techStack={["Swift", "SwiftUI", "VisionOS", "RealityKit"]}
              githubLink="https://github.com/xuo-lynn/VisionOS-Smart-Image"
            />
            <Project 
              title="ChessAI with Neural Net" 
              description="Trained over a few epochs with neural net. Worse than Magnus, but probably better than most people." 
              techStack={["Python", "Tensorflow", "Keras", "Chess.py", "Machine Learning"]}
              githubLink="https://github.com/xuo-lynn/neural-network-chess-engine"
            />
            <Project 
              title="Store Sales System" 
              description="Inventory, sales, database management, etc. Square if it never got to its A-series funding." 
              techStack={["Java", "SpringBoot", "MySQL", "Docker", "AWS"]}
              githubLink="https://github.com/xuo-lynn/Point-Of-Sale-System"
            />
            <Project 
              title="Discord Music API Bot" 
              description="Discord shut down most of their music bots, so I used YoutubeAPI and downloaded with FFMPEG to make my own." 
              techStack={["Python", "Discord.py", "Discord API", "Youtube API", "DigitalOcean"]}
              githubLink="https://github.com/xuo-lynn/discord-melody-bot"
            />
            <Project 
              title= "Portfolio Wesbite" 
              description="Website you're currently on. Just a fun way for me showcase my career and skills!" 
              techStack={["Typescript", "React", "NodeJS","ThreeJS", "Vercel"]}
              githubLink="https://github.com/xuo-lynn/xuo"
            />
            <div>
              <img className="pt-10 w-60 mx-auto" src="/mocha.gif" alt="mocha" />
              <p className="pt-2 text-lg text-gray-400 text-center mt-2">
                Thanks for visiting!<br/>
                Thoughtfully developed - xuo
               </p>
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
};

export default Projects;
