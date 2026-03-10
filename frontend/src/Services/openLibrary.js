import axios from "axios";

const BASE_URL = "https://openlibrary.org";
const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;

const openLibraryApi = {
  searchBooks: async (query, page = 1) => {
    const res = await axios.get(`${BASE_URL}/search.json`, {
      params: { q: query, page },
    });
    return res.data;
  },

  // ✅ Gets Internet Archive embed URL (works inside iframe)
  getReadUrl: async (title, author) => {
    try {
      // Step 1 — Search Open Library for the book
      const searchRes = await axios.get(`${BASE_URL}/search.json`, {
        params: { q: `${title} ${author}`, limit: 1 },
      });

      const doc = searchRes.data.docs?.[0];
      if (!doc) return null;

      // Step 2 — Get Internet Archive ID
      const iaId = doc.ia?.[0]; // ia = internet archive identifier
      if (iaId) {
        // Step 3 — Return embeddable Archive.org URL
        return `https://archive.org/embed/${iaId}`;
      }

      // Step 4 — Fallback to Google Books preview link (opens new tab)
      const googleRes = await axios.get(GOOGLE_BOOKS_URL, {
        params: {
          q: `${title} ${author}`,
          maxResults: 1,
          filter: "partial",
          key: GOOGLE_API_KEY,
        },
      });

      const item = googleRes.data.items?.[0];
      return item?.volumeInfo?.previewLink || null;

    } catch {
      return null;
    }
  },
};

export default openLibraryApi;