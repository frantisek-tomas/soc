import { configureStore } from "@reduxjs/toolkit";
import messageSliceReducer from "./commponents/features/messageSlice";
import preventionSliceReducer from "./commponents/features/preventionSlice";
import recipeSliceReducer from "./commponents/features/recipeSlice";
import userSliceReducer from "./commponents/features/userSlice";
import loginSliceReducer from "./commponents/features/loginSlice";
import medicalProceduresReducer from "./commponents/features/MedicalProceduresSlice";

const store = configureStore({
  reducer: {
    message: messageSliceReducer,
    prevention: preventionSliceReducer,
    prescriptions: recipeSliceReducer,
    user: userSliceReducer,
    login: loginSliceReducer,
    medicalProcedures: medicalProceduresReducer,
  },
});

export default store;
