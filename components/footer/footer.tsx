import React from 'react';
import { Typography } from '@mui/material';

const MyFooter: React.FC = () => {
  return (
    <footer>
      <Typography variant="body2" align="center" color="textSecondary">
        © {new Date().getFullYear()} My App
      </Typography>
    </footer>
  );
};

export default MyFooter;
