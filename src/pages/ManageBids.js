// src/pages/ManageBids.js
import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  TextField,
  MenuItem,
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button
} from '@mui/material';

const departments = [
  'Police',
  'Fire',
  'Security',
  'Parking',
  'Customer Experience'
];

const bids = [
  { id: 1, shift: 'Night Watch',    date: '2025-05-04', status: 'Open',    totalBids: 5 },
  { id: 2, shift: 'Morning Patrol', date: '2025-05-05', status: 'Awarded', totalBids: 3 },
  { id: 3, shift: 'Weekend Cover',  date: '2025-05-07', status: 'Closed',  totalBids: 8 }
];

export default function ManageBids() {
  const [fromDate,   setFromDate]   = useState('');
  const [toDate,     setToDate]     = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  return (
    <Layout title="Manage Bids">
      {/* Date Range & Dept Filter */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <TextField
          label="From"
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To"
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Filter by Dept"
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {departments.map(d => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">All Bids</Typography>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Bid ID</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Total Bids</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids.map(b => (
              <TableRow key={b.id} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{b.id}</TableCell>
                <TableCell>{b.shift}</TableCell>
                <TableCell>{b.date}</TableCell>
                <TableCell>
                  <Chip
                    label={b.status}
                    color={
                      b.status === 'Open' ? 'warning' :
                      b.status === 'Awarded' ? 'success' :
                      'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">{b.totalBids}</TableCell>
                <TableCell align="right">
                  <Button size="small" variant="contained">
                    {b.status === 'Open' ? 'Bid' : 'View'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Layout>
  );
}
