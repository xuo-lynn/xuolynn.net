import Hero from './Pages/Hero.tsx';
import Projects from './Pages/Projects.tsx';
import Discord from './Pages/Discord.tsx';
import { Analytics } from '@vercel/analytics/react'
function App() {
  return (
    <div className="flex flex-col">
      <Analytics />
      <Hero />
      <Discord /> 
      <Projects />
    </div>
  );
}

export default App  
