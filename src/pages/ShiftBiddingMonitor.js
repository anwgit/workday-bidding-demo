// src/pages/ShiftBiddingMonitor.js
import React, { useState, useEffect, useMemo } from 'react';
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
  TableSortLabel,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

// Dummy sample bidders for dialog (can be replaced with actual bid data if needed)
const sampleBidders = [
  { name: "John Doe", preference: 1 },
  { name: "Jane Smith", preference: 2 },
];

export default function ShiftBiddingMonitor() {
  const [rows, setRows] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [biddersOpen, setBiddersOpen] = useState(false);
  const [activeScheduleId, setActiveScheduleId] = useState(null);

  // Load CSV data
  useEffect(() => {
    async function loadCsv() {
      const base = process.env.PUBLIC_URL || '';
      const res = await fetch(`${base}/shift_monitor.csv`);
      const text = await res.text();
      const { data } = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: h => h.trim(),
      });
      // Convert numeric fields
      const cleaned = data.map(row => ({
        scheduleId: row['ScheduleID'],
        scheduleName: row['Schedule Name'],
        category: row['Category'],
        coverageHours: Number(row['Coverage Hours']),
        weekSpan: Number(row['Week Span']),
        totalBids: Number(row['Total Bids']),
        minStaffLevel: Number(row['MinStaffLevel']),
      }));
      setRows(cleaned);
    }
    loadCsv();
  }, []);

  const handleSort = id => {
    if (sortBy === id) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(id); setSortDir('asc'); }
  };

  // Show bidders dialog for a schedule
  const openBidders = scheduleId => {
    setActiveScheduleId(scheduleId);
    setBiddersOpen(true);
  };

  // Sorted rows
  const sortedRows = useMemo(() => {
    if (!sortBy) return rows;
    return [...rows].sort((a, b) => {
      const av = a[sortBy], bv = b[sortBy];
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv;
      } else {
        cmp = String(av).localeCompare(String(bv));
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortBy, sortDir]);

  // Grid columns definition
  const columns = [
    { id: 'scheduleId', label: 'ScheduleID' },
    { id: 'scheduleName', label: 'Schedule Name' },
    { id: 'category', label: 'Category' },
    { id: 'coverageHours', label: 'Coverage Hours', numeric: true },
    { id: 'weekSpan', label: 'Week Span', numeric: true },
    { id: 'totalBids', label: 'Total Bids', numeric: true },
    { id: 'score', label: 'Score', numeric: true },
    { id: 'minStaffLevel', label: 'MinStaffLevel', numeric: true },
  ];

  // Calculate score for display
  function getScore(row) {
    if (!row.minStaffLevel || row.minStaffLevel === 0) return '—';
    const percent = (row.totalBids / row.minStaffLevel) * 100;
    return `${percent.toFixed(0)}%`;
  }

  return (
    <Layout title="Shift Bidding Monitor">
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained">Send Notifications</Button>
      </Box>
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              {columns.map(col => (
                <TableCell
                  key={col.id}
                  align={col.numeric ? 'right' : 'left'}
                  sortDirection={sortBy === col.id ? sortDir : false}
                >
                  <TableSortLabel
                    active={sortBy === col.id}
                    direction={sortBy === col.id ? sortDir : 'asc'}
                    onClick={() => handleSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map(row => (
              <TableRow key={row.scheduleId}>
                <TableCell>{row.scheduleId}</TableCell>
                <TableCell>{row.scheduleName}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell align="right">{row.coverageHours}</TableCell>
                <TableCell align="right">{row.weekSpan}</TableCell>
                <TableCell align="right">
                  <Link component="button" onClick={() => openBidders(row.scheduleId)}>
                    {row.totalBids}
                  </Link>
                </TableCell>
                <TableCell align="right">{getScore(row)}</TableCell>
                <TableCell align="right">{row.minStaffLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Bidders Dialog */}
      <Dialog open={biddersOpen} onClose={() => setBiddersOpen(false)}>
        <DialogTitle>Bidders for Schedule {activeScheduleId}</DialogTitle>
        <DialogContent dividers>
          <List dense>
            {sampleBidders.map((b, i) => (
              <ListItem key={i}>
                <ListItemText primary={`${b.name} — Preference ${b.preference}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBiddersOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
