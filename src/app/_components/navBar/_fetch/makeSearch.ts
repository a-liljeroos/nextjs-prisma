import { SearchResult } from "@types";

const noResults: SearchResult = {
  posts: [],
  users: [],
  docs: [],
};

const makeSearch = async (term: string): Promise<SearchResult | null> => {
  return fetch("/api/search?q=" + term, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    if (res.status === 500) {
      return null;
    }
    return null;
  });
};

export default makeSearch;
