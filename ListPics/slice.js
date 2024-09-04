import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  images: []
};

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addImage(state, action) {
      state.images.push(action.payload);
    },
    removeImage(state, action) {
      state.images = state.images.filter((image) => image !== action.payload);
    },
  },
});

export const { addImage, removeImage } = imagesSlice.actions;

export default {

  imagesSlice: imagesSlice.reducer
};

