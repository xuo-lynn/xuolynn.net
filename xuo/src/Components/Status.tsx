import React, { useEffect, useState } from 'react';

interface CustomActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  created_at: number;
}

const Status: React.FC = () => {
  const [customStatus, setCustomStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://api.lanyard.rest/v1/users/212702039103373312');
        const result = await response.json();
        if (result.success) {
          const customActivity = result.data.activities.find(
            (activity: CustomActivity) => activity.type === 4
          );
          if (customActivity?.state) {
            setCustomStatus(customActivity.state);
          }
        }
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();

    // Set up WebSocket connection for real-time updates
    const socket = new WebSocket('wss://api.lanyard.rest/socket');
    let heartbeatInterval: ReturnType<typeof setInterval>;

    socket.onopen = () => {
      socket.send(JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: "212702039103373312"
        }
      }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.op === 1) {
        const { heartbeat_interval } = message.d;
        heartbeatInterval = setInterval(() => {
          socket.send(JSON.stringify({ op: 3 }));
        }, heartbeat_interval);
      }

      if (message.op === 0 && (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE')) {
        const customActivity = message.d.activities.find(
          (activity: CustomActivity) => activity.type === 4
        );
        if (customActivity?.state) {
          setCustomStatus(customActivity.state);
        } else {
          setCustomStatus(null);
        }
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

  if (!customStatus) {
    return null;
  }

  return (
    <div className="relative -ml-3 mt-4">
      {/* Main container */}
      <div className="bg-[#fce7f3] rounded-xl px-3 pt-2 pb-1.5 relative w-fit max-w-[min(230px,80vw)] shadow-md border border-[#fbcfe8]">
        <div className="absolute -top-2 left-2.5 w-5 h-3 bg-[#fce7f3] rounded-t-full"></div>
        {/* New circle element */}
        <div className="absolute -top-5 -left-2 w-3 h-3 bg-[#fce7f3] rounded-full"></div>
        <span className="text-gray-700 text-base break-words block leading-5">
          {customStatus}
        </span>
      </div>
    </div>
  );
};

export default Status;