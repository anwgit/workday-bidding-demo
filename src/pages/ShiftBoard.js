// src/pages/ShiftBoard.js
import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  TextField,
  MenuItem,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip
} from '@mui/material';

const departments = [
  'Police',
  'Fire',
  'Security',
  'Parking',
  'Customer Experience'
];

// Base metrics
const baseMetrics = [
  { label: 'Open Shifts',             value: 35, color: '#0052CC' },
  { label: 'Pending Bids',            value: 12, color: '#FFAB00' },
  { label: 'Shifts Assigned/Awarded', value: 78, color: '#36B37E' },
  { label: 'Closed Shifts',           value: 10, color: '#6554C0' }
];

// Compute total of all other metrics
const totalShiftsValue = baseMetrics.reduce((sum, m) => sum + m.value, 0);

// Final metrics array including the new "Total-Shifts"
const metrics = [
  ...baseMetrics,
  { label: 'Total-Shifts', value: totalShiftsValue, color: '#888888' }
];

// Shift data with new shiftType and renamed statuses
const shifts = [
  {
    id:          101,
    name:        'Night Watch',
    shiftType:   'Regular',
    date:        '2025-05-04',
    status:      'Open',
    totalBids:   5,
    assigned:    2
  },
  {
    id:          102,
    name:        'Morning Patrol',
    shiftType:   'Overtime',
    date:        '2025-05-05',
    status:      'Pending',
    totalBids:   3,
    assigned:    0
  },
  {
    id:          103,
    name:        'Weekend Cover',
    shiftType:   'Vacation',
    date:        '2025-05-07',
    status:      'Assigned',
    totalBids:   2,
    assigned:    3
  },
  {
    id:          104,
    name:        'Special Event',
    shiftType:   'Regular',
    date:        '2025-05-10',
    status:      'Closed',
    totalBids:   4,
    assigned:    4
  }
];

// Map statuses to chip colors
const statusColor = {
  Open:     'warning',
  Pending:  'secondary',
  Assigned: 'success',
  Closed:   'default'
};

export default function ShiftBoard() {
  const [fromDate,   setFromDate]   = useState('');
  const [toDate,     setToDate]     = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  return (
    <Layout title="Shift Board">
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

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((m) => (
          <Grid item xs={12} sm={6} md={3} key={m.label}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${m.color}33 0%, ${m.color}11 100%)`,
                borderRadius: 2,
                boxShadow: 3
              }}
            >
              <CardContent>
                <Typography variant="subtitle1">{m.label}</Typography>
                <Typography variant="h4">{m.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Shifts Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Shift ID</TableCell>
              <TableCell>Shift Name</TableCell>
              <TableCell>Shift Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Total Bids</TableCell>
              <TableCell align="center">Assigned Staff</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map((s) => (
              <TableRow key={s.id} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.shiftType}</TableCell>
                <TableCell>{s.date}</TableCell>
                <TableCell>
                  <Chip label={s.status} color={statusColor[s.status]} size="small" />
                </TableCell>
                <TableCell align="center">{s.totalBids}</TableCell>
                <TableCell align="center">{s.assigned}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Layout>
  );
}
