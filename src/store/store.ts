/**
 * store.ts
 *
 * Root Redux store configuration.
 * Combines all slices and exports typed hooks for use across the app.
 */

import { configureStore } from "@reduxjs/toolkit";
import ticketsReducer from "@/store/ticketsSlice";

export const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
