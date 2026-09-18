import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadIcon from '@mui/icons-material/CloudUpload';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { getPresignedUrl, uploadFileToS3 } from '../services/uploadService';
import { saveMediaRecord } from '../services/mediaService';

export default function Gallery() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const { uploadUrl, s3Key } = await getPresignedUrl(file.name, file.type, user.id);
      await uploadFileToS3(uploadUrl, file);

      await saveMediaRecord({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        s3_key: s3Key,
      });

      console.log('Upload complete and metadata saved');
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
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

          <Button
            variant="contained"
            startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <UploadIcon />}
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={handleFileSelected}
          />
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