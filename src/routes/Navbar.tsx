import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import * as React from 'react';
import { useSnackbar } from 'notistack';

interface NavbarProps {
  token: string | null;
  handleTokenUpdate: (newToken: string | null) => void;
}

const Navbar = ({ token, handleTokenUpdate }: NavbarProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = () => {
    // Delete the token from localStorage
    localStorage.removeItem('token');
    handleTokenUpdate(null);
    enqueueSnackbar('Logout successful', { variant: 'success' });
    // Redirect the user to the login page or any other desired location
  };

  React.useEffect(() => {
    // Check the token in localStorage when the component mounts
    const storedToken = localStorage.getItem('token');
    handleTokenUpdate(storedToken);
  }, []);

  return (
    <AppBar position="static" sx={{ bgcolor: '#1E1E1E' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Fitness App</Typography>
        <div>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {token ? (
            <>
              <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
