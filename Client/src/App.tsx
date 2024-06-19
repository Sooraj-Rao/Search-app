import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";

interface Product {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  category: number;
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const debouncedTerm = useDebounce(searchTerm, 1000)[0];
  const Server = import.meta.env.VITE_SERVER;

  const handleSearch = useCallback(
    async (term: string) => {
      if (term.trim() === "") {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSearchResults([]);
        const response = await axios.get(`${Server}/api/search?term=${term}`);
        const { error, message, result } = response.data;
        if (error) return setError(message);
        setSearchResults(result);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [Server]
  );

  const debouncedText = useMemo(() => debouncedTerm, [debouncedTerm]);

  useEffect(() => {
    handleSearch(debouncedText);
  }, [debouncedText, handleSearch]);

  return (
    <div>
      <div className="flex sm:flex-row flex-col items-center mb-10 sm:items-start justify-center gap-x-10 my-5">
        <h1 className="text-xl">Search Application</h1>
        <div className="">
          <input
            type="text"
            placeholder="Search for books, phone..."
            className="dark:bg-slate-500 border-2 border-l-slate-300 h-10 px-3 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <h1 className="text-center my-10 text-red-500">{error}</h1>}
      <ul className="flex gap-x-5 flex-wrap justify-center">
        {loading
          ? Array(10)
              .fill("")
              .map((_, i) => (
                <div
                  key={i}
                  className="shadow-lg animate-pulse bg-slate-300 h-96 w-60 p-4 m-4 rounded dark:bg-slate-500"
                ></div>
              ))
          : searchResults?.map((result) => {
              const { _id, imageUrl, name, stock, price, category } = result;
              return (
                <li key={_id}>
                  <div className="shadow-lg h-96 w-60 p-4 m-4 rounded dark:bg-slate-700">
                    <img
                      className="h-2/3 w-full object-contain mb-2"
                      src={imageUrl}
                      alt="product image"
                    />
                    <h1>
                      {name.length > 22 ? name.slice(0, 22) + "..." : name}
                    </h1>
                    <h5 className="text-sm dark:bg-gray-800 bg-gray-200 w-fit px-2 rounded-lg mt-1">
                      {category}
                    </h5>
                    <h5 className="mt-1 text-xl font-bold">₹ {price}</h5>
                    <h5 className="mt-1 text-sm ">
                      {stock > 0 ? stock + " in stock" : "Out of stock"}
                    </h5>
                  </div>
                </li>
              );
            })}
        {!loading && searchResults?.length === 0 && (
          <h1>Try Searching audio,books,phone..</h1>
        )}
      </ul>
    </div>
  );
};

export default App;
