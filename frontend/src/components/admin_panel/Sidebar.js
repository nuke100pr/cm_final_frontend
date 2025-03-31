import { 
    Box, 
    Drawer, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    Divider,
    Typography,
    Avatar
  } from '@mui/material';
  import {
    Dashboard as DashboardIcon,
    Category as CategoryIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    School as SchoolIcon
  } from '@mui/icons-material';
  
  const Sidebar = ({ activeTab, setActiveTab }) => {
    const tabs = [
      { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon /> },
      { id: 'boards', name: 'Boards', icon: <CategoryIcon /> },
      { id: 'clubs', name: 'Clubs', icon: <SchoolIcon /> },
      { id: 'users', name: 'Users', icon: <PeopleIcon /> },
      { id: 'por', name: 'POR', icon: <AssignmentIcon /> },
    ];
  
    return (
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#6a1b9a',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              margin: '0 auto 10px', 
              backgroundColor: '#9c4dcc',
              fontSize: '2rem'
            }}
          >
            C
          </Avatar>
          <Typography variant="h6">Admin</Typography>
          <Typography variant="caption">Control Panel</Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
        <List>
          {tabs.map((tab) => (
            <ListItem 
              key={tab.id}
              selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#9c4dcc',
                  '&:hover': {
                    backgroundColor: '#8e24aa',
                  }
                },
                '&:hover': {
                  backgroundColor: '#7b1fa2',
                },
                cursor: 'pointer'
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {tab.icon}
              </ListItemIcon>
              <ListItemText primary={tab.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
  };
  
  export default Sidebar;