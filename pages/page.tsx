import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Container,
  Typography,
  useTheme,
  styled,
  Grid,
  Card as MuiCard,
  CardContent,
  Snackbar,
  Box,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { ArrowBack, Star } from '@mui/icons-material';

const Card = styled(MuiCard)({
  cursor: 'pointer',
  backgroundColor: '#3f51b5',
});

const PageContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
}));

const StyledButton = styled(Button)<{ selected: boolean }>(({ theme, selected }) => ({
  fontWeight: 'bold',
  textTransform: 'none',
  backgroundColor: selected ? theme.palette.primary.main : '#FFF',
  color: selected ? '#FFF' : theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

const Timer = styled(Typography)({
  fontSize: '2rem',
  margin: '10px',
});

const BackButton = styled(Button)({
  fontWeight: 'bold',
  textTransform: 'none',
});

const ReplayButton = styled(Button)({
  fontWeight: 'bold',
  textTransform: 'none',
});

const StarsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '5px',
});

const Page: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const [pairsCount, setPairsCount] = useState<number>(4); // Default number of pairs
  const [cards, setCards] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(90); // 1 minute 30 seconds in seconds
  const [foundPairs, setFoundPairs] = useState<number[]>([]);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [showGame, setShowGame] = useState<boolean>(false);
  const [starsEarned, setStarsEarned] = useState<number>(0);

  // Store game statistics for each level
  const [levelStats, setLevelStats] = useState<{ [key: number]: { errors: number; time: number; stars: number } }>({});

  useEffect(() => {
    generateCards();
  }, [pairsCount]);

  const generateCards = () => {
    const pairs = [];
    for (let i = 1; i <= pairsCount; i++) {
      pairs.push(i, i);
    }
    pairs.sort(() => Math.random() - 0.5);
    setCards(pairs);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameOver && matchedPairs !== pairsCount) {
      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            clearInterval(timer);
            setGameOver(true);
            return prevTimeLeft;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameOver, matchedPairs, pairsCount]);

  const handleCardClick = (index: number) => {
    if (!gameStarted || revealedCards.length >= 2 || foundPairs.includes(cards[index]) || revealedCards.includes(index)) {
      return;
    }

    const newRevealedCards = [...revealedCards, index];
    setRevealedCards(newRevealedCards);

    if (newRevealedCards.length === 2) {
      const [firstIndex, secondIndex] = newRevealedCards;
      const isFirstMatch = cards[firstIndex] === cards[secondIndex];

      if (isFirstMatch) {
        setMatchedPairs(matchedPairs + 1);
        setFoundPairs([...foundPairs, cards[firstIndex]]);
        setRevealedCards([]);

        if (matchedPairs + 1 === pairsCount) {
          const stars = calculateStars();
          setStarsEarned(stars);

          // Update level stats
          setLevelStats({
            ...levelStats,
            [pairsCount]: {
              errors: errorsCount,
              time: 90 - timeLeft,
              stars: stars,
            },
          });
        }
      } else {
        setErrorsCount(errorsCount + 1); // Increment errors count
        setTimeout(() => {
          setRevealedCards(revealedCards.filter(cardIndex => cardIndex !== firstIndex && cardIndex !== secondIndex));
        }, 1000);
      }
    }
  };

  const renderCard = (index: number) => {
    const isRevealed = revealedCards.includes(index) || matchedPairs === pairsCount || foundPairs.includes(cards[index]);
    const value = isRevealed ? cards[index] : '?';
    const isClickable = !isRevealed && revealedCards.length < 2;

    return (
      <Grid item xs={3} key={index}>
        <Card
          onClick={() => isClickable && handleCardClick(index)}
          style={{ backgroundColor: isRevealed ? '#FFF' : '#3f51b5', pointerEvents: isClickable ? 'auto' : 'none' }}
        >
          <CardContent>
            <Typography variant="h3" align="center" style={{ color: isRevealed ? '#3f51b5' : '#FFF' }}>
              {value}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const handleStartGame = () => {
    if (!gameStarted) {
      setShowGame(true);
      setGameStarted(true);
    }
  };

  const calculateStars = () => {
    if (errorsCount <= 2) {
      return 3;
    } else if (errorsCount <= 4) {
      return 2;
    } else {
      return 1;
    }
  };

  const handleReplayGame = () => {
    setMatchedPairs(0);
    setErrorsCount(0);
    setTimeLeft(90);
    setFoundPairs([]);
    setRevealedCards([]);
    setStarsEarned(0); // Reset stars earned
    setShowGame(false); // Hide the game temporarily, so it won't show stats
    generateCards(); // Regenerate cards for the replayed game
  };

  const handleBackToMenu = () => {
    setShowGame(false);
  };

  return (
    <PageContainer>
      <Typography variant="h2" align="center" gutterBottom>
        Memory Game
      </Typography>

      <Typography variant="h5" gutterBottom>
        How to Play:
      </Typography>
      <Typography variant="body1" gutterBottom>
        Memory is a classic card game in which the player needs to find all the matching pairs of cards.
        To play, click on a card to reveal its number. Then, click on another card. If the numbers match, the pair is found.
        If not, the cards will be hidden again. The game ends when all pairs are found.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Choose Difficulty Level:
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {[...Array(6)].map((_, count) => (
          <Grid item key={count}>
            <StyledButton
              selected={pairsCount === count + 2}
              onClick={() => setPairsCount(count + 2)}
            >
              {count + 2} Pairs
            </StyledButton>
            {count + 2 === pairsCount && (
              <StarsContainer>
                {[...Array(3)].map((_, starIndex) => (
                  <Star key={starIndex} color={starIndex < calculateStars() ? 'primary' : 'disabled'} />
                ))}
              </StarsContainer>
            )}
          </Grid>
        ))}
      </Grid>

      {!gameStarted && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartGame}
          sx={{
            fontWeight: 'bold',
            textTransform: 'none',
            marginTop: '20px',
          }}
        >
          Ready?
        </Button>
      )}

      {showGame && (
        <div>
          <Grid container spacing={2} justifyContent="center">
            {cards.map((_, index) => renderCard(index))}
          </Grid>
          <Timer variant="h3">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Timer>
        </div>
      )}

      <Snackbar open={gameOver} autoHideDuration={6000} onClose={() => setGameOver(false)}>
        <MuiAlert onClose={() => setGameOver(false)} severity="error">
          Game Over! You couldn't find all pairs in time with {errorsCount} errors.
        </MuiAlert>
      </Snackbar>

      {matchedPairs === pairsCount && (
        <Box mt={2}>
          <Typography variant="h4">
            Congratulations! You found all pairs in {90 - timeLeft} seconds with {errorsCount} errors.{' '}
            <Typography variant="h5">
              You've earned {calculateStars()} stars!
            </Typography>
          </Typography>
        </Box>
      )}

      {gameStarted && (
        <Box mt={2}>
          <BackButton
            variant="contained"
            color="primary"
            onClick={handleBackToMenu}
            sx={{
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            <ArrowBack />
            Back to Menu
          </BackButton>
        </Box>
      )}

      {!gameOver && matchedPairs !== pairsCount && (
        <Box mt={2}>
          <ReplayButton
            variant="contained"
            color="primary"
            onClick={handleReplayGame}
            sx={{
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            Replay Game
          </ReplayButton>
        </Box>
      )}
    </PageContainer>
  );
};

export default Page;
