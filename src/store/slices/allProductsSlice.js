import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  allProductsData: [],
  filterProductsData: [],
  status:'',
  
};

export const getAllProducts = createAsyncThunk(
  "allProducts/getAllProducts",
  async () => {
    const res = await fetch("http://localhost:3333/products/all");
    const data = await res.json();
    return data;
  }
);

const allProductsSlice = createSlice({
  name: "allProducts",
  initialState,
  reducers: {
    //Сортировка select
    sortProductsAction: (state, action) => {
      const select = action.payload;
      if (select === "default") {
        state.filterProductsData = [...state.allProductsData];
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
    //Фильтрация по цене from = to
    filterPriceAction: (state, action) => {
      const { min_price, max_price } = action.payload;
      state.filterProductsData = state.allProductsData.filter(
        (el) =>
          (min_price === 0 || el.price >= min_price) &&
          (max_price === Infinity || el.price <= max_price)
      );
    },
    //Фильтрация чекбокс
    filterSaleProductsAction: (state, action) => {
      if (action.payload) {
        state.filterProductsData = state.allProductsData.filter(
          (product) => product.discont_price !== null
        );
      } else {
        state.filterProductsData = [...state.allProductsData];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.allProductsData = action.payload;
        state.filterProductsData = action.payload;
        state.status = "ready";
      })
      .addCase(getAllProducts.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default allProductsSlice.reducer;

export const {
  sortProductsAction,
  filterPriceAction,
  filterSaleProductsAction,
} = allProductsSlice.actions;
