import DiscordComponent from '../Components/DiscordComponent';

const Discord = () => {
  return (
    <div id="discord" className="min-h-screen pt-20 flex justify-center items-center">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-white mb-4 relative after:content-[''] after:absolute after:top-1/2 after:ml-4 after:w-80 after:h-[1px] after:bg-white">
          / profile
        </h1>
        <DiscordComponent />
      </div>
    </div>
  );
};

export default Discord;
