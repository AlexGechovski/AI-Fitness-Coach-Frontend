import React, { useState, ReactNode, ReactElement, cloneElement } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface ChatProviderProps {
  children: ReactNode;
}

interface ChatPageProps {
  messages: Message[];
  addMessage: (message: Message) => void;
}

const ChatProvider = ({ children }: ChatProviderProps): ReactElement => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message): void => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div>
      {/* Render the children components and pass the messages and addMessage function as props */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement<ChatPageProps>(child)) {
          return cloneElement(child, {
            messages,
            addMessage,
          });
        }
        return child;
      })}
    </div>
  );
};

export default ChatProvider;
