// src/pages/VacationPreferenceSubmission.js
import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Grid,
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
  TableBody
} from '@mui/material';

const DEPARTMENTS = [
  'Police',
  'Fire',
  'Security',
  'Parking',
  'Customer Experience'
];

const STATUSES = [
  'Submitted',
  'Pending',
  'Approved',
  'Rejected'
];

const sampleSubmissions = [
  {
    employeeName:  'John Doe',
    department:    'Police',
    seniorityDate: '2015-06-12',
    preferences: [
      '2025-07-01 to 2025-07-07',
      '2025-08-01 to 2025-08-07'
    ],
    submittedAt:   '2025-05-10T14:30',
    status:        'Submitted'
  },
  {
    employeeName:  'Jane Smith',
    department:    'Fire',
    seniorityDate: '2017-03-22',
    preferences: [
      '2025-07-08 to 2025-07-14',
      '2025-08-08 to 2025-08-14',
      '2025-09-01 to 2025-09-07'
    ],
    submittedAt:   '2025-05-11T09:15',
    status:        'Pending'
  },
  {
    employeeName:  'Alice Johnson',
    department:    'Security',
    seniorityDate: '2018-01-05',
    preferences: [
      '2025-07-15 to 2025-07-21'
    ],
    submittedAt:   '2025-05-12T08:45',
    status:        'Approved'
  }
];

export default function VacationPreferenceSubmission() {
  const [deptFilter, setDeptFilter]       = useState('');
  const [dateFrom,   setDateFrom]         = useState('');
  const [dateTo,     setDateTo]           = useState('');
  const [statusFilter, setStatusFilter]   = useState('');

  // determine max number of preferences to build columns
  const maxPrefs = useMemo(
    () => Math.max(...sampleSubmissions.map(s => s.preferences.length)),
    []
  );

  // apply filters
  const filtered = useMemo(() => {
    return sampleSubmissions.filter(s => {
      if (deptFilter && s.department !== deptFilter) return false;
      if (statusFilter && s.status !== statusFilter)   return false;
      if (dateFrom && new Date(s.submittedAt) < new Date(dateFrom)) return false;
      if (dateTo   && new Date(s.submittedAt) > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [deptFilter, statusFilter, dateFrom, dateTo]);

  // CSV export
  const exportCSV = () => {
    const prefHeaders = Array.from({ length: maxPrefs }, (_, i) => `Preference ${i + 1}`);
    const headers = [
      'Employee Name',
      'Department',
      'Seniority Date',
      ...prefHeaders,
      'Submitted At',
      'Status'
    ];
    const rows = filtered.map(s => {
      const prefs = [...s.preferences];
      // pad with blanks
      while (prefs.length < maxPrefs) prefs.push('');
      return [
        s.employeeName,
        s.department,
        s.seniorityDate,
        ...prefs,
        s.submittedAt,
        s.status
      ];
    });
    const csvContent = [headers, ...rows]
      .map(r => r.map(v => `"${v}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'vacation_preferences.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout title="Vacation Preference Submissions">
      {/* Filter Bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={deptFilter}
                label="Department"
                onChange={e => setDeptFilter(e.target.value)}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                {DEPARTMENTS.map(d => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="From"
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="To"
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={e => setStatusFilter(e.target.value)}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                {STATUSES.map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button
              variant="contained"
              onClick={exportCSV}
              sx={{ height: '100%' }}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Submissions Table */}
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Employee Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Seniority Date</TableCell>
              {Array.from({ length: maxPrefs }, (_, i) => (
                <TableCell key={i}>Preference {i + 1}</TableCell>
              ))}
              <TableCell>Submitted At</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((s, idx) => (
              <TableRow key={idx} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{s.employeeName}</TableCell>
                <TableCell>{s.department}</TableCell>
                <TableCell>{s.seniorityDate}</TableCell>
                {Array.from({ length: maxPrefs }, (_, i) => (
                  <TableCell key={i}>{s.preferences[i] || ''}</TableCell>
                ))}
                <TableCell>{s.submittedAt.replace('T', ' ')}</TableCell>
                <TableCell>{s.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Layout>
  );
}
