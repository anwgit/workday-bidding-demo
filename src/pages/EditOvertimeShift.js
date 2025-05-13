// src/pages/EditOvertimeShift.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';

// sample data to prefill when editing
const sampleOvertimeShifts = [
  {
    id:        201,
    title:     'Night Terminal B4 #7',
    start:     '2025-06-18T00:00',
    end:       '2025-06-18T04:00',
    createdBy: 'Auto (Min Staff Rule)'
  },
  {
    id:        202,
    title:     'Downtown Patrol Overtime',
    start:     '2025-06-19T16:00',
    end:       '2025-06-19T20:00',
    createdBy: 'Manual'
  }
  // ...etc
];

const CREATED_BY_OPTIONS = [
  'Scheduled',
  'Manual',
  'Auto (Min Staff Rule)'
];

export default function EditOvertimeShift() {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get('id');
  const existing = sampleOvertimeShifts.find(s => String(s.id) === idParam);

  const [id, setId]           = useState('');
  const [title, setTitle]     = useState('');
  const [start, setStart]     = useState('');
  const [end, setEnd]         = useState('');
  const [duration, setDuration] = useState('');
  const [createdBy, setCreatedBy] = useState('Manual');

  // load existing if present
  useEffect(() => {
    if (existing) {
      setId(existing.id);
      setTitle(existing.title);
      setStart(existing.start);
      setEnd(existing.end);
      setCreatedBy(existing.createdBy);
    }
  }, [existing]);

  // recalc duration on start/end change
  useEffect(() => {
    if (start && end) {
      const ms = new Date(end) - new Date(start);
      const hrs = ms / 1000 / 3600;
      setDuration(hrs > 0 ? `${hrs}h` : '');
    }
  }, [start, end]);

  const handleSave = () => {
    const shift = { id, title, start, end, duration, createdBy };
    console.log('Saving shift:', shift);
    // TODO: call API or update state
  };

  return (
    <Layout title={existing ? 'Edit Overtime Shift' : 'Create Overtime Shift'}>
      <Box sx={{ maxWidth: 600, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {existing ? 'Edit Shift' : 'Create New Shift'}
        </Typography>

        <TextField
          fullWidth
          label="Shift Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Start"
          type="datetime-local"
          value={start}
          onChange={e => setStart(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="End"
          type="datetime-local"
          value={end}
          onChange={e => setEnd(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Duration"
          value={duration}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Created By</InputLabel>
          <Select
            value={createdBy}
            label="Created By"
            onChange={e => setCreatedBy(e.target.value)}
          >
            {CREATED_BY_OPTIONS.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" href="/overtime-shifts-view">
            Cancel
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}
