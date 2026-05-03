
//  googleBooksApi.js

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const API_KEY  = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || "";


let lastRequestTime = 0;
const MIN_INTERVAL = 1100; // slightly above 1 sec

const waitForRateLimit = async () => {
  const now = Date.now();
  const diff = now - lastRequestTime;

  if (diff < MIN_INTERVAL) {
    await new Promise((res) =>
      setTimeout(res, MIN_INTERVAL - diff)
    );
  }

  lastRequestTime = Date.now();
};

// ─────────────────────────────────────────────
// stablePriceFromKey
// ─────────────────────────────────────────────

const stablePriceFromKey = (key = "", min = 199, max = 1499) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) & 0xffffffff;
  }
  return min + (Math.abs(hash) % (max - min + 1));
};

// ─────────────────────────────────────────────
// NORMALIZER
// ─────────────────────────────────────────────

export const normalizeGoogleBook = (volume) => {
  const info = volume.volumeInfo || {};
  const sale = volume.saleInfo || {};
  const id = volume.id || "";

  const image =
    info.imageLinks?.thumbnail?.replace("http:", "https:") ||
    info.imageLinks?.smallThumbnail?.replace("http:", "https:") ||
    `https://placehold.co/300x450/0f2027/ffa500?text=${encodeURIComponent(
      info.title?.slice(0, 10) || "Book"
    )}`;

  const listedUSD = sale.listPrice?.amount;

  const price = listedUSD
    ? Math.round(listedUSD * 90)
    : stablePriceFromKey(id || info.title || "", 199, 1499);

  const isbn =
    info.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier ||
    info.industryIdentifiers?.find((i) => i.type === "ISBN_10")?.identifier ||
    null;

  return {
    id,
    title: info.title || "Untitled",
    author: info.authors?.join(", ") || "Unknown Author",
    image,
    price,
    source: "google_books",

    subtitle: info.subtitle || "",
    publisher: info.publisher || null,
    publishedDate: info.publishedDate?.slice(0, 4) || null,
    description: info.description || "No description available.",
    pageCount: info.pageCount || null,
    categories: info.categories || [],
    rating: info.averageRating || null,
    ratingsCount: info.ratingsCount || 0,
    language: info.language || "en",
    isbn,
    previewLink: info.previewLink || null,
    infoLink: info.infoLink || null,
    raw: volume,
  };
};

// ─────────────────────────────────────────────
// FETCH HELPER (WITH RATE LIMIT)
// ─────────────────────────────────────────────

const fetchVolumes = async (params) => {
  await waitForRateLimit(); // 🔥 IMPORTANT FIX

  const url = new URL(BASE_URL);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  });

  if (API_KEY) url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString());

  if (res.status === 429) {
    throw new Error("Rate limit exceeded. Please wait a few seconds.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Google Books error ${res.status}`);
  }

  return res.json();
};

// ─────────────────────────────────────────────
// MAIN API
// ─────────────────────────────────────────────

export const searchAcademicBooks = async ({
  query = "",
  page = 1,
  pageSize = 12,
  subject = "all",
  orderBy = "relevance",
} = {}) => {
  const startIndex = (page - 1) * pageSize;

  let q = query.trim();

  if (subject && subject !== "all") {
    q = q ? `${q}+subject:${subject}` : `subject:${subject}`;
  } else if (!q) {
    q = "subject:academic+textbook";
  }

  const data = await fetchVolumes({
    q,
    startIndex,
    maxResults: pageSize,
    orderBy,
    printType: "books",
    langRestrict: "en",
    filter: "partial",
  });

  return {
    books: (data.items || []).map(normalizeGoogleBook),
    totalItems: data.totalItems || 0,
    page,
  };
};


// SUBJECT FILTERS


export const ACADEMIC_SUBJECTS = [
  { label: "All", value: "all" },
  { label: "Science", value: "science" },
  { label: "Engineering", value: "engineering" },
  { label: "Mathematics", value: "mathematics" },
  { label: "Medicine", value: "medicine" },
  { label: "Economics", value: "economics" },
  { label: "Psychology", value: "psychology" },
  { label: "History", value: "history" },
  { label: "Philosophy", value: "philosophy" },
  { label: "Law", value: "law" },
];

export default {
  searchAcademicBooks,
  normalizeGoogleBook,
  ACADEMIC_SUBJECTS,
};