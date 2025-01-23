import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  oneCategoriesData: [],
  filterProductsData: [],
  status: "",
  error: "",
};
const API_URL = "https://telran-project-backend-smoky.vercel.app/"
export const getOneCategory = createAsyncThunk(
  "oneCategory/getOneCategory",
  async (categoryId) => {
    const res = await fetch(`${API_URL}/categories/${categoryId}`);
    if (!res.ok) {
      throw new Error("No data found");
    }
    const data = await res.json();
    return data;
  }
);

const oneCategorySlice = createSlice({
  name: "oneCategory",
  initialState,
  reducers: {
    sortOneCategoryAction: (state, action) => {
      const select = action.payload;
      if (select === "default") {
        state.filterProductsData = [...state.oneCategoriesData.data];
      } else {
        const sortCard = [...state.filterProductsData];
        if (select === "price-high-low") {
          sortCard.sort((a, b) => b.price - a.price);
        } else if (select === "price-low-high") {
          sortCard.sort((a, b) => a.price - b.price);
        } else if (select === "newest") {
          sortCard.sort((a, b) => a.title.localeCompare(b.title));
        }
        state.filterProductsData = sortCard;
      }
    },
    filterOneCategoryPriceAction: (state, action) => {
      const { min_price, max_price } = action.payload;
      state.filterProductsData = state.oneCategoriesData.data.filter(
        (el) =>
          (min_price === 0 || el.price >= min_price) &&
          (max_price === Infinity || el.price <= max_price)
      );
    },
    filterOneCategorySaleAction: (state, action) => {
      if (action.payload) {
        state.filterProductsData = state.oneCategoriesData.data.filter(
          (product) => product.discont_price !== null
        );
      } else {
        state.filterProductsData = [...state.oneCategoriesData.data];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOneCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOneCategory.fulfilled, (state, action) => {
        state.oneCategoriesData = action.payload;
        state.filterProductsData = action.payload.data;
        state.status = "ready";
      })
      .addCase(getOneCategory.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      });
  },
});

export const {
  sortOneCategoryAction,
  filterOneCategoryPriceAction,
  filterOneCategorySaleAction,
} = oneCategorySlice.actions;

export default oneCategorySlice.reducer;
