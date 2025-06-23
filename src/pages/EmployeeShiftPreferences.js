// src/pages/EmployeeShiftPreferences.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Layout from '../components/Layout';
import {
  Box,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';

export default function EmployeeShiftPreferences() {
  const currentEmployeeId = 'E0001';

  const [shifts, setShifts] = useState([]);
  const [rawBids, setRawBids] = useState([]);
  const [prefs, setPrefs] = useState({});

  // Load shift grid from shift_monitor.csv
  useEffect(() => {
    async function loadData() {
      const PUB = process.env.PUBLIC_URL;
      const [shiftsText, bidsText] = await Promise.all([
        fetch(`${PUB}/shift_monitor.csv`).then(r => r.text()),
        fetch(`${PUB}/employee_bids.csv`).then(r => r.text())
      ]);

      // Parse shift_monitor.csv
      const parsedShifts = Papa.parse(shiftsText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: h => h.trim()
      }).data
      .filter(r => r.ScheduleID);

      // Parse employee_bids.csv
      const parsedBids = Papa.parse(bidsText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: h => h.trim()
      }).data
      .filter(r => r.EmployeeID);

      setRawBids(parsedBids);

      // Build shift data for the grid
      const processedShifts = parsedShifts.map(r => {
        const totalBids = Number(r['Total Bids']) || 0;
        const minStaffLevel = Number(r['MinStaffLevel']) || 0;
        return {
          scheduleId: r['ScheduleID'],
          scheduleName: r['Schedule Name'],
          category: r['Category'],
          coverageHours: Number(r['Coverage Hours']) || 0,
          weekSpan: Number(r['Week Span']) || 0,
          totalBids,
          minStaffLevel,
          score: minStaffLevel ? `${Math.round((totalBids / minStaffLevel) * 100)}%` : '—',
        };
      });

      setShifts(processedShifts);
    }
    loadData();
  }, []);

  // Load preferences for this employee from employee_bids.csv
  useEffect(() => {
    const mapPref = { '1': '1st', '2': '2nd', '3': '3rd' };
    const bidsFor = rawBids.filter(b => b.EmployeeID === currentEmployeeId);

    const initial = {};
    bidsFor.forEach(b => {
      initial[b.ShiftID] = mapPref[b.Preference] || '';
    });
    setPrefs(initial);
  }, [rawBids]);

  const handlePref = (sid, v) => {
    setPrefs(prev => {
      const c = { ...prev };
      Object.keys(c).forEach(k => { if (c[k] === v) c[k] = ''; });
      c[sid] = v;
      return c;
    });
  };

  // Table columns (all monitor grid columns plus Preference)
  const columns = [
    { id: 'scheduleId', label: 'ScheduleID' },
    { id: 'scheduleName', label: 'Schedule Name' },
    { id: 'category', label: 'Category' },
    { id: 'coverageHours', label: 'Coverage Hours', numeric: true },
    { id: 'weekSpan', label: 'Week Span', numeric: true },
    { id: 'totalBids', label: 'Total Bids', numeric: true },
    { id: 'score', label: 'Score', numeric: true },
    { id: 'minStaffLevel', label: 'MinStaffLevel', numeric: true },
    { id: 'preference', label: 'Preference' }
  ];

  return (
    <Layout title="Employee Preferences for Scheduling">
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              {columns.map(col => (
                <TableCell key={col.id} align={col.numeric ? 'right' : 'left'}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map(s => (
              <TableRow key={s.scheduleId} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{s.scheduleId}</TableCell>
                <TableCell>{s.scheduleName}</TableCell>
                <TableCell>{s.category}</TableCell>
                <TableCell align="right">{s.coverageHours}</TableCell>
                <TableCell align="right">{s.weekSpan}</TableCell>
                <TableCell align="right">{s.totalBids}</TableCell>
                <TableCell align="right">{s.score}</TableCell>
                <TableCell align="right">{s.minStaffLevel}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={prefs[s.scheduleId] || ''}
                      displayEmpty
                      onChange={e => handlePref(s.scheduleId, e.target.value)}
                    >
                      <MenuItem value=""><em>—</em></MenuItem>
                      <MenuItem value="1st">1st Choice</MenuItem>
                      <MenuItem value="2nd">2nd Choice</MenuItem>
                      <MenuItem value="3rd">3rd Choice</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => console.log('Preferences:', prefs)}
          disabled={!Object.values(prefs).some(v => v)}
        >
          Save Preferences
        </Button>
      </Box>
    </Layout>
  );
}
