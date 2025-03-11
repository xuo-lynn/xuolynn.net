import { TypeAnimation } from 'react-type-animation';
import ScrollIndicator from './ScrollIndicator';

const Intro = () => {
  return (
    <div className="pt-2 flex flex-col px-4">
       <TypeAnimation
        sequence={[
          'hi, im stella.',
          1500,
          '',
          500,
          'hi, im lynn.',
          1500,
          '',
          500,
          'hi, im xuo.',
          1500,
          ''
        ]}
        wrapper="h1"
        cursor={true}
        repeat={Infinity}
        className="text-center font-bold text-4xl sm:text-5xl md:text-7xl text-white"
      />
      
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl text-slate-300 mb-6">(call me whatever you want though)</h2>
      <div className='text-center text- sm:text-2xl md:text-2xl text-slate-300'>
        <p className="mb-2">I'm a software engineer based in New York City, and have been</p>
        <p className="mb-2">at <span className="text-blue-500">Meta</span> and <span className="text-red-500">Netflix</span> for their engineering experiences. I'm currently</p>
        <p className="mb-2">a Founding Engineer at a start-up, and will graduate around late 2025!</p>
        <p className="mb-2">Actively looking for <strong className="text-white">internships</strong> <span className="text-white">or</span> <strong className="text-white">full-time</strong> opportunities :)</p>
      </div>
      
      <ScrollIndicator targetId="discord" />
    </div>
  );
};

export default Intro;
