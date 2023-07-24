import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button,  Paper, Typography } from '@mui/material';
import jwt from 'jwt-decode';
interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface Chat {
  chatId: number;
  modelName: string;
  messages: Message[];
}

interface ChatPageProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onAddMessage: (message: Message) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ messages, setMessages, onAddMessage }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]); // State to store the fetched chats
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null); // State to store the selected chat

  const messagesEndRef = useRef<HTMLDivElement>(null);

  function getDecodedAccessToken(token: string): any {
    try {
      return jwt(token);
    } catch (error) {
      return null;
    }
  }

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('JWT token not found in local storage');
          return;
        }
        const tokenUsername = getDecodedAccessToken(token).sub;
        const response = await fetch(`http://localhost:8080/api/v1/chats/${tokenUsername}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    fetchChats();
  }, []);

  const handleChatButtonClick = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const newMessage: Message = {
      id: messages.length,
      text: inputText,
      isUser: true,
    };

    onAddMessage(newMessage);
    setInputText('');
    setLoading(true);

    try {
      const botResponse = await getAnswerToQuestion(inputText);

      const botMessage: Message = {
        id: messages.length + 1,
        text: botResponse,
        isUser: false,
      };

      onAddMessage(botMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAnswerToQuestion = async (question: string) => {
    try {
      const formattedMessages = formatMessagesForChatGpt(question, messages);
      const response = await fetch('http://localhost:8080/chat-gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedMessages),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the bot');
      }

      const data = await response.json();
      console.log(data);

      // Get the message content from the API response
      const botMessageContent = data.choices[0]?.message?.content || 'No response from the bot';
      return botMessageContent;
    } catch (error) {
      throw new Error('Failed to get response from the bot');
    }
  };

  const formatMessagesForChatGpt = (question: string, messages: Message[]) => {
    const formattedMessages = messages.map((message) => {
      return {
        role: message.isUser ? 'user' : 'assistant',
        content: message.text,
      };
    });

    // Add the user's question as the last message
    formattedMessages.push({
      role: 'user',
      content: question,
    });

    return {
      model: 'gpt-3.5-turbo',
      messages: formattedMessages,
    };
  };

  useEffect(() => {
    const initialBotMessage: Message = {
      id: 0,
      text: 'Hello!',
      isUser: false,
    };
    if (messages.length === 0) {
      setMessages([initialBotMessage]);
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant'});
    }
  }, [messages]);

  return (
    <div style={{ height: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Chat Page
      </Typography>
      <Paper style={{ flex: 1, width: '100%', maxWidth: 700, padding: '1rem', marginBottom: '1rem', overflow: 'auto' }}>
        {/* If a chat is selected, display its messages */}
        {selectedChat && (
          <div>
            <Typography variant="h6">Selected Chat: {selectedChat.chatId}</Typography>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: message.isUser ? '#1976d2' : '#3f51b5',
                    color: '#fff',
                    maxWidth: '70%',
                    alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  {message.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
              {isLoading && <div style={{ alignSelf: 'flex-start' }}>Bot is typing...</div>}
            </div>
          </div>
        )}

        {/* If no chat is selected, display the chat buttons */}
        {!selectedChat && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chats.map((chat) => (
              <Button key={chat.chatId} onClick={() => handleChatButtonClick(chat)}>
                Chat {chat.chatId}
              </Button>
            ))}
          </div>
        )}
      </Paper>
      <div style={{ width: '100%', maxWidth: 700 }}>
        <form style={{ display: 'flex', gap: '1rem' }} onSubmit={(e) => e.preventDefault()}>
          <TextField
            label="Your Message"
            value={inputText}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            style={{ flex: 1 }}
            onKeyDown={handleKeyDown}
          />
          <Button variant="contained" onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
