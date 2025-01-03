import React, { useEffect, useState } from 'react';
import { FaSpotify, FaGamepad, FaYoutube, FaTwitch, FaDesktop } from 'react-icons/fa';
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
      }, 1000); // update every second
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

            // filter out black and white ranges 
            if (!(r < 50 && g < 50 && b < 70) && !(r > 170 && g > 200 && b > 200)) {
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

  const getAssetImageUrl = (
    applicationId: string | number,
    asset: string | { id: string; animated: boolean } | undefined
  ) => {
    if (asset && typeof asset !== "string") {
      return `https://cdn.discordapp.com/emojis/${asset.id}.${
        asset.animated ? "gif" : "webp"
      }?quality=lossless`;
    }
    if (applicationId === 6) {
      return `/discord/hang/${asset}.svg`;
    }
    if (!asset) {
      return `https://dcdn.dstn.to/app-icons/${applicationId}?size=600`;
    }
    if (asset.startsWith("mp:external")) {
      const externalUrl = asset.replace("mp:", "");
      const discordCdnUrl = `https://media.discordapp.net/${externalUrl}`;
      return discordCdnUrl;
    }
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${asset}.png`;
  };

  if (loading) {
    return <div></div>;
  }

  if (!data) {
    return <div>Error loading data.</div>;
  }

  const gameActivities = data.activities.filter(activity => activity.type === 0) as LanyardData['activities'][0][];
  const watchingActivities = data.activities.filter(activity => activity.type === 3);

  const getSongProgress = () => {
    if (data.spotify) {
      const { start, end } = data.spotify.timestamps;
      const progress = ((currentTime) / (end - start)) * 100;
      return Math.min(progress, 100).toFixed(2); // progress doesn't exceed 100
    }
    return null;
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const songProgress = getSongProgress(); 
  const totalTime = data.spotify ? data.spotify.timestamps.end - data.spotify.timestamps.start : 0;

  const getActivityProgress = (activity: LanyardData['activities'][0]) => {
    if (activity.timestamps) {
      const { start, end } = activity.timestamps;
      if (end !== undefined) {
        const progress = ((Date.now() - start) / (end - start)) * 100;
        return Math.min(progress, 100).toFixed(2); // progress doesn't exceed 100
      }
      return null; // or handle the case where 'end' is undefined
    }
    return null;
  };

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

      {watchingActivities.map((activity, index) => (
        <div key={index} className="bg-black bg-opacity-30 p-2 rounded-lg mb-2">
          <div className="flex items-start justify-start">
            <h2 className="text-white text-sm flex items-center mb-1">
              Watching {activity.name} 
              {activity.name === 'Twitch' ? (
                <FaTwitch className="ml-1 pb-1 w-4 h-4" />
              ) : (
                <FaYoutube className="ml-1 pb-1 w-4 h-4" />
              )}
            </h2>
          </div>
          <div className="flex items-center relative">
            {activity.assets?.large_image && (
              <div className="relative">
                <img 
                  src={getAssetImageUrl(activity.application_id!, activity.assets.large_image)} 
                  alt={activity.assets.large_text || 'Large Image'} 
                  className="rounded-md w-14 h-14 mr-2"
                />
              </div>
            )}
            <div className="flex flex-col justify-center flex-grow">
              <p className="text-gray-300 font-bold">{activity.details}</p>
              {activity.state && <p className="text-gray-300 text-sm mt-[-4px]">{activity.state}</p>}
              {activity.details !== "Viewing home page" && activity.name !== "Twitch" && (
                <div className="flex items-center mt-1">
                  {activity.timestamps?.end === undefined && <FaDesktop className="mr-1 mb-0.5 w-3 h-3 text-green-500" />}
                  <span
                    className={`${
                      activity.timestamps?.end === undefined ? 'text-sm font-bold text-green-500' : 'text-xs text-gray-300'
                    }`}
                  >
                    {formatTime(Date.now() - (activity.timestamps?.start || 0))}
                  </span>
                  {activity.timestamps?.end !== undefined && (
                    <>
                      <div className="flex-grow bg-gray-500 rounded-full h-1 mx-2">
                        <div
                          className="bg-white h-1 rounded-full"
                          style={{ width: `${getActivityProgress(activity)}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-300 text-xs">
                        {formatTime(activity.timestamps.end - activity.timestamps.start)}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {gameActivities.slice(0, 2).map((activity, index) => (
        <div key={index} className="bg-black bg-opacity-30 p-2 rounded-lg mb-2">
          <div className="flex items-start justify-start">
            <h2 className="text-white text-sm flex items-center mb-1">
              Playing <FaGamepad className="ml-[5px] mb-[3px] w-3 h-3" />
            </h2>
          </div>
          <div className="flex items-center relative">
            {activity.assets?.large_image && (
              <div className="relative">
                <img 
                  src={getAssetImageUrl(activity.application_id!, activity.assets.large_image)} 
                  alt={activity.assets.large_text || 'Large Image'} 
                  className="rounded-md w-14 h-14 mr-2"
                />
                {activity.assets?.small_image && (
                  <img 
                    src={getAssetImageUrl(activity.application_id!, activity.assets.small_image)} 
                    alt={activity.assets.small_text || 'Small Image'} 
                    className="absolute bottom-[-5px] right-0 w-5 h-5 rounded-full border border-transparent"
                  />
                )}
              </div>
            )}
            <div className="flex flex-col justify-center flex-grow">
              <p className="text-gray-300 font-bold">{activity.name}</p>
              {activity.details && <p className="text-gray-300 text-sm mt-[-4px]">{activity.details}</p>}
              {activity.state && <p className="text-gray-300 text-sm mt-[-4px]">{activity.state}</p>}
            </div>
          </div>
        </div>
      ))}

      {!data.listening_to_spotify && gameActivities.length === 0 && watchingActivities.length === 0 && (
        <div className="bg-black bg-opacity-30 p-2 rounded-lg mb-2 flex flex-col items-center justify-center">
          <p className="text-white text-sm mb-2">Stella is currently resting. She'll be back soon!</p>
          <img src="/away.gif" alt="Away" className="w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default Lanyard;
