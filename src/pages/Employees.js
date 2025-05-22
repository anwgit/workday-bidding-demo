import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Layout from '../components/Layout';
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';

export default function Employees() {
  const [employees, setEmployees] = useState(null);

  useEffect(() => {
    const url = `${process.env.PUBLIC_URL}/employees.csv`;
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load ${url} (${r.status})`);
        return r.text();
      })
      .then(csv => {
        const { data } = Papa.parse(csv, { header: true });
        // filter out any blank rows
        setEmployees(data.filter(r => r.EmployeeID));
      })
      .catch(err => {
        console.error(err);
        setEmployees([]);
      });
  }, []);

  return (
    <Layout title="Employees">
      {!employees ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            All Employees
          </Typography>
          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: '#F0F7FF' }}>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Org</TableCell>
                  <TableCell>Hire Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map(emp => (
                  <TableRow key={emp.EmployeeID}>
                    <TableCell>{emp.EmployeeID}</TableCell>
                    <TableCell>{emp.Name}</TableCell>
                    <TableCell>{emp.Position}</TableCell>
                    <TableCell>{emp.Org}</TableCell>
                    <TableCell>{emp.Hire || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </Layout>
  );
}
