import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  categoriesData: [],
  status:'',
};

export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async () => {
    const res = await fetch("http://localhost:3333/categories/all");
    const data = res.json();
    return data;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoriesData = action.payload;
        state.status = "ready";
      })
      .addCase(getCategories.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default categoriesSlice.reducer;
