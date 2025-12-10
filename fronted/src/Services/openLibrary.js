//This file handles only Open Library calls — clean, simple, and reusable.
import axios from "axios";

const OPEN_BASE = "https://openlibrary.org";

const openLibraryApi = {
  searchBooks: (query, page = 1) =>
    axios.get(`${OPEN_BASE}/search.json`, {
      params: { q: query, page },
    }).then(res => res.data),

  getWork: (workId) =>
    axios.get(`${OPEN_BASE}/works/${workId}.json`)
      .then(res => res.data),

  // For cover images
  getCoverUrl: (coverId, size = "M") =>
    `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`,
};

export default openLibraryApi;
