import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, id: null, createdSpaces: [], visitedSpaces: [] },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.id = action.payload.id;
      state.value.createdSpaces = action.payload.createdSpaces;
      state.value.visitedSpaces = action.payload.visitedSpaces;
    },

    addSpace: (state, action) => {
      state.value.createdSpaces.push(action.payload);
    },
    updateSpace: (state, action) => {
      let index = state.value.createdSpaces.findIndex(e => e._id === action.payload._id)
      if(index > -1){
        state.value.createdSpaces[index].ground = action.payload.ground;
        state.value.createdSpaces[index].foreground = action.payload.foreground;
        state.value.createdSpaces[index].walls = action.payload.walls;
      }
    },
    trashSpace: (state, action) => {
      // console.log(current(state.value.createdSpaces))
      state.value.createdSpaces = state.value.createdSpaces.filter(space => space._id !== action.payload)
    },

    visitSpace: (state, action) => {
      if(!state.value.visitedSpaces.find(e => e._id === action.payload._id)){
        state.value.visitedSpaces.push(action.payload);
      }else{
        let index = state.value.visitedSpaces.findIndex(e => e._id === action.payload._id);
        state.value.visitedSpaces[index] = action.payload;
      }
    },
    trashVisitSpace: (state, action) => {
      state.value.visitedSpaces = state.value.visitedSpaces.filter(space => space._id !== action.payload)
    },

    logout: (state) => {
      state.value.token = null;
      state.value.id = null;
      state.value.createdSpaces = [];
      state.value.visitedSpaces = [];
    },
  },
});

export const { login, addSpace, updateSpace, trashSpace, visitSpace, trashVisitSpace, logout } = userSlice.actions;
export default userSlice.reducer;
