// src/pages/OvertimeShiftsView.js
import React from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const sampleOvertimeShifts = [
  {
    id:          201,
    title:       'Night Terminal B4 #7',
    start:       '2025-06-18 00:00',
    end:         '2025-06-18 04:00',
    duration:    '4h',
    createdBy:   'Auto (Min Staff Rule)'
  },
  {
    id:        202,
    title:     'Downtown Patrol Overtime',
    start:     '2025-06-19 16:00',
    end:       '2025-06-19 20:00',
    duration:  '4h',
    createdBy: 'Manual'
  },
  {
    id:        203,
    title:     'Weekend Special Event',
    start:     '2025-06-21 10:00',
    end:       '2025-06-21 18:00',
    duration:  '8h',
    createdBy: 'Manual'
  },
  {
    id:        204,
    title:     'Holiday Coverage',
    start:     '2025-07-04 00:00',
    end:       '2025-07-04 12:00',
    duration:  '12h',
    createdBy: 'Scheduled'
  }
];

export default function OvertimeShiftsView() {
  return (
    <Layout title="Overtime Shifts">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Open Overtime Shifts</Typography>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Shift ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell align="center">Duration</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleOvertimeShifts.map(shift => (
              <TableRow key={shift.id} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{shift.id}</TableCell>
                <TableCell>{shift.title}</TableCell>
                <TableCell>{shift.start}</TableCell>
                <TableCell>{shift.end}</TableCell>
                <TableCell align="center">{shift.duration}</TableCell>
                <TableCell>{shift.createdBy}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    href={`/overtime-shifts-edit?id=${shift.id}`}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Layout>
  );
}
