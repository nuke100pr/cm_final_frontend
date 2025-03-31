import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f8' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '240px',
          backgroundColor: '#f5f5f8',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;