// src/pages/VacationAwardAndOverride.js
import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import CheckIcon    from '@mui/icons-material/Check';
import ClearIcon    from '@mui/icons-material/Clear';
import EditIcon     from '@mui/icons-material/Edit';

const buckets = [
  { id: 1, name: 'Summer Vacation', start: '2025-06-01', end: '2025-08-31', slots: 10 },
  { id: 2, name: 'Winter Holiday',   start: '2025-12-15', end: '2026-01-15', slots: 5  }
];

const sampleSubmissions = [
  { id: 1, employeeName: 'John Doe',        seniorityDate: '2015-06-12', bucketId: 1, submittedAt: '2025-05-10T14:30', awarded: false },
  { id: 2, employeeName: 'Jane Smith',      seniorityDate: '2017-03-22', bucketId: 1, submittedAt: '2025-05-11T09:15', awarded: false },
  { id: 3, employeeName: 'Alice Johnson',   seniorityDate: '2018-01-05', bucketId: 1, submittedAt: '2025-05-12T08:45', awarded: false },
  { id: 4, employeeName: 'Bob Williams',    seniorityDate: '2014-11-30', bucketId: 1, submittedAt: '2025-05-12T10:20', awarded: false },
  { id: 5, employeeName: 'Carol Martinez',  seniorityDate: '2019-04-18', bucketId: 2, submittedAt: '2025-05-13T11:00', awarded: false }
];

export default function VacationAwardAndOverride() {
  const [selectedBucketId, setSelectedBucketId] = useState(buckets[0].id);
  const [submissions, setSubmissions]           = useState(sampleSubmissions);
  const [overrideOpen, setOverrideOpen]         = useState(false);
  const [overrideData, setOverrideData]         = useState({
    employeeId: '',
    toBucketId: '',
    reason: ''
  });

  const bucket = buckets.find(b => b.id === selectedBucketId);
  const subs  = submissions.filter(s => s.bucketId === selectedBucketId);

  // Auto-award: assign top N by seniorityDate oldest first
  const handleAutoAward = () => {
    const sorted = [...subs].sort((a, b) => new Date(a.seniorityDate) - new Date(b.seniorityDate));
    const toAward = sorted.slice(0, bucket.slots).map(s => s.id);
    setSubmissions(submissions.map(s => ({
      ...s,
      awarded: toAward.includes(s.id)
    })));
  };

  const toggleAward = (id) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, awarded: !s.awarded } : s));
  };

  const openOverride = (id) => {
    setOverrideData({ employeeId: id, toBucketId: selectedBucketId, reason: '' });
    setOverrideOpen(true);
  };

  const confirmOverride = () => {
    // In a real app, update database here.
    const { employeeId, toBucketId, reason } = overrideData;
    setSubmissions(submissions.map(s =>
      s.id === employeeId ? { ...s, bucketId: toBucketId, overrideReason: reason } : s
    ));
    setOverrideOpen(false);
  };

  return (
    <Layout title="Vacation Award & Override">
      {/* Bucket Selector & Auto-Award */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl size="small">
          <InputLabel>Bucket</InputLabel>
          <Select
            value={selectedBucketId}
            label="Bucket"
            onChange={e => setSelectedBucketId(e.target.value)}
          >
            {buckets.map(b => (
              <MenuItem key={b.id} value={b.id}>
                {b.name} ({b.start}–{b.end})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box>
          <Typography variant="body1">
            Capacity: {bucket.slots} | Submitted: {subs.length} | Awarded: {subs.filter(s => s.awarded).length}
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleAutoAward}>
          Auto Award
        </Button>
      </Box>

      {/* Submissions Table */}
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Employee Name</TableCell>
              <TableCell>Seniority Date</TableCell>
              <TableCell>Submitted At</TableCell>
              <TableCell align="center">Awarded</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subs.map(s => (
              <TableRow key={s.id} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{s.employeeName}</TableCell>
                <TableCell>{s.seniorityDate}</TableCell>
                <TableCell>{s.submittedAt.replace('T', ' ')}</TableCell>
                <TableCell align="center">
                  {s.awarded ? <CheckIcon color="success" /> : <ClearIcon color="disabled" />}
                </TableCell>
                <TableCell align="center">
                  <Button size="small" onClick={() => toggleAward(s.id)}>
                    {s.awarded ? 'Revoke' : 'Assign'}
                  </Button>
                  <IconButton size="small" onClick={() => openOverride(s.id)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Override Modal */}
      <Dialog open={overrideOpen} onClose={() => setOverrideOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Override Assignment</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Employee</InputLabel>
            <Select
              value={overrideData.employeeId}
              onChange={e => setOverrideData({ ...overrideData, employeeId: e.target.value })}
            >
              {subs.map(s => (
                <MenuItem key={s.id} value={s.id}>{s.employeeName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Bucket</InputLabel>
            <Select
              value={overrideData.toBucketId}
              onChange={e => setOverrideData({ ...overrideData, toBucketId: e.target.value })}
            >
              {buckets.map(b => (
                <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Override Reason"
            multiline
            rows={3}
            value={overrideData.reason}
            onChange={e => setOverrideData({ ...overrideData, reason: e.target.value })}
            fullWidth
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOverrideOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmOverride}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Layout>
);
}
