import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';


import App from './App.tsx';
import './index.css';
import RootLayout from './routes/RootLayout.tsx';
import SignInSide from './components/SignInSide.tsx';
import SignUp from './components/SignUp.tsx';
import Profile from './components/Profile.tsx';
import WeeklyWorkoutPage from './components/WeeklyWorkoutPage.tsx';
import ChatBotPage from './components/ChatBot.tsx';

const Root = () => {
  const [token, setToken] = React.useState<string | null>(localStorage.getItem('token'));


  const handleTokenUpdate = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    setToken(newToken);
  };


  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout token={token} handleTokenUpdate={handleTokenUpdate} />,
      children: [
        { path: '/', element: <App /> },
        { path: '/login', element: <SignInSide onTokenUpdate={handleTokenUpdate} /> },
        { path: '/register', element: <SignUp onTokenUpdate={handleTokenUpdate} /> },
        { path: '/profile', element: <Profile /> },
        { path: '/workout', element: <WeeklyWorkoutPage /> },
        { path: '/chat', element: <ChatBotPage /> }
      ],
    },
  ]);

  return (
    <React.StrictMode>
      <SnackbarProvider maxSnack={3}>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);