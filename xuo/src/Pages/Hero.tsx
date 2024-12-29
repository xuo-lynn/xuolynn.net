import ChibiModel from '../Components/ChibiModel';
import Intro from '../Components/Intro';
import FadeIn from 'react-fade-in';
import Socials from '../Components/Socials';

const Hero = () => {
  return (
    <FadeIn>
      <div className="relative flex flex-col items-center justify-center h-screen">
        <div className="absolute top-4 right-4">
          <Socials />
        </div>
        <ChibiModel />
        <Intro />
      </div>
    </FadeIn>
  );
};

export default Hero;
