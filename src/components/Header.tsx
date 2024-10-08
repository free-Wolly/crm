import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const Header: React.FC = () => {
  const { logout } = useAuth();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#00BCD4' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>Wolly CRM</Typography>
        <Button color="inherit" sx={{display: 'flex', gap: '5px'}} onClick={logout}>
          <LogoutIcon />
          <span>Logout</span>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;