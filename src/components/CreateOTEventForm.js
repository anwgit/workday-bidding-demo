import React, { useState } from 'react';
import {
  Box, TextField, Button, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';

const reasonCodes = ['Coverage', 'Call-Out', 'Special Event'];

export default function CreateOTEventForm({ onCreated }) {
  const [form, setForm] = useState({
    date: '', time: '', reason: reasonCodes[0]
  });

  const handleChange = f => e => setForm(c => ({ ...c, [f]: e.target.value }));

  const handleSubmit = () => {
    fetch('/api/ot-events', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    })
    .then(r=>r.json())
    .then(evt => {
      onCreated(evt);
      setForm({ date:'', time:'', reason: reasonCodes[0] });
    });
  };

  return (
    <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
      <TextField
        label="Date" type="date" size="small"
        InputLabelProps={{ shrink:true }}
        value={form.date} onChange={handleChange('date')}
      />
      <TextField
        label="Time" type="time" size="small"
        InputLabelProps={{ shrink:true }}
        value={form.time} onChange={handleChange('time')}
      />
      <FormControl size="small">
        <InputLabel>Reason</InputLabel>
        <Select
          label="Reason"
          value={form.reason}
          onChange={handleChange('reason')}
        >
          {reasonCodes.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleSubmit}>Create Event</Button>
    </Box>
  );
}
