import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  Box, Grid, Card, CardContent, Typography,
  List, ListItemButton, ListItemText, Button,
  FormControl, InputLabel, Select, MenuItem,
  Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

export default function ShiftBidding() {
  const shifts = [
    { id:1,title:'Night Watch (8pm-8am)', start:'2025-06-18', end:'2025-06-19', dur:'12h' },
    // …
  ];
  const rules  = ['Seniority','Rotation','Custom'];
  const [selShift,setSelShift] = useState(shifts[0].id);
  const [selRule, setSelRule]  = useState(rules[0]);
  const [explain, setExplain]  = useState('Select a rule to see logic…');
  const employees = [
    { num:1,status:'',name:'Doe, John',list:'Seniority',rank:'1',factors:'…' }
  ];

  const onRule = r => {
    setSelRule(r);
    setExplain(`Logic for ${r}: …`);
  };

  return (
    <Layout title="Execute Shift Bidding">
      <Box sx={{ display:'flex', mb:2, gap:1 }}>
        <Button variant="outlined">Sort By</Button>
        <Button variant="outlined">Contact Log</Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <List>
            {shifts.map(s=>(
              <ListItemButton
                key={s.id}
                selected={selShift===s.id}
                onClick={()=>setSelShift(s.id)}
              >
                <ListItemText primary={s.title} secondary={`${s.start} – ${s.end}`} />
                <Typography variant="caption">{s.dur}</Typography>
              </ListItemButton>
            ))}
          </List>
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:2 }}>
            <FormControl size="small">
              <InputLabel>Rule</InputLabel>
              <Select
                value={selRule}
                label="Rule"
                onChange={e=>onRule(e.target.value)}
              >
                {rules.map(r=> <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
            <IconButton><SettingsIcon/></IconButton>
            <Button variant="outlined">Outbound All</Button>
            <Button variant="outlined">Audit</Button>
          </Box>

          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background:'#F0F7FF' }}>
                  <TableCell>#</TableCell><TableCell>Name</TableCell><TableCell>Rank</TableCell>
                  <TableCell>List</TableCell><TableCell>Factors</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map(emp=>(
                  <TableRow key={emp.num}>
                    <TableCell>{emp.num}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.rank}</TableCell>
                    <TableCell>{emp.list}</TableCell>
                    <TableCell>{emp.factors}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Paper variant="outlined" sx={{ mt:2, p:2, whiteSpace:'pre-wrap' }}>
            <Typography variant="body2">{explain}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
