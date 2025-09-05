// src/pages/EmployeeVacationCalendar.js
import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function startOfMonth(d) { const x = new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x; }
function endOfMonth(d)   { const x = new Date(d); x.setMonth(x.getMonth()+1, 0); x.setHours(0,0,0,0); return x; }
function addMonths(d,n)  { const x = new Date(d); x.setMonth(x.getMonth()+n); return x; }
function ymd(d){ return d.toISOString().slice(0,10); }
function daysInRange(start,end){
  const a=[], s=new Date(start), e=new Date(end);
  s.setHours(0,0,0,0); e.setHours(0,0,0,0);
  for (let x=new Date(s); x<=e; x.setDate(x.getDate()+1)) a.push(new Date(x));
  return a;
}

export default function EmployeeVacationCalendar() {
  const { state } = useLocation();
  // state can be: { focusStart, focusEnd, bids: [ {id, pref, startDate, endDate, status} ] }
  const initialMonth = state?.focusStart ? startOfMonth(new Date(state.focusStart)) : startOfMonth(new Date());
  const [month, setMonth] = useState(initialMonth);

  useEffect(() => {
    if (state?.focusStart) setMonth(startOfMonth(new Date(state.focusStart)));
  }, [state?.focusStart]);

  const bids = useMemo(() => state?.bids || [], [state]);

  // Build calendar grid (Sun→Sat, 6 rows)
  const monthStart = startOfMonth(month);
  const monthEnd   = endOfMonth(month);
  const startGrid  = new Date(monthStart); startGrid.setDate(monthStart.getDate() - monthStart.getDay());
  const cells = Array.from({length: 42}, (_,i)=>{ const d=new Date(startGrid); d.setDate(d.getDate()+i); return d; });

  // Map bids to dates for quick rendering
  const eventsByDay = useMemo(() => {
    const map = {};
    bids.forEach(b => {
      daysInRange(b.startDate, b.endDate).forEach(d => {
        const k = ymd(d);
        if(!map[k]) map[k]=[];
        map[k].push(b);
      });
    });
    return map;
  }, [bids]);

  const monthLabel = month.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <Layout title="Vacation Calendar">
      <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton size="small" onClick={() => setMonth(addMonths(month, -1))}><ChevronLeftIcon /></IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{monthLabel}</Typography>
            <IconButton size="small" onClick={() => setMonth(addMonths(month, 1))}><ChevronRightIcon /></IconButton>
          </Stack>
          {state?.focusStart && (
            <Typography variant="body2" color="text.secondary">
              Focus: {ymd(new Date(state.focusStart))}{state?.focusEnd ? `–${ymd(new Date(state.focusEnd))}` : ""}
            </Typography>
          )}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 1 }}>
        {/* Week headers */}
        <Stack direction="row" sx={{ px: 1, pb: 1 }}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
            <Box key={d} sx={{ flex: 1, fontWeight: 600, textAlign: "center" }}>{d}</Box>
          ))}
        </Stack>
        {/* Grid */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.75,
        }}>
          {cells.map((d,i)=>{
            const inMonth = d.getMonth()===month.getMonth();
            const k = ymd(d);
            const events = eventsByDay[k] || [];
            return (
              <Box key={k+"_"+i} sx={{
                minHeight: 92,
                border: "1px solid",
                borderColor: inMonth ? "divider" : "transparent",
                bgcolor: inMonth ? "background.paper" : "action.hover",
                p: 0.75,
                borderRadius: 1
              }}>
                <Typography variant="caption" sx={{ fontWeight: 600, opacity: inMonth?1:0.5 }}>
                  {d.getDate()}
                </Typography>
                <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                  {events.map(ev=>(
                    <Chip key={ev.id}
                      size="small"
                      label={`Pref ${ev.pref} • ${ev.status}`}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Legend */}
      {bids.length>0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Showing {bids.length} bid{bids.length>1?"s":""} passed from the previous page. Use the arrows to change months.
          </Typography>
        </>
      )}
    </Layout>
  );
}
