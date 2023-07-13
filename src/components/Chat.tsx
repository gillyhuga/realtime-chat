import React, { useEffect, useState, useRef } from 'react';
import Ably from 'ably/promises';
import toast from 'react-hot-toast';

const ably = new Ably.Realtime.Promise({ authUrl: '/api' });

const Chat = () => {
  let inputBox = useRef<HTMLInputElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const [messageText, setMessageText] = useState<string>('');
  const [receivedMessages, setMessages] = useState<any[]>([]);
  const messageTextIsEmpty = messageText.trim().length === 0;

  const [channel, ablyChannel] = useChannel('chat-giltech', (message: any) => {
    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

  const sendChatMessage = (messageText: string) => {
    if (channel?.connection?.state === 'failed') {
      toast.error('Connection limit reached. Please try again later.');
      return;
    }

    channel.publish({ name: 'chat-message', data: messageText });
    setMessageText('');
    inputBox.current?.focus();
  };

  const handleFormSubmission = (event: React.FormEvent) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    event.preventDefault();
  };

  useEffect(() => {
    if (channel && channel.connection && channel.connection.state === 'failed') {
      toast.error('Connection limit reached. Please try again later.');
    }
    messageContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [channel, receivedMessages]);

  return (
    <div className="pb-20 pt-20">
      <div ref={messageContainerRef}>
        {receivedMessages.map((message, index) => {
          const timestamp = message.timestamp;
          const date = new Date(timestamp);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

          const author = message.connectionId === ablyChannel.connection.id ? 'Me' : message.connectionId;
          const isCurrentUser = author === 'Me';

          return (
            <div key={index} className={`chat ${isCurrentUser ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-header">
                {author}
                <time className="text-xs opacity-50 pl-2">{formattedTime}</time>
              </div>
              <div className={`chat-bubble break-words ${isCurrentUser ? 'bg-primary' : ''}`}>{message.data}</div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleFormSubmission}
        className="flex justify-center fixed bottom-0 left-0 right-0 bg-transparent backdrop-filter backdrop-blur-md pb-2 "
      >
        <div className="flex max-w-[768px] w-full mx-auto px-4 py-2">
          <input
            ref={inputBox}
            value={messageText}
            placeholder="Type a message..."
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            type="text"
            className="flex-grow outline-none bg-gray-200 rounded-full py-2 px-4 mr-2 max-w-[90%]"
          />
          <button
            disabled={messageTextIsEmpty}
            className="bg-primary text-white rounded-full py-2 px-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;

function useChannel(channelName: string, callbackOnMessage: (msg: any) => void): [any, any] {
  const channel = ably.channels.get(channelName);

  const onMount = () => {
    channel.subscribe((msg: any) => {
      callbackOnMessage(msg);
    });
  };

  const onUnmount = () => {
    channel.unsubscribe();
  };

  const useEffectHook = () => {
    onMount();
    return () => {
      onUnmount();
    };
  };

  useEffect(useEffectHook);

  return [channel, ably];
}
