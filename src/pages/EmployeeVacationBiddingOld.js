// src/pages/EmployeeVacationBidding.js
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

// use the Pangea fork instead of react-beautiful-dnd
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';



// Mock API
const fetchBuckets = async () => [
  {
    id: '1',
    name: 'Spring Break',
    dateRange: '03/20 - 03/27',
    slots: 10,
    status: 'Open',
    description: 'Spring break vacation bucket.',
    capacity: 10,
    eligibility: 'All full-time employees',
    availableDays: ['2025-03-20','2025-03-21','2025-03-22']
  },
  {
    id: '2',
    name: 'Summer Vacation',
    dateRange: '06/01 - 08/31',
    slots: 25,
    status: 'Open',
    description: 'Summer long vacation.',
    capacity: 25,
    eligibility: 'All employees',
    availableDays: ['2025-06-01','2025-06-02','2025-06-03']
  }
];

export default function EmployeeVacationBidding() {
  const [buckets, setBuckets] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [hasSubmission, setHasSubmission] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchBuckets();
      setBuckets(data);
      setPreferences(data.map(b => b.id));
    })();
  }, []);

  const onDragEnd = result => {
    if (!result.destination) return;
    const items = Array.from(preferences);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setPreferences(items);
    setIsDirty(true);
  };

  const handleRowClick = id => {
    setSelectedBucket(buckets.find(b => b.id === id));
  };

  const handleSubmit = () => {
    console.log('Submitting preferences:', preferences);
    setHasSubmission(true);
    setIsDirty(false);
  };

  const handleWithdraw = () => {
    console.log('Withdrawing preferences');
    setHasSubmission(false);
  };

  return (
    <Layout title="Employee Vacation Bidding">
      <Grid container spacing={2}>
        {/* Buckets Table */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Bucket Name</TableCell>
                  <TableCell>Date Range</TableCell>
                  <TableCell>Slots</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buckets.map(b => (
                  <TableRow
                    key={b.id}
                    hover
                    selected={selectedBucket?.id === b.id}
                    onClick={() => handleRowClick(b.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{b.name}</TableCell>
                    <TableCell>{b.dateRange}</TableCell>
                    <TableCell>{b.slots}</TableCell>
                    <TableCell>{b.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Details, Calendar & Drag-N-Drop */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            {selectedBucket ? (
              <>
                <Typography variant="h6">{selectedBucket.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedBucket.description}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">
                    Capacity: {selectedBucket.capacity}
                  </Typography>
                  <Typography variant="subtitle2">
                    Eligibility: {selectedBucket.eligibility}
                  </Typography>
                </Box>
                <Calendar
                  value={selectedBucket.availableDays.map(d => new Date(d))}
                  tileDisabled={({ date }) =>
                    !selectedBucket.availableDays.includes(date.toISOString().split('T')[0])
                  }
                />
              </>
            ) : (
              <Typography>Select a bucket to view details</Typography>
            )}
          </Paper>

          {selectedBucket && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Preference Ranking
              </Typography>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="prefs">
                  {provided => (
                    <List
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{ mb: 2 }}
                    >
                      {preferences.map((id, idx) => {
                        const b = buckets.find(x => x.id === id);
                        return (
                          <Draggable key={id} draggableId={id} index={idx}>
                            {prov => (
                              <ListItem
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                sx={{
                                  border: '1px solid #ddd',
                                  borderRadius: 1,
                                  mb: 1
                                }}
                              >
                                <ListItemText primary={`${idx + 1}. ${b.name}`} />
                              </ListItem>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </List>
                  )}
                </Droppable>
              </DragDropContext>

              <Typography
                variant="body2"
                color={isDirty ? 'warning.main' : 'success.main'}
                sx={{ mb: 1 }}
              >
                {isDirty ? 'Unsaved Changes' : 'Preferences Saved'}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={handleSubmit} disabled={!isDirty}>
                  Submit Preferences
                </Button>
                <Button variant="outlined" onClick={handleWithdraw} disabled={!hasSubmission}>
                  Withdraw Preferences
                </Button>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}
