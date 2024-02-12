import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const MyAppBar: React.FC = () => {
  return (
    <AppBar position="fixed" style={{ backgroundColor: '#111', zIndex: 9999 }}>
      <Toolbar style={{ backgroundColor: '#ffffff' }}>
        <Typography variant="h6" style={{ color: '#000000' }}>Raphael's memory game!</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
