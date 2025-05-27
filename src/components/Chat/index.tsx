import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useChannel } from '../../hooks/useChannel';
import ChatBubble from './ChatBubble';
import ChatForm from './ChatForm';

const animalNames = [
  'Lion', 'Tiger', 'Wolf', 'Fox', 'Panda',
  'Eagle', 'Shark', 'Dolphin', 'Bear', 'Hawk',
  'Otter', 'Falcon', 'Cheetah', 'Koala', 'Jaguar',
];

function generateRandomUsername() {
  const animal = animalNames[Math.floor(Math.random() * animalNames.length)];
  const number = Math.floor(Math.random() * 90) + 10;
  return `${animal}${number}`;
}

const Chat = () => {
  const inputBox = useRef<HTMLInputElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const [messageText, setMessageText] = useState<string>('');
  const [receivedMessages, setMessages] = useState<any[]>([]);
  const [presenceMembers, setPresenceMembers] = useState<any[]>([]);
  const messageTextIsEmpty = messageText.trim().length === 0;
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [channel, ablyChannel] = useChannel('chat-giltech', (message: any) => {
    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);
  });

  useEffect(() => {
    const savedUsername = localStorage.getItem('chatUsername');
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      const newUsername = generateRandomUsername();
      localStorage.setItem('chatUsername', newUsername);
      setUsername(newUsername);
    }
  }, []);

  useEffect(() => {
    if (!channel) return;

    setLoading(true);
    channel.history((err: any, page: any) => {
      setLoading(false);

      if (err) {
        console.error('Failed to fetch history:', err);
        toast.error('Failed to load chat history.');
        return;
      }
      if (page && page.items) {
        const sortedMessages = page.items.sort((a: any, b: any) => a.timestamp - b.timestamp);
        setMessages(sortedMessages);
      }
    });
  }, [channel]);


  const sendChatMessage = (messageText: string) => {
    if (channel?.connection?.state === 'failed') {
      toast.error('Connection limit reached. Please try again later.');
      return;
    }

    channel.publish({ name: 'chat-message', data: { text: messageText, username } });
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
      {loading ? (
        <div className="flex justify-center items-center h-42">
          <span className="loading loading-dots loading-xl"></span>
        </div>
      ) : (
        <div ref={messageContainerRef}>
          {receivedMessages.map((message, index) => (
            <ChatBubble
              key={index}
              message={message}
              ablyChannel={ablyChannel}
              messageContainerRef={messageContainerRef}
            />
          ))}
        </div>
      )}
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
