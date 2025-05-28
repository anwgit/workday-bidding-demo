// src/pages/OtBiddingProcess.js
import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Button,
  IconButton,
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
import SettingsIcon from '@mui/icons-material/Settings';

const sampleOvertimeShifts = [
  { id: 1, title: 'Night Terminal B4 #7',        start: '2025-06-18 00:00', end: '2025-06-18 04:00', duration: '4h' },
  { id: 2, title: 'Downtown Patrol OT',          start: '2025-06-19 16:00', end: '2025-06-19 20:00', duration: '4h' },
  { id: 3, title: 'Weekend Event Coverage',      start: '2025-06-21 10:00', end: '2025-06-21 18:00', duration: '8h' },
  { id: 4, title: 'Holiday Coverage (July 4th)', start: '2025-07-04 00:00', end: '2025-07-04 12:00', duration: '12h' }
];

const ruleSets = [
  '*P COBRA OT Hiring within 48 hours',
  '*P Delta Hiring within 48 hours',
  '*P International Pkwy Hiring within 48 hr',
  '*P Off Duty',
  '*P Police OT Hiring within 48 hours',
  '*P Terminal OT Hiring within 48 hours',
  '*P Vehicle OT Hiring within 48 hours',
  'P AA COBRA OT Hiring 48hrs – 14 days',
  'P AA Delta Hiring 48hrs – 14 days',
  'P AA International Pkwy Hiring 14 days',
  'P AA Off Duty 48hrs – 14 days',
  'P AA Police OT Hiring 48hrs – 14 days',
  'P AA Terminal OT Hiring 48hrs – 14 days',
  'P AA Vehicle OT Hiring 48hrs – 14 days',
  'P All Signups',
  'P Early or Late 8',
  'P Emergency Only',
  'P Jail Hiring 48hrs – 14 days',
  'P Jail Hiring within 48 hours',
  'P K9 EOD Special Ops Signup',
  'P Mandatory List',
  'P Signup Traffic and SWAT',
  'P Special Event OT Hiring'
];

// Fake employees for demo
function getEmployeesForRule(rule) {
  return [
    {
      number:  1,
      status:  '',
      name:    `Osterhoff, Stephen D. (${rule})`,
      list:    rule,
      rank:    'Police Officer',
      factors: '172, 06/26/2017'
    },
    {
      number:  2,
      status:  '',
      name:    `Konz, Christopher M. (${rule})`,
      list:    rule,
      rank:    'Police Officer',
      factors: '214, 02/03/2020'
    }
  ];
}

// Dynamically build a simple-language explanation for any rule
function getExplanationForRule(ruleName) {
  // extract numbers
  const dayMatch  = ruleName.match(/(\d+)\s*days?/i);
  const hourMatch = ruleName.match(/(\d+)\s*hrs?/i);

  let text = `Rule "${ruleName}":\n\n`;

  // Eligibility
  text += `• Eligibility window:\n`;
  if (dayMatch && hourMatch) {
    text += `  – Opens ${dayMatch[1]} days before the shift.\n`;
    text += `  – Closes ${hourMatch[1]} hours before the shift starts.\n`;
    text += `  (Gives advance notice but prevents last-minute sign-ups.)\n\n`;
  } else if (hourMatch) {
    text += `  – Opens ${hourMatch[1]} hours before the shift.\n`;
    text += `  – Closes when the shift begins.\n`;
    text += `  (Limits to last-minute volunteers.)\n\n`;
  } else if (dayMatch) {
    text += `  – Opens ${dayMatch[1]} days before the shift.\n`;
    text += `  – No explicit cutoff defined here.\n\n`;
  } else {
    text += `  – Defined by the rule name.\n\n`;
  }

  // Sign-up list
  text += `• Sign-up list filter:\n`;
  text += `  – Only employees who joined the "${ruleName}" list during that window are shown.\n\n`;

  // Sorting
  text += `• Sorting criteria:\n`;
  text += `  – Primary: seniority number ascending (smaller = more senior).\n`;
  text += `  – Secondary: date of last overtime ascending (longest wait first).\n\n`;

  // Display
  text += `• Display & Contact Order:\n`;
  text += `  – Lists all eligible, signed-up employees in that priority order.\n`;
  text += `  – Top entries will be contacted first.`;

  return text;
}

export default function OtBiddingProcess() {
  const [selShift, setSelShift]       = useState(sampleOvertimeShifts[0].id);
  const [selRule,  setSelRule]        = useState(ruleSets[0]);
  const [explanation, setExplanation] = useState(getExplanationForRule(ruleSets[0]));
  const employees = getEmployeesForRule(selRule);

  const handleRuleChange = (e) => {
    const rule = e.target.value;
    setSelRule(rule);
    setExplanation(getExplanationForRule(rule));
  };

  return (
    <Layout title="Shift - Fill By Rules">
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        {/* LEFT – 25% */}
        <Box sx={{
          width: '25%',
          pr: 2,
          borderRight: '1px solid #ccc',
          overflowY: 'auto',
          px: 1
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Overtime Shifts</Typography>
            <Box>
              <Button size="small" variant="outlined" sx={{ mr: 1 }}>Sort By</Button>
              <Button size="small" variant="outlined">Contact Log</Button>
            </Box>
          </Box>
          <List>
            {sampleOvertimeShifts.map(s => (
              <ListItemButton
                key={s.id}
                selected={selShift === s.id}
                onClick={() => setSelShift(s.id)}
                sx={{
                  mb: 1,
                  '&.Mui-selected': { bgcolor: '#E3F2FD' },
                  '&:hover': { bgcolor: '#F5F5F5' }
                }}
              >
                <ListItemText primary={s.title} secondary={`${s.start} – ${s.end}`} />
                <Typography variant="caption" sx={{ ml: 2 }}>{s.duration}</Typography>
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* RIGHT – 75% */}
        <Box sx={{ flexGrow: 1, pl: 2, overflowY: 'auto', px: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 300 }}>
              <InputLabel>Fill By Rules </InputLabel>
              <Select value={selRule} label="Fill By Rules" onChange={handleRuleChange}>
                {ruleSets.map(rule => <MenuItem key={rule} value={rule}>{rule}</MenuItem>)}
              </Select>
            </FormControl>
            <IconButton><SettingsIcon /></IconButton>
            <Button variant="outlined">Outbound All People</Button>
            <Button variant="outlined">Audit</Button>
          </Box>

          <Paper variant="outlined" sx={{ flex: '0 0 auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: '#E3F2FD' }}>
                  <TableCell>Number</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>List</TableCell>
                  <TableCell>Rank</TableCell>
                  <TableCell>Opportunity Factors</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map(emp => (
                  <TableRow key={emp.number} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                    <TableCell>{emp.number}</TableCell>
                    <TableCell>{emp.status}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.list}</TableCell>
                    <TableCell>{emp.rank}</TableCell>
                    <TableCell>{emp.factors}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Paper variant="outlined" sx={{ mt: 2, p: 2, flex: '1 1 auto', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
            <Typography variant="body2">{explanation}</Typography>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
}
