// src/Pages/BooksPage.jsx
import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, TextField, Button } from "@mui/material";
import { books as localBooks } from "../data/booksData"; // fallback/local dataset
import BookCard from "../Components/BookCard";
import BookDetailModal from "../Components/BookDetailModal";
import openLibraryApi from "../Services/openLibrary";

const BooksPage = ({ cart, setCart }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // normalized items for UI
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Helper: normalize an OpenLibrary "doc" into the shape your components expect
  function normalizeDoc(doc) {
    // Open Library doc keys: key (like "/works/OLxxxxW"), title, author_name[], cover_i, first_publish_year
    const id = doc.key ? doc.key.replace("/works/", "") : doc.cover_edition_key || doc.edition_key?.[0] || doc.key || doc.id;
    const title = doc.title || "Untitled";
    const authors = doc.author_name || [];
    const coverId = doc.cover_i || null;

    return {
      id,
      title,
      author: authors.join(", "),
      authors, // keep raw array if child components want it
      coverId,
      coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null,
      year: doc.first_publish_year || doc.publish_year?.[0] || null,
      raw: doc, // keep original doc for later details
    };
  }

  // Perform search
  async function handleSearch(newPage = 1) {
    const q = query.trim();
    if (!q) {
      // If no query, fall back to localBooks
      setResults(localBooks.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author || b.authors?.join?.(", "),
        coverUrl: b.coverUrl || b.image || null,
        raw: b,
      })));
      return;
    }

    setLoading(true);
    try {
      const data = await openLibraryApi.searchBooks(q, newPage);
      const docs = data?.docs || [];
      const normalized = docs.map(normalizeDoc);
      setResults(normalized);
      setPage(newPage);
    } catch (err) {
      console.error("OpenLibrary search error:", err);
      // fallback to local books on error
      setResults(localBooks.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author || b.authors?.join?.(", "),
        coverUrl: b.coverUrl || b.image || null,
        raw: b,
      })));
    } finally {
      setLoading(false);
    }
  }

  // View details: when clicking a book card
  async function handleViewDetails(book) {
    // If we have a work id, fetch more details; otherwise use raw data
    setSelectedBook(null);
    setModalOpen(true);

    try {
      // If id looks like OLxxxW or we stored it already, call getWork
      // Open Library work IDs usually end with 'W' (e.g. OL82563W)
      if (/^OL.*W$/.test(book.id)) {
        const work = await openLibraryApi.getWork(book.id);
        const detailed = {
          ...book,
          description: work.description?.value || work.description || null,
          subjects: work.subjects || [],
          covers: work.covers || [], // array of cover ids
          detailsRaw: work,
        };
        // include a larger cover if available
        if (detailed.covers && detailed.covers.length > 0) {
          detailed.coverUrl = `https://covers.openlibrary.org/b/id/${detailed.covers[0]}-L.jpg`;
        }
        setSelectedBook(detailed);
      } else {
        // no work id -> show existing data
        setSelectedBook(book);
      }
    } catch (err) {
      console.error("Failed to fetch work details:", err);
      setSelectedBook(book); // show what we have anyway
    }
  }

  // Add to cart: keep your existing cart shape but avoid duplicates
  const handleAddToCart = (book) => {
    // Normalize cart entry
    const cartItem = {
      id: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl || (book.coverId ? `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg` : null),
      quantity: 1,
    };

    // If item already in cart, increment quantity
    const exists = cart.find((c) => c.id === cartItem.id);
    if (exists) {
      const updated = cart.map(c => c.id === cartItem.id ? { ...c, quantity: (c.quantity || 1) + 1 } : c);
      setCart(updated);
    } else {
      setCart([...cart, cartItem]);
    }
  };

  // Initialize with local books so the page isn't empty
  useEffect(() => {
    const initial = localBooks.slice(0, 12).map(b => ({
      id: b.id,
      title: b.title,
      author: b.author || b.authors?.join?.(", "),
      coverUrl: b.coverUrl || b.image || null,
      raw: b,
    }));
    setResults(initial);
  }, []);

  return (
    <Box sx={{ py: 5 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#ffa500",
          mb: 3,
          textAlign: "center",
        }}
      >
        Browse Books
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Open Library (title, author, ISBN...)"
          size="small"
        />
        <Button variant="contained" onClick={() => handleSearch(1)}>
          Search
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setQuery("");
            handleSearch(1);
          }}
        >
          Reset
        </Button>
      </Box>

      <Grid container spacing={4}>
        {results.length === 0 && !loading && (
          <Typography sx={{ textAlign: "center", width: "100%" }}>
            No books found.
          </Typography>
        )}

        {results.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <BookCard
              book={book}
              onViewDetails={() => handleViewDetails(book)}
              onAddToCart={() => handleAddToCart(book)}
            />
          </Grid>
        ))}
      </Grid>

      {/* simplistic pagination controls for Open Library (if you want) */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
        <Button
          disabled={page <= 1 || loading}
          onClick={() => handleSearch(page - 1)}
        >
          Prev
        </Button>
        <Typography sx={{ alignSelf: "center" }}>Page {page}</Typography>
        <Button
          disabled={loading}
          onClick={() => handleSearch(page + 1)}
        >
          Next
        </Button>
      </Box>

      <BookDetailModal
        open={modalOpen}
        book={selectedBook}
        onClose={() => setModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </Box>
  );
};

export default BooksPage;
