// GameStats.tsx
import React from 'react';
import { Typography, Box } from '@mui/material';

interface Props {
  totalStars: number;
  levelStats: { [key: number]: { stars: number } };
}

const GameStats: React.FC<Props> = ({ totalStars, levelStats }) => (
  <Box mt={4}>
    <Typography variant="h4" align="center" gutterBottom style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      Total Stars Earned: {totalStars}
    </Typography>
    <Typography variant="h5" align="center" gutterBottom style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      Level Stats:
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {Object.keys(levelStats).map((levelIndex) => (
        <Box key={levelIndex}>
          <Typography variant="h6" style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
            Level {parseInt(levelIndex) + 1} - Stars: {levelStats[parseInt(levelIndex)].stars}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

export default GameStats;
