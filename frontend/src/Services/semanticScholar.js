// UI → searchPapers() → Semantic Scholar API
//    → normalizePaper() → UI-ready data


const BASE_URL = "https://api.semanticscholar.org/graph/v1";

const PAPER_FIELDS = [
  "paperId", "title", "authors", "year", "abstract",
  "citationCount", "referenceCount", "openAccessPdf",
  "publicationDate", "journal", "externalIds",
  "tldr", "fieldsOfStudy", "s2FieldsOfStudy",
].join(",");

const API_KEY = import.meta.env.VITE_SEMANTIC_SCHOLAR_API_KEY || "";

const buildHeaders = () => {
  const h = { "Content-Type": "application/json" };
  if (API_KEY) h["x-api-key"] = API_KEY;
  return h;
};

// GLOBAL RATE LIMITER (1 req/sec queue)


let queue = [];
let isProcessing = false;
let lastRequestTime = 0;

const RATE_LIMIT_MS = 1000; // 1 request per second

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;

  const { resolve, reject, url } = queue.shift();

  try {
    const now = Date.now();
    const waitTime = Math.max(0, RATE_LIMIT_MS - (now - lastRequestTime));

    await new Promise((r) => setTimeout(r, waitTime));

    const res = await fetch(url, { headers: buildHeaders() });

    lastRequestTime = Date.now();

    if (res.status === 429) {
      // retry after delay
      console.warn("429 hit — retrying...");
      await new Promise((r) => setTimeout(r, 1000));
      queue.unshift({ resolve, reject, url }); // requeue
    } else if (!res.ok) {
      reject(new Error(`Semantic Scholar error ${res.status}`));
    } else {
      const data = await res.json();
      resolve(data);
    }
  } catch (err) {
    reject(err);
  }

  isProcessing = false;
  processQueue(); // process next
};

const rateLimitedFetch = (url) => {
  return new Promise((resolve, reject) => {
    queue.push({ resolve, reject, url });
    processQueue();
  });
};

//  UTILITIES

const stablePriceFromKey = (key = "", min = 49, max = 499) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) & 0xffffffff;
  }
  return min + (Math.abs(hash) % (max - min + 1));
};

const FIELD_COLORS = {
  "Computer Science": "1e3a5f",
  "Mathematics": "2d1b4e",
  "Physics": "1a3a2a",
  "Biology": "1a3320",
  "Medicine": "3a1a1a",
  "Chemistry": "3a2a1a",
  "Economics": "1a2a3a",
  "Psychology": "2a1a3a",
  "Engineering": "1e2d3a",
  "History": "2a1f1a",
};

const fieldToColor = (f = "") => FIELD_COLORS[f] || "1a1a2e";

//  NORMALIZER

export const normalizePaper = (paper) => {
  const id = paper.paperId || "";
  const title = paper.title || "Untitled Paper";

  const authors =
    (paper.authors || [])
      .slice(0, 3)
      .map((a) => a.name)
      .join("; ") +
    ((paper.authors || []).length > 3
      ? ` +${paper.authors.length - 3} more`
      : "");

  const field =
    paper.s2FieldsOfStudy?.[0]?.category ||
    paper.fieldsOfStudy?.[0] ||
    "Research";

  const image = `https://placehold.co/300x450/${fieldToColor(field)}/ffffff?text=${encodeURIComponent(
    field.slice(0, 14)
  )}`;

  const doi = paper.externalIds?.DOI;
  const pdfUrl = paper.openAccessPdf?.url || null;

  return {
    id,
    title,
    author: authors || "Unknown Author",
    image,
    price: stablePriceFromKey(id || title, 49, 499),
    source: "semantic_scholar",

    year: paper.year || null,
    description:
      paper.tldr?.text || paper.abstract || "No abstract available.",
    abstract: paper.abstract || "",
    citationCount: paper.citationCount ?? 0,
    referenceCount: paper.referenceCount ?? 0,
    field,
    journal: paper.journal?.name || null,
    publicationDate: paper.publicationDate || null,
    pdfUrl,
    doiUrl: doi ? `https://doi.org/${doi}` : null,
    isOpenAccess: !!pdfUrl,
    raw: paper,
  };
};
//  FETCH HELPER (NOW RATE LIMITED)

const fetchJSON = async (url) => {
  return rateLimitedFetch(url);
};
//  PUBLIC API


export const searchPapers = async ({
  query = "",
  page = 1,
  pageSize = 12,
  field = "all",
  sortBy = "relevance",
} = {}) => {
  const offset = (page - 1) * pageSize;
  const q = query.trim() || "deep learning";

  const params = new URLSearchParams({
    query: q,
    limit: pageSize,
    offset,
    fields: PAPER_FIELDS,
  });

  if (field && field !== "all") params.set("fieldsOfStudy", field);
  if (sortBy === "citationCount") params.set("sort", "citationCount");

  const data = await fetchJSON(`${BASE_URL}/paper/search?${params}`);

  return {
    papers: (data.data || []).map(normalizePaper),
    total: data.total || 0,
    page,
  };
};

export const fetchPaperById = async (paperId) => {
  const data = await fetchJSON(
    `${BASE_URL}/paper/${paperId}?fields=${PAPER_FIELDS}`
  );
  return normalizePaper(data);
};

export const RESEARCH_FIELDS = [
  { label: "All Fields", value: "all" },
  { label: "Computer Science", value: "Computer Science" },
  { label: "Mathematics", value: "Mathematics" },
  { label: "Physics", value: "Physics" },
  { label: "Biology", value: "Biology" },
  { label: "Medicine", value: "Medicine" },
  { label: "Chemistry", value: "Chemistry" },
  { label: "Economics", value: "Economics" },
  { label: "Psychology", value: "Psychology" },
  { label: "Engineering", value: "Engineering" },
];

export default {
  searchPapers,
  fetchPaperById,
  RESEARCH_FIELDS,
  normalizePaper,
};