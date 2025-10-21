import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/context/ChatContext';
import { MessageSquare } from 'lucide-react';

const FloatingChatButton = () => {
  const { notifications } = useChat();
  const navigate = useNavigate();
  
  // Count unique senders for the notification badge
  const notificationCount = new Set(notifications.map(n => n.senderId)).size;

  return (
    <button
      onClick={() => navigate('/chat')}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-[#5b5dda] text-white shadow-lg flex items-center justify-center hover:bg-[#4a4ab5] transition-transform duration-200 hover:scale-110"
      aria-label="Open chats"
    >
      <MessageSquare className="w-7 h-7" />
      
      {/* Red notification dot */}
      {notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-card">
          {notificationCount}
        </span>
      )}
    </button>
  );
};

export default FloatingChatButton;