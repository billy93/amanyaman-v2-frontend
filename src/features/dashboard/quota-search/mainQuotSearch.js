/* eslint-disable no-unused-vars */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import QuotaSearch from './quotaSearch';
import { historyForm } from '../../auth/authSlice';
import QuotaSearchById from './quotaSearchById';
import { useGetBookingSearchQuery } from './policyApiSlice';
import {
  quotState,
  getSearchById,
  setFormStateCoverageType,
} from './quotaSearchSlice';
import { useSelector } from 'react-redux';
// import {
//   setFormStateAdult,
//   setFormStateCoverageChild,
//   selectManualInput,
//   setFormStateCoverageType,
//   setFormStateTravellerType,
//   setFormStateTotalPass,
//   setFormStateDestinationCountry,
//   setFormStateStartDate,
//   setFormEndDate,
//   setListCountries,
//   listcountries,
//   setListProducts,
// } from '../quotaSearchSlice';

const MainQuotSearch = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const stateFormHistory = useSelector(historyForm);

  const { data: searchById } = useGetBookingSearchQuery(id, {
    skip: id === undefined ? true : false,
  });
  const { step } = useSelector(quotState);
  // const getById = useSelector(getSearchById);

  React.useEffect(() => {
    if (id) {
      let coverType = searchById?.data?.coverType;
      console.log('cover', coverType);

      dispatch(setFormStateCoverageType(coverType));
    }
  }, [id, dispatch, searchById?.data?.coverType]);
  console.log('cover red', id ? 're' : 'no');
  return id ? (
    <QuotaSearchById step={stateFormHistory} />
  ) : (
    <QuotaSearch step={stateFormHistory} />
  );
};
export default MainQuotSearch;
