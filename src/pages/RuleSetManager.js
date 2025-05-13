// src/pages/RuleSetManager.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Switch,
  FormControlLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AVAILABLE_POSITIONS = [
  'PNT12E3_a','PNT12E3_b','RN_NIGHT_SHIFT'
];
const AVAILABLE_CERTIFICATIONS = [
  'Police Officer','FTO','Paramedic'
];
const AVAILABLE_PRIORITY_FIELDS = [
  'seniorityNumber','lastOvertimeAssigned','lastShiftDate'
];
const AVAILABLE_NOTIFICATION_METHODS = [
  'Phone','Text','Email'
];

export default function RuleSetManager({ initialRule, onSave }) {
  // if initialRule is passed in, we edit; otherwise create new
  const [name, setName] = useState('');
  const [earliestOffset, setEarliestOffset] = useState('');
  const [latestOffset,   setLatestOffset]   = useState('');
  const [positions,      setPositions]      = useState([]);
  const [certs,          setCerts]          = useState([]);
  const [priority,       setPriority]       = useState([]);
  const [notifMethods,   setNotifMethods]   = useState([]);
  const [maxAttempts,    setMaxAttempts]    = useState(3);
  const [timeoutSec,     setTimeoutSec]     = useState(120);
  const [fallbackAllDecline, setFallbackAllDecline] = useState(false);
  const [fallbackDeptWide,  setFallbackDeptWide]    = useState(false);

  useEffect(() => {
    if (initialRule) {
      setName(initialRule.name);
      setEarliestOffset(initialRule.eligibility.earliestSignup.offset);
      setLatestOffset(initialRule.eligibility.latestSignup.offset);
      setPositions(initialRule.qualifications.positionCodes);
      setCerts(initialRule.qualifications.certifications);
      setPriority(initialRule.priority.map(p => `${p.by}:${p.direction}`));
      setNotifMethods(initialRule.notifications.methods);
      setMaxAttempts(initialRule.notifications.maxAttempts);
      setTimeoutSec(initialRule.notifications.attemptTimeout);
      setFallbackAllDecline(initialRule.fallback?.afterAllDecline ?? false);
      setFallbackDeptWide(initialRule.fallback?.notifyDeptWide ?? false);
    }
  }, [initialRule]);

  const handleSave = () => {
    // assemble the rule object
    const rule = {
      name,
      eligibility: {
        earliestSignup: { offset: earliestOffset },
        latestSignup:   { offset: latestOffset }
      },
      qualifications: {
        positionCodes:    positions,
        certifications:   certs
      },
      priority: priority.map(item => {
        const [by, direction] = item.split(':');
        return { by, direction };
      }),
      notifications: {
        methods:        notifMethods,
        maxAttempts,
        attemptTimeout: timeoutSec
      },
      fallback: {
        afterAllDecline: fallbackAllDecline,
        notifyDeptWide:  fallbackDeptWide
      }
    };
    onSave && onSave(rule);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom>
        {initialRule ? 'Edit Rule Set' : 'Create Rule Set'}
      </Typography>

      {/* 1. Basic Info */}
      <TextField
        fullWidth
        label="Rule Set Name"
        value={name}
        onChange={e => setName(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* 2. Eligibility */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Eligibility Window</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Earliest Signup Offset"
              helperText="e.g. -14D, -7d"
              value={earliestOffset}
              onChange={e => setEarliestOffset(e.target.value)}
            />
            <TextField
              label="Latest Signup Offset"
              helperText="e.g. -48h"
              value={latestOffset}
              onChange={e => setLatestOffset(e.target.value)}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* 3. Qualifications */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Qualifications</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Position Codes</InputLabel>
            <Select
              multiple
              value={positions}
              onChange={e => setPositions(e.target.value)}
              input={<OutlinedInput label="Position Codes" />}
              renderValue={selected => selected.join(', ')}
            >
              {AVAILABLE_POSITIONS.map(code => (
                <MenuItem key={code} value={code}>
                  <Checkbox checked={positions.includes(code)} />
                  <ListItemText primary={code} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Certifications</InputLabel>
            <Select
              multiple
              value={certs}
              onChange={e => setCerts(e.target.value)}
              input={<OutlinedInput label="Certifications" />}
              renderValue={selected => selected.join(', ')}
            >
              {AVAILABLE_CERTIFICATIONS.map(c => (
                <MenuItem key={c} value={c}>
                  <Checkbox checked={certs.includes(c)} />
                  <ListItemText primary={c} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* 4. Priority */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Priority Ordering</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <InputLabel>Sort Fields</InputLabel>
            <Select
              multiple
              value={priority}
              onChange={e => setPriority(e.target.value)}
              input={<OutlinedInput label="Sort Fields" />}
              renderValue={selected => selected.join(', ')}
            >
              {AVAILABLE_PRIORITY_FIELDS.flatMap(field =>
                ['asc','desc'].map(dir => `${field}:${dir}`)
              ).map(item => (
                <MenuItem key={item} value={item}>
                  <Checkbox checked={priority.includes(item)} />
                  <ListItemText primary={item} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* 5. Notifications */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Notification Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Methods</InputLabel>
            <Select
              multiple
              value={notifMethods}
              onChange={e => setNotifMethods(e.target.value)}
              input={<OutlinedInput label="Methods" />}
              renderValue={selected => selected.join(', ')}
            >
              {AVAILABLE_NOTIFICATION_METHODS.map(m => (
                <MenuItem key={m} value={m}>
                  <Checkbox checked={notifMethods.includes(m)} />
                  <ListItemText primary={m} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              type="number"
              label="Max Attempts"
              value={maxAttempts}
              onChange={e => setMaxAttempts(+e.target.value)}
            />
            <TextField
              type="number"
              label="Timeout (sec)"
              value={timeoutSec}
              onChange={e => setTimeoutSec(+e.target.value)}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* 6. Fallback */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Fallback Options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Switch
                checked={fallbackAllDecline}
                onChange={e => setFallbackAllDecline(e.target.checked)}
              />
            }
            label="After all decline: retry dept-wide"
          />
          <FormControlLabel
            control={
              <Switch
                checked={fallbackDeptWide}
                onChange={e => setFallbackDeptWide(e.target.checked)}
              />
            }
            label="Notify entire department"
          />
        </AccordionDetails>
      </Accordion>

      {/* Save */}
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button variant="contained" onClick={handleSave}>
          {initialRule ? 'Update Rule Set' : 'Create Rule Set'}
        </Button>
      </Box>
    </Box>
  );
}
