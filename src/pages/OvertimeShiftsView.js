// src/pages/OvertimeShiftsView.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const departments = [
  'Police',
  'Fire',
  'Security',
  'Parking',
  'Customer Experience'
];

const sampleOvertimeShifts = [
  {
    id:        201,
    title:     'Night Terminal B4 #7',
    start:     '2025-06-18 00:00',
    end:       '2025-06-18 04:00',
    duration:  '4h',
    createdBy: 'Auto (Min Staff Rule)'
  },
  {
    id:        202,
    title:     'Downtown Patrol Overtime',
    start:     '2025-06-19 16:00',
    end:       '2025-06-19 20:00',
    duration:  '4h',
    createdBy: 'Manual'
  },
  {
    id:        203,
    title:     'Weekend Special Event',
    start:     '2025-06-21 10:00',
    end:       '2025-06-21 18:00',
    duration:  '8h',
    createdBy: 'Manual'
  },
  {
    id:        204,
    title:     'Holiday Coverage',
    start:     '2025-07-04 00:00',
    end:       '2025-07-04 12:00',
    duration:  '12h',
    createdBy: 'Scheduled'
  }
];

export default function OvertimeShiftsView() {
  const [org, setOrg]             = useState('');
  const [fromDate, setFromDate]   = useState('');
  const [toDate, setToDate]       = useState('');
  const [shifts, setShifts]       = useState(sampleOvertimeShifts);

  // initialize date range: today → two months ahead
  useEffect(() => {
    const today = new Date();
    const twoMonths = new Date();
    twoMonths.setMonth(today.getMonth() + 2);

    const fmt = d => {
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${d.getFullYear()}-${mm}-${dd}`;
    };

    setFromDate(fmt(today));
    setToDate(fmt(twoMonths));
  }, []);

  const handleGetShifts = () => {
    // TODO: call API to get open OT shifts from Workday
    console.log('Get OpenShifts from WD:', { org, fromDate, toDate });
    // e.g. setShifts(fetchedData);
  };

  const handleImport = () => {
    console.log('Import from Excel Sheet');
  };
  const handleExport = () => {
    console.log('Export current list');
  };
  const handlePush = () => {
    console.log('Push to Workday');
  };

  return (
    <Layout title="Overtime Shifts">
      {/* Header controls */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          mb: 3
        }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Supervisory Org</InputLabel>
          <Select
            value={org}
            label="Supervisory Org"
            onChange={e => setOrg(e.target.value)}
          >
            {departments.map(d => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="From"
          type="date"
          size="small"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Button variant="contained" onClick={handleGetShifts}>
          Get OpenShifts from WD
        </Button>
        <Button variant="contained" onClick={handleImport}>
          Import from Excel Sheet
        </Button>
        <Button variant="contained" onClick={handleExport}>
          Export
        </Button>
        <Button variant="contained" onClick={handlePush}>
          Push to Workday
        </Button>
      </Box>

      {/* Data table */}
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Shift ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell align="center">Duration</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map(shift => (
              <TableRow
                key={shift.id}
                sx={{ '&:hover': { background: '#EEF5FF' } }}
              >
                <TableCell>{shift.id}</TableCell>
                <TableCell>{shift.title}</TableCell>
                <TableCell>{shift.start}</TableCell>
                <TableCell>{shift.end}</TableCell>
                <TableCell align="center">{shift.duration}</TableCell>
                <TableCell>{shift.createdBy}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    href={`/overtime-shifts-edit?id=${shift.id}`}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {shifts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    No overtime shifts found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Layout>
  );
}
