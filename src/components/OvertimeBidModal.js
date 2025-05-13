import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, LinearProgress, Box
} from '@mui/material';
// import useWebSocket from './useWebSocket'  // your WebSocket hook

export default function OvertimeBidModal({ eventDetails, criteriaWeights, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!open) return;
    // subscribe to queue position updates
    // const ws = useWebSocket(`/ws/ot-queue/${eventDetails.id}`, msg => setPosition(msg.position));
    // return () => ws.close();
  }, [open, eventDetails]);

  const submitOTBid = () => {
    setLoading(true);
    fetch(`/api/ot-bid`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ eventId: eventDetails.id })
    })
    .then(() => setLoading(false));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Bid for OT on {eventDetails.date}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1">Ranking Breakdown:</Typography>
        {criteriaWeights.map(c => (
          <Box key={c.label} sx={{ mt:1 }}>
            <Typography>{c.label}: {c.weight * 100}%</Typography>
            <LinearProgress variant="determinate" value={c.weight * 100} />
          </Box>
        ))}
        {position != null && (
          <Typography sx={{ mt:2 }}>
            Your queue position: <strong>{position}</strong>
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={submitOTBid}
          disabled={loading}
        >
          {loading ? 'Submitting…' : 'Confirm Bid'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
