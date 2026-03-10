import React, { useState } from "react";
import {
  Dialog, DialogContent, Box, Typography,
  IconButton, Button, CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import openLibraryApi from "../Services/openLibrary";
import { toast } from "react-toastify";

export default function BookDetailModal({ open, book, onClose, onAddToCart }) {
  const [loadingReader, setLoadingReader] = useState(false);
  const [readerUrl, setReaderUrl] = useState(null);  // ← store embed URL
  const [readerOpen, setReaderOpen] = useState(false);

  if (!book) return null;

  const handleReadPreview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to read books! 🔒");
      return;
    }

    setLoadingReader(true);
    const url = await openLibraryApi.getReadUrl(book.title, book.author);
    setLoadingReader(false);

    if (!url) {
      toast.error("No preview available for this book 📚");
      return;
    }

    // Archive.org embed → show in our reader
    if (url.includes("archive.org/embed")) {
      setReaderUrl(url);
      setReaderOpen(true);
    } else {
      // Google Books fallback → new tab
      window.open(url, "_blank");
    }
  };

  // ── FULLSCREEN READER (Archive.org embed) ──
  if (readerOpen) {
    return (
      <Dialog open fullScreen PaperProps={{ sx: { background: "#0d0d0d" } }}>
        <Box
          display="flex" justifyContent="space-between" alignItems="center"
          px={2} py={1}
          sx={{ background: "#1a1a1a", borderBottom: "1px solid #333" }}
        >
          <Typography fontWeight="bold" sx={{ color: "#ffa500" }}>
            📖 {book.title}
          </Typography>
          <IconButton onClick={() => { setReaderOpen(false); setReaderUrl(null); }} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <iframe
            src={readerUrl}
            width="100%"
            height="100%"
            style={{ border: "none", minHeight: "calc(100vh - 56px)" }}
            title={book.title}
            allow="fullscreen"
            allowFullScreen
          />
        </DialogContent>
      </Dialog>
    );
  }

  // ── BOOK DETAIL MODAL ──
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { background: "#1a1a1a", color: "#fff", borderRadius: 3 } }}
    >
      <DialogContent>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box display="flex" gap={3} mb={3}>
          <Box
            component="img"
            src={book.image}
            alt={book.title}
            sx={{ width: 120, height: 170, objectFit: "cover", borderRadius: 2 }}
          />
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#ffa500" }}>
              {book.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#bbb", mt: 1 }}>
              Author: {book.author}
            </Typography>
            <Typography variant="body2" sx={{ color: "#bbb", mt: 0.5 }}>
              Rating: ⭐ {book.rating ?? "N/A"}
            </Typography>
            <Typography variant="h6" sx={{ color: "#00e676", fontWeight: "bold", mt: 1 }}>
              ₹{book.price}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="contained" fullWidth
            sx={{ background: "linear-gradient(90deg,#ffa500,#ff5e00)", borderRadius: "24px", fontWeight: 600 }}
            onClick={() => { onAddToCart(book); onClose(); }}
          >
            Add to Cart — ₹{book.price}
          </Button>

          <Button
            variant="outlined" fullWidth
            disabled={loadingReader}
            sx={{ borderRadius: "24px", color: "#ffa500", borderColor: "#ffa500", fontWeight: 600 }}
            onClick={handleReadPreview}
          >
            {loadingReader
              ? <CircularProgress size={20} sx={{ color: "#ffa500" }} />
              : "📖 Read Preview"
            }
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}