import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setPage, setSearchTerm, setTotalPages } from "./slice";
import { debounce } from "lodash";
import "./styles.css";
import axios from "axios";
import { resizeImage } from "./imageResizer";

function App() {
  const dispatch = useDispatch();
  const { products, currentPage, totalPages, error } = useSelector(
    (state) => state.products
  );
  const [inputValue, setInputValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");

      const resizedProducts = await Promise.all(
        response.data.map(async (product) => {
          try {
            const resizedImage = await resizeImage(product.image, 300, 300);
            console.log("Resized image URL:", resizedImage);
            return { ...product, image: resizedImage };
          } catch (resizeError) {
            console.error("Error resizing image:", resizeError);
            return product;
          }
        })
      );
      console.log("Resized products:", resizedProducts);
      dispatch(fetchProducts(resizedProducts));
      setFilteredProducts(resizedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    dispatch(setPage(pageNumber));
  };

  const handleSearch = debounce((term) => {
    setInputValue(term);

    const filtered = products.filter(
      (product) =>
        product.category.toLowerCase().includes(term.toLowerCase()) ||
        product.title.toLowerCase().includes(term.toLowerCase())
    );

    if (
      filtered.length === 0 &&
      [
        "electronics",
        "jewelery",
        "men's clothing",
        "women's clothing",
      ].includes(term.toLowerCase())
    ) {
      setFilteredProducts([{ id: -1, title: "No match found" }]);
    } else {
      setFilteredProducts(filtered);
    }

    dispatch(setSearchTerm(term));
  }, 300);

  const handleInputChange = (event) => {
    const value = event.target.value;
    handleSearch(value);
  };

  const startIndex = (currentPage - 1) * 4;
  const endIndex = Math.min(startIndex + 4, filteredProducts.length);

  const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button
        key={i}
        className={currentPage === i ? "active" : ""}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="container">
      <div className="filter">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search..."
        />
      </div>
      <div className="grid">
        {productsToDisplay.map((product) => (
          <div className="grid-item" key={product.id}>
            <img src={product.image} alt={product.title} />
          </div>
        ))}
      </div>
      <div className="pagination">{paginationButtons}</div>
      {error && <div>Error fetching products: {error}</div>}
    </div>
  );
}

export default App;
