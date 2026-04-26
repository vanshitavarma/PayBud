import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  loading: false,
  error: null,
  filters: {
    groupId: null,
    dateRange: null,
    category: null,
  },
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
      state.loading = false;
      state.error = null;
    },
    addExpense: (state, action) => {
      state.expenses.unshift(action.payload);
    },
    updateExpense: (state, action) => {
      const idx = state.expenses.findIndex((e) => e._id === action.payload._id);
      if (idx !== -1) state.expenses[idx] = action.payload;
    },
    removeExpense: (state, action) => {
      state.expenses = state.expenses.filter((e) => e._id !== action.payload);
    },
    setExpensesLoading: (state, action) => {
      state.loading = action.payload;
    },
    setExpensesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setExpenses,
  addExpense,
  updateExpense,
  removeExpense,
  setExpensesLoading,
  setExpensesError,
  setFilters,
  clearFilters,
} = expensesSlice.actions;
export default expensesSlice.reducer;
