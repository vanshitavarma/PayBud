import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groups: [],
  currentGroup: null,
  loading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
      state.loading = false;
      state.error = null;
    },
    addGroup: (state, action) => {
      state.groups.unshift(action.payload);
    },
    updateGroup: (state, action) => {
      const idx = state.groups.findIndex((g) => g._id === action.payload._id);
      if (idx !== -1) state.groups[idx] = action.payload;
    },
    removeGroup: (state, action) => {
      state.groups = state.groups.filter((g) => g._id !== action.payload);
    },
    setCurrentGroup: (state, action) => {
      state.currentGroup = action.payload;
    },
    setGroupsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGroupsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setGroups,
  addGroup,
  updateGroup,
  removeGroup,
  setCurrentGroup,
  setGroupsLoading,
  setGroupsError,
} = groupsSlice.actions;
export default groupsSlice.reducer;
