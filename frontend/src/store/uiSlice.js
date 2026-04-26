import { createSlice } from '@reduxjs/toolkit';

let toastIdCounter = 0;

const initialState = {
  sidebarOpen: false,
  modalStack: [],
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    pushModal: (state, action) => {
      state.modalStack.push(action.payload);
    },
    popModal: (state) => {
      state.modalStack.pop();
    },
    clearModals: (state) => {
      state.modalStack = [];
    },
    addToast: (state, action) => {
      toastIdCounter += 1;
      state.toasts.push({
        id: toastIdCounter,
        type: 'info',
        duration: 4000,
        ...action.payload,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  pushModal,
  popModal,
  clearModals,
  addToast,
  removeToast,
} = uiSlice.actions;
export default uiSlice.reducer;
