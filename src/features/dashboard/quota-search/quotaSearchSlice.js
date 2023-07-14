import { createSlice } from '@reduxjs/toolkit';

const date = new Date();
console.log('date', date.getMonth());
const createSearchSlice = createSlice({
  name: 'createQuotaSearch',
  initialState: {
    formState: {
      manualInput: {
        coverageType: '',
        travellerType: '',
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
      selectPaymentMethod: 'Credit Card',
      useGalileoPNR: null,
      selectInsurancePlan: null,
      travellersData: {
        fullName: '',
        Nik: '',
        listTravellers: [
          {
            id: 1,
            typeStatus: 'Mrs',
            fullName: 'Andrea Pirlo',
            emailAddress: 'andrea@gmail.com',
            phoneNumber: '02138499',
            pasportNumber: '76542662',
            dateOfBirth: '23 juli 1967',
            placeOfBirth: 'Roma',
          },
        ],
      },
      countries: null,
      lists: [],
      listProduct: [],
    },
    step: 1,
  },
  reducers: {
    setFormStateCoverageType: (state, action) => {
      state.formState.manualInput.coverageType = action.payload;
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
      state.formState.travellersData.listTravellers = [...action.payload];
    },
    setPaymentMethod: (state, action) => {
      state.formState.selectPaymentMethod = action.data;
    },
    setListCountries: (state, action) => {
      state.formState.countries = [...action.payload];
    },
    setListProducts: (state, action) => {
      state.formState.listProduct = [...action.payload];
    },
  },
});

export const {
  setListProducts,
  setListCountries,
  setFormStateAdult,
  setFormStateCoverageChild,
  setFormEndDate,
  setTravellersData,
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
export const selectTravelInsurance = (state) =>
  state.quotaSearch?.formState?.listProduct;
export const selectedTravelInsurance = (state) =>
  state.quotaSearch?.formState?.selectInsurancePlan;
export const FillTravellersData = (state) =>
  state.quotaSearch?.formState?.travellersData;
export const selectPaymentMethod = (state) =>
  state.quotaSearch?.formState?.selectPaymentMethod;
export const listcountries = (state) => state.quotaSearch?.formState?.countries;
