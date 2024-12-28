import React, { useEffect, useState } from 'react';
import { FaSpotify, FaGamepad } from 'react-icons/fa';
import Waveform from './Waveform';

interface LanyardData {
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;
  listening_to_spotify: boolean;
  kv: {
    location: string;
  };
  spotify: {
    track_id: string;
    timestamps: {
      start: number;
      end: number;
    };
    song: string;
    artist: string;
    album_art_url: string;
    album: string;
  } | null;
  discord_user: {
    username: string;
    public_flags: number;
    id: string;
    discriminator: string;
    avatar: string;
    avatar_decoration_data?: {
      asset: string;
    };
  };
  discord_status: string;
  activities: Array<{
    type: number;
    name: string;
    application_id?: string;
    details?: string;
    state?: string;
    timestamps?: {
      start: number;
      end?: number;
    };
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
    };
  }>;
}

const Lanyard: React.FC = () => {
  const [data, setData] = useState<LanyardData | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [lightestColor, setLightestColor] = useState<string>('rgb(255,255,255)');
  const [dominantColor, setDominantColor] = useState<string>('rgb(0,0,0)');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/212702039103373312`, {
          headers: {
            'Authorization': '77b1046fa55ce8b2af7928f1e43f37f8'
          }
        });
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching Lanyard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const socket = new WebSocket('wss://api.lanyard.rest/socket');
    let heartbeatInterval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;

    const sendHeartbeat = () => {
      socket.send(JSON.stringify({ op: 3 })); // Opcode 3: Heartbeat
    };

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log('WebSocket connection timed out');
        socket.close();
      }, 4 * 60 * 1000); // 4 minutes
    };

    socket.onopen = () => {
      console.log('WebSocket connection opened');
      socket.send(JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: "212702039103373312"
        }
      }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.op === 1) { // Opcode 1: Hello
        const { heartbeat_interval } = message.d;
        clearInterval(heartbeatInterval);
        heartbeatInterval = setInterval(sendHeartbeat, heartbeat_interval);
        resetTimeout();
      }

      if (message.op === 0 && (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE')) {
        setData(message.d);
        resetTimeout();
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      clearInterval(heartbeatInterval);
      clearTimeout(timeout);
    };

    return () => {
      socket.close();
      clearInterval(heartbeatInterval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (data?.spotify) {
      interval = setInterval(() => {
        setCurrentTime(Date.now() - data.spotify!.timestamps.start);
      }, 1000); // Update every second
    }
    return () => clearInterval(interval);
  }, [data?.spotify]);

  useEffect(() => {
    if (data?.spotify?.album_art_url) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = data.spotify.album_art_url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);

          const imageData = context.getImageData(0, 0, img.width, img.height);
          const pixels = imageData.data;
          const colorCount: Record<string, number> = {};
          let lightestColorValue = 0;
          let lightestColorRGB = 'rgb(255,255,255)';

          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Filter out more black ranges and keep white filter the same
            if (!(r < 70 && g < 70 && b < 70) && !(r > 180 && g > 180 && b > 180)) {
              const color = `${r},${g},${b}`;
              colorCount[color] = (colorCount[color] || 0) + 1;

              const brightness = r + g + b;
              if (brightness > lightestColorValue) {
                lightestColorValue = brightness;
                lightestColorRGB = `rgb(${r},${g},${b})`;
              }
            }
          }

          setLightestColor(lightestColorRGB);

          const dominantColorKey = Object.keys(colorCount).reduce((a, b) => colorCount[a] > colorCount[b] ? a : b);
          const [domR, domG, domB] = dominantColorKey.split(',').map(Number);
          setDominantColor(`rgb(${domR},${domG},${domB})`);
        }
      };
    }
  }, [data?.spotify?.album_art_url]);

  if (loading) {
    return <div></div>;
  }

  if (!data) {
    return <div>Error loading data.</div>;
  }

  const currentActivity = data.activities.find(activity => activity.type === 0) as LanyardData['activities'][0] | undefined;

  const getSongProgress = () => {
    if (data.spotify) {
      const { start, end } = data.spotify.timestamps;
      const progress = ((currentTime) / (end - start)) * 100;
      return Math.min(progress, 100).toFixed(2); // Ensure progress doesn't exceed 100%
    }
    return null;
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const songProgress = getSongProgress();
  const totalTime = data.spotify ? data.spotify.timestamps.end - data.spotify.timestamps.start : 0;

  return (
    <div>
      {data.listening_to_spotify && data.spotify && (
        <div className="bg-black bg-opacity-30 p-2 rounded-lg mb-2 relative">
          <div className="flex items-start justify-start">
            <h2 className="text-white text-sm flex items-center mb-1">
              Listening to Spotify <FaSpotify className="ml-1 pb-1 w-4 h-4" />
            </h2>
          </div>
          <div className="flex items-center">
            <img src={data.spotify.album_art_url} alt={data.spotify.album} className="rounded-md w-14 h-14 mr-2" />
            <div className="flex flex-col justify-center flex-grow mt-[-10px]">
              <p className="text-gray-300 font-bold pt-[10px]">{data.spotify.song}</p>
              <p className="text-gray-300 text-sm mt-[-4px]">{data.spotify.artist}</p>
              {songProgress && (
                <div className="flex items-center mt-1">
                  <span className="text-gray-300 text-xs">{formatTime(currentTime)}</span>
                  <div className="flex-grow bg-gray-500 rounded-full h-1 mx-2">
                    <div
                      className="bg-white h-1 rounded-full"
                      style={{ width: `${songProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-300 text-xs">{formatTime(totalTime)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="absolute top-12 right-5">
            <Waveform isPlaying={data.listening_to_spotify} lightestColor={lightestColor} darkestColor={dominantColor} />
          </div>
        </div>
      )}

      {currentActivity && (
        <div className="bg-black bg-opacity-30 p-2 rounded-lg mb-2">
          <div className="flex items-start justify-start">
            <h2 className="text-white text-sm flex items-center mb-1">
              Currently Playing <FaGamepad className="ml-[5px] mb-[3px] w-3 h-3" />
            </h2>
          </div>
          <div className="flex items-center relative">
            {currentActivity.assets?.large_image && (
              <div className="relative">
                <img 
                  src={`https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.large_image}.png`} 
                  alt={currentActivity.assets.large_text || 'Large Image'} 
                  className="rounded-md w-14 h-14 mr-2"
                />
                {currentActivity.assets?.small_image && (
                  <img 
                    src={`https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${currentActivity.assets.small_image}.png`} 
                    alt={currentActivity.assets.small_text || 'Small Image'} 
                    className="absolute bottom-[-5px] right-0 w-5 h-5 rounded-full border border-transparent"
                  />
                )}
              </div>
            )}
            <div className="flex flex-col justify-center flex-grow">
              <p className="text-gray-300 font-bold">{currentActivity.name}</p>
              {currentActivity.details && <p className="text-gray-300 text-sm mt-[-4px]">{currentActivity.details}</p>}
              {currentActivity.state && <p className="text-gray-300 text-sm mt-[-4px]">{currentActivity.state}</p>}
            </div>
          </div>
        </div>
      )}

      {!data.listening_to_spotify && !currentActivity && (
        <div className="bg-black bg-opacity-30 p-2 rounded-lg mb-2 flex flex-col items-center justify-center">
          <p className="text-white text-sm mb-2">Stella is currently resting. She'll be back soon!</p>
          <img src="/away.gif" alt="Away" className="w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default Lanyard;
