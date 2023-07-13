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

  const author = message.connectionId === ablyChannel.connection.id ? 'Me' : message.connectionId;
  const isCurrentUser = author === 'Me';

  useEffect(() => {
    messageContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messageContainerRef]);

  return (
    <div className={`chat ${isCurrentUser ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-header">
        {author}
        <time className="text-xs opacity-50 pl-2">{formattedTime}</time>
      </div>
      <div className={`chat-bubble break-words ${isCurrentUser ? 'bg-primary' : ''}`}>{message.data}</div>
    </div>
  );
};

export default ChatBubble;
