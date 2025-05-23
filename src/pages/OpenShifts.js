// src/pages/OpenShifts.js
import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import Layout from '../components/Layout';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Autocomplete } from '@mui/material';

export default function OpenShifts() {
  // Data state
  const [shifts, setShifts] = useState([]);
  const [bids, setBids] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [bidCounts, setBidCounts] = useState({});

  // UI state
  const [orgFilter, setOrgFilter] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  // Total Bids popup
  const [biddersOpen, setBiddersOpen] = useState(false);
  const [activeShiftId, setActiveShiftId] = useState(null);
  const [activeBidders, setActiveBidders] = useState([]);

  // Worker assignment popup
  const [workerOpen, setWorkerOpen] = useState(false);
  const [assignShiftId, setAssignShiftId] = useState(null);
  const [assignValue, setAssignValue] = useState(null);

  // Add Shifts popup
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    shiftName: '',
    startDate: '',
    endDate: '',
    position: '',
    location: '',
    org: ''
  });

  // load CSVs
  useEffect(() => {
    async function loadData() {
      const base = process.env.PUBLIC_URL || '';
      const [shRes, bidRes, empRes] = await Promise.all([
        fetch(`${base}/Employee_shifts.csv`),
        fetch(`${base}/employee_bids.csv`),
        fetch(`${base}/employees.csv`)
      ]);
      const [shText, bidText, empText] = await Promise.all([
        shRes.text(),
        bidRes.text(),
        empRes.text()
      ]);

      const { data: parsedShifts } = Papa.parse(shText, {
        header: true, skipEmptyLines: true, transformHeader: h => h.trim()
      });
      const { data: parsedBids } = Papa.parse(bidText, {
        header: true, skipEmptyLines: true, transformHeader: h => h.trim()
      });
      const { data: parsedEmps } = Papa.parse(empText, {
        header: true, skipEmptyLines: true, transformHeader: h => h.trim()
      });

      // employees list
      setEmployees(parsedEmps.filter(e => e.EmployeeID && e.Name));

      // bids list
      setBids(parsedBids);

      // bid counts
      const counts = {};
      parsedBids.forEach(b => {
        if (b.ShiftID) counts[b.ShiftID] = (counts[b.ShiftID] || 0) + 1;
      });
      setBidCounts(counts);

      // build shifts
      const clean = parsedShifts
        .filter(r => r['Shift ID'])
        .map(r => ({
          shiftId:        r['Shift ID'],
          shiftName:      r['Shift Name'],
          start:          r.Start,
          end:            r.End,
          org:            r.Org,
          position:       r.Position,
          location:       r.Location,
          status:         r.Status || (r.Worker ? 'Assigned' : 'Open'),
          totalBids:      counts[r['Shift ID']] || 0,
          workerAssigned: r.Worker || 'Unassigned'
        }));
      setShifts(clean);
    }
    loadData();
  }, []);

  // Org filter options
  const orgOptions = useMemo(() => {
    const s = new Set(shifts.map(s => s.org).filter(o => o));
    return ['All', ...Array.from(s)];
  }, [shifts]);

  // apply org filter
  const filtered = useMemo(() => {
    return orgFilter === 'All'
      ? shifts
      : shifts.filter(s => s.org === orgFilter);
  }, [shifts, orgFilter]);

  // sorting
  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortBy], bv = b[sortBy];
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv;
      } else {
        cmp = String(av).localeCompare(String(bv));
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortBy, sortDir]);

  const handleSort = id => {
    if (sortBy === id) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(id); setSortDir('asc'); }
  };

  // open bidders dialog
  const openBidders = shiftId => {
    setActiveShiftId(shiftId);
    const list = bids
      .filter(b => b.ShiftID === shiftId)
      .map(b => ({
        name: employees.find(e => e.EmployeeID === b.EmployeeID)?.Name || b.EmployeeID,
        preference: b.Preference
      }));
    setActiveBidders(list);
    setBiddersOpen(true);
  };

  // open worker assignment dialog
  const openWorkerDialog = shiftId => {
    setAssignShiftId(shiftId);
    setAssignValue(shifts.find(s => s.shiftId === shiftId)?.workerAssigned || '');
    setWorkerOpen(true);
  };

  // confirm assignment
  const handleAssign = () => {
    setShifts(s =>
      s.map(item =>
        item.shiftId === assignShiftId
          ? { ...item, workerAssigned: assignValue || 'Unassigned' }
          : item
      )
    );
    setWorkerOpen(false);
  };

  // Add Shifts modal handlers
  const onAddClick = () => setAddOpen(true);
  const onAddCreate = () => {
    const { shiftName, startDate, endDate, position, location, org } = form;
    if (!shiftName || !startDate || !endDate) return;
    const sd = new Date(startDate), ed = new Date(endDate);
    const newRows = [];
    for (let d = new Date(sd); d <= ed; d.setDate(d.getDate() + 1)) {
      newRows.push({
        shiftId: `${Date.now()}${d.getDate()}`,
        shiftName,
        start: `${d.toISOString().slice(0,10)} 00:00`,
        end:   `${d.toISOString().slice(0,10)} 23:59`,
        org,
        position,
        location,
        status: 'Open',
        totalBids: 0,
        workerAssigned: 'Unassigned'
      });
    }
    setShifts(prev => [...newRows, ...prev]);
    setForm({ shiftName:'', startDate:'', endDate:'', position:'', location:'', org:'' });
    setAddOpen(false);
  };

  // define columns
  const columns = [
    { id: 'shiftId',      label: 'Shift ID' },
    { id: 'shiftName',    label: 'Shift Name' },
    { id: 'start',        label: 'Start' },
    { id: 'end',          label: 'End' },
    { id: 'org',          label: 'Org' },
    { id: 'position',     label: 'Position' },
    { id: 'location',     label: 'Location' },
    { id: 'status',       label: 'Status' },
    { id: 'totalBids',    label: 'Total Bids', numeric: true },
    { id: 'workerAssigned', label: 'Worker Assigned' }
  ];

  return (
    <Layout title="Open Shifts">
      <Box sx={{ display:'flex', gap:2, flexWrap:'wrap', mb:2 }}>
        <FormControl size="small" sx={{ minWidth:200 }}>
          <InputLabel>Supervisory Org</InputLabel>
          <Select
            value={orgFilter}
            label="Supervisory Org"
            onChange={e=>setOrgFilter(e.target.value)}
          >
            {orgOptions.map(o=>(
              <MenuItem key={o} value={o}>{o}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={onAddClick}>Add Shifts</Button>
        <Button variant="contained">Auto Generate – Fill Gaps</Button>
        <Button variant="contained">Send Notifications</Button>
        <Button variant="contained">Push to Workday</Button>
      </Box>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background:'#F0F7FF' }}>
              {columns.map(col=>(
                <TableCell
                  key={col.id}
                  align={col.numeric?'right':'left'}
                  sortDirection={sortBy===col.id?sortDir:false}
                >
                  <TableSortLabel
                    active={sortBy===col.id}
                    direction={sortBy===col.id?sortDir:'asc'}
                    onClick={()=>handleSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map(row=>(
              <TableRow key={row.shiftId}>
                {columns.map(col=>{
                  const v = row[col.id];
                  if (col.id==='totalBids') {
                    return (
                      <TableCell key={col.id} align="right">
                        <Link component="button" onClick={()=>openBidders(row.shiftId)}>
                          {v}
                        </Link>
                      </TableCell>
                    );
                  }
                  if (col.id==='workerAssigned') {
                    return (
                      <TableCell key={col.id}>
                        {v}{' '}
                        <IconButton size="small" onClick={()=>openWorkerDialog(row.shiftId)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={col.id} align={col.numeric?'right':'left'}>
                      {v}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Bidders Dialog */}
      <Dialog open={biddersOpen} onClose={()=>setBiddersOpen(false)}>
        <DialogTitle>Bidders for Shift {activeShiftId}</DialogTitle>
        <DialogContent dividers>
          <List dense>
            {activeBidders.length>0 ? activeBidders.map((b,i)=>(
              <ListItem key={i}>
                <ListItemText primary={`${b.name} — Preference ${b.preference}`} />
              </ListItem>
            )) : (
              <ListItem>
                <ListItemText primary="No bids yet" />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setBiddersOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Worker Assignment Dialog */}
      <Dialog open={workerOpen} onClose={()=>setWorkerOpen(false)}>
        <DialogTitle>Assign Worker</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={employees.map(e=>e.Name)}
            value={assignValue}
            onChange={(e,newVal)=>setAssignValue(newVal)}
            renderInput={params=>(
              <TextField {...params} label="Select Employee" autoFocus fullWidth/>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setWorkerOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssign}>Assign</Button>
        </DialogActions>
      </Dialog>

      {/* Add Shifts Dialog */}
      <Dialog open={addOpen} onClose={()=>setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Shifts</DialogTitle>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2 }}>
          <TextField
            label="Shift Name"
            value={form.shiftName}
            onChange={e=>setForm(f=>({...f,shiftName:e.target.value}))}
            fullWidth
          />
          <TextField
            label="Shift Start Date"
            type="date"
            value={form.startDate}
            onChange={e=>setForm(f=>({...f,startDate:e.target.value}))}
            InputLabelProps={{ shrink:true }}
            fullWidth
          />
          <TextField
            label="Shift End Date"
            type="date"
            value={form.endDate}
            onChange={e=>setForm(f=>({...f,endDate:e.target.value}))}
            InputLabelProps={{ shrink:true }}
            fullWidth
          />
          <TextField
            label="Position"
            value={form.position}
            onChange={e=>setForm(f=>({...f,position:e.target.value}))}
            fullWidth
          />
          <TextField
            label="Location"
            value={form.location}
            onChange={e=>setForm(f=>({...f,location:e.target.value}))}
            fullWidth
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Supervisory Org</InputLabel>
            <Select
              value={form.org}
              label="Supervisory Org"
              onChange={e=>setForm(f=>({...f,org:e.target.value}))}
            >
              {orgOptions.filter(o=>'All'!==o).map(o=>(
                <MenuItem key={o} value={o}>{o}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={onAddCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
