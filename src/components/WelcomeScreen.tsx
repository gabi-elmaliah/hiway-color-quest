import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomHexColor } from '../utils/color'; // utility function to generate random hex color
import { Button,Grid,Typography, Card, CardContent } from '@mui/material';
import '../styles/WelcomeScreen.css';
const COLOR_API_BASE = "https://www.thecolorapi.com/scheme";

type Palette = [string, string];
interface WelcomeScreenProps {
  onThemeSelect: (palette: Palette) => void;
}



const WelcomeScreen = ({ onThemeSelect }: WelcomeScreenProps) => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const navigate = useNavigate();

  const fetchPalettes = async () => {
    const newPalettes: Palette[] = [];
  
    for (let i = 0; i < 3; i++) {
      try {
        const randomHex = getRandomHexColor();
        const url = `${COLOR_API_BASE}?hex=${randomHex}&mode=complement&count=2`;
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error(`Color API error: ${response.status}`);
        }
  
        const data = await response.json();
        const colors = data.colors.map((c: any) => c.hex.value);

        newPalettes.push([colors[0], colors[1]]);
  
  
      } catch (error) {
        const fallbackPalette: Palette = [getRandomHexColor(), getRandomHexColor()];
        newPalettes.push(fallbackPalette);
      }
    }
  
    setPalettes(newPalettes);
  };

  useEffect(() => { 
    fetchPalettes();
  }, []);

  return (
    <Grid container spacing={2} direction="column" alignItems="center">
      {/* Title */}
    
      <Typography variant="h3" gutterBottom>
          🎨 Start Your Adventure
      </Typography>
  
        <Grid container spacing={2} justifyContent="center">
          {palettes.map((palette, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                 onClick={() => {
                  onThemeSelect(palette);
                  navigate('/game'); 
                }}
                className="palette-card"
                style={{
                  background: `linear-gradient(to right, ${palette[0]} 50%, ${palette[1]} 50%)`,
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="white">
                    Theme {index + 1}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
  
      {/* Button */}
      <Grid item >
        <Button
          variant="contained"
          onClick={fetchPalettes}
        >
          🔄 Summon Fresh Palettes
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          className="hall-of-heroes-button"
          onClick={() => navigate('/hall-of-heroes')}
          sx={{ mt: 2 }}
        >
          🏆 View Hall of Heroes
        </Button>
      </Grid>
    </Grid>
  );
};

export default WelcomeScreen;
