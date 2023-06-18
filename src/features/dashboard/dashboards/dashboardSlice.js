import { createSlice } from '@reduxjs/toolkit';

const createDashboardSlice = createSlice({
  name: 'dashboardSlice',
  initialState: {
    policy: {},
  },
  reducers: {
    setStatePolicyList: (state, action) => {
      state.policy = action.payload;
    },
  },
});

export const { setStatePolicyList } = createDashboardSlice.actions;

export default createDashboardSlice.reducer;
export const chartstate = (state) => state.dashboards.policy;
