import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateLastBotMessage: (state, action) => {
      const { id, text } = action.payload;
      const message = state.messages.find((msg) => msg.id === id);
      if (message) {
        message.text = text;
      }
    },
  },
});

export const { addMessage, updateLastBotMessage } = chatSlice.actions;
export default chatSlice.reducer;
