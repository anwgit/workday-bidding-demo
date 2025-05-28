// src/pages/ShiftAward.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Layout from '../components/Layout';
import {
  Box,
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
  Typography,
  CircularProgress,
  IconButton,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditIcon  from '@mui/icons-material/Edit';

export default function ShiftAward() {
  const [windowName, setWindowName] = useState('Cycle A');
  const windows = ['Cycle A Shift Bidding - December','Cycle B','Cycle C'];

  const [employees, setEmployees] = useState([]);
  const [bids,      setBids]      = useState([]);
  const [records,   setRecords]   = useState(null);
  const [autoAwarded, setAutoAwarded] = useState(false);

  // dialog state
  const [dialogOpen,   setDialogOpen]   = useState(false);
  const [dialogTitle,  setDialogTitle]  = useState('');
  const [dialogReason, setDialogReason] = useState([]);

  // Load CSVs on mount
  useEffect(() => {
    async function loadData() {
      try {
        const PUB = process.env.PUBLIC_URL;
        const [empText, bidText] = await Promise.all([
          fetch(`${PUB}/employees.csv`).then(r => {
            if (!r.ok) throw new Error(`employees.csv not found (${r.status})`);
            return r.text();
          }),
          fetch(`${PUB}/employee_bids.csv`).then(r => {
            if (!r.ok) throw new Error(`employee_bids.csv not found (${r.status})`);
            return r.text();
          })
        ]);
        const emps = Papa.parse(empText, { header: true })
                       .data.filter(r => r.EmployeeID);
        const bds  = Papa.parse(bidText, { header: true })
                       .data.filter(r => r.EmployeeID && r.ShiftID);

        setEmployees(emps);
        setBids(bds);

        // initial join, no awards yet
        const initial = bds.map(b => {
          const e = emps.find(e=>e.EmployeeID===b.EmployeeID) || {};
          return {
            employeeID: b.EmployeeID,
            name:       e.Name      || '',
            position:   e.Position  || '',
            org:        e.Org       || '',
            seniority:  e.Hire      || '',
            shiftID:    b.ShiftID,
            preference: b.Preference,
            submitted:  b.Submitted || '',
            awarded:    false,
            reason:     []
          };
        });
        setRecords(initial);
      } catch (err) {
        console.error(err);
        setRecords([]);
      }
    }
    loadData();
  }, []);

  // Auto‐award logic
  const handleAutoAward = () => {
    if (!records) return;
    const byShift = records.reduce((acc, r) => {
      (acc[r.shiftID] = acc[r.shiftID]||[]).push(r);
      return acc;
    }, {});
    const updated = [];

    Object.values(byShift).forEach(group => {
      let winner = null;
      let reason = [];

      if (group.length===1) {
        winner = group[0];
        reason.push('Only one bid → auto-awarded.');
      } else {
        for (let p=1; p<=3; p++) {
          const cands = group.filter(r=>Number(r.preference)===p);
          reason.push(`Preference ${p}: ${cands.length} candidate(s).`);
          if (!cands.length) continue;
          if (cands.length===1) {
            winner = cands[0];
            reason.push('Single candidate → awarded.');
          } else {
            reason.push('Tie → breaking by seniority.');
            const tie = cands.map(r=>({
              ...r,
              _hire: new Date(
                (employees.find(e=>e.EmployeeID===r.employeeID)||{}).Hire
              )
            }));
            tie.sort((a,b)=>a._hire - b._hire);
            winner = tie[0];
            reason.push(`Winner: ${winner.name} (Hired ${winner.seniority}).`);
          }
          break;
        }
      }

      group.forEach(r => {
        if (winner && r.employeeID===winner.employeeID) {
          r.awarded = true;
          r.reason = reason;
        } else {
          r.awarded = false;
          r.reason = reason.length
            ? ['Not selected at winning preference.']
            : [];
        }
        updated.push(r);
      });
    });

    setRecords(updated);
    setAutoAwarded(true);
  };

  // Toggle awarded on/off
  const handleToggle = (id, sid) => {
    setRecords(prev =>
      prev.map(r =>
        r.employeeID===id && r.shiftID===sid
          ? { ...r, awarded: !r.awarded }
          : r
      )
    );
  };

  // Show reasoning dialog
  const showReason = r => {
    setDialogTitle(`${r.name} – Shift ${r.shiftID}`);
    setDialogReason(r.reason);
    setDialogOpen(true);
  };

  if (records===null) {
    return (
      <Layout title="Award & Override">
        <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  // Header stats
  const capacity       = new Set(records.map(r=>r.shiftID)).size;
  const submittedCount = records.length;
  const awardedCount   = records.filter(r=>r.awarded).length;

  return (
    <Layout title="Award & Override">
      {/* Header */}
      <Box sx={{ display:'flex', gap:2, alignItems:'center', mb:3, flexWrap:'wrap' }}>
        <FormControl size="small">
          <InputLabel>Window</InputLabel>
          <Select
            value={windowName}
            label="Window"
            onChange={e=>setWindowName(e.target.value)}
          >
            {windows.map(w=>(
              <MenuItem key={w} value={w}>{w}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography>
          Capacity: {capacity} | Submitted: {submittedCount} | Awarded: {awardedCount}
        </Typography>

        <Button variant="contained" onClick={handleAutoAward}>
          AUTO AWARD
        </Button>
      </Box>

      {/* Table */}
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background:'#F0F7FF' }}>
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Org</TableCell>
              <TableCell>Seniority</TableCell>
              <TableCell>Shift ID</TableCell>
              <TableCell>Preference</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Awarded</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map(r=>(
              <TableRow key={`${r.employeeID}-${r.shiftID}`}>
                <TableCell>{r.employeeID}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.position}</TableCell>
                <TableCell>{r.org}</TableCell>
                <TableCell>{r.seniority}</TableCell>
                <TableCell>{r.shiftID}</TableCell>
                <TableCell>{r.preference}</TableCell>
                <TableCell>{r.submitted}</TableCell>
                <TableCell>
                  {autoAwarded
                    ? r.awarded
                      ? <CheckIcon color="success" fontSize="small" />
                      : <ClearIcon color="error" fontSize="small" />
                    : null
                  }
                </TableCell>
                <TableCell>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={()=>handleToggle(r.employeeID, r.shiftID)}
                  >
                    REVOKE
                  </Link>{' '}
                  {autoAwarded && (
                    <IconButton size="small" onClick={()=>showReason(r)}>
                      <InfoOutlinedIcon />
                    </IconButton>
                  )}{' '}
                  <IconButton
                    size="small"
                    onClick={()=>alert(`Override ${r.employeeID}-${r.shiftID}`)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Reason Dialog */}
      <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <List>
            {dialogReason.map((line,i)=>(
              <ListItem key={i} disablePadding>
                <ListItemText primary={`• ${line}`} />
              </ListItem>
            ))}
            {dialogReason.length===0 && (
              <ListItem disablePadding>
                <ListItemText primary="No decision logic available." />
              </ListItem>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
