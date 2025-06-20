// src/pages/ShiftBiddingDefineSchedules.js
import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const orgOptions = ['Police', 'Fire', 'Parking', 'IOC'];

// Pre-populated schedule names for the list box
const scheduleNames = [
  'Police Night-Mo 8hr - 10p - 6a/Tu/Su/Mo/Tu/Sa/Su-12 hour Shift 6p-6a',
  'Police Night-Mo 8hr - 8p - 4a/Tu/Su/Mo/Tu/Sa/Su-12 hour Shift 4p-4a',
  'Police Day-Mo/Tu 8hr - 6a - 2p/Su/Mo/Tu/We/Su-12 hour Shift 6a-6p',
  'Police Day-Mo 8hr 4p - 12a/Tu/Su/Mo/Tu/We/Su-12 hour Shift 4a-4p',
  '4/10  - 10Hour - SUN/MON/TUE/WED - Shift -10A-10P',
  '4/10-ROTATE-Mo/Tu/We/Su-10 Hour Shift-4:30AM-3:00PM + 1:00PM-11:30PM',
  '5/8- 8- Hour - mo/tu/we/th/fr - 8 Hour Shift 7:00am - 3:00pm',
  '4/10-Th/Fr/Sa/Su-10 Hour Shift-9:00AM-7:30PM',
  '5/8 -8Hour -Mo/Th/Fr/Sa/Su-8 Hour Shift-2:00PM-10:30PM',
];

const initialBuckets = [
  {
    id: 1,
    name: scheduleNames[0],
    MinStaffLevel: 10,
    description: 'Regular Day Schedule for 9-5 shifts.',
  },
  {
    id: 2,
    name: scheduleNames[1],
    MinStaffLevel: 5,
    description: 'Year-end holiday period.',
  }
];

const initialCurrent = {
  id: null,
  name: '',
  MinStaffLevel: '',
  description: ''
};

export default function ShiftBiddingDefineSchedules() {
  const [buckets, setBuckets] = useState(initialBuckets);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(initialCurrent);
  const [selectedOrg, setSelectedOrg] = useState(orgOptions[0]);

  const openNew = () => {
    setIsEditing(false);
    setCurrent(initialCurrent);
    setOpen(true);
  };

  const openEdit = (bucket) => {
    setIsEditing(true);
    setCurrent({ ...bucket });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setBuckets(buckets.filter(b => b.id !== id));
  };

  const handleChange = (field) => (e) => {
    setCurrent({ ...current, [field]: e.target.value });
  };

  const handleSave = () => {
    // Ensure MinStaffLevel is a number
    const newCurrent = {
      ...current,
      MinStaffLevel: Number(current.MinStaffLevel),
    };

    if (isEditing) {
      setBuckets(buckets.map(b => (b.id === current.id ? newCurrent : b)));
    } else {
      const nextId = Math.max(0, ...buckets.map(b => b.id)) + 1;
      setBuckets([...buckets, { ...newCurrent, id: nextId }]);
    }
    setOpen(false);
  };

  return (
    <Layout title="Define Shift Schedules for Shift Bidding">
      <Box sx={{
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="org-select-label">Supervisory Organization</InputLabel>
          <Select
            labelId="org-select-label"
            id="org-select"
            value={selectedOrg}
            label="Supervisory Organization"
            onChange={e => setSelectedOrg(e.target.value)}
          >
            {orgOptions.map(org => (
              <MenuItem key={org} value={org}>{org}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={openNew}>
          Create New Schedule
        </Button>
      </Box>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Schedule Name</TableCell>
              <TableCell align="center">Min Staff Level</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buckets.map(bucket => (
              <TableRow key={bucket.id} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{bucket.name}</TableCell>
                <TableCell align="center">{bucket.MinStaffLevel}</TableCell>
                <TableCell>{bucket.description}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => openEdit(bucket)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(bucket.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Schedule' : 'Create New Schedule'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="schedule-name-label">Schedule Name</InputLabel>
            <Select
              labelId="schedule-name-label"
              id="schedule-name"
              value={current.name}
              label="Schedule Name"
              onChange={handleChange('name')}
            >
              {scheduleNames.map((schedule, idx) => (
                <MenuItem key={idx} value={schedule}>{schedule}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Min Staff Level"
            type="number"
            value={current.MinStaffLevel}
            onChange={handleChange('MinStaffLevel')}
            fullWidth
          />
          <TextField
            label="Description"
            value={current.description}
            onChange={handleChange('description')}
            multiline
            rows={3}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {isEditing ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
