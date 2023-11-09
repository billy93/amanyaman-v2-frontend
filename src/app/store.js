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
import upgradeQuotaSearch from '../features/dashboard/upgradePolicy/upgradeQuotaSearchSlice';
import policyList from '../features/dashboard/policy/policySlice';
import masterUser from '../features/dashboard/masterUser/masterUserSlice';
import masterProducts from '../features/dashboard/masterProduct/masterProductSlice';
import travelAgent from '../features/dashboard/travelAgent/travelAgentSlice';
import systemParams from '../features/dashboard/systemParameters/systemParamsSlice';
import productPrice from '../features/dashboard/productPrice/productPriceSlice';
import dashboards from '../features/dashboard/dashboards/dashboardSlice';
import { encryptTransform } from 'redux-persist-transform-encrypt';
// import { encryptData, decryptData } from './encrypt';
// import { enc, AES } from 'crypto-js';
// import storageSession from 'reduxjs-toolkit-persist/lib/storage/session';
// import { apiSlice } from './api/apiSlice';
// import { logOut } from '../features/auth/authSlice';
const encryptionKey = 'amanyaman-v2-2023';

const encryptor = encryptTransform({
  secretKey: encryptionKey,
  onError: function (error) {
    console.error('Encryption/Decryption Error:', error);
  },
});

const authPersistConfig = {
  key: 'auth',
  storage,
  transforms: [encryptor],
  whitelist: ['userLogin'],
};

// const rootPersistForm = {
//   key: 'root-form',
//   storage,
//   whitelist: ['quotaSearch'],
// };

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor],
  // whitelist: ['auth.userLogin'],
  blacklist: [
    'apiSlice',
    'quotaSearch',
    'policyList',
    'masterUser',
    'masterProduct',
    'agent',
    'systemParams',
    'productPrice',
    'upgradePolicy',
    'dashboards',
  ],
};

// const persistForm = persistReducer(rootPersistForm, createSearchQuotaReducer);
const authdReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authdReducer,
  quotaSearch: createSearchQuotaReducer,
  policyList: policyList,
  masterUser: masterUser,
  masterProduct: masterProducts,
  agent: travelAgent,
  systemParams: systemParams,
  productPrice: productPrice,
  dashboards: dashboards,
  upgradePolicy: upgradeQuotaSearch,
});

const persistRoot = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistRoot,
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
