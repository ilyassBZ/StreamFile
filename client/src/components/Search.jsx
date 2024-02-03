import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getfile, handleSearch, useSearch } from "../api/api";
import API_URL from "../utils/api";

import { useLocation } from "react-router-dom";

const SearchForm = () => {
  const [keyword, setKeyword] = useState("");
  const [download, setDownload] = useState(false);
  const location = useLocation();
  const handleSubmit = () => {
    handleSearch(keyword);
    setDownload(true);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlKeyword = urlParams.get("keyword");

    if (urlKeyword) {
      setKeyword(urlKeyword);
      setDownload(true);
    } else {
      setDownload(false);
    }
  }, [location.search]);

  return (
    <div className="w-full flex justify-center align-middle flex-col">
      <div className="w-full flex justify-center">
        <form onSubmit={handleSubmit} className="w-2/3 flex flex-row">
          <input
            type="text"
            name="keyword"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            className="border-2 border-gray-300 w-4/5 p-1 rounded-md"
            placeholder="Keyword"
          />
          <button className="bg-gray-200  p-1 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="30"
              viewBox="0 0 50 50"
            >
              <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"></path>
            </svg>
          </button>
        </form>
      </div>
      <div
        className={!download ? "hidden" : "flex justify-center w-full mt-20 "}
      >
        <a
          className=" flex justify-center border p-3 rounded-md bg-green-400"
          href={`${API_URL}/search?keyword=${keyword}`}
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default SearchForm;
