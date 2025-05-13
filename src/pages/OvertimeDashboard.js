import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Box, Grid, Typography } from '@mui/material';
import OvertimeEventCard from '../components/OvertimeEventCard';
import OvertimeBidModal from '../components/OvertimeBidModal';

export default function OvertimeDashboard() {
  const [otEvents, setOtEvents] = useState([]);
  const [selectedEventId, setSelectedId] = useState(null);
  const [optInStatus, setOptInStatus] = useState({});

  // Replace API call with hardcoded demo data
  useEffect(() => {
    setOtEvents([
      {
        id: 1,
        date: '2025-05-20',
        time: '8:00 AM – 4:00 PM',
        reason: 'Staff Shortage',
        status: 'Open'
      },
      {
        id: 2,
        date: '2025-05-22',
        time: '4:00 PM – 12:00 AM',
        reason: 'Event Coverage',
        status: 'Open'
      },
      {
        id: 3,
        date: '2025-05-25',
        time: '12:00 AM – 8:00 AM',
        reason: 'Emergency Shift',
        status: 'Closed'
      }
    ]);
  }, []);

  const toggleOptInOT = (eventId) => {
    setOptInStatus(s => ({ ...s, [eventId]: !s[eventId] }));
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
