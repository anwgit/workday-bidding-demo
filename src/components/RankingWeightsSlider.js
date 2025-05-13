import React from 'react';
import { Box, Typography, Slider } from '@mui/material';

export default function RankingWeightsSlider({ weights, onChange }) {
  const handleSlider = key => (_, value) => {
    onChange({ ...weights, [key]: value / 100 });
  };

  return (
    <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
      {Object.entries(weights).map(([key, val]) => (
        <Box key={key}>
          <Typography gutterBottom>
            {key.charAt(0).toUpperCase() + key.slice(1)}: {(val*100).toFixed()}%
          </Typography>
          <Slider
            value={val*100}
            onChange={handleSlider(key)}
            step={5}
            min={0}
            max={100}
            valueLabelDisplay="auto"
          />
        </Box>
      ))}
    </Box>
  );
}
