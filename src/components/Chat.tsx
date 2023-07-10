import React, { useEffect, useState, useRef } from 'react';
import Ably from "ably/promises";
import toast from 'react-hot-toast';

const ably = new Ably.Realtime.Promise({ authUrl: '/api' });

const Chat: React.FC = () => {
  let inputBox: HTMLInputElement | null = null;
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const [messageText, setMessageText] = useState<string>("");
  const [receivedMessages, setMessages] = useState<any[]>([]);
  const messageTextIsEmpty = messageText.trim().length === 0;

  const [channel, ably] = useChannel("chat-gilteh", (message: any) => {
    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

  const sendChatMessage = (messageText: string) => {
    if (channel?.connection?.state === 'failed') {
      toast.error("Connection limit reached. Please try again later.");
      return;
    }
  
    channel.publish({ name: "chat-message", data: messageText });
    setMessageText("");
    inputBox!.focus();
  }

  const handleFormSubmission = (event: React.FormEvent) => {
    event.preventDefault();
    sendChatMessage(messageText);
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    event.preventDefault();
  }

  const messages = receivedMessages.reverse().map((message, index) => {
    const timestamp = message.timestamp;
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const clockTime = `${hours}:${minutes}`;

    const author = message.connectionId === ably.connection.id ? "me" : "other";
    const isCurrentUser = author === "me";
    const messageClass = `rounded-lg p-2 max-w-md ${
      isCurrentUser ? "bg-indigo-500 text-white self-end" : "bg-gray-100 text-gray-800"
    }`;
    const containerClass = `flex ${isCurrentUser ? "justify-end" : "justify-start"}`;

    return (
      <div key={index} className={containerClass}>
        <div className={messageClass}>
          <p className={`text-sm ${isCurrentUser ? "text-white" : "text-gray-900"}`}>{message.data}</p>
          <p className={`text-xs text-gray-500 ${isCurrentUser ? "text-white text-left" : "text-right"}`}>{clockTime}</p>
        </div>
      </div>
    );
  });

  useEffect(() => {
    if (channel && channel.connection && channel.connection.state === 'failed') {
      toast.error("Connection limit reached. Please try again later.");
    }
    messageContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [channel, receivedMessages]);

  return (
    <div className="pt-20 pb-12 max-w-[768px] mx-auto">
      <div ref={messageContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className="m-4">
            {message}
          </div>
        ))}
      </div>
      <form onSubmit={handleFormSubmission} className="flex justify-center fixed bottom-0 left-0 right-0 bg-transparent backdrop-filter backdrop-blur-md">
        <div className="flex max-w-[768px] w-full mx-auto px-4 py-2">
          <input
            ref={(element) => { inputBox = element; }}
            value={messageText}
            placeholder="Type a message..."
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            type="text"
            className="flex-grow outline-none bg-gray-200 rounded-full py-2 px-4 mr-2 max-w-[90%]"
          />
          <button
            disabled={messageTextIsEmpty}
            className="bg-indigo-500 text-white rounded-full py-2 px-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;

function useChannel(channelName: string, callbackOnMessage: (msg: any) => void): [any, any] {
  const channel = ably.channels.get(channelName);

  const onMount = () => {
    channel.subscribe((msg: any) => { callbackOnMessage(msg); });
  }

  const onUnmount = () => {
    channel.unsubscribe();
  }

  const useEffectHook = () => {
    onMount();
    return () => { onUnmount(); };
  };

  useEffect(useEffectHook);

  return [channel, ably];
}
