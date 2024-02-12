import React from 'react';
import { Typography } from '@mui/material';

const MyFooter: React.FC = () => {
  return (
    <footer>
      <Typography variant="body2" align="center" color="textSecondary">
        © {new Date().getFullYear()}{' '}
        <a href="https://github.com/RaphDou/nextjs-memory-game" target="_blank" rel="noopener noreferrer">
          Github
        </a>
      </Typography>
    </footer>
  );
};

export default MyFooter;
