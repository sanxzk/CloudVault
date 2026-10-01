import { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { getViewUrl } from '../../services/uploadService';
import type { MediaItem } from '../../services/mediaService';

interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem, viewUrl: string) => void;
}

export default function MediaCard({ item, onClick }: MediaCardProps) {
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getViewUrl(item.s3_key)
      .then((url) => {
        if (!cancelled) setViewUrl(url);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [item.s3_key]);

  const isVideo = item.file_type.startsWith('video/');

  return (
    <Card
      sx={{ cursor: viewUrl ? 'pointer' : 'default' }}
      onClick={() => viewUrl && onClick(item, viewUrl)}
    >
      <Box
        sx={{
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
        }}
      >
        {error && <BrokenImageIcon color="disabled" fontSize="large" />}
        {!error && !viewUrl && <CircularProgress size={24} />}
        {!error && viewUrl && isVideo && (
          <video src={viewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
        )}
        {!error && viewUrl && !isVideo && (
          <CardMedia
            component="img"
            image={viewUrl}
            alt={item.file_name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </Box>

      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
        <Typography variant="body2" noWrap title={item.file_name}>
          {item.file_name}
        </Typography>
      </CardContent>
    </Card>
  );
}