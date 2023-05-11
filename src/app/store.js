import { Iterable } from 'immutable'
import { configureStore,createSerializableStateInvariantMiddleware,isPlain } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice"
import authReducer from '../features/auth/authSlice'
import createClaimReducer from '../features/dashboard/claim/createClaimSlice'
import createSearchQuotaReducer from '../features/dashboard/quota-search/quotaSearchSlice'
import policyList from '../features/dashboard/policy/policySlice'
import masterUser from '../features/dashboard/masterUser/masterUserSlice'
import masterProducts from '../features/dashboard/masterProduct/masterProductSlice'

const isSerializable = (value) => Iterable.isIterable(value) || isPlain(value)

const getEntries = (value) =>
  Iterable.isIterable(value) ? value.entries() : Object.entries(value)

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
  getEntries,
})

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        createClaimForm: createClaimReducer,
        quotaSearch: createSearchQuotaReducer,
        policyList: policyList,
        masterUser: masterUser,
        masterProduct: masterProducts,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware),
    devTools: true
})