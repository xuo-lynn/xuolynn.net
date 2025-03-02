import React, { useEffect, useState } from 'react';

interface CustomActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  created_at: number;
  emoji?: {
    id: string;
    name: string;
    animated: boolean;
  };
}

const Status: React.FC = () => {
  const [customActivity, setCustomActivity] = useState<CustomActivity | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://api.lanyard.rest/v1/users/212702039103373312');
        const result = await response.json();
        if (result.success) {
          const activity = result.data.activities.find(
            (activity: CustomActivity) => activity.type === 4
          );
          setCustomActivity(activity || null);
        }
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();

    const socket = new WebSocket('wss://api.lanyard.rest/socket');
    let heartbeatInterval: ReturnType<typeof setInterval>;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.op === 1) {
        const { heartbeat_interval } = message.d;
        heartbeatInterval = setInterval(() => {
          socket.send(JSON.stringify({ op: 3 }));
        }, heartbeat_interval);
      }

      if (message.op === 0 && (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE')) {
        const activity = message.d.activities.find(
          (activity: CustomActivity) => activity.type === 4
        );
        setCustomActivity(activity || null);
      }
    };

    socket.onclose = () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };

    return () => {
      socket.close();
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, []);

  if (!customActivity?.state) {
    return null;
  }

  return (
    <div className="relative -ml-3 mt-4">
      <div className="bg-gradient-to-br from-[#07101e] to-[#091524] rounded-xl px-3 pt-2 pb-1.5 relative w-fit sm:max-w-[230px] max-w-[184px] shadow-md border border-[#25292e]">
        <div className="absolute -top-2 left-2.5 w-5 h-3 bg-[#07101e] rounded-t-full"></div>  
        <div className="absolute -top-5 -left-2 w-3 h-3 bg-[#07101e] rounded-full"></div>
        <span className="text-gray-200 text-base break-words block leading-5">
          {customActivity.emoji && (
            <img 
              src={`https://cdn.discordapp.com/emojis/${customActivity.emoji.id}${customActivity.emoji.animated ? '.gif' : '.png'}`}
              alt={customActivity.emoji.name}
              className="w-[18px] h-[18px] inline-block mr-1.5 -mt-[1px] object-contain"
            />
          )}
          {customActivity.state}
        </span>
      </div>
    </div>
  );
};

export default Status;