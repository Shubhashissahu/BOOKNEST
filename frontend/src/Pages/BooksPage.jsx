//src/pages/Bookpage.jsx
//
//  Three tabs:
//   0 — General Books    (Open Library search)
//   1 — Academic Books   (Google Books API)
//   2 — Research Papers  (Semantic Scholar)


import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box, Grid, Typography, TextField, Button,
  CircularProgress, Skeleton, Alert, Tabs, Tab,
  Chip, Stack, Select, MenuItem, FormControl,
} from "@mui/material";
import SearchIcon     from "@mui/icons-material/Search";
import RefreshIcon    from "@mui/icons-material/Refresh";
import MenuBookIcon   from "@mui/icons-material/MenuBook";
import SchoolIcon     from "@mui/icons-material/School";
import ScienceIcon    from "@mui/icons-material/Science";
import { toast }      from "react-toastify";
import { useSearchParams } from "react-router-dom";

import BookCard        from "../Components/BookCard";
import PaperCard       from "../Components/PaperCard";
import BookDetailModal from "../Components/BookDetailModal";

import { searchBooks }                            from "../Services/openLibrary";
import { searchAcademicBooks, ACADEMIC_SUBJECTS } from "../Services/googleBooksApi";
import { searchPapers,        RESEARCH_FIELDS }   from "../Services/semanticScholar";


//  SMALL SHARED UI PIECES


const TABS = [
  { label: "General Books",   icon: <MenuBookIcon sx={{ fontSize: "1rem" }} /> },
  { label: "Academic Books",  icon: <SchoolIcon   sx={{ fontSize: "1rem" }} /> },
  { label: "Research Papers", icon: <ScienceIcon  sx={{ fontSize: "1rem" }} /> },
];

const CardSkeleton = () => (
  <Box sx={{
    borderRadius: 2, overflow: "hidden",
    bgcolor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
  }}>
    <Skeleton variant="rectangular" height={200} animation="wave"
      sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
    <Box sx={{ p: 1.5 }}>
      <Skeleton variant="text" width="85%" animation="wave" sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
      <Skeleton variant="text" width="60%" animation="wave" sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
      <Skeleton variant="text" width="40%" animation="wave" sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
      <Skeleton variant="rectangular" height={34} sx={{ mt: 1.5, borderRadius: 1, bgcolor: "rgba(255,165,0,0.1)" }} />
    </Box>
  </Box>
);

const FilterChips = ({ options, selected, onSelect }) => (
  <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}>
    {options.map((opt) => (
      <Chip key={opt.value} label={opt.label}
        onClick={() => onSelect(opt.value)}
        sx={{
          cursor: "pointer",
          fontWeight: selected === opt.value ? 700 : 400,
          bgcolor: selected === opt.value ? "#ffa500" : "transparent",
          color:   selected === opt.value ? "#000"    : "rgba(255,255,255,0.6)",
          border:  selected === opt.value
            ? "1px solid #ffa500"
            : "1px solid rgba(255,255,255,0.15)",
          "&:hover": { borderColor: "#ffa500", color: selected === opt.value ? "#000" : "#ffa500" },
          transition: "all 0.15s ease",
        }}
      />
    ))}
  </Stack>
);

const SortSelect = ({ value, onChange, options }) => (
  <FormControl size="small" sx={{ minWidth: 160 }}>
    <Select value={value} onChange={(e) => onChange(e.target.value)}
      sx={{
        color: "#ffa500", fontSize: "0.8rem",
        bgcolor: "rgba(255,165,0,0.06)",
        border: "1px solid rgba(255,165,0,0.25)",
        ".MuiOutlinedInput-notchedOutline": { border: "none" },
        ".MuiSvgIcon-root": { color: "#ffa500" },
      }}
    >
      {options.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
    </Select>
  </FormControl>
);

const ResultCount = ({ count, loading }) =>
  !loading && count > 0
    ? <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", mb: 2 }}>
        ~{count.toLocaleString()} results
      </Typography>
    : null;

const EmptyState = ({ msg }) => (
  <Grid item xs={12}>
    <Box sx={{ textAlign: "center", py: 10 }}>
      <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>📭</Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.45)" }}>{msg}</Typography>
    </Box>
  </Grid>
);

const ErrorState = ({ msg, onRetry }) => (
  <Grid item xs={12}>
    <Alert severity="error"
      action={<Button size="small" startIcon={<RefreshIcon />} onClick={onRetry} sx={{ color: "#ffa500" }}>Retry</Button>}
      sx={{ bgcolor: "rgba(255,80,80,0.08)", color: "#ff6b6b", border: "1px solid rgba(255,80,80,0.2)", "& .MuiAlert-icon": { color: "#ff6b6b" } }}>
      {msg}
    </Alert>
  </Grid>
);

const PaginBar = ({ page, loading, onPrev, onNext }) => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 5 }}>
    <Button variant="outlined" color="warning" size="small"
      disabled={page === 1 || loading} onClick={onPrev} sx={{ minWidth: 90 }}>
      ← Prev
    </Button>
    <Typography sx={{ color: "#ffa500", fontWeight: 600, minWidth: 70, textAlign: "center" }}>
      Page {page}
    </Typography>
    <Button variant="outlined" color="warning" size="small"
      disabled={loading} onClick={onNext} sx={{ minWidth: 90 }}>
      Next →
    </Button>
  </Box>
);

// ─────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const BooksPage = ({ setCart }) => {
  const [searchParams] = useSearchParams();

  // Shared
  const [activeTab,    setActiveTab]    = useState(0);
  const [query,        setQuery]        = useState("");
  const [inputValue,   setInputValue]   = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen,    setModalOpen]    = useState(false);

  // Tab 0 — General
  const [genBooks,   setGenBooks]   = useState([]);
  const [genPage,    setGenPage]    = useState(1);
  const [genTotal,   setGenTotal]   = useState(0);
  const [genLoading, setGenLoading] = useState(false);
  const [genError,   setGenError]   = useState(null);

  // Tab 1 — Academic
  const [acadBooks,   setAcadBooks]   = useState([]);
  const [acadPage,    setAcadPage]    = useState(1);
  const [acadTotal,   setAcadTotal]   = useState(0);
  const [acadSubject, setAcadSubject] = useState("all");
  const [acadOrder,   setAcadOrder]   = useState("relevance");
  const [acadLoading, setAcadLoading] = useState(false);
  const [acadError,   setAcadError]   = useState(null);

  // Tab 2 — Research
  const [papers,       setPapers]       = useState([]);
  const [paperPage,    setPaperPage]    = useState(1);
  const [paperTotal,   setPaperTotal]   = useState(0);
  const [paperField,   setPaperField]   = useState("all");
  const [paperSort,    setPaperSort]    = useState("relevance");
  const [paperLoading, setPaperLoading] = useState(false);
  const [paperError,   setPaperError]   = useState(null);

  // Lazy-load guard — only fetch a tab when first visited
  const initiated = useRef({ 0: false, 1: false, 2: false });

  // ─── FETCHERS ──────────────────────────────────────────────

  const fetchGeneral = useCallback(async (q, page = 1) => {
    setGenLoading(true); setGenError(null);
    try {
      const res = await searchBooks(q || "popular books", page, 12);
      setGenBooks(res.docs); setGenPage(res.page); setGenTotal(res.totalFound);
    } catch (err) {
      setGenError("Could not load books. Please try again.",err); setGenBooks([]);
    } finally { setGenLoading(false); }
  }, []);

  const fetchAcademic = useCallback(async (q, page = 1, subject = "all", order = "relevance") => {
    setAcadLoading(true); setAcadError(null);
    try {
      const res = await searchAcademicBooks({ query: q, page, pageSize: 12, subject, orderBy: order });
      setAcadBooks(res.books); setAcadPage(res.page); setAcadTotal(res.totalItems);
    } catch (err) {
      setAcadError("Could not load academic books. Please try again.",err); setAcadBooks([]);
    } finally { setAcadLoading(false); }
  }, []);

  const fetchPapers = useCallback(async (q, page = 1, field = "all", sort = "relevance") => {
    setPaperLoading(true); setPaperError(null);
    try {
      const res = await searchPapers({ query: q, page, pageSize: 12, field, sortBy: sort });
      setPapers(res.papers); setPaperPage(res.page); setPaperTotal(res.total);
    } catch (e) {
      setPaperError(e.message.includes("Rate limit") ? e.message : "Could not load papers. Please try again.");
      setPapers([]);
    } finally { setPaperLoading(false); }
  }, []);

  // ─── INIT FROM URL ─────────────────────────────────────────

  useEffect(() => {
    const q   = searchParams.get("q") || searchParams.get("category") || "";
    const tab = parseInt(searchParams.get("tab") || "0", 10);
    setInputValue(q); setQuery(q); setActiveTab(tab);

    if (tab === 0) fetchGeneral(q, 1);
    if (tab === 1) fetchAcademic(q, 1, "all", "relevance");
    if (tab === 2) fetchPapers(q, 1, "all", "relevance");
    initiated.current[tab] = true;
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── LAZY-LOAD ON TAB SWITCH ────────────────────────────────

  useEffect(() => {
    if (!initiated.current[activeTab]) {
      initiated.current[activeTab] = true;
      if (activeTab === 0) fetchGeneral(query, 1);
      if (activeTab === 1) fetchAcademic(query, 1, acadSubject, acadOrder);
      if (activeTab === 2) fetchPapers(query, 1, paperField, paperSort);
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── SEARCH ────────────────────────────────────────────────

  const handleSearch = () => {
    const q = inputValue.trim();
    setQuery(q);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (activeTab === 0) { setGenPage(1);   fetchGeneral(q, 1); }
    if (activeTab === 1) { setAcadSubject("all"); setAcadPage(1);  fetchAcademic(q, 1, "all", acadOrder); }
    if (activeTab === 2) { setPaperField("all"); setPaperPage(1); fetchPapers(q, 1, "all", paperSort); }
  };

  // ─── CART ──────────────────────────────────────────────────

  const handleAddToCart = useCallback((item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        toast.info("Quantity updated");
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      toast.success(`Added to cart`);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, [setCart]);

  // ─── RENDER HELPERS ────────────────────────────────────────

  const skeletons = () =>
    Array.from({ length: 12 }).map((_, i) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={`sk-${i}`}><CardSkeleton /></Grid>
    ));

  const isLoading = (activeTab === 0 && genLoading) ||
                    (activeTab === 1 && acadLoading) ||
                    (activeTab === 2 && paperLoading);

  // ─── JSX ───────────────────────────────────────────────────

  return (
    <Box sx={{
      minHeight: "100vh", pt: 3, pb: 6, px: 2,
      background: "linear-gradient(180deg, rgba(0,0,0,0.97) 0%, rgba(15,15,25,0.98) 100%)",
    }}>
      <Box sx={{ maxWidth: 1320, mx: "auto" }}>

        {/* Header */}
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffa500", textAlign: "center", mb: 0.5, letterSpacing: "-0.5px" }}>
          Browse Books & Papers
        </Typography>
        <Typography sx={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", mb: 3 }}>
          General books, academic textbooks, and peer-reviewed research — all in one place
        </Typography>

        {/* Search bar */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mb: 3 }}>
          <TextField size="small" value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={
              activeTab === 0 ? "Search books..."
              : activeTab === 1 ? "Search textbooks..."
              : "Search research papers..."
            }
            InputProps={{ startAdornment: <SearchIcon sx={{ color: "#ffa500", mr: 1, fontSize: "1.1rem" }} /> }}
            sx={{
              width: { xs: "100%", sm: 320 },
              "& .MuiOutlinedInput-root": {
                bgcolor: "#111",
                "& fieldset": { borderColor: "rgba(255,165,0,0.25)" },
                "&:hover fieldset": { borderColor: "rgba(255,165,0,0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#ffa500" },
              },
              input: { color: "#fff" },
            }}
          />
          <Button variant="contained" color="warning" disabled={isLoading} onClick={handleSearch}
            sx={{ minWidth: 100, fontWeight: 700 }}>
            {isLoading ? <CircularProgress size={18} color="inherit" /> : "Search"}
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
            TabIndicatorProps={{ style: { backgroundColor: "#ffa500", height: 3 } }}
            sx={{
              "& .MuiTab-root": {
                color: "rgba(255,255,255,0.45)", textTransform: "none",
                fontWeight: 600, fontSize: "0.9rem", minHeight: 48,
                "&.Mui-selected": { color: "#ffa500" },
              },
            }}
          >
            {TABS.map((t, i) => (
              <Tab key={i} label={t.label} icon={t.icon} iconPosition="start" />
            ))}
          </Tabs>
        </Box>

        {/* ── TAB 0: GENERAL ─────────────────────────────── */}
        {activeTab === 0 && (
          <>
            <ResultCount count={genTotal} loading={genLoading} />
            <Grid container spacing={2.5} alignItems="stretch">
              {genLoading    ? skeletons()
               : genError    ? <ErrorState msg={genError} onRetry={() => fetchGeneral(query, genPage)} />
               : !genBooks.length ? <EmptyState msg="No books found. Try a different search." />
               : genBooks.map((b) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={b.id}>
                  <BookCard book={b}
                    onViewDetails={() => { setSelectedBook(b); setModalOpen(true); }}
                    onAddToCart={() => handleAddToCart(b)} />
                </Grid>
              ))}
            </Grid>
            {!genLoading && genBooks.length > 0 && (
              <PaginBar page={genPage} loading={genLoading}
                onPrev={() => { window.scrollTo({top:0,behavior:"smooth"}); fetchGeneral(query, genPage - 1); }}
                onNext={() => { window.scrollTo({top:0,behavior:"smooth"}); fetchGeneral(query, genPage + 1); }} />
            )}
          </>
        )}

        {/* ── TAB 1: ACADEMIC ────────────────────────────── */}
        {activeTab === 1 && (
          <>
            {/* Filters row */}
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 1 }}>
              <FilterChips options={ACADEMIC_SUBJECTS} selected={acadSubject}
                onSelect={(v) => { setAcadSubject(v); setAcadPage(1); fetchAcademic(query, 1, v, acadOrder); }} />
              <SortSelect value={acadOrder} onChange={(v) => { setAcadOrder(v); setAcadPage(1); fetchAcademic(query, 1, acadSubject, v); }}
                options={[{ value: "relevance", label: "Most Relevant" }, { value: "newest", label: "Newest First" }]} />
            </Box>
            <ResultCount count={acadTotal} loading={acadLoading} />
            <Grid container spacing={2.5} alignItems="stretch">
              {acadLoading    ? skeletons()
               : acadError    ? <ErrorState msg={acadError} onRetry={() => fetchAcademic(query, acadPage, acadSubject, acadOrder)} />
               : !acadBooks.length ? <EmptyState msg="No academic books found. Try a different subject or keyword." />
               : acadBooks.map((b) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={b.id}>
                  <BookCard book={b}
                    onViewDetails={() => { setSelectedBook(b); setModalOpen(true); }}
                    onAddToCart={() => handleAddToCart(b)} />
                </Grid>
              ))}
            </Grid>
            {!acadLoading && acadBooks.length > 0 && (
              <PaginBar page={acadPage} loading={acadLoading}
                onPrev={() => { window.scrollTo({top:0,behavior:"smooth"}); fetchAcademic(query, acadPage - 1, acadSubject, acadOrder); }}
                onNext={() => { window.scrollTo({top:0,behavior:"smooth"}); fetchAcademic(query, acadPage + 1, acadSubject, acadOrder); }} />
            )}
          </>
        )}

        {/* ── TAB 2: RESEARCH PAPERS ─────────────────────── */}
        {activeTab === 2 && (
          <>
            {/* Filters row */}
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 1 }}>
              <FilterChips options={RESEARCH_FIELDS} selected={paperField}
                onSelect={(v) => { setPaperField(v); setPaperPage(1); fetchPapers(query, 1, v, paperSort); }} />
              <SortSelect value={paperSort} onChange={(v) => { setPaperSort(v); setPaperPage(1); fetchPapers(query, 1, paperField, v); }}
                options={[{ value: "relevance", label: "Most Relevant" }, { value: "citationCount", label: "Most Cited" }]} />
            </Box>

            {/* Semantic Scholar info banner */}
            <Box sx={{
              bgcolor: "rgba(255,165,0,0.05)", border: "1px solid rgba(255,165,0,0.15)",
              borderRadius: 1.5, px: 2, py: 1, mb: 2,
              display: "flex", alignItems: "center", gap: 1,
            }}>
              <ScienceIcon sx={{ color: "#ffa500", fontSize: "1rem", flexShrink: 0 }} />
              <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>
                Powered by{" "}
                <Box component="a" href="https://semanticscholar.org" target="_blank" rel="noopener noreferrer"
                  sx={{ color: "#ffa500", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  Semantic Scholar
                </Box>
                {" "}— 200M+ academic papers. Open Access PDFs linked where available.
                {!import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY && " Add a free API key to VITE_SEMANTIC_SCHOLAR_API_KEY to increase rate limits."}
              </Typography>
            </Box>

            <ResultCount count={paperTotal} loading={paperLoading} />

            <Grid container spacing={2.5} alignItems="stretch">
              {paperLoading    ? skeletons()
               : paperError    ? <ErrorState msg={paperError} onRetry={() => fetchPapers(query, paperPage, paperField, paperSort)} />
               : !papers.length ? <EmptyState msg="No papers found. Try a different keyword or field." />
               : papers.map((p) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
                  <PaperCard paper={p}
                    onViewDetails={() => { setSelectedBook(p); setModalOpen(true); }}
                    onAddToCart={() => handleAddToCart(p)} />
                </Grid>
              ))}
            </Grid>

            {!paperLoading && papers.length > 0 && (
              <PaginBar page={paperPage} loading={paperLoading}
                onPrev={() => { window.scrollTo({top:0,behavior:"smooth"}); fetchPapers(query, paperPage - 1, paperField, paperSort); }}
                onNext={() => { window.scrollTo({top:0,behavior:"smooth"}); fetchPapers(query, paperPage + 1, paperField, paperSort); }} />
            )}
          </>
        )}

        {/* Modal */}
        <BookDetailModal open={modalOpen} book={selectedBook}
          onClose={() => setModalOpen(false)} onAddToCart={handleAddToCart} />

      </Box>
    </Box>
  );
};

export default BooksPage;