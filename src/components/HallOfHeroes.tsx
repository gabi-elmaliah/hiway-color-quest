import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid,Button, Card, CardContent, Typography, Container } from '@mui/material';
import { loadHallOfHeroes } from '../utils/hallOfHeroes';
import '../styles/HallOfHeroes.css'; 


const HallOfHeroes = () => {
  const heroes = loadHallOfHeroes();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md"  className="hall-container">
      <Typography variant="h3" align="center" className="hall-title">
        🏆 Hall of Heroes
      </Typography>

      {heroes.length === 0 ? (
        <Typography variant="h6" align="center" className="no-heroes-text">
          No heroes yet. Be the first to inscribe your name!
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {heroes.map((hero, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className="hero-card">
                <CardContent>
                  <Typography variant="h5" className="hero-name">
                    #{index + 1} – {hero.name || '???'}
                  </Typography>
                  <Typography variant="body1" className="hero-stat">
                    🎯 Player Moves: <strong>{hero.playerMoves}</strong>
                  </Typography>
                  <Typography variant="body1" className="hero-stat">
                    🌍 Env Moves: <strong>{hero.envMoves}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
           Back to Home Screen
        </Button>
      </Box>
    </Container>
  );
};

export default HallOfHeroes;
