import { createSlice } from '@reduxjs/toolkit';

const createPolicySlice = createSlice({
  name: 'policySlice',
  initialState: {
    policy: {
      masterChecked: false,
      message: null,
      listPolicy: [
        {
          id: 1,
          policyNumber: '13562452',
          traveller: 'Mr. Bayu Purnama',
          bookingId: '12345',
          product: 'Amanyaman Asia 50',
          status: 'Success',
          issuedBy: 'Mr. Fadli as',
          purchaseDate: '2023-05-16',
          select: 'false',
        },
        {
          id: 2,
          policyNumber: '94735395',
          traveller: 'Mr. Dudung',
          bookingId: '345211',
          product: 'Amanyaman Worldwide 50',
          status: 'Success',
          issuedBy: 'Mr. Rama ',
          purchaseDate: '2023-05-26',
          select: 'false',
        },
      ],
      selectedPolicy: [],
    },
  },
  reducers: {
    setStatePolicyList: (state, action) => {
      state.policy = action.payload;
    },
    setStateSelectedt: (state, action) => {
      state.policy.selectedPolicy = action.payload;
    },
    setStateMessage: (state, action) => {
      state.policy.message = action.payload;
    },
  },
});

export const { setStatePolicyList, setStateSelectedt, setStateMessage } =
  createPolicySlice.actions;

export default createPolicySlice.reducer;
export const listPolicy = (state) => state.policyList.policy;
export const message = (state) => state.policyList.message;
export const listSelected = (state) => state.policyList.policy?.selectedPolicy;
