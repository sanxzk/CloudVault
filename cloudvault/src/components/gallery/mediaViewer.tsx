import { Dialog, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { MediaItem } from '../../services/mediaService';

interface MediaViewerProps {
  item: MediaItem | null;
  viewUrl: string | null;
  onClose: () => void;
}

export default function MediaViewer({ item, viewUrl, onClose }: MediaViewerProps) {
  if (!item || !viewUrl) return null;

  const isVideo = item.file_type.startsWith('video/');

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1, bgcolor: 'background.paper' }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ bgcolor: 'black', display: 'flex', justifyContent: 'center' }}>
          {isVideo ? (
            <video src={viewUrl} controls style={{ maxWidth: '100%', maxHeight: '70vh' }} />
          ) : (
            <img src={viewUrl} alt={item.file_name} style={{ maxWidth: '100%', maxHeight: '70vh' }} />
          )}
        </Box>

        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1">{item.file_name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {(item.file_size / 1024).toFixed(1)} KB · {new Date(item.created_at).toLocaleString()}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}