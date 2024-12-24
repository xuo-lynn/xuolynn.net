import React, { useEffect, useState } from 'react';

interface DiscordUser {
  id: string;
  avatar: string;
  avatar_decoration_data?: {
    asset: string;
  };
}

interface AvatarDisplayProps {
  userId: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ userId }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarDecorationUrl, setAvatarDecorationUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      const result = await response.json();
      if (result.success) {
        const user: DiscordUser = result.data.discord_user;
        const avatarExtension = user.avatar.startsWith("a_") ? "gif" : "png";
        setAvatarUrl(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${avatarExtension}?size=256`);

        if (user.avatar_decoration_data && !avatarDecorationUrl) {
          const decorationUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=64&passthrough=true`;
          const decorationResponse = await fetch(decorationUrl);
          const blob = await decorationResponse.blob();
          setAvatarDecorationUrl(URL.createObjectURL(blob));
        }
      }
    };

    fetchAvatar();
  }, [userId, avatarDecorationUrl]);

  return (
    <div
      className="avatar-display"
      style={{
        position: 'relative',
        width: '153px',
        height: '153px'
      }}
    >
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="rounded-full w-32 h-32"
          style={{ position: 'relative', zIndex: 1 }}
        />
      )}
      {avatarDecorationUrl && (
        <img
          src={avatarDecorationUrl}
          alt="Avatar Decoration"
          className="avatar-decoration"
          style={{
            position: 'absolute',
            top: '-14px',
            left: '-13px',
            zIndex: 2,
            width: '153px',
            height: '153px'
          }}
        />
      )}
    </div>
  );
};

export default AvatarDisplay; 