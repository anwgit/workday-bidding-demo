// src/pages/RuleSetsView.js
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

const sampleRuleSets = [
  { id:  1, name: '*P COBRA OT Hiring within 48 hours',           earliestSignup: '-48h', latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id:  2, name: '*P Delta Hiring within 48 hours',             earliestSignup: '-48h', latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id:  3, name: '*PInternational Pkwy Hiring within 48 hr',    earliestSignup: '-48h', latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id:  4, name: '*P Off Duty',                                 earliestSignup: null,   latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id:  5, name: '*P Police OT Hiring within 48 hours',         earliestSignup: '-48h', latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id:  6, name: '*P Terminal OT Hiring within 48 hours',       earliestSignup: '-48h', latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id:  7, name: '*P Vehicle OT Hiring within 48 hours',        earliestSignup: '-48h', latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id:  8, name: 'P AA COBRA OT Hiring 48hrs - 14 days',         earliestSignup: '-14D', latestSignup: '-48h', positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id:  9, name: 'P AA Delta Hiring 48hrs - 14 days',           earliestSignup: '-14D', latestSignup: '-48h', positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 10, name: 'P AA International Pkwy Hiring 14 days',      earliestSignup: '-14D', latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 11, name: 'P AA Off Duty 48hrs - 14 days',               earliestSignup: '-14D', latestSignup: '-48h', positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 12, name: 'P AA Police OT Hiring 48hrs - 14 days',       earliestSignup: '-14D', latestSignup: '-48h', positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 13, name: 'P AA Terminal OT Hiring 48hrs - 14 days',     earliestSignup: '-14D', latestSignup: '-48h', positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 14, name: 'P AA Vehicle OT Hiring 48hrs - 14 days',      earliestSignup: '-14D', latestSignup: '-48h', positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 15, name: 'P All Signups',                              earliestSignup: null,   latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 16, name: 'P Early or Late 8',                          earliestSignup: null,   latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 17, name: 'P Emergency Only',                           earliestSignup: null,   latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 18, name: 'P Jail Hiring 48hrs - 14 days',              earliestSignup: '-14D', latestSignup: '-48h', positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 19, name: 'P Jail Hiring within 48 hours',              earliestSignup: null,   latestSignup: '-48h', positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 20, name: 'P K9 EOD Special Ops Signup',                earliestSignup: null,   latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 21, name: 'P Mandatory List',                           earliestSignup: null,   latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 22, name: 'P Signup Traffic and SWAT',                  earliestSignup: null,   latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } },
  { id: 23, name: 'P Special Event OT Hiring',                  earliestSignup: null,   latestSignup: null, positions: [], certifications: [], priority: [], notifications: { methods: [], maxAttempts: 0, attemptTimeout: 0 }, fallback: { afterAllDecline: false, notifyDeptWide: false } }
];

export default function RuleSetsView() {
  return (
    <Layout title="Rule Sets">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Existing Rule Sets</Typography>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#F0F7FF' }}>
              <TableCell>Name</TableCell>
              <TableCell>Earliest Sign-Up</TableCell>
              <TableCell>Latest Sign-Up</TableCell>
              <TableCell align="center"># Positions</TableCell>
              <TableCell align="center"># Certs</TableCell>
              <TableCell align="center"># Priority</TableCell>
              <TableCell align="center"># Methods</TableCell>
              <TableCell align="center">Attempts</TableCell>
              <TableCell align="center">Timeout (s)</TableCell>
              <TableCell align="center">Fallback All Decline</TableCell>
              <TableCell align="center">Dept-Wide Fallback</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleRuleSets.map(rule => (
              <TableRow key={rule.id} sx={{ '&:hover': { background: '#EEF5FF' } }}>
                <TableCell>{rule.name}</TableCell>
                <TableCell>{rule.earliestSignup || '-'}</TableCell>
                <TableCell>{rule.latestSignup || '-'}</TableCell>
                <TableCell align="center">{rule.positions.length}</TableCell>
                <TableCell align="center">{rule.certifications.length}</TableCell>
                <TableCell align="center">{rule.priority.length}</TableCell>
                <TableCell align="center">{rule.notifications.methods.length}</TableCell>
                <TableCell align="center">{rule.notifications.maxAttempts}</TableCell>
                <TableCell align="center">{rule.notifications.attemptTimeout}</TableCell>
                <TableCell align="center">
                  {rule.fallback.afterAllDecline ? 'Yes' : 'No'}
                </TableCell>
                <TableCell align="center">
                  {rule.fallback.notifyDeptWide ? 'Yes' : 'No'}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    href={`/rule-sets?edit=${rule.id}`}
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
