import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './apiSlice'; // Adjust the import path as needed

export const store = configureStore({
  reducer: {
    api: apiReducer,
  },
});
