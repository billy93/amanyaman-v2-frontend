import { createSlice } from '@reduxjs/toolkit';

const date = new Date();
console.log('date', date.getMonth());
const createSearchSlice = createSlice({
  name: 'createQuotaSearch',
  initialState: {
    formState: {
      manualInput: {
        coverageType: 'Single Trip',
        travellerType: 'Individual',
        totalPass: 1,
        destinationCountry: [],
        adult: 1,
        child: 1,
        startDate: {
          day: date.getDate(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        },
        endDate: {
          day: date.getDate() + 1,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        },
      },
      upgradeData: null,
      selectPaymentMethod: 'Credit Card',
      useGalileoPNR: null,
      selectInsurancePlan: null,
      travellersData: {
        fullName: '',
        Nik: '',
        bookingId: '',
        success: false,
        listTravellers: [],
        list: [],
        editTraveller: null,
      },
      countries: null,
      lists: [],
      listProduct: [],
      step: 0,
      getById: null,
    },
  },
  reducers: {
    setFormStateCoverageType: (state, action) => {
      state.formState.manualInput.coverageType = action.payload;
    },
    setUpgradeData: (state, action) => {
      state.formState.upgradeData = action.payload;
    },
    setEditTraveller: (state, action) => {
      state.formState.travellersData.editTraveller = action.payload;
    },
    setGetById: (state, action) => {
      state.formState.getById = action.payload;
    },
    setStepActive: (state, action) => {
      state.formState.step = action.payload;
    },
    setFormStateCoverageChild: (state, action) => {
      state.formState.manualInput.child = action.payload;
    },
    setFormStateAdult: (state, action) => {
      state.formState.manualInput.adult = action.payload;
    },
    setFormStateTravellerType: (state, action) => {
      state.formState.manualInput.travellerType = action.payload;
    },
    setFormStateTotalPass: (state, action) => {
      state.formState.manualInput.totalPass = action.payload;
    },
    setFormStateDestinationCountry: (state, action) => {
      const { country } = action.payload;
      console.log('c', action.payload);
      state.formState.manualInput.destinationCountry = country;
    },
    setFormStateStartDate: (state, action) => {
      const { startDate } = action.payload;
      state.formState.manualInput.startDate = startDate;
    },
    setFormEndDate: (state, action) => {
      const { endDate } = action.payload;
      state.formState.manualInput.endDate = endDate;
    },
    setSelectTravelInsurancePlan: (state, action) => {
      const { travelInsurancePlan } = action.payload;
      state.formState.selectInsurancePlan = travelInsurancePlan;
    },
    setTravellersData: (state, action) => {
      // console.log('action', action.payload);
      state.formState.travellersData.listTravellers = [...action.payload];
    },
    setTravellersDataUpgrade: (state, action) => {
      // console.log('action', action.payload);
      state.formState.travellersData.list = [...action.payload];
    },
    setBookingId: (state, action) => {
      console.log('action', action.payload);
      state.formState.travellersData = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.formState.selectPaymentMethod = action.data;
    },
    setListCountries: (state, action) => {
      state.formState.countries = [...action.payload];
    },
    setMessage: (state, action) => {
      state.formState.travellersData.success = action.payload;
    },
    setListProducts: (state, action) => {
      state.formState.listProduct = [...action.payload];
    },
  },
});

export const {
  setUpgradeData,
  setMessage,
  setEditTraveller,
  setGetById,
  setBookingId,
  setStepActive,
  setListProducts,
  setListCountries,
  setFormStateAdult,
  setFormStateCoverageChild,
  setFormEndDate,
  setTravellersData,
  setTravellersDataUpgrade,
  setPaymentMethod,
  setFormStateCoverageType,
  setFormStateTravellerType,
  setFormStateTotalPass,
  setFormStateDestinationCountry,
  setFormStateStartDate,
  setSelectTravelInsurancePlan,
} = createSearchSlice.actions;

export default createSearchSlice.reducer;
export const selectManualInput = (state) =>
  state.quotaSearch?.formState?.manualInput;
export const quotState = (state) => state.quotaSearch?.formState;
export const getSearchById = (state) => state.quotaSearch?.formState?.getById;
export const selectTravelInsurance = (state) =>
  state.quotaSearch?.formState?.listProduct;
export const selectedTravelInsurance = (state) =>
  state.quotaSearch?.formState?.selectInsurancePlan;
export const FillTravellersData = (state) =>
  state.quotaSearch?.formState?.travellersData;
export const EditTravellers = (state) =>
  state.quotaSearch?.formState?.travellersData.editTraveller;
export const messages = (state) =>
  state.quotaSearch?.formState?.travellersData.success;
export const selectPaymentMethod = (state) =>
  state.quotaSearch?.formState?.selectPaymentMethod;
export const listcountries = (state) => state.quotaSearch?.formState?.countries;
export const travellerUpgrade = (state) =>
  state.quotaSearch?.formState?.upgradeData;
