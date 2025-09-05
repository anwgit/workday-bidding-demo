// src/pages/VacationConfig.js
import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  Box,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
const RowActionButtons = ({ editing, onEdit, onSave, onCancel, onDelete }) => (
  <Stack direction="row" spacing={1} justifyContent="flex-end">
    {!editing && (
      <IconButton size="small" onClick={onEdit} aria-label="Edit">
        <EditIcon fontSize="inherit" />
      </IconButton>
    )}
    {editing && (
      <>
        <IconButton size="small" onClick={onSave} aria-label="Save">
          <SaveIcon fontSize="inherit" />
        </IconButton>
        <IconButton size="small" onClick={onCancel} aria-label="Cancel">
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </>
    )}
    <IconButton size="small" color="error" onClick={onDelete} aria-label="Delete">
      <DeleteIcon fontSize="inherit" />
    </IconButton>
  </Stack>
);

const CellInput = ({
  editing,
  value,
  onChange,
  type = "text",
  select,
  options,
  placeholder,
  allowNA = false,
}) =>
  editing ? (
    select ? (
      <FormControl size="small" fullWidth>
        <Select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          {(options || []).map((opt) => {
            const v = typeof opt === "string" ? opt : opt.value;
            const l = typeof opt === "string" ? opt : opt.label;
            return (
              <MenuItem key={v} value={v}>
                {l}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    ) : (
      <TextField
        size="small"
        type={type}
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          if (allowNA && (raw === "NA" || raw === "na" || raw === "")) {
            onChange(raw ? raw.toUpperCase() : "NA");
          } else if (type === "number") {
            onChange(raw === "" ? "" : Number(raw));
          } else {
            onChange(raw);
          }
        }}
        fullWidth
        placeholder={placeholder}
      />
    )
  ) : (
    <span>{String(value ?? "")}</span>
  );

// -----------------------------------------------------------------------------
// Section wrapper
// -----------------------------------------------------------------------------
function Section({ title, description, onAdd, children }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        {onAdd && (
          <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={onAdd}>
            Add Row
          </Button>
        )}
      </Box>
      {children}
    </Box>
  );
}

// -----------------------------------------------------------------------------
// Main page
// -----------------------------------------------------------------------------
export default function VacationConfig() {
  // Department context (scopes all grids; not shown in columns)
  const departments = ["CX", "Police", "Fire", "Security", "TBU"];
  const [currentDept, setCurrentDept] = useState("CX");

  // Utility
  const newId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
  const filt = (rows) => rows.filter((r) => (r.dept ?? currentDept) === currentDept);

  // ------------------------- SEED DATA ---------------------------------------
  // Bidding Windows (Cycles List)
  const [cycles, setCycles] = useState([
    // Your two demo rows for the selected department (default CX)
    {
      id: "VC1",
      dept: "CX",
      name: "Bidding Window – Instant",
      coverageStart: "2026-06-01",
      coverageEnd: "2026-08-31",
      awardMode: "INSTANT",
      maxConsec: 30, // numeric
      status: "ACTIVE",
      _editing: false,
    },
    {
      id: "VC2",
      dept: "CX",
      name: "Bidding Window – Auto Award",
      coverageStart: "2026-09-01",
      coverageEnd: "2026-12-31",
      awardMode: "AUTOAWARD",
      maxConsec: "NA", // string NA
      status: "DRAFT",
      _editing: false,
    },
  ]);

  // Notice Rules (seed CX canonical bands + TBU examples)
  const [noticeRules, setNoticeRules] = useState([
    // CX six canonical bands (hours vs notice; look-ahead = 6 months)
    { id: "NR1", dept: "CX", minHours: 0.25, maxHours: 3.0,   minDaysNotice: -1, maxMonthsAhead: 6, active: true, _editing: false }, // -1 => Prior calendar day
    { id: "NR2", dept: "CX", minHours: 3.25, maxHours: 10.0,  minDaysNotice: 3,  maxMonthsAhead: 6, active: true, _editing: false },
    { id: "NR3", dept: "CX", minHours: 10.25, maxHours: 24.0, minDaysNotice: 7,  maxMonthsAhead: 6, active: true, _editing: false },
    { id: "NR4", dept: "CX", minHours: 24.25, maxHours: 40.0, minDaysNotice: 14, maxMonthsAhead: 6, active: true, _editing: false },
    { id: "NR5", dept: "CX", minHours: 40.25, maxHours: 80.0, minDaysNotice: 21, maxMonthsAhead: 6, active: true, _editing: false },
    { id: "NR6", dept: "CX", minHours: 80.25, maxHours: 9999, minDaysNotice: 30, maxMonthsAhead: 6, active: true, _editing: false },
    // TBU example bands (adjust later to spreadsheet)
    { id: "NR7", dept: "TBU", minHours: 0.25, maxHours: 8.0,  minDaysNotice: 3, maxMonthsAhead: 6, active: true, _editing: false },
    { id: "NR8", dept: "TBU", minHours: 8.25, maxHours: 40.0, minDaysNotice: 7, maxMonthsAhead: 6, active: true, _editing: false },
  ]);

  // Capacity Rules (sample)
  const [capacityRules, setCapacityRules] = useState([
    { id: "CR1", dept: "CX", org: "TerminalA", loc: "T1", role: "Agent", period: "DAY", maxOff: 4,  minStaff: 2,  aggregate: false, _editing: false },
    { id: "CR2", dept: "CX", org: "Campus",   loc: "All", role: "All",   period: "DAY", maxOff: 20, minStaff: 10, aggregate: true,  _editing: false },
  ]);

  // Shift Staffing Minimums (BASE) — CX & TBU demo rows
  const [shiftMinimums, setShiftMinimums] = useState([
    // CX Campus baseline
    { id: "SM1", dept: "CX", org: "Campus",   loc: "All", shift: "First",     minRoleA: 3, minRoleB: 6, periodType: "BASE", _editing: false }, // RoleA=Supervisors, RoleB=ACES (rename in UI later if you wish)
    { id: "SM2", dept: "CX", org: "Campus",   loc: "All", shift: "Second",    minRoleA: 3, minRoleB: 6, periodType: "BASE", _editing: false },
    { id: "SM3", dept: "CX", org: "Campus",   loc: "All", shift: "Overnight", minRoleA: 1, minRoleB: 3, periodType: "BASE", _editing: false },
    // TBU Plaza Ops baseline
    { id: "SM4", dept: "TBU", org: "Plaza Ops", loc: "All", shift: "Day",       minRoleA: 2, minRoleB: 3, periodType: "BASE", _editing: false }, // RoleA=Supervisors, RoleB=Specialists (example)
    { id: "SM5", dept: "TBU", org: "Plaza Ops", loc: "All", shift: "Evening",   minRoleA: 2, minRoleB: 2, periodType: "BASE", _editing: false },
    { id: "SM6", dept: "TBU", org: "Plaza Ops", loc: "All", shift: "Overnight", minRoleA: 1, minRoleB: 1, periodType: "BASE", _editing: false },
  ]);

  // Peak Period Overrides (sample for CX)
  const [peakOverrides, setPeakOverrides] = useState([
    {
      id: "PO1",
      dept: "CX",
      name: "Spring Break Lead/Follow",
      dateStart: "2026-03-10",
      dateEnd: "2026-03-20",
      org: "Campus",
      loc: "All",
      shift: "First",
      minRoleA: 4, // override Supervisors
      minRoleB: 7, // override ACES
      source: "CX Memo",
      active: true,
      _editing: false,
    },
  ]);

  const [blackouts, setBlackouts] = useState([
    { id: "B1", dept: "CX", coverage: "Summer 2026", dateStart: "2026-06-14", dateEnd: "2026-07-14", org: "Campus", loc: "All", reason: "FIFA", source: "ExternalFeed", active: true, _editing: false },
  ]);

  // Filtered views
  const cyclesView = useMemo(() => filt(cycles), [cycles, currentDept]);
  const noticeRulesView = useMemo(() => filt(noticeRules), [noticeRules, currentDept]);
  const capacityRulesView = useMemo(() => filt(capacityRules), [capacityRules, currentDept]);
  const shiftMinimumsView = useMemo(() => filt(shiftMinimums), [shiftMinimums, currentDept]);
  const peakOverridesView = useMemo(() => filt(peakOverrides), [peakOverrides, currentDept]);
  const blackoutsView = useMemo(() => filt(blackouts), [blackouts, currentDept]);

  // Row helpers
  const startEdit = (setList, id) =>
    setList((rows) => rows.map((r) => (r.id === id ? { ...r, _editing: true } : r)));
  const cancelEdit = (setList, id, isNew) =>
    setList((rows) => (isNew ? rows.filter((r) => r.id !== id) : rows.map((r) => (r.id === id ? { ...r, _editing: false, _new: false } : r))));
  const saveRow = (setList, id) =>
    setList((rows) => rows.map((r) => (r.id === id ? { ...r, _editing: false, _new: false } : r)));
  const deleteRow = (setList, id) => setList((rows) => rows.filter((r) => r.id !== id));

  // ---------------------------------------------------------------------------
  return (
    <Layout title="Vacation Bidding – Admin Configuration">
      {/* Top bar: Department selector on LEFT */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControl size="small">
            <InputLabel id="dept-label">Department</InputLabel>
            <Select
              labelId="dept-label"
              label="Department"
              value={currentDept}
              onChange={(e) => setCurrentDept(e.target.value)}
              sx={{ minWidth: 220 }}
            >
              {departments.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Chip label="Config Prototype" color="primary" variant="outlined" />
      </Box>

      {/* Bidding Windows (Cycles List) */}
      <Section
        title="Bidding Windows (Cycles List)"
        onAdd={() =>
          setCycles((rows) => [
            {
              id: newId("VC"),
              dept: currentDept,
              name: "New Bidding Window",
              coverageStart: "",
              coverageEnd: "",
              awardMode: "INSTANT",
              maxConsec: 30,
              status: "DRAFT",
              _editing: true,
              _new: true,
            },
            ...rows,
          ])
        }
      >
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#F0F7FF" }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Coverage Start</TableCell>
                <TableCell>Coverage End</TableCell>
                <TableCell>Award Mode</TableCell>
                <TableCell>Max Consecutive (workdays)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cyclesView.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.name} onChange={(v) => setCycles((rows) => rows.map((x) => (x.id === r.id ? { ...x, name: v } : x)))} placeholder="e.g., Summer 2026 Window" />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.coverageStart} onChange={(v) => setCycles((rows) => rows.map((x) => (x.id === r.id ? { ...x, coverageStart: v } : x)))} type="date" />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.coverageEnd} onChange={(v) => setCycles((rows) => rows.map((x) => (x.id === r.id ? { ...x, coverageEnd: v } : x)))} type="date" />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.awardMode} onChange={(v) => setCycles((rows) => rows.map((x) => (x.id === r.id ? { ...x, awardMode: v } : x)))} select options={["INSTANT", "AUTOAWARD", "SENIORITY", "HYBRID"]} />
                  </TableCell>
                  <TableCell>
                    <CellInput
                      editing={r._editing}
                      value={r.maxConsec}
                      onChange={(v) => setCycles((rows) => rows.map((x) => (x.id === r.id ? { ...x, maxConsec: v } : x)))}
                      type={typeof r.maxConsec === "number" ? "number" : "text"}
                      allowNA
                      placeholder="e.g., 30 or NA"
                    />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.status} onChange={(v) => setCycles((rows) => rows.map((x) => (x.id === r.id ? { ...x, status: v } : x)))} select options={["DRAFT", "ACTIVE", "CLOSED", "ARCHIVED"]} />
                  </TableCell>
                  <TableCell align="right">
                    <RowActionButtons
                      editing={r._editing}
                      onEdit={() => startEdit(setCycles, r.id)}
                      onSave={() => saveRow(setCycles, r.id)}
                      onCancel={() => cancelEdit(setCycles, r.id, r._new)}
                      onDelete={() => deleteRow(setCycles, r.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Section>

      <Divider sx={{ my: 2 }} />

      {/* Notice Rules */}
      <Section
        title="Notice Rules"
        onAdd={() =>
          setNoticeRules((rows) => [
            { id: newId("NR"), dept: currentDept, minHours: 0, maxHours: 0, minDaysNotice: 0, maxMonthsAhead: 6, active: true, _editing: true, _new: true },
            ...rows,
          ])
        }
      >
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#F7F7F7" }}>
                <TableCell>ID</TableCell>
                <TableCell>Min Hours</TableCell>
                <TableCell>Max Hours</TableCell>
                <TableCell>Min Days Notice</TableCell>
                <TableCell>Max Months Ahead</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {noticeRulesView.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="number" value={r.minHours} onChange={(v) => setNoticeRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, minHours: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="number" value={r.maxHours} onChange={(v) => setNoticeRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, maxHours: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="number" value={r.minDaysNotice} onChange={(v) => setNoticeRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, minDaysNotice: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="number" value={r.maxMonthsAhead} onChange={(v) => setNoticeRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, maxMonthsAhead: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.active ? "Yes" : "No"} onChange={(v) => setNoticeRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, active: v === "Yes" } : x)))} select options={["Yes", "No"]} />
                  </TableCell>
                  <TableCell align="right">
                    <RowActionButtons
                      editing={r._editing}
                      onEdit={() => startEdit(setNoticeRules, r.id)}
                      onSave={() => saveRow(setNoticeRules, r.id)}
                      onCancel={() => cancelEdit(setNoticeRules, r.id, r._new)}
                      onDelete={() => deleteRow(setNoticeRules, r.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Section>

      <Divider sx={{ my: 2 }} />

      {/* Capacity Rules */}
      <Section
        title="Capacity Rules"
        onAdd={() =>
          setCapacityRules((rows) => [
            { id: newId("CR"), dept: currentDept, org: "", loc: "", role: "", period: "DAY", maxOff: 0, minStaff: 0, aggregate: false, _editing: true, _new: true },
            ...rows,
          ])
        }
      >
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#F7F7F7" }}>
                <TableCell>ID</TableCell>
                <TableCell>Org</TableCell>
                <TableCell>Loc</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Max Off</TableCell>
                <TableCell>Min Staff</TableCell>
                <TableCell>Aggregate?</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {capacityRulesView.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.org} onChange={(v) => setCapacityRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, org: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.loc} onChange={(v) => setCapacityRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, loc: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.role} onChange={(v) => setCapacityRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, role: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.period} onChange={(v) => setCapacityRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, period: v } : x)))} select options={["DAY", "WEEK", "PAY_PERIOD"]} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="number" value={r.maxOff} onChange={(v) => setCapacityRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, maxOff: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="number" value={r.minStaff} onChange={(v) => setCapacityRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, minStaff: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.aggregate ? "Yes" : "No"} onChange={(v) => setCapacityRules((rows) => rows.map((x) => (x.id === r.id ? { ...x, aggregate: v === "Yes" } : x)))} select options={["Yes", "No"]} />
                  </TableCell>
                  <TableCell align="right">
                    <RowActionButtons
                      editing={r._editing}
                      onEdit={() => startEdit(setCapacityRules, r.id)}
                      onSave={() => saveRow(setCapacityRules, r.id)}
                      onCancel={() => cancelEdit(setCapacityRules, r.id, r._new)}
                      onDelete={() => deleteRow(setCapacityRules, r.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Section>

      <Divider sx={{ my: 2 }} />

      {/* Shift Staffing Minimums (BASE / PEAK_OVERRIDE types) */}
      <Section
        title="Shift Staffing Minimums"
        onAdd={() =>
          setShiftMinimums((rows) => [
            { id: newId("SM"), dept: currentDept, org: "Campus", loc: "All", shift: "First", minRoleA: 0, minRoleB: 0, periodType: "BASE", _editing: true, _new: true },
            ...rows,
          ])
        }
      >
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#F7F7F7" }}>
                <TableCell>ID</TableCell>
                <TableCell>Org</TableCell>
                <TableCell>Loc</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell>Min Role A</TableCell>
                <TableCell>Min Role B</TableCell>
                <TableCell>Period Type</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shiftMinimumsView.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.org} onChange={(v) => setShiftMinimums((rows) => rows.map((x) => (x.id === r.id ? { ...x, org: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.loc} onChange={(v) => setShiftMinimums((rows) => rows.map((x) => (x.id === r.id ? { ...x, loc: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.shift} onChange={(v) => setShiftMinimums((rows) => rows.map((x) => (x.id === r.id ? { ...x, shift: v } : x)))} select options={["First","Second","Overnight","Day","Evening"]} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="number" value={r.minRoleA} onChange={(v) => setShiftMinimums((rows) => rows.map((x) => (x.id === r.id ? { ...x, minRoleA: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="number" value={r.minRoleB} onChange={(v) => setShiftMinimums((rows) => rows.map((x) => (x.id === r.id ? { ...x, minRoleB: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.periodType} onChange={(v) => setShiftMinimums((rows) => rows.map((x) => (x.id === r.id ? { ...x, periodType: v } : x)))} select options={["BASE","PEAK_OVERRIDE"]} />
                  </TableCell>
                  <TableCell align="right">
                    <RowActionButtons
                      editing={r._editing}
                      onEdit={() => startEdit(setShiftMinimums, r.id)}
                      onSave={() => saveRow(setShiftMinimums, r.id)}
                      onCancel={() => cancelEdit(setShiftMinimums, r.id, r._new)}
                      onDelete={() => deleteRow(setShiftMinimums, r.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Section>

      <Divider sx={{ my: 2 }} />

      {/* Peak Period Overrides */}
      <Section
        title="Peak Period Overrides"
        onAdd={() =>
          setPeakOverrides((rows) => [
            { id: newId("PO"), dept: currentDept, name: "", dateStart: "", dateEnd: "", org: "Campus", loc: "All", shift: "First", minRoleA: 0, minRoleB: 0, source: "", active: true, _editing: true, _new: true },
            ...rows,
          ])
        }
      >
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#F7F7F7" }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Org</TableCell>
                <TableCell>Loc</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell>Min Role A (override)</TableCell>
                <TableCell>Min Role B (override)</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {peakOverridesView.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.name} onChange={(v) => setPeakOverrides((rows) => rows.map((x) => (x.id === r.id ? { ...x, name: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="date" value={r.dateStart} onChange={(v) => setPeakOverrides((rows) => rows.map((x) => (x.id === r.id ? { ...x, dateStart: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="date" value={r.dateEnd} onChange={(v) => setPeakOverrides((rows) => rows.map((x) => (x.id === r.id ? { ...x, dateEnd: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.org} onChange={(v) => setPeakOverrides((rows) => rows.map((x) => (x.id === r.id ? { ...x, org: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.loc} onChange={(v) => setPeakOverrides((rows) => rows.map((x) => (x.id === r.id ? { ...x, loc: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.shift} onChange={(v) => setPeakOverrides((rows) => rows.map((x) => (x.id === r.id ? { ...x, shift: v } : x)))} select options={["First","Second","Overnight","Day","Evening"]} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="number" value={r.minRoleA} onChange={(v) => setPeakOverrides((rows) => rows.map((x) => (x.id === r.id ? { ...x, minRoleA: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="number" value={r.minRoleB} onChange={(v) => setPeakOverrides((rows) => rows.map((x) => (x.id === r.id ? { ...x, minRoleB: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.source} onChange={(v) => setPeakOverrides((rows) => rows.map((x) => (x.id === r.id ? { ...x, source: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.active ? "Yes" : "No"} onChange={(v) => setPeakOverrides((rows) => rows.map((x) => (x.id === r.id ? { ...x, active: v === "Yes" } : x)))} select options={["Yes", "No"]} />
                  </TableCell>
                  <TableCell align="right">
                    <RowActionButtons
                      editing={r._editing}
                      onEdit={() => startEdit(setPeakOverrides, r.id)}
                      onSave={() => saveRow(setPeakOverrides, r.id)}
                      onCancel={() => cancelEdit(setPeakOverrides, r.id, r._new)}
                      onDelete={() => deleteRow(setPeakOverrides, r.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Section>

      <Divider sx={{ my: 2 }} />

      {/* Blackout Periods (true no-vacation windows) */}
      <Section
        title="Blackout Periods"
        onAdd={() =>
          setBlackouts((rows) => [
            { id: newId("B"), dept: currentDept, coverage: "", dateStart: "", dateEnd: "", org: "Campus", loc: "All", reason: "", source: "", active: true, _editing: true, _new: true },
            ...rows,
          ])
        }
      >
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#F7F7F7" }}>
                <TableCell>ID</TableCell>
                <TableCell>Coverage</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Org</TableCell>
                <TableCell>Loc</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blackoutsView.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.coverage} onChange={(v) => setBlackouts((rows) => rows.map((x) => (x.id === r.id ? { ...x, coverage: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="date" value={r.dateStart} onChange={(v) => setBlackouts((rows) => rows.map((x) => (x.id === r.id ? { ...x, dateStart: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} type="date" value={r.dateEnd} onChange={(v) => setBlackouts((rows) => rows.map((x) => (x.id === r.id ? { ...x, dateEnd: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.org} onChange={(v) => setBlackouts((rows) => rows.map((x) => (x.id === r.id ? { ...x, org: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.loc} onChange={(v) => setBlackouts((rows) => rows.map((x) => (x.id === r.id ? { ...x, loc: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.reason} onChange={(v) => setBlackouts((rows) => rows.map((x) => (x.id === r.id ? { ...x, reason: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.source} onChange={(v) => setBlackouts((rows) => rows.map((x) => (x.id === r.id ? { ...x, source: v } : x)))} />
                  </TableCell>
                  <TableCell>
                    <CellInput editing={r._editing} value={r.active ? "Yes" : "No"} onChange={(v) => setBlackouts((rows) => rows.map((x) => (x.id === r.id ? { ...x, active: v === "Yes" } : x)))} select options={["Yes", "No"]} />
                  </TableCell>
                  <TableCell align="right">
                    <RowActionButtons
                      editing={r._editing}
                      onEdit={() => startEdit(setBlackouts, r.id)}
                      onSave={() => saveRow(setBlackouts, r.id)}
                      onCancel={() => cancelEdit(setBlackouts, r.id, r._new)}
                      onDelete={() => deleteRow(setBlackouts, r.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Section>
    </Layout>
  );
}
