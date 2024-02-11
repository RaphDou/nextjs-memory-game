import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const MyAppBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Raph's memory game!</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
