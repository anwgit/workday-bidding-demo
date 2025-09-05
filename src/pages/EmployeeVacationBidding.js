// src/pages/EmployeeVacationBidding.js
import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

// -----------------------------------------------------------------------------
// Small helpers
// -----------------------------------------------------------------------------
const fmtDate = (s) => (s ? new Date(s).toISOString().slice(0, 10) : "");
const hoursBetween = (start, end, hoursPerDay = 8) => {
  if (!start || !end) return 0;
  const ms = new Date(end) - new Date(start) + 24 * 3600 * 1000;
  const days = Math.max(0, Math.round(ms / (24 * 3600 * 1000)));
  return days * hoursPerDay;
};

function Section({ title, right, children }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
        {right}
      </Box>
      {children}
    </Box>
  );
}

// -----------------------------------------------------------------------------
// Add / Edit Bid Dialog (5.1.1)
// -----------------------------------------------------------------------------
function AddBidDialog({ open, onClose, onSave, seed }) {
  const [isRange, setIsRange] = useState(Boolean(seed?.endDate && seed?.endDate !== seed?.startDate));
  const [startDate, setStartDate] = useState(seed?.startDate || "");
  const [endDate, setEndDate] = useState(seed?.endDate || "");
  const [fullDay, setFullDay] = useState(seed?.fullDay ?? true);
  const [hours, setHours] = useState(seed?.hours ?? 8);
  const [preference, setPreference] = useState(seed?.preference ?? 1);
  const [comments, setComments] = useState(seed?.comments ?? "");

  const computedHours = useMemo(
    () => (fullDay ? hoursBetween(startDate, isRange ? endDate : startDate, 8) : Number(hours || 0)),
    [startDate, endDate, fullDay, hours, isRange]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Vacation Bid</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Date selection */}
          <Stack direction="row" spacing={2}>
            <Chip
              label="Single day"
              color={!isRange ? "primary" : "default"}
              variant={!isRange ? "filled" : "outlined"}
              onClick={() => setIsRange(false)}
              sx={{ borderRadius: "999px" }}
            />
            <Chip
              label="Range"
              color={isRange ? "primary" : "default"}
              variant={isRange ? "filled" : "outlined"}
              onClick={() => setIsRange(true)}
              sx={{ borderRadius: "999px" }}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={isRange ? endDate : startDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled={!isRange}
            />
          </Stack>

          {/* Hours */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label="Full day"
              color={fullDay ? "primary" : "default"}
              variant={fullDay ? "filled" : "outlined"}
              onClick={() => setFullDay(true)}
              sx={{ borderRadius: "999px" }}
            />
            <Chip
              label="Partial"
              color={!fullDay ? "primary" : "default"}
              variant={!fullDay ? "filled" : "outlined"}
              onClick={() => setFullDay(false)}
              sx={{ borderRadius: "999px" }}
            />
            {!fullDay && (
              <TextField
                label="Hours"
                type="number"
                size="small"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                inputProps={{ min: 1, step: 0.5 }}
              />
            )}
            <Typography sx={{ ml: "auto" }} variant="body2" color="text.secondary">
              Computed: <strong>{computedHours}</strong> hrs
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Preference"
              type="number"
              size="small"
              value={preference}
              onChange={(e) => setPreference(Number(e.target.value))}
              inputProps={{ min: 1, step: 1 }}
              fullWidth
            />
            <TextField
              label="Comments"
              size="small"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              fullWidth
            />
          </Stack>

          <Paper variant="outlined" sx={{ p: 1.5, fontFamily: "monospace", fontSize: 12 }}>
            ⓘ Notice rule & capacity checks will run on submit.
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() =>
            onSave({
              startDate,
              endDate: isRange ? endDate : startDate,
              hours: computedHours,
              preference,
              comments,
              fullDay,
            })
          }
        >
          Submit Bid
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------
export default function EmployeeVacationBidding() {
  const navigate = useNavigate();

  // Seeded “Vacation Buckets Available”
  const [buckets] = useState([
    { id: "BK1", name: "SF TEST",  startDate: "2025-08-25", endDate: "2025-08-26", available: 10 },
    { id: "BK2", name: "SF TEST2", startDate: "2025-08-06", endDate: "2025-08-26", available: 20 },
    { id: "BK3", name: "xyz",      startDate: "2025-08-28", endDate: "2025-08-28", available: 10 },
  ]);

  // My bids
  const [bids, setBids] = useState([
    { id: "B1", pref: 1, startDate: "2026-03-10", endDate: "2026-03-12", hours: 24, status: "Submitted", conflicts: "None" },
    { id: "B2", pref: 2, startDate: "2026-04-05", endDate: "2026-04-09", hours: 40, status: "Pending", conflicts: "Overlap" },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSeed, setDialogSeed] = useState(null);

  const openCustomDialog = () => {
    setDialogSeed(null);
    setDialogOpen(true);
  };
  const openBucketDialog = (bk) => {
    setDialogSeed({
      startDate: bk.startDate,
      endDate: bk.endDate,
      fullDay: true,
      preference: (bids?.length || 0) + 1,
      hours: hoursBetween(bk.startDate, bk.endDate, 8),
      comments: `Bid for bucket: ${bk.name}`,
    });
    setDialogOpen(true);
  };

  const addBid = (payload) => {
    const next = {
      id: `B_${Math.random().toString(36).slice(2, 7)}`,
      pref: payload.preference || (bids.length + 1),
      startDate: payload.startDate,
      endDate: payload.endDate,
      hours: payload.hours,
      status: "Pending",
      conflicts: "TBD",
    };
    setBids((rows) => [...rows, next]);
    setDialogOpen(false);
  };

  const editBid = (row) => {
    setDialogSeed({
      startDate: row.startDate,
      endDate: row.endDate,
      fullDay: true,
      hours: row.hours,
      preference: row.pref,
      comments: "",
    });
    setDialogOpen(true);
    // On save, demo just adds a new pending revision.
  };

  const withdrawOne = (id) => setBids((rows) => rows.filter((r) => r.id !== id));
  const withdrawAll = () => setBids([]);
  const submitAll = () => setBids((rows) => rows.map((r) => ({ ...r, status: "Submitted" })));

  // ---------------------------------------------------------------------------
  return (
    <Layout title="Employee – Place/Manage Bids">
      {/* Top banner */}
      <Paper variant="outlined" sx={{ p: 1.5, mb: 2, display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          | Q1–Q2 2026 Coverage &nbsp;&nbsp;| Window closes in 3d 04h 12m |
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          | PTO Balance: <b>120</b> hrs &nbsp;| Projected by Start Date: <b>136</b> hrs |
        </Typography>
      </Paper>

      {/* Vacation Buckets Available */}
      <Section
        title="Vacation Buckets Available"
        right={<Chip size="small" label="Auto-award in some depts." variant="outlined" />}
      >
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#F7F7F7" }}>
                <TableCell>Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buckets.map((bk) => (
                <TableRow key={bk.id}>
                  <TableCell>{bk.name}</TableCell>
                  <TableCell>{fmtDate(bk.startDate)}</TableCell>
                  <TableCell>{fmtDate(bk.endDate)}</TableCell>
                  <TableCell>{bk.available}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => openBucketDialog(bk)}>
                      Bid
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Section>

      <Divider sx={{ my: 2 }} />

      {/* Action bar */}
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={openCustomDialog}>
          Add Custom Bid
        </Button>
        <Button startIcon={<SendIcon />} variant="outlined" size="small" onClick={submitAll}>
          Submit All
        </Button>
        <Button startIcon={<DeleteIcon />} color="error" variant="outlined" size="small" onClick={withdrawAll}>
          Withdraw All
        </Button>
      </Stack>

      {/* My Bids Table */}
      <Section title="My Bids">
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#F7F7F7" }}>
                <TableCell>Pref</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Conflicts</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bids.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.pref}</TableCell>
                  <TableCell>
                    {fmtDate(r.startDate)} — {fmtDate(r.endDate)}
                  </TableCell>
                  <TableCell>{r.hours}</TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell>{r.conflicts}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {/* View in Calendar -> navigates to calendar page with this bid */}
                      <Tooltip title="View this bid in calendar">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate("/vacation-calendar", {
                              state: {
                                focusStart: r.startDate,
                                focusEnd: r.endDate,
                                bids: [r],
                              },
                            })
                          }
                        >
                          <CalendarMonthIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => editBid(r)}>
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Withdraw">
                        <IconButton size="small" color="error" onClick={() => withdrawOne(r.id)}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Section>

      {/* Dialog */}
      <AddBidDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={addBid}
        seed={dialogSeed}
      />
    </Layout>
  );
}
