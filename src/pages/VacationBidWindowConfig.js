// src/pages/VacationBidWindowConfig.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Checkbox,
  Button,
  Paper
} from '@mui/material';

export default function VacationBidWindowConfig() {
  const [windows, setWindows] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [config, setConfig] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isAlwaysOpen: false,
    adHocEnabled: false
  });

  // load existing windows
  useEffect(() => {
    fetch('/api/vacation/windows')
      .then(r => r.json())
      .then(data => {
        setWindows(data);
        if (data.length) {
          const first = data[0];
          setSelectedId(first.id);
          setConfig({
            name: first.name,
            startDate: first.startDate,
            endDate: first.endDate,
            isAlwaysOpen: first.isAlwaysOpen,
            adHocEnabled: first.adHocEnabled
          });
        }
      });
  }, []);

  const onSelect = (id) => {
    const win = windows.find(w => w.id === id);
    setSelectedId(id);
    setConfig({
      name: win.name,
      startDate: win.startDate,
      endDate: win.endDate,
      isAlwaysOpen: win.isAlwaysOpen,
      adHocEnabled: win.adHocEnabled
    });
  };

  const handleChange = (field) => (e) => {
    const val = field === 'isAlwaysOpen' || field === 'adHocEnabled'
      ? e.target.checked
      : e.target.value;
    setConfig(cfg => ({ ...cfg, [field]: val }));
  };

  const handleSave = () => {
    // validation
    if (!config.isAlwaysOpen && config.endDate <= config.startDate) {
      alert('End date must be after start date');
      return;
    }
    const method = selectedId ? 'PUT' : 'POST';
    const url = selectedId
      ? `/api/vacation/windows/${selectedId}`
      : '/api/vacation/windows';
    fetch(url, {
      method,
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(config)
    })
    .then(r => r.json())
    .then(win => {
      // refresh list
      setWindows(w => {
        if (method === 'POST') return [...w, win];
        return w.map(x => x.id===win.id? win : x);
      });
      setSelectedId(win.id);
      alert('Saved successfully');
    })
    .catch(() => alert('Save failed'));
  };

  const handleLaunch = () => {
    if (!config.adHocEnabled) return;
    fetch(`/api/vacation/windows/${selectedId}/launch`, { method:'POST' })
      .then(r => {
        if (r.ok) alert('Launched!');
        else throw new Error();
      })
      .catch(() => alert('Launch failed'));
  };

  return (
    <Layout title="Vacation Bid Window Config">
      <Paper variant="outlined" sx={{ p:3, maxWidth:600 }}>
        <Typography variant="h6" gutterBottom>
          Configure Bid/Ad-Hoc Window
        </Typography>

        <FormControl fullWidth size="small" sx={{ mb:2 }}>
          <InputLabel>Existing Windows</InputLabel>
          <Select
            value={selectedId}
            label="Existing Windows"
            onChange={e => onSelect(e.target.value)}
          >
            <MenuItem value=""><em>New Window</em></MenuItem>
            {windows.map(w => (
              <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Name"
          size="small"
          fullWidth
          value={config.name}
          onChange={e => setConfig(c => ({ ...c, name: e.target.value }))}
          sx={{ mb:2 }}
        />

        <TextField
          label="Start Date"
          type="date"
          size="small"
          fullWidth
          InputLabelProps={{ shrink:true }}
          value={config.startDate}
          onChange={handleChange('startDate')}
          sx={{ mb:2 }}
          disabled={config.isAlwaysOpen}
        />

        <TextField
          label="End Date"
          type="date"
          size="small"
          fullWidth
          InputLabelProps={{ shrink:true }}
          value={config.endDate}
          onChange={handleChange('endDate')}
          sx={{ mb:2 }}
          disabled={config.isAlwaysOpen}
        />

        <FormControlLabel
          control={
            <Switch
              checked={config.isAlwaysOpen}
              onChange={handleChange('isAlwaysOpen')}
            />
          }
          label="Always Open"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={config.adHocEnabled}
              onChange={handleChange('adHocEnabled')}
            />
          }
          label="Enable Ad-Hoc Launch"
        />

        <Box sx={{ mt:3, display:'flex', gap:2 }}>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={handleLaunch}
            disabled={!config.adHocEnabled || !selectedId}
          >
            Launch Now
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
}
