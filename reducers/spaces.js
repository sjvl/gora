import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const spacesSlice = createSlice({
  name: 'spaces',
  initialState,
  reducers: {
    blank: (state, action) => {
        // state.value.push(action.payload);
    },
  },
});

export const { blank } = spacesSlice.actions;
export default spacesSlice.reducer;
