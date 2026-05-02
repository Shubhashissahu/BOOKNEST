// import axios from "axios";

// const BASE_URL = "https://openlibrary.org";
// const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";
// const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;

const BASE_URL = "https://openlibrary.org";

// ── Subject slugs that map to each UI category chip
export const CATEGORY_SUBJECTS = {
  all:      null,           // handled separately — uses trending endpoint
  fiction:  "fiction",
  science:  "science",
  "self-help": "self_help",
  business: "business",
  history:  "history",
};

// ── Trending period options
export const TRENDING_PERIODS = {
  daily:   "daily",
  weekly:  "weekly",
  monthly: "monthly",
};
//  STABLE PRICE  (no Math.random — same key → same price)
export const stablePriceFromKey = (key = "", min = 199, max = 999) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) & 0xffffffff;
  }
  return min + (Math.abs(hash) % (max - min + 1));
};
//  NORMALIZERS
// Works API doc → unified book shape
export const normalizeWork = (work) => {
  const key   = work.key || "";
  const id    = key.replace("/works/", "");
  const coverId = work.cover_id || work.cover_i;

  return {
    id,
    title:     work.title || "Untitled",
    author:    work.authors?.[0]?.name
                 || work.author_name?.[0]
                 || work.authors?.[0]
                 || "Unknown Author",
    image: coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : `https://placehold.co/300x450/111827/ffa500?text=${encodeURIComponent(work.title?.slice(0,10) || "Book")}`,
    price:     stablePriceFromKey(key || work.title || ""),
    rating:    work.ratings_average
                 ? parseFloat(work.ratings_average.toFixed(1))
                 : null,
    ratingsCount: work.ratings_count || 0,
    firstPublished: work.first_publish_year || null,
    subject:   work.subject?.[0] || null,
    source:    "openlibrary",
    raw:       work,
  };
};
/**
 * Get embeddable reading URL (Internet Archive)
 */
export const getReadUrl = async (title, author) => {
  try {
    const data = await fetchJSON(
      `${BASE_URL}/search.json?q=${encodeURIComponent(title + " " + author)}&limit=1`
    );

    const doc = data.docs?.[0];
    if (!doc) return null;

    const iaId = doc.ia?.[0];

    if (iaId) {
      return `https://archive.org/embed/${iaId}`;
    }

    return null; // no fallback now (Google removed)

  } catch {
    return null;
  }
};
// Search API doc → unified book shape (slightly different field names)
export const normalizeSearchDoc = (doc) => {
  const key     = doc.key || "";
  const id      = key.replace("/works/", "");
  const coverId = doc.cover_i;

  return {
    id,
    title:     doc.title || "Untitled",
    author:    doc.author_name?.join(", ") || "Unknown Author",
    image: coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : `https://placehold.co/300x450/111827/ffa500?text=${encodeURIComponent(doc.title?.slice(0,10) || "Book")}`,
    price:     stablePriceFromKey(key || doc.title || ""),
    rating:    doc.ratings_average
                 ? parseFloat(doc.ratings_average.toFixed(1))
                 : null,
    ratingsCount: doc.ratings_count || 0,
    firstPublished: doc.first_publish_year || null,
    subject:   doc.subject?.[0] || null,
    source:    "openlibrary",
    raw:       doc,
  };
};
//  FETCH HELPERS
const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open Library error ${res.status}: ${url}`);
  return res.json();
};
export const fetchTrending = async (period = "weekly", limit = 12) => {
  const data = await fetchJSON(
    `${BASE_URL}/trending/${period}.json?limit=${limit}`
  );
  return (data.works || []).map(normalizeWork);
};
export const fetchBySubject = async (subject, limit = 12, offset = 0) => {
  const data = await fetchJSON(
    `${BASE_URL}/subjects/${subject}.json?limit=${limit}&offset=${offset}`
  );
  // Subjects API returns works with slightly different shape
  return (data.works || []).map((work) => {
    const key     = work.key || "";
    const id      = key.replace("/works/", "");
    const coverId = work.cover_id;
    const authorName = work.authors?.[0]?.name || "Unknown Author";

    return {
      id,
      title:   work.title || "Untitled",
      author:  authorName,
      image: coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : `https://placehold.co/300x450/111827/ffa500?text=${encodeURIComponent(work.title?.slice(0,10) || "Book")}`,
      price:   stablePriceFromKey(key || work.title || ""),
      rating:  null,
      ratingsCount: 0,
      firstPublished: work.first_publish_year || null,
      subject: subject,
      source:  "openlibrary",
      raw:     work,
    };
  });
};

export const searchBooks = async (query, page = 1, limit = 12) => {
  const offset = (page - 1) * limit;
  const data   = await fetchJSON(
    `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,ratings_average,ratings_count,subject`
  );
  return {
    docs:       (data.docs || []).map(normalizeSearchDoc),
    totalFound: data.numFound || 0,
    page,
  };
};
 
export const fetchWorkById = async (workId) => {
  const [work, ratings] = await Promise.allSettled([
    fetchJSON(`${BASE_URL}/works/${workId}.json`),
    fetchJSON(`${BASE_URL}/works/${workId}/ratings.json`),
  ]);

  const w = work.status === "fulfilled" ? work.value : {};
  const r = ratings.status === "fulfilled" ? ratings.value : {};

  const coverId = w.covers?.[0];
  const key     = w.key || `/works/${workId}`;
  const id      = key.replace("/works/", "");

  return {
    id,
    title:    w.title || "Untitled",
    author:   "Unknown Author",          // authors need separate /authors/:id call
    image: coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`  // Large for modal
      : `https://placehold.co/300x450/111827/ffa500?text=No+Cover`,
    description: typeof w.description === "string"
      ? w.description
      : w.description?.value || "No description available.",
    price:    stablePriceFromKey(key || id),
    rating:   r.summary?.average ? parseFloat(r.summary.average.toFixed(1)) : null,
    ratingsCount: r.summary?.count || 0,
    firstPublished: null,
    source:   "openlibrary",
    raw:      w,
  };
};

export default {
  fetchTrending,
  fetchBySubject,
  searchBooks,
  fetchWorkById,
  getReadUrl,
  stablePriceFromKey,
  normalizeWork,
  normalizeSearchDoc,
  CATEGORY_SUBJECTS,
};