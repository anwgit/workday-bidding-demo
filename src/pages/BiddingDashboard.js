import React from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button
} from '@mui/material';
import SearchIcon       from '@mui/icons-material/Search';
import AccessTimeIcon   from '@mui/icons-material/AccessTime';
import BeachAccessIcon  from '@mui/icons-material/BeachAccess';
import ConfigureIcon from '@mui/icons-material/Settings';


const cards = [
  {
    title:    'Manage Shift Bidding',
    subtitle: 'Task to bid shift',
    button:   'Manage Shift Bidding',
    icon:     <SearchIcon fontSize="large" color="primary" />
  },
  {
    title:    'Manage Overtime Bidding',
    subtitle: 'Task to bid overtime',
    button:   'View Employee Shifts',
    icon:     <AccessTimeIcon fontSize="large" color="primary" />
  },
  {
    title:    'Manage Vacation Bidding',
    subtitle: 'Task to bid vacation',
    button:   'Review Shifts',
    icon:     <BeachAccessIcon fontSize="large" color="primary" />
  },
  {
    title:    'Administer /Configuration',
    subtitle: 'Task to configure app and other functions',
    button:   'Configure',
    icon:     <ConfigureIcon fontSize="large" color="primary" />
  }
];

export default function BiddingDashboard() {
  return (
    <Layout title="DFW Bidding Dashboard">
      <Box sx={{ flexGrow: 1, mt: 1 }}>
        <Grid container spacing={3}>
          {cards.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.title}>
              <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {c.icon}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6">{c.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {c.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                  <Button variant="outlined">
                    {c.button}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ textAlign: 'right', mt: 4, color: 'text.secondary' }}>
        
      </Box>
    </Layout>
  );
}
