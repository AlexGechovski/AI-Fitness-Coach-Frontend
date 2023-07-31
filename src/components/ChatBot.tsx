import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Paper, Typography, IconButton } from '@mui/material';
import jwt from 'jwt-decode';
import ClearIcon from '@mui/icons-material/Clear';

interface Message {
  role: string;
  content: string;
}

interface Chat {
  chatId: number;
  model: string;
  messages: Message[];
}

const ChatBotPage: React.FC = () => {
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
    if (selectedChat === null && chats.length > 0) {
      setSelectedChat(chats[0]);
    }
  }, [chats]);

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
    if (inputText.trim() === '' || isLoading || !selectedChat) return;
  
    const newMessage: Message = {
      role: 'user',
      content: inputText,
    };
  
    // Create a copy of the chats state
    const updatedChats = [...chats];
  
    // Find the selected chat in the copy of chats
    const selectedChatIndex = updatedChats.findIndex((chat) => chat.chatId === selectedChat.chatId);

    // Update the messages for the selected chat
    if (selectedChatIndex !== -1) {
      updatedChats[selectedChatIndex].messages.push(newMessage);
    }
    setChats(updatedChats);
    setInputText('');
    setLoading(true);

    const token = localStorage.getItem('token');
        if (!token) {
          console.error('JWT token not found in local storage');
          return;
        }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/chats/${selectedChat.chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMessage),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get response from the bot');
      }
  
      const botResponse: Message = await response.json();
  
      // Update the messages for the selected chat with the bot's response
      if (selectedChatIndex !== -1) {
        updatedChats[selectedChatIndex].messages.push(botResponse);
      }
      setChats(updatedChats);

      console.log(chats);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
  }
  }, [chats]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [selectedChat]);




  const handleNewChatButtonClick = async () => {

    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create a new chat');
      }

      const newChat: Chat = await response.json();

      // Add the new chat to the chats state
      setChats((prevChats) => [...prevChats, newChat]);

      // Select the new chat
      setSelectedChat(newChat);
    } catch (error) {
      console.error('Error starting new chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: number) => {

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('JWT token not found in local storage');
      return;
    }

    try {
      setLoading(true);

      // Send a DELETE request to the API endpoint to delete the chat
      const response = await fetch(`http://localhost:8080/api/v1/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      // Update the chats state by removing the deleted chat
      setChats((prevChats) => prevChats.filter((chat) => chat.chatId !== chatId));

      // If the deleted chat was selected, clear the selected chat
      if (selectedChat && selectedChat.chatId === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div style={{display: 'flex', flexDirection: 'row',justifyContent: 'center'}}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem',marginRight: '2rem',marginTop: '3rem' }}>
        <Button
        onClick={() => handleNewChatButtonClick()}
        style={{ backgroundColor: 'transparent',
                color: '#000',
            }}
        >
            New Chat
        </Button>
        {chats.map((chat) => (
            <div key={chat.chatId} >
                <Button
                variant={selectedChat === chat ? 'contained' : 'text'}
                onClick={() => handleChatButtonClick(chat)}
                style={{ backgroundColor: selectedChat === chat ? '#3f51b5' : 'transparent',
                        color: selectedChat === chat ? '#fff' : '#000',
                    }}
                >
                    Chat {chat.chatId}
                </Button>
                <IconButton onClick={() => handleDeleteChat(chat.chatId)} color="error" aria-label="delete">
                    <ClearIcon />
                </IconButton>

            </div>
        ))}
        </div>
        <div style={{ height: '90vh',width: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4" gutterBottom>
            Chat Bot Page
        </Typography>
        <Paper style={{ flex: 1, width: '100%', maxWidth: 700, padding: '1rem', marginBottom: '1rem', overflow: 'auto' }}>
            {/* If a chat is selected, display its messages */}
            {selectedChat && (
        <div>
          <Typography variant="h6">Selected Chat: {selectedChat.chatId}</Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedChat.messages
              .filter((message) => message.role !== 'system' && message.role !== 'function')
              .map((message, index) => (
                // Skip rendering the third message (index 2)
                // Note: Array index starts from 0
                index !== 1 && (
                  <div
                    key={index}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      backgroundColor: message.role === 'user' ? '#1976d2' : '#3f51b5',
                      color: '#fff',
                      maxWidth: '70%',
                      alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {message.content}
                  </div>
                )
              ))}
            <div ref={messagesEndRef} />
            {isLoading && <div style={{ alignSelf: 'flex-start' }}>Bot is typing...</div>}
          </div>
        </div>
      )}

            {/* If no chat is selected, display the chat buttons */}
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
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                    }
                }}
            />
            <Button variant="contained"   onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send'}
            </Button>
            </form>
        </div>

        </div>

    </div>

  );
};

export default ChatBotPage;