import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  products: [],
  currentPage: 1,
  totalPages: 1,
  searchTerm: "",
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchProducts: (state, action) => {
      state.products = action.payload;
      state.totalPages = Math.ceil(action.payload.length / 4);
      state.error = null;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { fetchProducts, setPage, setSearchTerm } = productsSlice.actions;
export default productsSlice.reducer;
