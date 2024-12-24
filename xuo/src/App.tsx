import Hero from './Pages/Hero.tsx';
import Projects from './Pages/Projects.tsx';
import Discord from './Pages/Discord.tsx';

function App() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Discord /> 
      <Projects />
    </div>
  );
}

export default App  
