// src/pages/ShiftAward.js
import React, { useState, useEffect } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';

const scheduleLookup = {
  "100507": { name: "Police Night-Mo 8hr - 10p - 6a", minStaff: 10 },
  "100508": { name: "Police Night-Mo 8hr - 8p - 4a", minStaff: 12 },
  "100510": { name: "Police Day-Mo/Tu 8hr - 6a - 2p", minStaff: 11 },
  "100512": { name: "Police Day-Mo 8hr 4p - 12a", minStaff: 13 },
  "100513": { name: "4/10 - 10Hour - SUN/MON/TUE/WED - 10A-10P", minStaff: 10 },
  "100514": { name: "5/8- 8- Hour - mo/tu/we/th/fr - 7am-3pm", minStaff: 14 }
  // Add more as needed
};

export default function ShiftAward() {
  const [windowName, setWindowName] = useState('Cycle A');
  const windows = ['Cycle A Shift Bidding - December', 'Cycle B', 'Cycle C'];

  const [employees, setEmployees] = useState([]);
  const [bids, setBids] = useState([]);
  const [records, setRecords] = useState(null);
  const [autoAwarded, setAutoAwarded] = useState(false);

  // filter state
  const [orgFilter, setOrgFilter] = useState('');
  const [orgOptions, setOrgOptions] = useState([]);

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogReason, setDialogReason] = useState([]);

  // Simulate loading CSVs (replace this with your actual data loading logic)
  useEffect(() => {
    async function loadData() {
      // Instead of CSVs, simulate with arrays or load as you already do
      // Here's an example, assuming bids and employees have already been loaded
      // Replace this with your actual data fetching as needed
      // For the demo, let's just use static data

      // This is a placeholder for demonstration:
      const emps = [
        { EmployeeID: "E0004", Name: "George Will", Position: "Officer", Org: "Police", Hire: "2/13/2016" },
        { EmployeeID: "E0007", Name: "Mike J", Position: "Officer", Org: "Police", Hire: "11/23/2010" },
        { EmployeeID: "E0005", Name: "Michael Morre", Position: "Officer", Org: "Police", Hire: "5/18/2014" },
        { EmployeeID: "E0006", Name: "Carl Stone", Position: "Officer", Org: "Police", Hire: "8/20/2012" }
      ];
      const bds = [
        { EmployeeID: "E0004", ShiftID: "100507", Preference: 1, Submitted: "12/6/2024" },
        { EmployeeID: "E0007", ShiftID: "100508", Preference: 1, Submitted: "12/9/2024" },
        { EmployeeID: "E0005", ShiftID: "100510", Preference: 1, Submitted: "12/7/2024" },
        { EmployeeID: "E0006", ShiftID: "100510", Preference: 1, Submitted: "12/8/2024" },
        { EmployeeID: "E0004", ShiftID: "100512", Preference: 2, Submitted: "12/14/2024" },
        { EmployeeID: "E0005", ShiftID: "100513", Preference: 1, Submitted: "12/15/2024" },
        { EmployeeID: "E0006", ShiftID: "100514", Preference: 1, Submitted: "12/16/2024" }
      ];

      setEmployees(emps);
      setBids(bds);

      // build org options
      const orgSet = new Set();
      bds.forEach(b => {
        const emp = emps.find(e => e.EmployeeID === b.EmployeeID);
        if (emp?.Org) orgSet.add(emp.Org);
      });
      setOrgOptions(Array.from(orgSet));
      const initialOrg = Array.from(orgSet)[0] || '';
      setOrgFilter(initialOrg);

      const joined = bds.map(b => {
        const emp = emps.find(e => e.EmployeeID === b.EmployeeID) || {};
        const sched = scheduleLookup[b.ShiftID] || {};
        return {
          employee: b.EmployeeID + (emp.Name ? `-${emp.Name}` : ''),
          position: emp.Position || '',
          org: emp.Org || '',
          seniority: emp.Hire || '',
          schedule: sched.name || '',
          minStaffLevel: sched.minStaff || '',
          preference: b.Preference,
          submitted: b.Submitted || '',
          awarded: false,
          reason: [],
          employeeID: b.EmployeeID,
          shiftID: b.ShiftID,
        };
      });

      setRecords(joined);
    }
    loadData();
  }, []);

  // Auto‐award logic (unchanged)
  const handleAutoAward = () => {
    if (!records) return;
    const bySchedule = records.reduce((acc, r) => {
      (acc[r.schedule] = acc[r.schedule] || []).push(r);
      return acc;
    }, {});
    const updated = [];

    Object.values(bySchedule).forEach(group => {
      let winner = null;
      let reason = [];

      if (group.length === 1) {
        winner = group[0];
        reason.push('Only one bid → auto-awarded.');
      } else {
        for (let p = 1; p <= 3; p++) {
          const cands = group.filter(r => Number(r.preference) === p);
          reason.push(`Preference ${p}: ${cands.length} candidate(s).`);
          if (!cands.length) continue;
          if (cands.length === 1) {
            winner = cands[0];
            reason.push('Single candidate → awarded.');
          } else {
            reason.push('Tie → breaking by seniority.');
            const tie = cands.map(r => ({
              ...r,
              _hire: new Date(r.seniority)
            }));
            tie.sort((a, b) => a._hire - b._hire);
            winner = tie[0];
            reason.push(`Winner: ${winner.employee} (Hired ${winner.seniority}).`);
          }
          break;
        }
      }

      group.forEach(r => {
        if (winner && r.employeeID === winner.employeeID) {
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
        r.employeeID === id && r.shiftID === sid
          ? { ...r, awarded: !r.awarded }
          : r
      )
    );
  };

  // Show reasoning dialog
  const showReason = r => {
    setDialogTitle(`${r.employee} – Schedule ${r.schedule}`);
    setDialogReason(r.reason);
    setDialogOpen(true);
  };

  if (records === null) {
    return (
      <Layout title="Award & Override">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  // Filter records by Supervisory Org
  const filteredRecords = orgFilter
    ? records.filter(r => r.org === orgFilter)
    : records;

  // Capacity: sum of MinStaffLevel for visible rows
  const capacity = filteredRecords.reduce((sum, r) => sum + (Number(r.minStaffLevel) || 0), 0);
  const submittedCount = filteredRecords.length;
  const awardedCount = filteredRecords.filter(r => r.awarded).length;

  return (
    <Layout title="Award & Override">
      {/* Header */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small">
          <InputLabel>Window</InputLabel>
          <Select
            value={windowName}
            label="Window"
            onChange={e => setWindowName(e.target.value)}
          >
            {windows.map(w => (
              <MenuItem key={w} value={w}>{w}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Supervisory Org Listbox */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Supervisory Organization</InputLabel>
          <Select
            value={orgFilter || ''}
            label="Supervisory Organization"
            onChange={e => setOrgFilter(e.target.value)}
          >
            {orgOptions.map(org => (
              <MenuItem key={org} value={org}>{org}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography>
          Capacity: {capacity} | Submitted: {submittedCount} | Awarded: {awardedCount}
        </Typography>

        <Button variant="contained" onClick={handleAutoAward}>
          AUTO AWARD
        </Button>
          <Button variant="contained" color="secondary" sx={{ ml: 1 }}>
          PUSH SCHEDULES TO WORKER
        </Button>
      </Box>

      {/* Table */}
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Employee</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Seniority</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>MinStaffLevel</TableCell>
              <TableCell>Preference</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Awarded</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map(r => (
              <TableRow key={`${r.employeeID}-${r.shiftID}`}>
                <TableCell>{r.employee}</TableCell>
                <TableCell>{r.position}</TableCell>
                <TableCell>{r.seniority}</TableCell>
                <TableCell>{r.schedule}</TableCell>
                <TableCell>{r.minStaffLevel}</TableCell>
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
                    onClick={() => handleToggle(r.employeeID, r.shiftID)}
                  >
                    REVOKE
                  </Link>{' '}
                  {autoAwarded && (
                    <IconButton size="small" onClick={() => showReason(r)}>
                      <InfoOutlinedIcon />
                    </IconButton>
                  )}{' '}
                  <IconButton
                    size="small"
                    onClick={() => alert(`Override ${r.employeeID}-${r.shiftID}`)}
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <List>
            {dialogReason.map((line, i) => (
              <ListItem key={i} disablePadding>
                <ListItemText primary={`• ${line}`} />
              </ListItem>
            ))}
            {dialogReason.length === 0 && (
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
