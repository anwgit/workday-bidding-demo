// src/pages/ShiftIngestion.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';

export default function ShiftIngestion() {
  // Mock data for demonstration
  const mockShifts = [
    {
      Shift_Reference: [{ ID: [{ _: '100501' }] }],
      Shift_Name: ['Night Watch'],
      Shift_Start_DateTime: ['2025-06-18 20:00'],
      Shift_End_DateTime: ['2025-06-19 08:00'],
      Supervisory_Organization_Reference: [{ Name: ['Police – West'] }],
      Worker_Reference: null,
      Position_Reference: [{ Name: ['Officer RN'] }],
      Work_Location_Reference: [{ Name: ['Terminal B4'] }]
    },
    {
      Shift_Reference: [{ ID: [{ _: '100502' }] }],
      Shift_Name: ['Day Patrol'],
      Shift_Start_DateTime: ['2025-06-19 08:00'],
      Shift_End_DateTime: ['2025-06-19 16:00'],
      Supervisory_Organization_Reference: [{ Name: ['Police – West'] }],
      Worker_Reference: [{ Name: ['Doe, John'] }],
      Position_Reference: [{ Name: ['Officer RN'] }],
      Work_Location_Reference: [{ Name: ['Terminal B4'] }]
    },
    {
      Shift_Reference: [{ ID: [{ _: '100503' }] }],
      Shift_Name: ['Event Coverage'],
      Shift_Start_DateTime: ['2025-06-21 10:00'],
      Shift_End_DateTime: ['2025-06-21 18:00'],
      Supervisory_Organization_Reference: [{ Name: ['Parking'] }],
      Worker_Reference: [{ Name: ['Smith, Alice'] }],
      Position_Reference: [{ Name: ['Parking Attd.'] }],
      Work_Location_Reference: [{ Name: ['Parking Lot'] }]
    },
    {
      Shift_Reference: [{ ID: [{ _: '100504' }] }],
      Shift_Name: ['Holiday Coverage'],
      Shift_Start_DateTime: ['2025-07-04 00:00'],
      Shift_End_DateTime: ['2025-07-04 12:00'],
      Supervisory_Organization_Reference: [{ Name: ['Security'] }],
      Worker_Reference: null,
      Position_Reference: [{ Name: ['Sec Officer'] }],
      Work_Location_Reference: [{ Name: ['Main Gate'] }]
    }
  ];

  // State for grid data
  const [shifts, setShifts] = useState(mockShifts);

  // Filter state
  const [from, setFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [to, setTo]     = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().slice(0, 10);
  });
  const [orgs, setOrgs]   = useState([]);
  const [orgId, setOrgId] = useState('');

  // Load supervisory orgs (mock)
  useEffect(() => {
    const list = [
      { id: 'POLICE_WEST', name: 'Police – West' },
      { id: 'PARKING',     name: 'Parking' },
      { id: 'SECURITY',    name: 'Security' }
    ];
    setOrgs(list);
    setOrgId(list[0].id);
  }, []);

  // Stubbed fetch function; later connect to Extend REST endpoint
  const fetchShifts = async () => {
    // Example when real endpoint is ready:
    // const resp = await fetch(`/api/shifts?from=${from}&to=${to}&orgId=${orgId}`);
    // const data = await resp.json();
    // setShifts(data);

    // For now, we keep the mock data
    setShifts(mockShifts);
  };

  // Re-fetch when filters change
  useEffect(() => {
    fetchShifts();
  }, [orgId, from, to]);

  return (
    <Layout title="Shift Ingestion & Open-Shift Setup">
      {/* Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Supervisory Org</InputLabel>
          <Select
            value={orgId}
            label="Supervisory Org"
            onChange={e => setOrgId(e.target.value)}
          >
            {orgs.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="From"
          type="date"
          value={from}
          onChange={e => setFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />

        <TextField
          label="To"
          type="date"
          value={to}
          onChange={e => setTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />

        <Button variant="contained" onClick={fetchShifts}>
          Refresh from Workday
        </Button>

        <Button variant="contained" onClick={() => {/* TODO: implement Excel import */}}>
          Import from Excel Sheet
        </Button>
      </Box>

      {/* Shifts Grid */}
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Shift ID</TableCell>
              <TableCell>Shift Name</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Org</TableCell>
              <TableCell>Worker</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map(s => (
              <TableRow key={s.Shift_Reference[0].ID[0]._}>
                <TableCell>{s.Shift_Reference[0].ID[0]._}</TableCell>
                <TableCell>{s.Shift_Name[0]}</TableCell>
                <TableCell>{s.Shift_Start_DateTime[0]}</TableCell>
                <TableCell>{s.Shift_End_DateTime[0]}</TableCell>
                <TableCell>
                  {s.Supervisory_Organization_Reference[0].Name[0]}
                </TableCell>
                <TableCell>
                  {s.Worker_Reference?.[0]?.Name?.[0] || 'Unassigned'}
                </TableCell>
                <TableCell>{s.Position_Reference[0].Name[0]}</TableCell>
                <TableCell>{s.Work_Location_Reference[0].Name[0]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Layout>
  );
}
