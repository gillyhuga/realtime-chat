import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useChannel } from '../../hooks/useChannel';
import ChatBubble from './ChatBubble';
import ChatForm from './ChatForm';

const Chat = () => {
  let inputBox = useRef<HTMLInputElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const [messageText, setMessageText] = useState<string>('');
  const [receivedMessages, setMessages] = useState<any[]>([]);
  const [presenceMembers, setPresenceMembers] = useState<any[]>([]);
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

  useEffect(() => {
    if (channel) {
      channel.presence.enter();

      channel.presence.subscribe('enter', (member: any) => {
        setPresenceMembers((prevMembers) => [...prevMembers, member]);
      });

      channel.presence.subscribe('leave', (member: { clientId: any }) => {
        setPresenceMembers((prevMembers) =>
          prevMembers.filter((existingMember) => existingMember.clientId !== member.clientId)
        );
      });

      channel.presence.get().then((members: any[]) => {
        setPresenceMembers(members);
      });

      return () => {
        channel.presence.unsubscribe();
        channel.presence.leave();
      };
    }
  }, [channel]);

  return (
    <div className="pb-20 pt-20">
      <div ref={messageContainerRef}>
        {receivedMessages.map((message, index) => {
          return (
            <ChatBubble
              key={index}
              message={message}
              ablyChannel={ablyChannel}
              messageContainerRef={messageContainerRef}
            />
          );
        })}
      </div>
      <ChatForm
        messageText={messageText}
        messageTextIsEmpty={messageTextIsEmpty}
        setMessageText={setMessageText}
        handleFormSubmission={handleFormSubmission}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default Chat;
