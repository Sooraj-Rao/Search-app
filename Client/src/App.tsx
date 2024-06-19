import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";

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

  const handleSearch = async (term: string) => {
    if (term.trim() === "") {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.get<Product[]>(
        `http://localhost:8000/api/search?term=${term}`
      );
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      setError("Failed to fetch data. Please try again.");
    }
  };

  const debouncedSearch = debounce((term: string) => {
    handleSearch(term);
  }, 1000);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  return (
    <div>
      <div className="flex justify-center gap-x-10 my-5">
        <h1 className="text-xl mb-5">Search Application</h1>
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search for books, phones..."
            className="dark:bg-slate-500 border-2 border-l-slate-300 h-10 px-3 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading && <h1>Loading...</h1>}

      {error && <h1>{error}</h1>}
      <ul className="flex gap-x-5 flex-wrap justify-center">
        {searchResults.map((result) => {
          const { _id, imageUrl, name,  stock, price, category } =
            result;
          return (
            <li key={_id}>
              <div className="shadow-lg h-96 w-60 p-4 m-4 rounded dark:bg-slate-700">
                <img
                  className="h-2/3 w-full object-contain mb-2"
                  src={imageUrl}
                  alt="product image"
                />
                <h1>{name.length > 22 ? name.slice(0, 22) + "..." : name}</h1>
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
      </ul>
    </div>
  );
};

export default App;
