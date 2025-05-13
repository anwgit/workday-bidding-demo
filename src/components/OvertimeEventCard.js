import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Chip } from '@mui/material';

export default function OvertimeEventCard({ event, optedIn, onToggleOptIn, onBid }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">{new Date(event.date).toLocaleDateString()}</Typography>
        <Typography color="textSecondary">{event.time} – {event.reason}</Typography>
        <Chip
          label={event.status}
          size="small"
          color={event.status === 'Open' ? 'success' : 'default'}
          sx={{ mt:1 }}
        />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onToggleOptIn}>
          {optedIn ? 'Opt-Out' : 'Opt-In'}
        </Button>
        <Button size="small" variant="contained" onClick={onBid} disabled={!optedIn}>
          Bid
        </Button>
      </CardActions>
    </Card>
  );
}
