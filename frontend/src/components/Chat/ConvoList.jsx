import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom'; // <-- IMPORT

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const ConvoList = ({ conversations, currentChat, setCurrentChat, onlineUsers }) => {
  const { user } = useAuth();
  const navigate = useNavigate(); // <-- INITIALIZE

  const handleConvoClick = (convo) => {
    setCurrentChat(convo); // This updates the "active" highlight
    navigate(`/chat/${convo._id}`); // This changes the URL to show the chat
  };

  return (
    <div className="flex flex-col h-full text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">Chats</h2>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search chats..." 
            className="pl-9 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Conversation Items */}
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            You don't have any chats yet.
          </div>
        ) : (
          conversations.map((convo) => {
            const otherMember = convo.members.find(m => m._id !== user._id);
            if (!otherMember) return null;

            const isOnline = onlineUsers.some(u => u.userId === otherMember._id);
            const isActive = currentChat?._id === convo._id;

            return (
              <div
                key={convo._id}
                onClick={() => handleConvoClick(convo)} // <-- USE NEW HANDLER
                className={`flex items-center gap-3 p-3 cursor-pointer 
                            border-b border-border last:border-b-0
                            hover:bg-accent transition-colors duration-200
                            ${isActive ? 'bg-secondary' : ''}`}
              >
                <div className="relative">
                  <img
                    src={otherMember.profilePic || defaultAvatar}
                    alt={otherMember.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold truncate">{otherMember.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {convo.lastMessage ? 
                      (convo.lastMessage.senderId === user._id ? "You: " : "") + convo.lastMessage.text 
                      : "No messages yet"}
                  </p> 
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConvoList;