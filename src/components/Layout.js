// src/components/Layout.js
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  CssBaseline,
  Collapse
} from '@mui/material';
import MenuIcon          from '@mui/icons-material/Menu';
import ChevronLeftIcon   from '@mui/icons-material/ChevronLeft';
import HomeIcon          from '@mui/icons-material/Home';
import DashboardIcon     from '@mui/icons-material/Dashboard';
import GavelIcon         from '@mui/icons-material/Gavel';
import GroupIcon         from '@mui/icons-material/Group';
import ListIcon          from '@mui/icons-material/List';
import LayersIcon        from '@mui/icons-material/Layers';
import AccessTimeIcon    from '@mui/icons-material/AccessTime';
import SettingsIcon      from '@mui/icons-material/Settings';
import ListAltIcon       from '@mui/icons-material/ListAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandLess        from '@mui/icons-material/ExpandLess';
import ExpandMore        from '@mui/icons-material/ExpandMore';

const drawerWidth = 260;

export default function Layout({ title, children }) {
  const [drawerOpen,   setDrawerOpen]   = useState(true);
  const [shiftOpen,    setShiftOpen]    = useState(false);
  const [overtimeOpen, setOvertimeOpen] = useState(false);
  const [vacationOpen, setVacationOpen] = useState(false);

  const toggleDrawer   = () => setDrawerOpen(o => !o);
  const toggleShift    = () => setShiftOpen(o => !o);
  const toggleOvertime = () => setOvertimeOpen(o => !o);
  const toggleVacation = () => setVacationOpen(o => !o);

  // only the very top-level items
  const mainMenu = [
    { text: 'Home',        icon: <HomeIcon />,      path: '/' },
    { text: 'Shift Board', icon: <DashboardIcon />, path: '/shift-board' },
    { text: 'Manage Bids', icon: <GavelIcon />,     path: '/manage' },
    { text: 'Employees',   icon: <GroupIcon />,     path: '/employees' }
  ];

  // Shift Bidding subgroup
  const shiftMenu = [
    { text: 'Shift Ingestion',      icon: <ListIcon />, path: '/shift-ingestion' },
    { text: 'Bid Window Mgmt',      icon: <ListIcon />, path: '/shift-bid-windows' },
    { text: 'Define Shift Schedules', icon: <ListIcon />, path: '/shift-define-schedules' },
    { text: 'Shift Bidding Monitor',   icon: <ListIcon />, path: '/shift-bidding-monitor' },
    { text: 'Open Shifts',          icon: <ListIcon />, path: '/open-shifts' },
    { text: 'Employee Preferences', icon: <ListIcon />, path: '/shift-preferences' },
    { text: 'Execute Bidding',      icon: <ListIcon />, path: '/shift-bidding' },
    { text: 'Resolve & Override',   icon: <ListIcon />, path: '/shift-award' }
  ];

  // Overtime Bidding subgroup
  const overtimeMenu = [
    { text: 'Staffing Levels',       icon: <LayersIcon />,     path: '/staffing-levels' },
    { text: 'Overtime Shifts',       icon: <AccessTimeIcon />, path: '/overtime-shifts-view' },
    { text: 'Manage Rule Sets',      icon: <SettingsIcon />,   path: '/rule-sets' },
    { text: 'View Rule Sets',        icon: <ListAltIcon />,    path: '/rule-sets-view' },
    { text: 'Fill By Rules Process', icon: <AccessTimeIcon />, path: '/ot-bidding-process' }
  ];

  // Vacation Bidding subgroup
  const vacationMenu = [
    { text: 'Vacation Bidding',       icon: <CalendarTodayIcon />, path: '/employee-vacation-bidding' },
    { text: 'Bucket Definitions',     icon: <CalendarTodayIcon />, path: '/vacations-buckets' },
    { text: 'Preference Submissions', icon: <CalendarTodayIcon />, path: '/vacation-preference-submission' },
    { text: 'Award & Override',       icon: <CalendarTodayIcon />, path: '/vacation-award-override' },
    { text: 'Window Config',          icon: <CalendarTodayIcon />, path: '/vacation-window-config' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          ml: drawerOpen ? `${drawerWidth}px` : 0,
          width: drawerOpen
            ? `calc(100% - ${drawerWidth}px)`
            : '100%'
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {mainMenu.map(item => (
            <ListItemButton
              key={item.text}
              component={RouterLink}
              to={item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}

          {/* Shift Bidding Module */}
          <ListItemButton onClick={toggleShift}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Shift Bidding Module" />
            {shiftOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={shiftOpen} timeout="auto" unmountOnExit>
            <List disablePadding>
              {shiftMenu.map(s => (
                <ListItemButton
                  key={s.text}
                  component={RouterLink}
                  to={s.path}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>{s.icon}</ListItemIcon>
                  <ListItemText primary={s.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {/* Overtime Bidding Module */}
          <ListItemButton onClick={toggleOvertime}>
            <ListItemIcon><AccessTimeIcon /></ListItemIcon>
            <ListItemText primary="Overtime Bidding Module" />
            {overtimeOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={overtimeOpen} timeout="auto" unmountOnExit>
            <List disablePadding>
              {overtimeMenu.map(o => (
                <ListItemButton
                  key={o.text}
                  component={RouterLink}
                  to={o.path}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>{o.icon}</ListItemIcon>
                  <ListItemText primary={o.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {/* Vacation Bidding Module */}
          <ListItemButton onClick={toggleVacation}>
            <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
            <ListItemText primary="Vacation Bidding Module" />
            {vacationOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={vacationOpen} timeout="auto" unmountOnExit>
            <List disablePadding>
              {vacationMenu.map(v => (
                <ListItemButton
                  key={v.text}
                  component={RouterLink}
                  to={v.path}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>{v.icon}</ListItemIcon>
                  <ListItemText primary={v.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: drawerOpen
            ? `calc(100% - ${drawerWidth}px)`
            : '100%'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
