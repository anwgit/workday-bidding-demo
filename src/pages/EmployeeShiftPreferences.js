// src/pages/EmployeeShiftPreferences.js
import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import Layout from '../components/Layout';
import {
  Box,
  Button,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function EmployeeShiftPreferences() {
  const currentEmployeeId = 'E0001';

  const [shifts, setShifts]   = useState([]);
  const [rawBids, setRawBids] = useState([]);
  const [from, setFrom]       = useState('');
  const [to,   setTo]         = useState('');

  useEffect(() => {
    async function loadAll() {
      try {
        const PUB = process.env.PUBLIC_URL;
        const [shiftsCsv, bidsCsv] = await Promise.all([
          fetch(`${PUB}/Employee_Shifts.csv`).then(r => r.text()),
          fetch(`${PUB}/employee_bids.csv`).then(r => r.text())
        ]);

        const parsedShifts = Papa.parse(shiftsCsv, { header: true })
          .data.filter(r => r['Shift ID']);
        const parsedBids = Papa.parse(bidsCsv, { header: true })
          .data.filter(r => r.EmployeeID);

        setRawBids(parsedBids);

        const bidCounts = parsedBids.reduce((acc, b) => {
          acc[b.ShiftID] = (acc[b.ShiftID] || 0) + 1;
          return acc;
        }, {});

        const merged = parsedShifts.map(r => {
          const [datePart, startTime] = r.Start.split(' ');
          const endTime = r.End.split(' ')[1];
          return {
            id:        r['Shift ID'],
            date:      datePart,
            start:     startTime,
            end:       endTime,
            name:      r['Shift Name'],
            org:       r.Org,
            position:  r.Position,
            location:  r.Location,
            totalBids: bidCounts[r['Shift ID']] || 0
          };
        });

        const dates = merged.map(s => s.date).sort();
        setFrom(dates[0]);
        setTo(dates[dates.length - 1]);
        setShifts(merged);
      } catch (err) {
        console.error('CSV load error', err);
      }
    }
    loadAll();
  }, []);

  const employeeList = [
    { id: 'ALL',   name: 'All Employees', org: null },
    { id: 'E0001', name: 'John Doe',      org: 'Role A' },
    { id: 'E0002', name: 'Alice Smith',   org: 'Role A' },
    { id: 'E0003', name: 'Bob Johnson',   org: 'Role A' },
    { id: 'E0004', name: 'Karen White',   org: 'Role A' },
    { id: 'E0005', name: 'Mike Brown',    org: 'Role B' },
    { id: 'E0006', name: 'Sara Green',    org: 'Role B' },
    { id: 'E0007', name: 'Tom Black',     org: 'Role B' },
    { id: 'E0008', name: 'Linda Blue',    org: 'Role B' }
  ];

  const [mode, setMode]                         = useState('employee');
  const [selectedEmployee, setSelectedEmployee] = useState('ALL');
  const selectedOrg = employeeList.find(e => e.id === selectedEmployee)?.org;

  const [sortBy, setSortBy]   = useState('date');
  const [sortDir, setSortDir] = useState('asc');
  const [prefs, setPrefs]     = useState({});

  useEffect(() => {
    const mapPref = { '1': '1st', '2': '2nd', '3': '3rd' };
    const bidsFor = mode === 'employee'
      ? rawBids.filter(b => b.EmployeeID === currentEmployeeId)
      : rawBids.filter(b => b.EmployeeID === selectedEmployee);

    const initial = {};
    bidsFor.forEach(b => {
      initial[b.ShiftID] = mapPref[b.Preference] || '';
    });
    setPrefs(initial);
  }, [rawBids, mode, selectedEmployee]);

  const visibleShifts = useMemo(() => {
    return shifts
      .filter(s => s.date >= from && s.date <= to)
      .filter(s => mode === 'manager'
        ? (selectedEmployee === 'ALL' || s.org === selectedOrg)
        : true
      )
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'date')       cmp = a.date.localeCompare(b.date);
        else if (sortBy === 'start') cmp = a.start.localeCompare(b.start);
        else if (sortBy === 'position') cmp = a.position.localeCompare(b.position);
        else if (sortBy === 'org')      cmp = a.org.localeCompare(b.org);
        else if (sortBy === 'totalBids') cmp = a.totalBids - b.totalBids;
        else cmp = ('' + a[sortBy]).localeCompare('' + b[sortBy]);
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [shifts, from, to, mode, selectedEmployee, selectedOrg, sortBy, sortDir]);

  const toggleSort = col => {
    if (sortBy === col) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(col);
      setSortDir('asc');
    }
  };
  const handlePref = (sid, v) => {
    setPrefs(prev => {
      const c = { ...prev };
      Object.keys(c).forEach(k => { if (c[k] === v) c[k] = ''; });
      c[sid] = v;
      return c;
    });
  };

  return (
    <Layout title="Employee Preferences for Scheduling">
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small">
          <InputLabel>Mode</InputLabel>
          <Select value={mode} label="Mode" onChange={e => setMode(e.target.value)}>
            <MenuItem value="employee">Employee Mode</MenuItem>
            <MenuItem value="manager">Manager Mode</MenuItem>
          </Select>
        </FormControl>

        {mode === 'manager' && (
          <>
            <FormControl size="small">
              <InputLabel>Employee</InputLabel>
              <Select
                value={selectedEmployee}
                label="Employee"
                onChange={e => setSelectedEmployee(e.target.value)}
              >
                {employeeList.map(emp => (
                  <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Supervisory Org"
              size="small"
              value={selectedOrg || ''}
              InputProps={{ readOnly: true }}
            />
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="From" type="date" size="small"
          value={from} onChange={e => setFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To" type="date" size="small"
          value={to} onChange={e => setTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={() => { /* Refresh if needed */ }}>
          Refresh
        </Button>
      </Box>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell onClick={() => toggleSort('id')}>Shift ID</TableCell>
              <TableCell onClick={() => toggleSort('date')}>
                Date&nbsp;
                {sortBy === 'date' && (sortDir === 'asc'
                  ? <ArrowUpwardIcon fontSize="small" />
                  : <ArrowDownwardIcon fontSize="small" />
                )}
              </TableCell>
              <TableCell onClick={() => toggleSort('start')}>
                Shift Time&nbsp;
                {sortBy === 'start' && (sortDir === 'asc'
                  ? <ArrowUpwardIcon fontSize="small" />
                  : <ArrowDownwardIcon fontSize="small" />
                )}
              </TableCell>
              <TableCell onClick={() => toggleSort('name')}>
                Shift Name&nbsp;
                {sortBy === 'name' && (sortDir === 'asc'
                  ? <ArrowUpwardIcon fontSize="small" />
                  : <ArrowDownwardIcon fontSize="small" />
                )}
              </TableCell>
              <TableCell onClick={() => toggleSort('org')}>
                Org&nbsp;
                {sortBy === 'org' && (sortDir === 'asc'
                  ? <ArrowUpwardIcon fontSize="small" />
                  : <ArrowDownwardIcon fontSize="small" />
                )}
              </TableCell>
              <TableCell onClick={() => toggleSort('position')}>
                Position&nbsp;
                {sortBy === 'position' && (sortDir === 'asc'
                  ? <ArrowUpwardIcon fontSize="small" />
                  : <ArrowDownwardIcon fontSize="small" />
                )}
              </TableCell>
              <TableCell onClick={() => toggleSort('location')}>
                Location&nbsp;
                {sortBy === 'location' && (sortDir === 'asc'
                  ? <ArrowUpwardIcon fontSize="small" />
                  : <ArrowDownwardIcon fontSize="small" />
                )}
              </TableCell>
              <TableCell onClick={() => toggleSort('totalBids')}>
                Total Bids&nbsp;
                {sortBy === 'totalBids' && (sortDir === 'asc'
                  ? <ArrowUpwardIcon fontSize="small" />
                  : <ArrowDownwardIcon fontSize="small" />
                )}
              </TableCell>
              <TableCell>Preference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleShifts.map(s => (
              <TableRow key={s.id} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.date}</TableCell>
                <TableCell>{s.start}–{s.end}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.org}</TableCell>
                <TableCell>{s.position}</TableCell>
                <TableCell>{s.location}</TableCell>
                <TableCell align="center">{s.totalBids}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={prefs[s.id] || ''}
                      displayEmpty
                      onChange={e => handlePref(s.id, e.target.value)}
                      disabled={mode === 'manager'}
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

      {mode === 'employee' && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => console.log('Preferences:', prefs)}
            disabled={!Object.values(prefs).some(v => v)}
          >
            Save Preferences
          </Button>
        </Box>
      )}
    </Layout>
  );
}
