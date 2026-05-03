//src/components/PaperCard.jsx
import React, { useState } from "react";
import {
  Box, Typography, Button, Chip, Tooltip, IconButton,
} from "@mui/material";
import FormatQuoteIcon     from "@mui/icons-material/FormatQuote";
import LockOpenIcon        from "@mui/icons-material/LockOpen";
import LinkIcon            from "@mui/icons-material/Link";
import PictureAsPdfIcon    from "@mui/icons-material/PictureAsPdf";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import InfoOutlinedIcon    from "@mui/icons-material/InfoOutlined";

const fmtCitations = (n = 0) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const PaperCard = ({ paper, onViewDetails, onAddToCart }) => {
  const [imgErr, setImgErr] = useState(false);
  const { title, author, year, field, journal,
          citationCount, isOpenAccess, pdfUrl, doiUrl, price, image } = paper;

  return (
    <Box sx={{
      height: "100%", display: "flex", flexDirection: "column",
      borderRadius: 2, overflow: "hidden",
      bgcolor: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      transition: "all 0.2s ease",
      "&:hover": {
        border: "1px solid rgba(255,165,0,0.35)",
        bgcolor: "rgba(255,165,0,0.04)",
        transform: "translateY(-3px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      },
    }}>

      {/* Cover image */}
      <Box sx={{ position: "relative" }}>
        <Box component="img"
          src={imgErr ? "https://placehold.co/300x200/1a1a2e/ffa500?text=Paper" : image}
          alt={title} onError={() => setImgErr(true)}
          sx={{ width: "100%", height: 180, objectFit: "cover", display: "block", filter: "brightness(0.85)" }}
        />

        {/* Field pill */}
        <Chip label={field} size="small" sx={{
          position: "absolute", top: 8, left: 8,
          bgcolor: "rgba(0,0,0,0.75)", color: "#ffa500",
          fontSize: "0.65rem", height: 20,
          border: "1px solid rgba(255,165,0,0.3)",
          backdropFilter: "blur(4px)",
        }} />

        {/* Open Access badge */}
        {isOpenAccess && (
          <Chip
            icon={<LockOpenIcon sx={{ fontSize: "0.7rem !important", color: "#fff !important" }} />}
            label="Open Access" size="small"
            sx={{
              position: "absolute", top: 8, right: 8,
              bgcolor: "rgba(0,180,100,0.9)", color: "#fff",
              fontSize: "0.6rem", height: 20,
            }}
          />
        )}
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 1.5, gap: 0.75 }}>

        {/* Title */}
        <Typography sx={{
          fontWeight: 700, fontSize: "0.88rem", color: "#fff", lineHeight: 1.35,
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {title}
        </Typography>

        {/* Authors */}
        <Typography sx={{
          fontSize: "0.72rem", color: "rgba(255,255,255,0.5)",
          fontStyle: "italic", lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {author}
        </Typography>

        {/* Journal · year */}
        {(journal || year) && (
          <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,165,0,0.7)" }}>
            {[journal, year].filter(Boolean).join(" · ")}
          </Typography>
        )}

        {/* Citation count */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <FormatQuoteIcon sx={{ fontSize: "0.9rem", color: "#ffa500" }} />
          <Typography sx={{ fontSize: "0.78rem", color: "#ffa500", fontWeight: 600 }}>
            {fmtCitations(citationCount)} citations
          </Typography>
        </Box>

        {/* Quick-access links */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {pdfUrl && (
            <Tooltip title="Open PDF">
              <IconButton size="small" component="a" href={pdfUrl}
                target="_blank" rel="noopener noreferrer"
                sx={{ color: "#ff6b6b", p: 0.5 }}>
                <PictureAsPdfIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Tooltip>
          )}
          {doiUrl && (
            <Tooltip title="View on DOI">
              <IconButton size="small" component="a" href={doiUrl}
                target="_blank" rel="noopener noreferrer"
                sx={{ color: "rgba(255,255,255,0.4)", p: 0.5 }}>
                <LinkIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Price */}
        <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#4caf50" }}>
          ₹{price}
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mt: 0.5 }}>
          <Button variant="contained" color="warning" size="small"
            startIcon={<InfoOutlinedIcon />} onClick={onViewDetails}
            sx={{ fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 0.5 }}>
            View Details
          </Button>
          <Button variant="outlined" color="warning" size="small"
            startIcon={<AddShoppingCartIcon />} onClick={onAddToCart}
            sx={{ fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PaperCard;