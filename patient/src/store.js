import { configureStore } from '@reduxjs/toolkit';
import contactsSliceReducer from './commonest/features/contactsSlice';
import medicalSliceReducer from './commonest/features/recipeSlice';
import pricesSliceReducer from './commonest/features/priceSlice';
import bookingSliceReducer from './commonest/features/bookingSlice';
import settingSliceReducer from './commonest/features/settingsSlice'

const store = configureStore({
  reducer: {
    contacts: contactsSliceReducer,
    recipe: medicalSliceReducer,
    prices: pricesSliceReducer,
    bookings : bookingSliceReducer,
    settings : settingSliceReducer,
  },
});

export default store;
