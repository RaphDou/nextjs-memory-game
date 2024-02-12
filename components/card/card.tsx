// Card.tsx
import React from 'react';
import { Card as MuiCard, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';

const Card = styled(MuiCard)({
  cursor: 'pointer',
});

interface Props {
  value: number;
  isRevealed: boolean;
  isClickable: boolean;
  onClick: () => void;
}

const CardComponent: React.FC<Props> = ({ value, isRevealed, isClickable, onClick }) => (
  <Card
    onClick={isClickable ? onClick : undefined}
    style={{
      backgroundColor: isRevealed ? '#FFF' : '#3f51b5',
      pointerEvents: isClickable ? 'auto' : 'none',
      boxShadow: isRevealed ? '0 0 10px rgba(0, 0, 0, 0.5)' : 'none',
    }}
  >
    <CardContent>
      <Typography variant="h3" align="center" style={{ color: isRevealed ? '#3f51b5' : '#FFF' }}>
        {isRevealed ? value : '?'}
      </Typography>
    </CardContent>
  </Card>
);

export default CardComponent;
