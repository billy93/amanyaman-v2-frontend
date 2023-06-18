import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../../../app/api/apiSlice';

const createSystemParamsSlice = createSlice({
  name: 'systemParamsSlice',
  initialState: {
    systemParams: {
      masterChecked: false,
      totalCount: null,
      listSystemParams: [],
      fields: {
        name: '',
        value: '',
      },
      edit: null,
      detail: null,
    },
  },
  reducers: {
    setSystemParams: (state, action) => {
      state.systemParams.listSystemParams = action.payload;
    },
    setSystemParamsFieldName: (state, action) => {
      state.systemParams.systemParamsName = action.payload;
    },
    setSystemParamsFieldValue: (state, action) => {
      state.systemParams.systemParamsValue = action.payload;
    },
    setFields: (state, action) => {
      state.systemParams.fields = action.payload;
    },
    setDetail: (state, action) => {
      state.systemParams.detail = action.payload;
    },
    setEdit: (state, action) => {
      state.systemParams.edit = action.payload;
    },
    setTotalCount: (state, action) => {
      state.systemParams.totalCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.getSystemParams.matchFulfilled,
      (state, { meta }) => {
        const headers = meta.baseQueryMeta.response.headers; // this is a Headers {} object
        state.totalCount = headers.get('X-Total-Count');
        console.log('tesssss', Number(headers.get('Content-Type'))); // prints application/json; charset=utf-8
        console.log('tesssss meta', meta); // prints application/json; charset=utf-8
        console.log(headers.get('authorization')); // prints undefined
      }
    );
  },
});

export const {
  setTotalCount,
  setEdit,
  setDetail,
  setSystemParams,
  setSystemParamsFieldName,
  setSystemParamsFieldValue,
  setFields,
} = createSystemParamsSlice.actions;

export default createSystemParamsSlice.reducer;
export const listSystemParam = (state) => state.systemParams.listSystemParams;
export const systemParamsNames = (state) => state.systemParams.systemParamsName;
export const systemParamsValues = (state) =>
  state.systemParams.systemParamsValue;
export const listFields = (state) => state.systemParams.systemParams.fields;
export const detailParams = (state) => state.systemParams.systemParams.detail;
export const editParams = (state) => state.systemParams.systemParams.edit;
export const totalCounts = (state) =>
  state.systemParams.systemParams.totalCount;
