import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

export interface Interview {
  id: string;
  candidate: string;
  interviewer: string;
  date: Date | null;
  timeSlotStart: string;
  timeSlotEnd: string;
  interviewType: "Technical" | "HR" | "Behavioral";

}

interface InterviewState {
  interviews: Interview[];
}

const initialState: InterviewState = {
  interviews: [],
};

const interviewSlice = createSlice({
  name: "interviews",
  initialState,
  reducers: {
    addInterview: (state, action: PayloadAction<Omit<Interview, "id">>) => {
      const newInterview = { id: uuidv4(), ...action.payload };
      state.interviews.push(newInterview);
    },
    updateInterview: (state, action: PayloadAction<Interview>) => {
      const index = state.interviews.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.interviews[index] = action.payload;
      }
      toast.success("Slot Updated!");
    },
    removeInterview: (state, action: PayloadAction<string>) => {
      state.interviews = state.interviews.filter((i) => i.id !== action.payload);
    },
  },
});

export const { addInterview, updateInterview, removeInterview } = interviewSlice.actions;

const persistConfig = {
  key: "interviews",
  storage,
};

export default persistReducer(persistConfig, interviewSlice.reducer);
