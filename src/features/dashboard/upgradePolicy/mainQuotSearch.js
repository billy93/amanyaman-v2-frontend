/* eslint-disable no-unused-vars */
import React from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import QuotaSearch from './quotaSearch';
import { historyForm, userLoginCurrent } from '../../auth/authSlice';
import QuotaSearchById from './quotaSearchById';
import { useGetBookingSearchQuery } from './policyApiSlice';
import usePersist from '../../hook/usePersist';
import {
  Text,
  Flex,
  InputRightElement,
  InputGroup,
  Heading,
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumb,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
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
  const { id, policyNumberString } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [persist, setPersist] = usePersist();
  const stateFormHistory = useSelector(historyForm);
  const login = useSelector(userLoginCurrent);

  const { data: searchById } = useGetBookingSearchQuery(id, {
    skip: id === undefined ? true : false,
  });
  // const { step } = useSelector(quotState);
  // const getById = useSelector(getSearchById);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <QuotaSearchById step={login?.historyStep} />
    </>
  );
};
export default MainQuotSearch;
