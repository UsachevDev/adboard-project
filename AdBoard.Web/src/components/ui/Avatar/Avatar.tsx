import React from 'react';
import { stringToColor } from '@/utils/colors';

interface AvatarProps {
  name: string;
  size?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = '2rem' }) => {
  const backgroundColor = stringToColor(name);
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor,
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: `calc(${size} / 2)`,
        fontWeight: 'bold',
      }}
    >
      {firstLetter}
    </div>
  );
};

export default Avatar;
