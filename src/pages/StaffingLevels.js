// src/pages/StaffingLevels.js
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
  Button
} from '@mui/material';

const departments = [
  'Police',
  'Fire',
  'Security',
  'Parking',
  'Customer Experience'
];

const staffingData = [
  {
    id: 1,
    department:     'ICO (Call Center Operations)',
    position:       'Operator',
    shift:          'Night (8p-8a)',
    dayType:        'Weekday',
    minStaff:       5,
    availableStaff: 6,
    surplusDeficit: +1
  },
  {
    id: 2,
    department:     'ICO (Call Center Operations)',
    position:       'Operator',
    shift:          'Night (8p-8a)',
    dayType:        'Weekend',
    minStaff:       7,
    availableStaff: 5,
    surplusDeficit: -2
  }
];

export default function StaffingLevels() {
  const [fromDate,   setFromDate]   = useState('');
  const [toDate,     setToDate]     = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  return (
    <Layout title="Staffing Levels – (Staffing Levels for OT and Vacations.)">
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
        <Typography variant="h6">Current Staffing Levels</Typography>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Department</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Day Type</TableCell>
              <TableCell align="center">Min Staff Level</TableCell>
              <TableCell align="center">Available Staff</TableCell>
              <TableCell align="center">Surplus/Deficit</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffingData.map(row => (
              <TableRow key={row.id} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell>{row.shift}</TableCell>
                <TableCell>{row.dayType}</TableCell>
                <TableCell align="center">{row.minStaff}</TableCell>
                <TableCell align="center">{row.availableStaff}</TableCell>
                <TableCell
                  align="center"
                  sx={{ color: row.surplusDeficit >= 0 ? 'green' : 'red', fontWeight: 'bold' }}
                >
                  {row.surplusDeficit >= 0 && '+'}{row.surplusDeficit}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color={row.surplusDeficit >= 0 ? 'success' : 'error'}
                  >
                    {row.surplusDeficit >= 0
                      ? 'Create Vacation Shifts'
                      : 'Create OT Shift'}
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
