import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from '../features/auth/authSlice';
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'reduxjs-toolkit-persist';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import createSearchQuotaReducer from '../features/dashboard/quota-search/quotaSearchSlice';
import policyList from '../features/dashboard/policy/policySlice';
import masterUser from '../features/dashboard/masterUser/masterUserSlice';
import masterProducts from '../features/dashboard/masterProduct/masterProductSlice';
import travelAgent from '../features/dashboard/travelAgent/travelAgentSlice';
import systemParams from '../features/dashboard/systemParameters/systemParamsSlice';
import productPrice from '../features/dashboard/productPrice/productPriceSlice';
import dashboards from '../features/dashboard/dashboards/dashboardSlice';
// import storageSession from 'reduxjs-toolkit-persist/lib/storage/session';
// import { apiSlice } from './api/apiSlice';
// import { logOut } from '../features/auth/authSlice';

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootPersistForm = {
  key: 'root-form',
  storage,
  whitelist: ['quotaSearch'],
};

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['apiSlice'], // Exclude the 'api' reducer from persisting
};

const persistAuth = persistReducer(persistConfig, authReducer);
const persistForm = persistReducer(rootPersistForm, createSearchQuotaReducer);

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: persistAuth,
  quotaSearch: persistForm,
  policyList: policyList,
  masterUser: masterUser,
  masterProduct: masterProducts,
  agent: travelAgent,
  systemParams: systemParams,
  productPrice: productPrice,
  dashboards: dashboards,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        /* ignore persistance actions */
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: true,
});
setupListeners(store.dispatch);
// console.log('tokens',JSON.parse(localStorage.getItem('persist')).token?.id_token )
// const checkTokenInLocalStorage = () => {
//   const token = JSON.parse(localStorage.getItem('persist')) && JSON.parse(localStorage.getItem('persist')).token?.id_token;
//   if (!token) {
//     store.dispatch(logOut()); // Force logout if token is not found
//     // window.location.reload(); // Refresh the page
//   } else {
//     store.dispatch(logOut(token));
//   }
// };

// // // Initialize the store and check token in localStorage
// checkTokenInLocalStorage();

// // Listen to the storage event to detect changes in localStorage
// window.addEventListener('storage', (event) => {
//   if (event.key === 'token' && event.newValue === null) {
//     store.dispatch(logOut()); // Force logout if token is cleared in localStorage
//     window.location.reload(); // Refresh the page
//   }
// });

export const persistor = persistStore(store);
