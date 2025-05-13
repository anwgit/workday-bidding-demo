// src/pages/VacationsBuckets.js
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
  TableBody
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const initialBuckets = [
  {
    id: 1,
    name: 'Summer Vacation',
    start: '2025-06-01',
    end: '2025-08-31',
    slots: 10,
    description: 'Peak season for summer time off.'
  },
  {
    id: 2,
    name: 'Winter Holiday',
    start: '2025-12-15',
    end: '2026-01-15',
    slots: 5,
    description: 'Year-end holiday period.'
  }
];

export default function VacationsBuckets() {
  const [buckets, setBuckets] = useState(initialBuckets);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    name: '',
    start: '',
    end: '',
    slots: '',
    description: ''
  });

  const openNew = () => {
    setIsEditing(false);
    setCurrent({ id: null, name: '', start: '', end: '', slots: '', description: '' });
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
    if (isEditing) {
      setBuckets(buckets.map(b => (b.id === current.id ? current : b)));
    } else {
      const nextId = Math.max(0, ...buckets.map(b => b.id)) + 1;
      setBuckets([...buckets, { ...current, id: nextId }]);
    }
    setOpen(false);
  };

  return (
    <Layout title="Bucket Definitions">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={openNew}>
          Create New Bucket
        </Button>
      </Box>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Bucket Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell align="center">Slot Count</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buckets.map(bucket => (
              <TableRow key={bucket.id} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{bucket.name}</TableCell>
                <TableCell>{bucket.start}</TableCell>
                <TableCell>{bucket.end}</TableCell>
                <TableCell align="center">{bucket.slots}</TableCell>
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
          {isEditing ? 'Edit Bucket' : 'Create New Bucket'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Bucket Name"
            value={current.name}
            onChange={handleChange('name')}
            fullWidth
          />
          <TextField
            label="Start Date"
            type="date"
            value={current.start}
            onChange={handleChange('start')}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="End Date"
            type="date"
            value={current.end}
            onChange={handleChange('end')}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Slot Count"
            type="number"
            value={current.slots}
            onChange={handleChange('slots')}
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
