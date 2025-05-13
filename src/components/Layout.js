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
  Collapse
} from '@mui/material';
import MenuIcon          from '@mui/icons-material/Menu';
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
  const [ovtOpen, setOvtOpen] = useState(false);
  const [vacOpen, setVacOpen] = useState(false);
  const displayTitle = title || (children?.type?.name ?? 'Application');

  const primaryNav = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Shift Board', icon: <DashboardIcon />, path: '/shift-board' },
    { text: 'Manage Bids', icon: <GavelIcon />, path: '/manage' },
    { text: 'Employees', icon: <GroupIcon />, path: '/employees' },
    { text: 'Staffing Levels', icon: <LayersIcon />, path: '/staffing-levels' },
    { text: 'Manage Rule Sets', icon: <SettingsIcon />, path: '/rule-sets' },
    { text: 'View Rule Sets', icon: <ListAltIcon />, path: '/rule-sets-view' }
  ];

  const otSubmenu = [
    { text: 'OT Dashboard',   icon: <ListIcon />,   path: '/ot-dashboard' },
    { text: 'Bid Modal Demo', icon: <ListIcon />,   path: '/ot-bidding-process' },
    { text: 'Admin Console',  icon: <ListIcon />,   path: '/ot-admin-console' }
  ];

  const vacSubmenu = [
    { text: 'Vacation Bidding',       icon: <CalendarTodayIcon />, path: '/employee-vacation-bidding' },
    { text: 'Bucket Definitions',     icon: <CalendarTodayIcon />, path: '/vacations-buckets' },
    { text: 'Preference Submissions', icon: <AssignmentIcon />,     path: '/vacation-preference-submission' },
    { text: 'Award & Override',       icon: <SwapHorizIcon />,      path: '/vacation-award-override' },
    { text: 'Window Config',          icon: <CalendarTodayIcon />, path: '/vacation-window-config' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" elevation={4}>
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {displayTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: '#ffffff'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {/* Primary navigation */}
            {primaryNav.map(item => (
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

            {/* Overtime Bidding submenu */}
            <ListItemButton onClick={() => setOvtOpen(o => !o)}>
              <ListItemIcon><AccessTimeIcon /></ListItemIcon>
              <ListItemText primary="Overtime Bidding" />
              {ovtOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={ovtOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {otSubmenu.map(it => (
                  <ListItemButton
                    key={it.text}
                    component={RouterLink}
                    to={it.path}
                    sx={{ pl: 4, '&:hover': { background: '#F0F7FF' } }}
                  >
                    <ListItemIcon>{it.icon}</ListItemIcon>
                    <ListItemText primary={it.text} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>

            {/* Vacation Bidding submenu */}
            <ListItemButton onClick={() => setVacOpen(o => !o)}>
              <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
              <ListItemText primary="Vacation Bidding Module" />
              {vacOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={vacOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {vacSubmenu.map(it => (
                  <ListItemButton
                    key={it.text}
                    component={RouterLink}
                    to={it.path}
                    sx={{ pl: 4, '&:hover': { background: '#F0F7FF' } }}
                  >
                    <ListItemIcon>{it.icon}</ListItemIcon>
                    <ListItemText primary={it.text} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}