
import React from 'react';
import { CharacterType } from '../types';

interface CharacterAvatarProps {
  type: CharacterType;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ type }) => {
  const getAvatarStyle = () => {
    switch (type) {
      case CharacterType.RYOTAKU:
        return { bg: 'bg-indigo-900', icon: '📜', color: 'text-white' };
      case CharacterType.GENPAKU:
        return { bg: 'bg-amber-700', icon: '🩺', color: 'text-white' };
      case CharacterType.AI:
        return { bg: 'bg-cyan-600', icon: '🤖', color: 'text-white' };
      case CharacterType.GENNAI:
        return { bg: 'bg-red-600', icon: '⚡', color: 'text-white' };
      case CharacterType.USER:
        return { bg: 'bg-stone-400', icon: '👤', color: 'text-white' };
      default:
        return { bg: 'bg-gray-500', icon: '❓', color: 'text-white' };
    }
  };

  const style = getAvatarStyle();

  return (
    <div className={`${style.bg} ${style.color} w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md border-2 border-white/20`}>
      {style.icon}
    </div>
  );
};

export default CharacterAvatar;
