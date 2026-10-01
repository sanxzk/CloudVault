import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import UploadIcon from "@mui/icons-material/CloudUpload";
import { supabase } from "../services/supabase";
import { useAuth } from "../hooks/useAuth";
import { getPresignedUrl, uploadFileToS3 } from "../services/uploadService";
import { saveMediaRecord } from "../services/mediaService";
import { fetchUserMedia } from "../services/mediaService";
import type { MediaItem } from "../services/mediaService";
import MediaGrid from "../components/gallery/mediaGrid";
import MediaViewer from "../components/gallery/mediaViewer";

export default function Gallery() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const MAX_SIZE_MB = 50;
    const isValidType =
      file.type.startsWith("image/") || file.type.startsWith("video/");
    const isValidSize = file.size <= MAX_SIZE_MB * 1024 * 1024;

    if (!isValidType) {
      alert("Only image and video files are allowed.");
      e.target.value = "";
      return;
    }

    if (!isValidSize) {
      alert(`File is too large. Max size is ${MAX_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const { uploadUrl, s3Key } = await getPresignedUrl(
        file.name,
        file.type,
        user.id,
      );
      await uploadFileToS3(uploadUrl, file);

      await saveMediaRecord({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        s3_key: s3Key,
      });
      await loadMedia();
      console.log("Upload complete and metadata saved");
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  const loadMedia = async () => {
    if (!user) return;
    setLoadingMedia(true);
    try {
      const items = await fetchUserMedia(user.id);
      setMediaItems(items);
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [user]);

  const [viewerItem, setViewerItem] = useState<MediaItem | null>(null);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">CloudVault</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h5">My Media</Typography>

          <Button
            variant="contained"
            startIcon={
              uploading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <UploadIcon />
              )
            }
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={handleFileSelected}
          />
        </Box>

        {loadingMedia ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        ) : mediaItems.length === 0 ? (
          <Box
            sx={
              {
                /* ...existing empty state styling... */
              }
            }
          >
            <Typography variant="body1" color="text.secondary">
              No media uploaded yet.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload your first file to get started.
            </Typography>
          </Box>
        ) : (
          <MediaGrid
            items={mediaItems}
            onCardClick={(item, url) => {
              setViewerItem(item);
              setViewerUrl(url);
            }}
          />
        )}
      </Box>
      <MediaViewer
        item={viewerItem}
        viewUrl={viewerUrl}
        onClose={() => {
          setViewerItem(null);
          setViewerUrl(null);
        }}
      />
    </Box>
  );
}
