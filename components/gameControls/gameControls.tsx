// GameControls.tsx
import React from 'react';
import { Button, Box } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

interface Props {
  onReplay: () => void;
  onBackToMenu: () => void;
}

const GameControls: React.FC<Props> = ({ onReplay, onBackToMenu }) => (
  <Box mt={2}>
    <Button
      variant="contained"
      color="primary"
      onClick={onReplay}
      sx={{
        fontWeight: 'bold',
        textTransform: 'none',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      Replay Level
    </Button>
    <Button
      variant="contained"
      color="primary"
      onClick={onBackToMenu}
      sx={{
        fontWeight: 'bold',
        textTransform: 'none',
        marginLeft: '10px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <ArrowBack />
      Back to Menu
    </Button>
  </Box>
);

export default GameControls;
