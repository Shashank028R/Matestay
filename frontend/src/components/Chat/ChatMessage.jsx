import React from 'react';
import TimeAgo from 'react-timeago'; 
import { useAuth } from '@/context/AuthContext';

const customFormatter = (value, unit, suffix) => {
  if (unit === 'second') {
    return 'just now';
  }
  return `${value} ${unit}${value > 1 ? 's' : ''} ${suffix}`;
};

const ChatMessage = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      <div 
        className={`rounded-2xl px-4 py-2 max-w-[70%] text-wrap break-words shadow-sm
          ${
            isOwnMessage 
              ? 'bg-primary text-primary-foreground' // Your message (Theme: Primary)
              : 'bg-muted text-muted-foreground' // Other person's message (Theme: Muted)
          }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className={`text-xs mt-1 ${isOwnMessage ? 'opacity-70' : 'opacity-70'}`}>
          <TimeAgo date={message.createdAt} formatter={customFormatter} />
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;