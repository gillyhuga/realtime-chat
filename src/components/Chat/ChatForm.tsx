import React from 'react';

interface ChatFormProps {
  messageText: string;
  messageTextIsEmpty: boolean;
  setMessageText: (text: string) => void;
  handleFormSubmission: (event: React.FormEvent) => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
}

const ChatForm: React.FC<ChatFormProps> = ({
  messageText,
  messageTextIsEmpty,
  setMessageText,
  handleFormSubmission,
  handleKeyPress,
}) => {
  return (
    <form
      onSubmit={handleFormSubmission}
      className="flex justify-center fixed bottom-0 left-0 right-0 bg-transparent backdrop-filter backdrop-blur-md pb-2 ">
      <div className="flex max-w-[768px] w-full mx-auto px-4 py-2">
        <input
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
  );
};

export default ChatForm;
