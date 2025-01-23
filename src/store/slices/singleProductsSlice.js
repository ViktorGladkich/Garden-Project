import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { serverUrl } from "../../utils/config.js";

const initialState = {
  product: {},
};
const API_URL = "https://telran-project-backend-smoky.vercel.app/"
export const getSingleProduct = createAsyncThunk(
  "singleProduct/getSingleProduct",
  async (productId) => {
    const res = await fetch(`${API_URL}products/${productId}`);
    if (!res.ok) {
      throw new Error("No data found");
    }
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  }
);

const singleProductSlice = createSlice({
  name: "singleProduct",
  initialState,
  reducers: {
    incrementSingleProducts(state) {
      if (state.product) {
        state.product.amount++;
      }
    },
    decrementSingleProducts(state) {
      if (state.product && state.product.amount > 1) {
        state.product.amount--;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.product = { ...action.payload, amount: 1 };
        state.status = "succeeded";
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { incrementSingleProducts, decrementSingleProducts } = singleProductSlice.actions;
export default singleProductSlice.reducer;
