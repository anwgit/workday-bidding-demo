import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Button, IconButton, Typography
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function BidQueueTable({ otEvents, weights }) {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // WebSocket subscription to live queue
    // const ws = new WebSocket('wss://.../ot-queue');
    // ws.onmessage = e => setQueue(JSON.parse(e.data));
    // return () => ws.close();
  }, []);

  const handleAward = (id, award) => {
    fetch(`/api/ot-bid/${id}/${award?'award':'decline'}`, { method: 'POST' })
      .then(() => {
        setQueue(q => q.map(r => r.id===id? { ...r, awarded: award } : r));
      });
  };

  const handleOverride = (id) => {
    const reason = prompt('Override reason:');
    if (!reason) return;
    fetch(`/api/ot-bid/${id}/override`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ reason })
    });
  };

  return (
    <Paper variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background:'#F0F7FF' }}>
            <TableCell>Event</TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Score</TableCell>
            <TableCell align="center">Award</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {queue.map(row => (
            <TableRow key={row.id} sx={{ '&:hover':{background:'#EEF5FF'} }}>
              <TableCell>{otEvents.find(e=>e.id===row.eventId)?.reason}</TableCell>
              <TableCell>{row.employeeName}</TableCell>
              <TableCell>{row.score.toFixed(2)}</TableCell>
              <TableCell align="center">
                {row.awarded ? <CheckIcon color="success"/> : <CloseIcon color="disabled"/>}
              </TableCell>
              <TableCell align="center">
                <Button size="small" onClick={()=>handleAward(row.id, true)}>Award</Button>
                <Button size="small" onClick={()=>handleAward(row.id, false)}>Decline</Button>
                <IconButton size="small" onClick={()=>handleOverride(row.id)}>Override</IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {queue.length===0 && (
        <Typography sx={{ p:2, textAlign:'center' }}>No bids in queue</Typography>
      )}
    </Paper>
  );
}
