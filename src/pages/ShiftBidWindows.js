import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Box, Button, TextField, Switch, Checkbox,
  FormControlLabel, FormControl, InputLabel, Select, MenuItem, Paper
} from '@mui/material';

export default function ShiftBidWindows() {
  const [windows, setWindows] = useState([]);
  const [sel, setSel] = useState('');
  const [cfg, setCfg] = useState({
    name:'', startDate:'', endDate:'', isAlwaysOpen:false, adHocEnabled:false
  });

  useEffect(() => {
    // TODO: GET /api/bid-windows
    const w = [{ id:1,name:'Cycle A',startDate:'2025-06-01',endDate:'2025-06-10',isAlwaysOpen:false,adHocEnabled:true }];
    setWindows(w);
    setSel(w[0].id);
    setCfg(w[0]);
  }, []);

  const save = () => {/* POST/PUT */}
  const launch = () => {/* POST /launch */}

  return (
    <Layout title="Bid Window Mgmt">
      <FormControl size="small" sx={{ mb:2, minWidth:300 }}>
        <InputLabel>Existing Windows</InputLabel>
        <Select value={sel} label="Existing Windows" onChange={e=>{const id=e.target.value;setSel(id);setCfg(windows.find(w=>w.id===id));}}>
          <MenuItem value=''><em>New</em></MenuItem>
          {windows.map(w=>(
            <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Paper variant="outlined" sx={{ p:2 }}>
        <TextField fullWidth size="small" label="Name" value={cfg.name} onChange={e=>setCfg({...cfg,name:e.target.value})} sx={{ mb:2 }} />
        <TextField fullWidth size="small" label="Start Date" type="date" InputLabelProps={{shrink:true}}
          value={cfg.startDate} onChange={e=>setCfg({...cfg,startDate:e.target.value})} sx={{ mb:2 }} disabled={cfg.isAlwaysOpen}/>
        <TextField fullWidth size="small" label="End Date" type="date" InputLabelProps={{shrink:true}}
          value={cfg.endDate} onChange={e=>setCfg({...cfg,endDate:e.target.value})} sx={{ mb:2 }} disabled={cfg.isAlwaysOpen}/>
        <FormControlLabel control={<Switch checked={cfg.isAlwaysOpen} onChange={e=>setCfg({...cfg,isAlwaysOpen:e.target.checked})}/>} label="Always Open" />
        <FormControlLabel control={<Checkbox checked={cfg.adHocEnabled} onChange={e=>setCfg({...cfg,adHocEnabled:e.target.checked})}/>} label="Enable Ad-Hoc Launch" />
        <Box sx={{ mt:2, display:'flex', gap:2 }}>
          <Button variant="contained" onClick={save}>Save</Button>
          <Button variant="outlined" onClick={launch} disabled={!cfg.adHocEnabled}>Launch Now</Button>
        </Box>
      </Paper>
    </Layout>
  );
}
