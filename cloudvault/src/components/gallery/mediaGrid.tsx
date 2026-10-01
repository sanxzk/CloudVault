import { Grid } from '@mui/material';
import type { MediaItem } from '../../services/mediaService';
import MediaCard from './mediaCard';

interface MediaGridProps {
  items: MediaItem[];
  onCardClick: (item: MediaItem, viewUrl: string) => void;
}

export default function MediaGrid({ items, onCardClick }: MediaGridProps) {
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
          <MediaCard item={item} onClick={onCardClick} />
        </Grid>
      ))}
    </Grid>
  );
}