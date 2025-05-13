import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Box, Typography, Divider, Paper } from '@mui/material';
import CreateOTEventForm    from '../components/CreateOTEventForm';
import RankingWeightsSlider from '../components/RankingWeightsSlider';
import BidQueueTable        from '../components/BidQueueTable';

export default function OvertimeAdminConsole() {
  const [otEvents, setOtEvents]     = useState([]);
  const [weights, setWeights]       = useState({
    proximity: 0.4,
    seniority: 0.3,
    leastOt:   0.3
  });


    useEffect(() => {
  fetch('/api/ot-events')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Server responded ${res.status}: ${res.statusText}`);
      }
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        return res.text().then(text => {
          console.error('Expected JSON but got:', text);
          throw new Error('Server did not return JSON');
        });
      }
      return res.json();
    })
    .then(data => {
      setOtEvents(data);
    })
    .catch(err => {
      console.error('Failed to load OT events:', err);
      // Optionally surface a user‐friendly message here
    });
}, []);


  const handleWeightsChange = (newWeights) => {
    setWeights(newWeights);
    // PUT /api/ot-config/weights
    fetch('/api/ot-config/weights', {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(newWeights)
    });
  };

  return (
    <Layout title="OT Admin Console">
      <Box sx={{ display:'flex', gap:3, flexWrap:'wrap' }}>
        <Paper sx={{ p:2, flex:'1 1 300px' }} variant="outlined">
          <Typography variant="h6">Create OT Event</Typography>
          <CreateOTEventForm onCreated={evt=> setOtEvents(es => [...es,evt])} />
        </Paper>

        <Paper sx={{ p:2, flex:'1 1 300px' }} variant="outlined">
          <Typography variant="h6">Ranking Weights</Typography>
          <RankingWeightsSlider weights={weights} onChange={handleWeightsChange} />
        </Paper>
      </Box>

      <Divider sx={{ my:3 }} />

      <Typography variant="h6" gutterBottom>Bid Queue</Typography>
      <BidQueueTable otEvents={otEvents} weights={weights} />
    </Layout>
  );
}
