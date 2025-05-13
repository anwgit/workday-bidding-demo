// src/pages/FillByRules.js
import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SendIcon     from '@mui/icons-material/Send';
import ListIcon     from '@mui/icons-material/List';

const positions = [
  {
    id:       1,
    title:    'PNT12E3_a/.../Night Terminal/B4 #7',
    start:    '06/18/2025 00:00',
    end:      '06/18/2025 04:00',
    duration: '4h'
  }, // trailing comma to avoid syntax errors
  // …add more if needed
];

const ruleSets = [
  'P AA Terminal OT Hiring 48hrs–14 days',
  'Another Rule Set'
];

const employees = [
  {
    number:  1,
    status:  '',
    name:    'Osterhoff, Stephen D. (COBRA)',
    list:    'P AA Signup Terminal 48 hrs – 14 days',
    rank:    'Police Officer',
    factors: '172, 06/26/2017'
  },
  {
    number:  2,
    status:  '',
    name:    'Konz, Christopher M. (FTO)',
    list:    'P AA Signup Terminal 48 hrs – 14 days',
    rank:    'Police Officer',
    factors: '214, 02/03/2020'
  }
];

export default function FillByRules() {
  const [selectedPos,  setSelectedPos]  = useState(positions[0].id);
  const [selectedRule, setSelectedRule] = useState(ruleSets[0]);

  return (
    <Layout title="Fill By Rules">
      <Grid container spacing={2}>
        {/* Positions Panel */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Positions</Typography>
            <Button size="small" variant="outlined" startIcon={<ListIcon />}>
              Sort By
            </Button>
            <Button size="small" variant="outlined">
              Contact Log
            </Button>
          </Box>
          <List>
            {positions.map((pos) => (
              <ListItem
                key={pos.id}
                component={Paper}
                variant="outlined"
                selected={selectedPos === pos.id}
                onClick={() => setSelectedPos(pos.id)}
                sx={{
                  mb: 1,
                  cursor: 'pointer',
                  '&.Mui-selected': { bgcolor: '#E3F2FD' },
                  '&:hover': { bgcolor: '#F5F5F5' }
                }}
              >
                <ListItemText
                  primary={pos.title}
                  secondary={`${pos.start}\n${pos.end}`}
                />
                <Typography variant="caption" sx={{ ml: 2 }}>
                  {pos.duration}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Fill by Rules Panel */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 300 }}>
              <InputLabel>Fill By Rules</InputLabel>
              <Select
                value={selectedRule}
                label="Fill By Rules"
                onChange={(e) => setSelectedRule(e.target.value)}
              >
                {ruleSets.map((rule) => (
                  <MenuItem key={rule} value={rule}>
                    {rule}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton size="large">
              <SettingsIcon />
            </IconButton>
            <Button variant="outlined" startIcon={<SendIcon />}>
              Outbound All People
            </Button>
            <Button variant="outlined">Audit</Button>
          </Box>

          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: '#E3F2FD' }}>
                  <TableCell>#</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>List</TableCell>
                  <TableCell>Rank</TableCell>
                  <TableCell>Opportunity Factors</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.number}>
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
        </Grid>
      </Grid>
    </Layout>
  );
}
