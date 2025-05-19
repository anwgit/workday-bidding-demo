import React, { useState, useMemo } from 'react';
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
  MenuItem,
  IconButton
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function EmployeeShiftPreferences() {
  // Mock data
  const initialShifts = [
    {
      id: '100501',
      name: 'Night Watch',
      start: '2025-06-18 20:00',
      end:   '2025-06-19 08:00',
      location: 'Terminal B4',
      totalBids: 12,
      vacancies: 3
    },
    {
      id: '100502',
      name: 'Day Patrol',
      start: '2025-06-19 08:00',
      end:   '2025-06-19 16:00',
      location: 'Terminal B4',
      totalBids: 5,
      vacancies: 1
    },
    {
      id: '100503',
      name: 'Event Coverage',
      start: '2025-06-21 10:00',
      end:   '2025-06-21 18:00',
      location: 'Parking Lot',
      totalBids: 8,
      vacancies: 2
    },
    {
      id: '100504',
      name: 'Holiday Coverage',
      start: '2025-07-04 00:00',
      end:   '2025-07-04 12:00',
      location: 'Main Gate',
      totalBids: 2,
      vacancies: 2
    }
  ];

  const [shifts]     = useState(initialShifts);
  const [from, setFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [to,   setTo]   = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() + 6);
    return d.toISOString().slice(0,10);
  });
  const [sortBy, setSortBy]     = useState('start');
  const [sortDir, setSortDir]   = useState('asc');
  const [prefs, setPrefs]       = useState({});

  // Combined & sorted data
  const sortedShifts = useMemo(() => {
    return [...shifts]
      .filter(s => s.start.slice(0,10) >= from && s.start.slice(0,10) <= to)
      .sort((a,b) => {
        let diff = 0;
        if (sortBy === 'dateTime') {
          diff = a.start.localeCompare(b.start);
        } else {
          diff = ('' + a[sortBy]).localeCompare('' + b[sortBy]);
        }
        return sortDir === 'asc' ? diff : -diff;
      });
  }, [shifts, from, to, sortBy, sortDir]);

  const toggleSort = column => {
    if (sortBy === column) {
      setSortDir(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const handlePref = (id, val) => {
    setPrefs(prev => {
      const updated = { ...prev };
      // clear duplicates
      Object.keys(updated).forEach(k => {
        if (updated[k] === val) updated[k] = '';
      });
      updated[id] = val;
      return updated;
    });
  };

  const savePrefs = () => {
    console.log('Saved preferences:', prefs);
    // TODO: POST to /api/preferences
  };

  return (
    <Layout title="Employee Preferences for Scheduling">
      {/* Filter Bar */}
      <Box sx={{ display:'flex', gap:2, mb:2, flexWrap:'wrap' }}>
        <TextField
          label="From"
          type="date"
          size="small"
          value={from}
          onChange={e => setFrom(e.target.value)}
          InputLabelProps={{ shrink:true }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={to}
          onChange={e => setTo(e.target.value)}
          InputLabelProps={{ shrink:true }}
        />
        <Button variant="contained" onClick={() => { /* re-fetch when real */ }}>
          Refresh
        </Button>
      </Box>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background:'#F0F7FF' }}>
              <TableCell onClick={() => toggleSort('dateTime')}>
                Date/Time&nbsp;
                {sortBy==='dateTime' ? (sortDir==='asc' ? <ArrowUpwardIcon fontSize="small"/> : <ArrowDownwardIcon fontSize="small"/>) : null}
              </TableCell>
              <TableCell onClick={() => toggleSort('name')}>
                Shift Name&nbsp;
                {sortBy==='name' ? (sortDir==='asc' ? <ArrowUpwardIcon fontSize="small"/> : <ArrowDownwardIcon fontSize="small"/>) : null}
              </TableCell>
              <TableCell onClick={() => toggleSort('location')}>
                Location&nbsp;
                {sortBy==='location' ? (sortDir==='asc' ? <ArrowUpwardIcon fontSize="small"/> : <ArrowDownwardIcon fontSize="small"/>) : null}
              </TableCell>
              <TableCell onClick={() => toggleSort('totalBids')}>
                Total Bids&nbsp;
                {sortBy==='totalBids' ? (sortDir==='asc' ? <ArrowUpwardIcon fontSize="small"/> : <ArrowDownwardIcon fontSize="small"/>) : null}
              </TableCell>
              <TableCell onClick={() => toggleSort('vacancies')}>
                Vacancies&nbsp;
                {sortBy==='vacancies' ? (sortDir==='asc' ? <ArrowUpwardIcon fontSize="small"/> : <ArrowDownwardIcon fontSize="small"/>) : null}
              </TableCell>
              <TableCell>Preference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedShifts.map(s => (
              <TableRow key={s.id} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{s.start}–{s.end}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.location}</TableCell>
                <TableCell align="center">{s.totalBids}</TableCell>
                <TableCell align="center">{s.vacancies}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={prefs[s.id]||''}
                      displayEmpty
                      onChange={e => handlePref(s.id, e.target.value)}
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

      <Box sx={{ mt:2 }}>
        <Button
          variant="contained"
          onClick={savePrefs}
          disabled={!Object.values(prefs).some(v => v)}
        >
          Save Preferences
        </Button>
      </Box>
    </Layout>
  );
}
