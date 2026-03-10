import React from "react";
import {
  Dialog, DialogContent, Box, Typography, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function BookReader({ open, book, readerUrl, onClose }) {
  if (!book) return null;

  return (
    <Dialog open={open} onClose={onClose} fullScreen
      PaperProps={{ sx: { background: "#0d0d0d" } }}
    >
      {/* Header */}
      <Box
        display="flex" justifyContent="space-between" alignItems="center"
        px={2} py={1}
        sx={{ background: "#1a1a1a", borderBottom: "1px solid #333" }}
      >
        <Typography fontWeight="bold" sx={{ color: "#ffa500" }}>
          📖 {book.title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Reader */}
      <DialogContent sx={{ p: 0 }}>
        {readerUrl ? (
          <iframe
            src={readerUrl}
            width="100%"
            height="100%"
            style={{ border: "none", minHeight: "calc(100vh - 56px)" }}
            title={book.title}
            allow="fullscreen"
          />
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
            <Typography sx={{ color: "#888" }}>No preview available.</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}