import { Iterable } from 'immutable'
import { configureStore,createSerializableStateInvariantMiddleware,isPlain,combineReducers } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice"
import authReducer from '../features/auth/authSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'reduxjs-toolkit-persist';
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import createClaimReducer from '../features/dashboard/claim/createClaimSlice'
import createSearchQuotaReducer from '../features/dashboard/quota-search/quotaSearchSlice'
import policyList from '../features/dashboard/policy/policySlice'
import masterUser from '../features/dashboard/masterUser/masterUserSlice'
import masterProducts from '../features/dashboard/masterProduct/masterProductSlice'
import travelAgent from '../features/dashboard/travelAgent/travelAgentSlice'
import storageSession from 'reduxjs-toolkit-persist/lib/storage/session'

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist:['auth']
}



const isSerializable = (value) => Iterable.isIterable(value) || isPlain(value)

const getEntries = (value) =>
  Iterable.isIterable(value) ? value.entries() : Object.entries(value)

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
  getEntries,
})

const rootReducer = combineReducers({
       [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        createClaimForm: createClaimReducer,
        quotaSearch: createSearchQuotaReducer,
        policyList: policyList,
        masterUser: masterUser,
        masterProduct: masterProducts,
        agent:travelAgent
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
     middleware: getDefaultMiddleware =>
       getDefaultMiddleware({
        serializableCheck: {
      /* ignore persistance actions */
      ignoredActions: [
        FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER
      ],
    },
      }).concat(apiSlice.middleware),
      devTools: true
})
setupListeners(store.dispatch)
export const persistor = persistStore(store)