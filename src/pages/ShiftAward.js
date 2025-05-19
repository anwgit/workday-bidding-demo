import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  Box, Button,Typography, FormControl, InputLabel, Select, MenuItem,
  Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon  from '@mui/icons-material/Edit';

export default function ShiftAward() {
  const windows = [{ id:1,name:'Cycle A',slots:5,submitted:8,awarded:5 }];
  const [winId, setWinId] = useState(windows[0].id);
  const [subs, setSubs]   = useState([
    { id:1,name:'Doe, John',seniority:'2015-06-12',submitted:'2025-05-10',awarded:true }
  ]);
  const [ovr, setOvr]     = useState({open:false,empId:'',reason:''});

  const autoAward = ()=>{/* POST /award */}
  const toggle = id => {/* PUT /bid/award */};
  const doOverride = () => {/* POST /bid/override */};

  return (
    <Layout title="Resolve & Override">
      <Box sx={{ display:'flex', alignItems:'center',gap:2,mb:2 }}>
        <FormControl size="small">
          <InputLabel>Window</InputLabel>
          <Select value={winId} label="Window" onChange={e=>setWinId(e.target.value)}>
            {windows.map(w=> <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
          </Select>
        </FormControl>
        <Typography>Capacity: {windows[0].slots} | Submitted: {windows[0].submitted} | Awarded: {windows[0].awarded}</Typography>
        <Button variant="contained" onClick={autoAward}>Auto Award</Button>
      </Box>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background:'#F0F7FF' }}>
              <TableCell>Employee</TableCell><TableCell>Seniority</TableCell><TableCell>Submitted</TableCell>
              <TableCell>Awarded</TableCell><TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subs.map(s=>(
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.seniority}</TableCell>
                <TableCell>{s.submitted}</TableCell>
                <TableCell>{s.awarded? <CheckIcon color="success"/> : <ClearIcon color="error"/>}</TableCell>
                <TableCell>
                  <Button size="small" onClick={()=>toggle(s.id)}>{s.awarded?'Revoke':'Assign'}</Button>
                  <IconButton size="small" onClick={()=>setOvr({open:true,empId:s.id,reason:''})}><EditIcon/></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={ovr.open} onClose={()=>setOvr(o=>({...o,open:false}))}>
        <DialogTitle>Override</DialogTitle>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2,mt:1 }}>
          <TextField label="Reason" multiline rows={3} value={ovr.reason} onChange={e=>setOvr(o=>({...o,reason:e.target.value}))}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOvr(o=>({...o,open:false}))}>Cancel</Button>
          <Button variant="contained" onClick={doOverride}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
