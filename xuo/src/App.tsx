import Hero from './Pages/Hero.tsx';
import About from './Pages/About.tsx';
import Projects from './Pages/Projects.tsx';

function App() {
  return (
    <div className="flex flex-col">
      <Hero />
      <About /> 
      <Projects />
    </div>
  );
}

export default App  
