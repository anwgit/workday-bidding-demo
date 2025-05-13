import React from 'react';
import {
  Avatar, List, ListItem, ListItemAvatar,
  ListItemText, Paper, Box, Typography
} from '@mui/material';
import Layout from '../components/Layout';

const employees = [
  { name: 'Alice Johnson', role: 'Firefighter' },
  { name: 'Bob Smith',     role: 'Paramedic'  },
  { name: 'Carol Lee',     role: 'Dispatcher' }
];

const avatarBg = ['#FFAB00','#36B37E','#6554C0'];

export default function Employees() {
  return (
    <Layout title="Employees">
      <Box sx={{ mb:2 }}>
        <Typography variant="h6">Team Roster</Typography>
      </Box>
      <Paper>
        <List>
          {employees.map((emp, i) => (
            <ListItem
              key={emp.name}
              sx={{
                '&:hover': { background: '#F7F9FC' }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: avatarBg[i % avatarBg.length] }}>
                  {emp.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={emp.name}
                secondary={emp.role}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Layout>
  );
}
