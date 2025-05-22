// src/pages/ShiftBidWindows.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Button,
  TextField,
  Switch,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';

export default function ShiftBidWindows() {
  const [windows, setWindows] = useState([]);
  const [sel, setSel] = useState('');
  const [cfg, setCfg] = useState({
    id: null,
    name: '',
    biddingStartDate: '2024-12-01',
    biddingEndDate:   '2024-12-31',
    scheduleStartDate:'2025-01-01',
    scheduleEndDate:  '2025-06-30',
    isAlwaysOpen:     false,
    adHocEnabled:     false
  });

  useEffect(() => {
    // TODO: replace stub with GET /api/bid-windows
    const w = [
      {
        id: 1,
        name: 'Cycle A',
        biddingStartDate: '2024-12-01',
        biddingEndDate:   '2024-12-31',
        scheduleStartDate:'2025-01-01',
        scheduleEndDate:  '2025-06-30',
        isAlwaysOpen:     false,
        adHocEnabled:     true
      }
    ];
    setWindows(w);
    setSel(w[0].id);
    setCfg(w[0]);
  }, []);

  const save = () => {
    // TODO: POST / PUT cfg
    console.log('Save window config', cfg);
  };
  const launch = () => {
    // TODO: POST /api/vacation/windows/{id}/launch
    console.log('Launch now', cfg.id);
  };

  return (
    <Layout title="Bid Window Mgmt">
      {/* Existing Windows selector */}
      <FormControl size="small" sx={{ mb: 2, minWidth: 300 }}>
        <InputLabel>Existing Windows</InputLabel>
        <Select
          value={sel}
          label="Existing Windows"
          onChange={e => {
            const id = e.target.value;
            setSel(id);
            setCfg(windows.find(w => w.id === id) || cfg);
          }}
        >
          <MenuItem value=""><em>New</em></MenuItem>
          {windows.map(w => (
            <MenuItem key={w.id} value={w.id}>
              {w.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Configuration Form */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        {/* Window Name */}
        <TextField
          fullWidth
          size="small"
          label="Name"
          value={cfg.name}
          onChange={e => setCfg({ ...cfg, name: e.target.value })}
          sx={{ mb: 2 }}
        />

        {/* Bidding Window Date Range */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            size="small"
            label="Bidding Window Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={cfg.biddingStartDate}
            onChange={e => setCfg({ ...cfg, biddingStartDate: e.target.value })}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Bidding Window End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={cfg.biddingEndDate}
            onChange={e => setCfg({ ...cfg, biddingEndDate: e.target.value })}
            sx={{ flex: 1 }}
          />
        </Box>

        {/* Schedule Shift Date Range */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            size="small"
            label="Schedule Shift Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={cfg.scheduleStartDate}
            onChange={e => setCfg({ ...cfg, scheduleStartDate: e.target.value })}
            sx={{ flex: 1 }}
            disabled={cfg.isAlwaysOpen}
          />
          <TextField
            size="small"
            label="Schedule Shift End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={cfg.scheduleEndDate}
            onChange={e => setCfg({ ...cfg, scheduleEndDate: e.target.value })}
            sx={{ flex: 1 }}
            disabled={cfg.isAlwaysOpen}
          />
        </Box>

        {/* Always Open & Ad-Hoc */}
        <FormControlLabel
          control={
            <Switch
              checked={cfg.isAlwaysOpen}
              onChange={e => setCfg({ ...cfg, isAlwaysOpen: e.target.checked })}
            />
          }
          label="Always Open"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={cfg.adHocEnabled}
              onChange={e => setCfg({ ...cfg, adHocEnabled: e.target.checked })}
            />
          }
          label="Enable Ad-Hoc Launch"
        />

        {/* Actions */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={launch}
            disabled={!cfg.adHocEnabled}
          >
            Launch Now
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
}
