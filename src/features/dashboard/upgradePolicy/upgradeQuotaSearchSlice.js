import { createSlice } from '@reduxjs/toolkit';

const date = new Date();
console.log('date upgrade', date.getMonth());
const upgradeSearchSlice = createSlice({
  name: 'upgradeQuotaSearch',
  initialState: {
    formState: {
      upgradeData: null,
      listProducts: [],
      listTravellers: [],
    },
  },
  reducers: {
    setUpgradeData: (state, action) => {
      state.formState.upgradeData = { ...action.payload };
    },
    setUpgradeDataProducts: (state, action) => {
      state.formState.listProducts = action.payload;
    },
    setUpgradeDataTravellers: (state, action) => {
      state.formState.listTravellers = action.payload;
    },
  },
});

export const {
  setUpgradeData,
  setUpgradeDataProducts,
  setUpgradeDataTravellers,
} = upgradeSearchSlice.actions;
export default upgradeSearchSlice.reducer;
export const travellerUpgrade = (state) =>
  state.upgradePolicy?.formState?.upgradeData;

export const upgradeProducts = (state) =>
  state.upgradePolicy?.formState?.listProducts;

export const upgradeListTravellers = (state) =>
  state.upgradePolicy?.formState?.listTravellers;
