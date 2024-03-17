import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favourites: [],
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    setFavourites(state, action) {
      state.favourites = action.payload;
    },
    addFavourite(state, action) {
      const existingMovie = state.favourites.find(movie => movie.movieId === action.payload.movieId);
      if (!existingMovie) {
        state.favourites.push(action.payload);
      }
    },
    removeFavourite(state, action) {
      state.favourites = state.favourites.filter(movie => movie.movieId !== action.payload);
    },
  },
});

export const { setFavourites, addFavourite, removeFavourite } = apiSlice.actions;

export default apiSlice.reducer;
