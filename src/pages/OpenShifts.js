import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  Box, Button, TextField, MenuItem, FormControl, Select,
  Paper, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';

export default function OpenShifts() {
  const [from, setFrom] = useState('');
  const [to,   setTo]   = useState('');
  const [dept, setDept] = useState('');
  const depts = ['Police','Fire','Security'];
  const [rows,setRows]  = useState([
    { id:201,name:'Night Watch',date:'2025-06-18',origin:'Auto',bids:5,status:'Open' }
  ]);

  const autoGen = ()=>{/* POST /auto */}

  return (
    <Layout title="Open Shifts">
      <Box sx={{ display:'flex', gap:2, mb:2 }}>
        <TextField label="From" type="date" value={from} onChange={e=>setFrom(e.target.value)} InputLabelProps={{ shrink:true }}/>
        <TextField label="To"   type="date" value={to}   onChange={e=>setTo(e.target.value)}   InputLabelProps={{ shrink:true }}/>
        <FormControl size="small" sx={{ minWidth:200 }}>
          <Select value={dept} onChange={e=>setDept(e.target.value)} displayEmpty>
            <MenuItem value=""><em>All Depts</em></MenuItem>
            {depts.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={autoGen}>Auto-Generate Gaps</Button>
      </Box>
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background:'#F0F7FF' }}>
              <TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Date</TableCell>
              <TableCell>Origin</TableCell><TableCell>Total Bids</TableCell><TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r=>(
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.origin}</TableCell>
                <TableCell>{r.bids}</TableCell>
                <TableCell>{r.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Layout>
  );
}
