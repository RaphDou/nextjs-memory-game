import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, useTheme, styled, Snackbar, Box, Tooltip, Grid } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Card from '../components/card/card';
import GameControls from '../components/gameControls/gameControls';
import GameStats from '../components/gameStats/gameStats';
import { Button } from '@mui/material';

// Styled components for customizing Material-UI components
const PageContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: theme.palette.background.default,
}));

// Define levels of the game with their properties
const levels = [
  {
    name: 'Beginner',
    description: 'A simple level for beginners. Match 4 pairs within 60 seconds with a maximum of 3 errors.',
    pairsCount: 4,
    timeLimit: 60,
    maxErrors: 3,
    background: '#CFF09E',
  },
  {
    name: 'Intermediate',
    description: 'An intermediate level for those looking for a challenge. Match 6 pairs within 90 seconds with a maximum of 4 errors.',
    pairsCount: 6,
    timeLimit: 90,
    maxErrors: 4,
    background: '#FEB95F',
  },
  {
    name: 'Advanced',
    description: 'An advanced level for experts. Match 8 pairs within 120 seconds with a maximum of 5 errors.',
    pairsCount: 8,
    timeLimit: 120,
    maxErrors: 5,
    background: '#FF6F61',
  },
];

// Main component for the memory game page
const Page: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();

  // State variables for managing game state
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

  // Effect to initialize level when selected level index changes
  useEffect(() => {
    if (selectedLevelIndex !== null) {
      initializeLevel();
    }
  }, [selectedLevelIndex]);

  // Initialize level based on selected level index
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

  // Generate shuffled pairs of cards for the level
  const generateCards = (pairsCount: number): number[] => {
    const pairs = [];
    for (let i = 1; i <= pairsCount; i++) {
      pairs.push(i, i);
    }
    pairs.sort(() => Math.random() - 0.5);
    return pairs;
  };

  // Effect to update timer during the game
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

  // Handle card click event
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

  // Render individual card based on its index
  const renderCard = (index: number) => {
    const isRevealed = revealedCards.includes(index) || matchedPairs === levels[selectedLevelIndex].pairsCount || foundPairs.includes(cards[index]);
    const isClickable = !isRevealed && revealedCards.length < 2;

    return (
      <Grid item xs={3} key={index}>
        <Card
          value={cards[index]}
          isRevealed={isRevealed}
          isClickable={isClickable}
          onClick={() => isClickable && handleCardClick(index)}
        />
      </Grid>
    );
  };

  // Handle start level button click
  const handleStartLevel = () => {
    setShowGame(true);
    setGameStarted(true);
  };

  // Calculate stars earned based on errors count
  const calculateStars = (): number => {
    if (errorsCount <= 2) {
      return 3;
    } else if (errorsCount <= 4) {
      return 2;
    } else {
      return 1;
    }
  };

  // Update level statistics after completing the level
  const updateLevelStats = (stars: number) => {
    const levelTimeTaken = levels[selectedLevelIndex].timeLimit - timeLeft;
    const levelStatsCopy = { ...levelStats };
    levelStatsCopy[selectedLevelIndex] = { errors: errorsCount, timeTaken: levelTimeTaken, stars: stars };
    setLevelStats(levelStatsCopy);

    const totalStarsEarned = Object.values(levelStatsCopy).reduce((acc, stat) => acc + stat.stars, 0);
    setTotalStars(totalStarsEarned);

    console.log(`Level ${selectedLevelIndex + 1} stats - Errors: ${errorsCount}, Time: ${levelTimeTaken} seconds, Stars: ${stars}`);
  };

  // Handle replay level button click
  const handleReplayLevel = () => {
    if (selectedLevelIndex !== null) {
      const level = levels[selectedLevelIndex];
      setCards(generateCards(level.pairsCount));
      setRevealedCards([]);
      setMatchedPairs(0);
      setGameStarted(true); // Start the game immediately upon clicking "Replay"
      setGameOver(false);
      setTimeLeft(level.timeLimit);
      setFoundPairs([]);
      setErrorsCount(0);
      setStarsEarned(0);
    }
  };

  // Handle back to menu button click
  const handleBackToMenu = () => {
    setSelectedLevelIndex(null);
    setShowGame(false);
  };

  return (
    <PageContainer style={{ background: selectedLevelIndex !== null ? levels[selectedLevelIndex].background : theme.palette.background.default }}>
      <Typography variant="h2" align="center" gutterBottom style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
        Memory Game
      </Typography>

      {/* Content before the game starts */}
      {!showGame && (
        <div>
          <Typography variant="h5" gutterBottom style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
            Choose Difficulty Level:
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {levels.map((level, index) => (
              <Grid item key={index}>
                <Tooltip title={level.description} arrow>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSelectedLevelIndex(index)}
                    style={{ fontWeight: 'bold', textTransform: 'none', fontFamily: 'Arial, sans-serif' }}
                  >
                    {level.name}
                  </Button>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
          {selectedLevelIndex !== null && !gameStarted && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartLevel}
              sx={{ fontWeight: 'bold', textTransform: 'none', marginTop: '20px', fontFamily: 'Arial, sans-serif' }}
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
          <Typography variant="h3" style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </Typography>
        </div>
      )}

      {/* After the game ends */}
      {matchedPairs === levels[selectedLevelIndex]?.pairsCount && (
        <Box mt={2}>
          <Typography variant="h4" style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
            Congratulations! You found all pairs in {levels[selectedLevelIndex].timeLimit - timeLeft} seconds with {errorsCount} errors.
          </Typography>
          <Typography variant="h5" style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
            You've earned {starsEarned} stars!
          </Typography>
        </Box>
      )}

      {/* Buttons during the game */}
      {gameStarted && (
        <GameControls onReplay={handleReplayLevel} onBackToMenu={handleBackToMenu} />
      )}

      {/* Snackbar for game over */}
      <Snackbar open={gameOver} autoHideDuration={6000} onClose={() => setGameOver(false)}>
        <MuiAlert onClose={() => setGameOver(false)} severity="error">
          Game Over! You couldn't find all pairs in time with {errorsCount} errors.
        </MuiAlert>
      </Snackbar>

      {/* Total stars earned */}
      {totalStars > 0 && (
        <GameStats totalStars={totalStars} levelStats={levelStats} />
      )}
    </PageContainer>
  );
};

export default Page;
