import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Container } from '@mui/material';
import { loadHallOfHeroes } from '../utils/hallOfHeroes';


const HallOfHeroes = () => {
  const heroes = loadHallOfHeroes();

  return (
    <Container maxWidth="md" className="hall-container">
      <Typography variant="h3" align="center" className="hall-title">
        🏆 Hall of Heroes
      </Typography>

      {heroes.length === 0 ? (
        <Typography variant="h6" align="center" className="no-heroes-text">
          No heroes yet. Be the first to inscribe your name!
        </Typography>
      ) : (
        <Grid container spacing={3}>
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
    </Container>
  );
};

export default HallOfHeroes;
