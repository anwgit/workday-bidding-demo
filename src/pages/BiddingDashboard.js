import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Box, Grid, Typography } from '@mui/material';
import OvertimeEventCard from '../components/OvertimeEventCard';
import OvertimeBidModal  from '../components/OvertimeBidModal';

export default function OvertimeDashboard() {
  const [otEvents, setOtEvents]           = useState([]);
  const [selectedEventId, setSelectedId]  = useState(null);
  const [optInStatus, setOptInStatus]     = useState({});

  useEffect(() => {
    fetch('/api/ot-events')
      .then(r => r.json())
      .then(setOtEvents);
  }, []);

  const toggleOptInOT = (eventId) => {
    // toggle local & POST to API
    setOptInStatus(s => ({ ...s, [eventId]: !s[eventId] }));
    fetch(`/api/ot-events/${eventId}/opt-in`, { method: 'POST' });
  };

  const selectOTEvent = (eventId) => {
    setSelectedId(eventId);
  };

  return (
    <Layout title="Overtime Dashboard">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Available OT Events</Typography>
      </Box>
      <Grid container spacing={2}>
        {otEvents.map(evt => (
          <Grid item xs={12} sm={6} md={4} key={evt.id}>
            <OvertimeEventCard
              event={evt}
              optedIn={!!optInStatus[evt.id]}
              onToggleOptIn={() => toggleOptInOT(evt.id)}
              onBid={() => selectOTEvent(evt.id)}
            />
          </Grid>
        ))}
      </Grid>

      {selectedEventId != null && (
        <OvertimeBidModal
          eventDetails={otEvents.find(e => e.id === selectedEventId)}
          criteriaWeights={[
            { label: 'Proximity', weight: 0.4 },
            { label: 'Seniority', weight: 0.3 },
            { label: 'Least OT', weight: 0.3 }
          ]}
          open={true}
          onClose={() => setSelectedId(null)}
        />
      )}
    </Layout>
);
}
