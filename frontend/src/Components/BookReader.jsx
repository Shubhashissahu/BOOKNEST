import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Button
} from "@mui/material";

import { Document, Page, pdfjs } from "react-pdf";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CloseIcon from "@mui/icons-material/Close";

// PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

export default function BookReader({ open, book, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.2);

  if (!book) return null;

  const handleZoomIn = () => setScale((s) => s + 0.2);
  const handleZoomOut = () => setScale((s) => Math.max(0.8, s - 0.2));

  const nextPage = () => page < numPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#111",
          color: "white"
        }}
      >
        {book.title}
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ background: "#000", textAlign: "center" }}>
        {/* PDF Viewer */}
        <Document
          file={book.pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page pageNumber={page} scale={scale} />
        </Document>

        <Typography sx={{ color: "white", mt: 2 }}>
          Page {page} of {numPages}
        </Typography>

        {/* Controls */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
          <IconButton sx={{ color: "white" }} onClick={prevPage}>
            <NavigateBeforeIcon />
          </IconButton>

          <IconButton sx={{ color: "white" }} onClick={handleZoomOut}>
            <ZoomOutIcon />
          </IconButton>

          <IconButton sx={{ color: "white" }} onClick={handleZoomIn}>
            <ZoomInIcon />
          </IconButton>

          <IconButton sx={{ color: "white" }} onClick={nextPage}>
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
