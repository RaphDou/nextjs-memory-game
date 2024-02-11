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

const levels = [
  { pairsCount: 2, timeLimit: 60 },
  { pairsCount: 4, timeLimit: 90 },
  { pairsCount: 6, timeLimit: 120 },
  // Ajoutez plus de niveaux selon vos besoins
];

const Page: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const [selectedLevelIndex, setSelectedLevelIndex] = useState<number | null>(null);
  const [cards, setCards] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [foundPairs, setFoundPairs] = useState<number[]>([]);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [showGame, setShowGame] = useState<boolean>(false);
  const [starsEarned, setStarsEarned] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [levelStats, setLevelStats] = useState<{ [key: number]: { errors: number; timeTaken: number; stars: number } }>({});

  useEffect(() => {
    if (selectedLevelIndex !== null) {
      initializeLevel();
    }
  }, [selectedLevelIndex]);

  const initializeLevel = () => {
    const level = levels[selectedLevelIndex];
    setCards(generateCards(level.pairsCount));
    setRevealedCards([]);
    setMatchedPairs(0);
    setGameStarted(false);
    setGameOver(false);
    setTimeLeft(level.timeLimit);
    setFoundPairs([]);
    setErrorsCount(0);
    setStarsEarned(0);
  };

  const generateCards = (pairsCount: number): number[] => {
    const pairs = [];
    for (let i = 1; i <= pairsCount; i++) {
      pairs.push(i, i);
    }
    pairs.sort(() => Math.random() - 0.5);
    return pairs;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameOver && selectedLevelIndex !== null && matchedPairs !== levels[selectedLevelIndex]?.pairsCount) {
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
  }, [gameStarted, gameOver, matchedPairs, selectedLevelIndex]);

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

        if (matchedPairs + 1 === levels[selectedLevelIndex].pairsCount) {
          const stars = calculateStars();
          setStarsEarned(stars);
          updateLevelStats(stars);
        }
      } else {
        setErrorsCount(errorsCount + 1);
        setTimeout(() => {
          setRevealedCards(revealedCards.filter(cardIndex => cardIndex !== firstIndex && cardIndex !== secondIndex));
        }, 1000);
      }
    }
  };

  const renderCard = (index: number) => {
    const isRevealed = revealedCards.includes(index) || matchedPairs === levels[selectedLevelIndex].pairsCount || foundPairs.includes(cards[index]);
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

  const handleStartLevel = () => {
    setShowGame(true);
    setGameStarted(true);
  };

  const calculateStars = (): number => {
    if (errorsCount <= 2) {
      return 3;
    } else if (errorsCount <= 4) {
      return 2;
    } else {
      return 1;
    }
  };

  const updateLevelStats = (stars: number) => {
    const levelTimeTaken = levels[selectedLevelIndex].timeLimit - timeLeft;
    const levelStatsCopy = { ...levelStats };
    levelStatsCopy[selectedLevelIndex] = { errors: errorsCount, timeTaken: levelTimeTaken, stars: stars };
    setLevelStats(levelStatsCopy);

    const totalStarsEarned = Object.values(levelStatsCopy).reduce((acc, stat) => acc + stat.stars, 0);
    setTotalStars(totalStarsEarned);

    console.log(`Level ${selectedLevelIndex + 1} stats - Errors: ${errorsCount}, Time: ${levelTimeTaken} seconds, Stars: ${stars}`);
  };

  const handleReplayLevel = () => {
    if (selectedLevelIndex !== null) {
      const level = levels[selectedLevelIndex];
      setCards(generateCards(level.pairsCount));
      setRevealedCards([]);
      setMatchedPairs(0);
      setGameStarted(true); // Commencer le jeu immédiatement après avoir appuyé sur le bouton "Rejouer"
      setGameOver(false);
      setTimeLeft(level.timeLimit);
      setFoundPairs([]);
      setErrorsCount(0);
      setStarsEarned(0);
    }
  };

  const handleBackToMenu = () => {
    setSelectedLevelIndex(null);
    setShowGame(false);
  };

  return (
    <PageContainer>
      <Typography variant="h2" align="center" gutterBottom>
        Memory Game
      </Typography>

      {/* Content before the game starts */}
      {!showGame && (
        <div>
          <Typography variant="h5" gutterBottom>
            Choose Difficulty Level:
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {levels.map((level, index) => (
              <Grid item key={index}>
                <StyledButton
                  selected={selectedLevelIndex === index}
                  onClick={() => setSelectedLevelIndex(index)}
                >
                  {level.pairsCount} Pairs
                </StyledButton>
              </Grid>
            ))}
          </Grid>
          {selectedLevelIndex !== null && !gameStarted && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartLevel}
              sx={{
                fontWeight: 'bold',
                textTransform: 'none',
                marginTop: '20px',
              }}
            >
              Start Level
            </Button>
          )}
        </div>
      )}

      {/* During the game */}
      {showGame && (
        <div>
          <Grid container spacing={2} justifyContent="center">
            {cards.map((_, index) => renderCard(index))}
          </Grid>
          <Timer variant="h3">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Timer>
        </div>
      )}

      {/* After the game ends */}
      {matchedPairs === levels[selectedLevelIndex]?.pairsCount && (
        <Box mt={2}>
          <Typography variant="h4">
            Congratulations! You found all pairs in {levels[selectedLevelIndex].timeLimit - timeLeft} seconds with {errorsCount} errors.{' '}
            <Typography variant="h5">
              You've earned {starsEarned} stars!
            </Typography>
          </Typography>
        </Box>
      )}

      {/* Buttons during the game */}
      {gameStarted && (
        <Box mt={2}>
          <ReplayButton
            variant="contained"
            color="primary"
            onClick={handleReplayLevel}
            sx={{
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            Replay Level
          </ReplayButton>
          <BackButton
            variant="contained"
            color="primary"
            onClick={handleBackToMenu}
            sx={{
              fontWeight: 'bold',
              textTransform: 'none',
              marginLeft: '10px',
            }}
          >
            <ArrowBack />
            Back to Menu
          </BackButton>
        </Box>
      )}

      {/* Snackbar for game over */}
      <Snackbar open={gameOver} autoHideDuration={6000} onClose={() => setGameOver(false)}>
        <MuiAlert onClose={() => setGameOver(false)} severity="error">
          Game Over! You couldn't find all pairs in time with {errorsCount} errors.
        </MuiAlert>
      </Snackbar>

      {/* Total stars earned */}
      {totalStars > 0 && (
        <Box mt={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Total Stars Earned: {totalStars}
          </Typography>
          <Typography variant="h5" align="center" gutterBottom>
            Level Stats:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {Object.keys(levelStats).map((levelIndex) => (
              <Box key={levelIndex}>
                <Typography variant="h6">
                  Level {parseInt(levelIndex) + 1} - Stars: {levelStats[parseInt(levelIndex)].stars}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </PageContainer>
  );
};

export default Page;
