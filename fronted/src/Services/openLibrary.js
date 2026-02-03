import axios from "axios";

const BASE_URL = "https://openlibrary.org";

const openLibraryApi = {
  searchBooks: async (query, page = 1) => {
    const res = await axios.get(`${BASE_URL}/search.json`, {
      params: { q: query, page },
    });
    return res.data;
  },
};

export default openLibraryApi;
