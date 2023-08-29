/* eslint-disable no-unused-vars */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import QuotaSearch from './quotaSearch';
import { historyForm, userLoginCurrent } from '../../auth/authSlice';
import QuotaSearchById from './quotaSearchById';
import { useGetBookingSearchQuery } from './policyApiSlice';
import usePersist from '../../hook/usePersist';
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
  const [persist, setPersist] = usePersist();
  const stateFormHistory = useSelector(historyForm);
  const login = useSelector(userLoginCurrent);

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
  // console.log('cover red', localStorage.getItem('persist').token);
  return id ? (
    <QuotaSearchById step={login?.historyStep} />
  ) : (
    <QuotaSearch step={login?.historyStep} />
  );
};
export default MainQuotSearch;
