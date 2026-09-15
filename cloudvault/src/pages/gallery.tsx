import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, AppBar, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadIcon from '@mui/icons-material/CloudUpload';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

export default function Gallery() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">CloudVault</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">{user?.email}</Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5">My Media</Typography>
          <Button variant="contained" startIcon={<UploadIcon />} disabled>
            Upload
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 10,
            border: '2px dashed #ccc',
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No media uploaded yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload will be available soon.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}