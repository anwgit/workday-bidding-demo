// src/components/Layout.js
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider
} from '@mui/material';
import MenuIcon          from '@mui/icons-material/Menu';
import ChevronLeftIcon   from '@mui/icons-material/ChevronLeft';
import HomeIcon          from '@mui/icons-material/Home';
import DashboardIcon     from '@mui/icons-material/Dashboard';
import GavelIcon         from '@mui/icons-material/Gavel';
import GroupIcon         from '@mui/icons-material/Group';
import LayersIcon        from '@mui/icons-material/Layers';
import SettingsIcon      from '@mui/icons-material/Settings';
import ListAltIcon       from '@mui/icons-material/ListAlt';
import AccessTimeIcon    from '@mui/icons-material/AccessTime';
import ListIcon          from '@mui/icons-material/List';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentIcon    from '@mui/icons-material/Assignment';
import SwapHorizIcon     from '@mui/icons-material/SwapHoriz';
import ExpandLess        from '@mui/icons-material/ExpandLess';
import ExpandMore        from '@mui/icons-material/ExpandMore';

const drawerWidth = 260;

export default function Layout({ title, children }) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [vacationOpen, setVacationOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(open => !open);
  const toggleVacation = () => setVacationOpen(open => !open);

  const mainMenu = [
    { text: 'Home',                       icon: <HomeIcon />,               path: '/' },
    { text: 'Shift Board',                icon: <DashboardIcon />,          path: '/shift-board' },
    { text: 'Manage Bids',                icon: <GavelIcon />,              path: '/manage' },
    { text: 'Employees',                  icon: <GroupIcon />,              path: '/employees' },
    { text: 'Staffing Levels',            icon: <LayersIcon />,             path: '/staffing-levels' },
    { text: 'Manage Rule Sets',           icon: <SettingsIcon />,           path: '/rule-sets' },
    { text: 'View Rule Sets',             icon: <ListAltIcon />,            path: '/rule-sets-view' },
    { text: 'Overtime Shifts',            icon: <AccessTimeIcon />,         path: '/overtime-shifts-view' },
    { text: 'Overtime Bidding Process',   icon: <ListIcon />,               path: '/ot-bidding-process' },
    { text: 'Edit Overtime Shift',        icon: <ListIcon />,               path: '/overtime-shift-edit' }
  ];

  const vacationMenu = [
    { text: 'Vacation Bidding',           icon: <CalendarTodayIcon />,      path: '/employee-vacation-bidding' },
    { text: 'Bucket Definitions',         icon: <CalendarTodayIcon />,      path: '/vacations-buckets' },
    { text: 'Preference Submissions',     icon: <AssignmentIcon />,         path: '/vacation-preference-submission' },
    { text: 'Award & Override',           icon: <SwapHorizIcon />,          path: '/vacation-award-override' },
    { text: 'Window Config',              icon: <CalendarTodayIcon />,      path: '/vacation-window-config' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          ml: drawerOpen ? `${drawerWidth}px` : 0,
          width: drawerOpen
            ? `calc(100% - ${drawerWidth}px)`
            : '100%',
          transition: theme =>
            theme.transitions.create(['width','margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
            })
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap>
            {title || (children?.type?.name ?? 'Application')}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
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
              sx={{ '&:hover': { background: '#F0F7FF' } }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}

          {/* Vacation Bidding Module */}
          <ListItemButton onClick={toggleVacation}>
            <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
            <ListItemText primary="Vacation Bidding Module" />
            {vacationOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={vacationOpen} timeout="auto" unmountOnExit>
            <List disablePadding>
              {vacationMenu.map(sub => (
                <ListItemButton
                  key={sub.text}
                  component={RouterLink}
                  to={sub.path}
                  sx={{ pl: 4, '&:hover': { background: '#F0F7FF' } }}
                >
                  <ListItemIcon>{sub.icon}</ListItemIcon>
                  <ListItemText primary={sub.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: drawerOpen
            ? `calc(100% - ${drawerWidth}px)`
            : '100%',
          transition: theme =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
            })
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
