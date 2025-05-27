import React, { useEffect } from 'react';
import { formatTime } from '../../utils/timeUtils';

interface ChatBubbleProps {
  message: any;
  ablyChannel: any;
  messageContainerRef: React.RefObject<HTMLDivElement>;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, ablyChannel, messageContainerRef }) => {
  const timestamp = message.timestamp;
  const formattedTime = formatTime(timestamp);

  const storedUsername = localStorage.getItem('chatUsername') || '';
  const isCurrentUser = message.data?.username === storedUsername;

  const author = isCurrentUser ? 'Me' : message.data?.username || message.connectionId;

  useEffect(() => {
    messageContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messageContainerRef]);

  return (
    <div className={`chat ${isCurrentUser ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-header">
        {author}
        <time className="text-xs opacity-50 pl-2">{formattedTime}</time>
      </div>
      <div className={`chat-bubble break-words ${isCurrentUser ? 'bg-primary' : ''}`}>
        {message.data?.text || ''}
      </div>
    </div>
  );
};

export default ChatBubble;
