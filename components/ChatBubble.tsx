
import React from 'react';
import { ChatMessage, CharacterType } from '../types';
import CharacterAvatar from './CharacterAvatar';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === CharacterType.USER;
  const isAnalysis = message.isAnalysis;

  if (isAnalysis) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-stone-200/80 border border-stone-300 rounded-lg px-4 py-2 text-xs text-stone-600 italic max-w-[80%] text-center">
          <span className="font-bold mr-2 text-stone-500">[分析]</span>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
        <CharacterAvatar type={message.sender} />
      </div>
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="text-[10px] text-stone-500 mb-1 font-bold px-1 uppercase tracking-wider">
          {message.sender}
        </div>
        <div 
          className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : message.sender === CharacterType.GENNAI
                ? 'bg-red-50 text-red-900 border-2 border-red-200 rounded-tl-none font-bold animate-pulse'
                : 'bg-white text-stone-800 rounded-tl-none border border-stone-100'
          }`}
        >
          {message.content}
        </div>
        <div className="text-[9px] text-stone-400 mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
