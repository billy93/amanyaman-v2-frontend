import { createSlice } from '@reduxjs/toolkit';

const date = new Date();
console.log('date upgrade', date.getMonth());
const upgradeSearchSlice = createSlice({
  name: 'upgradeQuotaSearch',
  initialState: {
    formState: {
      upgradeData: null,
    },
  },
  reducers: {
    setUpgradeData: (state, action) => {
      console.log('setanss', action.payload);
      state.formState.upgradeData = action.payload;
    },
  },
});

export const { setUpgradeData } = upgradeSearchSlice.actions;

export const travellerUpgrade = (state) =>
  state.upgradePolicy?.formState?.upgradeData;
