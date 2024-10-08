import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { sidebarMenu } from '../constants/SidebarMenu';
import { useLocation } from 'react-router-dom'

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >

      <Link to={'/'} style={{ textDecoration: 'none', color: 'black' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '0px 16px', gap: '12px' }}>
          <img src="/img/logo.png" width={65} height={45} alt="Wolly" />
          <h2>Wolly</h2>
        </Box>
      </Link>
      <List>

        {sidebarMenu.map((item, index) => (
          <ListItem
            component={Link}
            to={item.link}
            key={index}
            className={`sidebar-item ${pathname === item.link ? 'active' : ''}`}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} sx={{ color: 'black' }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;