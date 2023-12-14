/* eslint-disable no-unused-vars */
import React from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import QuotaSearch from './quotaSearch';
import { historyForm, userLoginCurrent } from '../../auth/authSlice';
import QuotaSearchById from './quotaSearchById';
import { useGetBookingSearchQuery } from './policyApiSlice';
import { useGetBookingByIdQuery } from '../policy/policyApiSlice';
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
  // setFormStateCoverageType,
} from './quotaSearchSlice';
import { useSelector } from 'react-redux';
import {
  setFormStateAdult,
  setFormStateCoverageChild,
  selectManualInput,
  setFormStateCoverageType,
  setFormStateTravellerType,
  setFormStateTotalPass,
  setFormStateDestinationCountry,
  setFormStateStartDate,
  setFormEndDate,
  setListCountries,
  listcountries,
  setListProducts,
  setUpgradeData,
} from './quotaSearchSlice';
import PageLoader from '../../../components/pageLoader';

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
  const { data: quotation } = useGetBookingByIdQuery(id);
  // const { step } = useSelector(quotState);
  // const getById = useSelector(getSearchById);

  const handleBack = () => {
    navigate(-1);
  };
  React.useEffect(() => {
    dispatch(setUpgradeData(quotation));
  }, [quotation]);
  let content;
  if (isLoading) {
    content = <PageLoader loading={isLoading} />;
  } else if (quotation) {
    <QuotaSearchById step={login?.historyStep} />;
  }
  return (
    <>
      {id && policyNumberString !== undefined ? (
        <QuotaSearchById step={login?.historyStep} />
      ) : (
        <QuotaSearch step={login?.historyStep} />
      )}
    </>
  );
};
export default MainQuotSearch;
