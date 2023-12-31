/* eslint-disable no-unused-vars */
import React from 'react';
import { useSelector, dispatch, useDispatch } from 'react-redux';
import PageLoader from '../../../components/pageLoader';
import {
  userLoginCurrent,
  historyForm,
  setHistoryForm,
  setCredentials,
} from '../../auth/authSlice';
import Forms from './form/form';
import { AiFillCheckCircle } from 'react-icons/ai';
import {
  Box,
  Flex,
  Text,
  Center,
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumb,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import usePersist from '../../../features/hook/usePersist';
import {
  useGetBookingSearchQuery,
  useGetListTravellerQuery,
  // useGetBookingByIdQuery,
} from './policyApiSlice';
import { useGetBookingByIdQuery } from '../policy/policyApiSlice';

import {
  setUpgradeData,
  travellerUpgrade,
  setUpgradeDataTravellers,
  upgradeListTravellers,
} from './upgradeQuotaSearchSlice';

import { useParams, useNavigate, NavLink } from 'react-router-dom';

const steps = [
  { title: '1', description: 'Upgrade Policy' },
  { title: '2', description: 'Select Product' },
  { title: '3', description: 'Payment' },
];

function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const QuotaSearchById = () => {
  const user = useSelector(userLoginCurrent);
  const upgradeData = useSelector(travellerUpgrade);
  const listTravellersState = useSelector(upgradeListTravellers);
  const navigate = useNavigate();
  const historysbumit = useSelector(historyForm);
  const [persist] = usePersist();
  // const messagesTraveller = useSelector(messages);
  // const list = useSelector(FillTravellersData);
  // const prevListTraveller = usePrevious(list?.listTravellers);
  // const [skipListTraveller, setSkipListTrave] = React.useState(false);
  const dispatch = useDispatch();
  const { id, policyNumberString } = useParams();
  const { data, isLoading: loadingData } = useGetBookingSearchQuery(id);
  const {
    data: quotation,
    isLoading: loading,
    isError,
    refetch: fetchData,
  } = useGetBookingByIdQuery(id);

  const { data: listTravellers, refetch } = useGetListTravellerQuery(id);
  // const { step } = useSelector(quotState);
  const history = localStorage.getItem('persist:root');
  // console.log('hisstory', history);
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: historysbumit,
  });
  // const [searchproducts, { isLoading }] = useSearchproductsMutation();
  function formatDate(dateString) {
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    return { day, month, year };
  }
  // console.log('persist', persist);
  const handlePrev = () => {
    const addStep = {
      ...user,
      historyStep: historysbumit - 1,
    };
    dispatch(setCredentials({ ...addStep }));
    prevStep();
  };

  const handleNext = () => {
    const addStep = {
      ...user,
      historyStep: user?.historyStep + 1,
    };
    dispatch(setCredentials({ ...addStep }));
    nextStep();
  };

  function convertDateToObject(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return { year, month, day };
  }

  React.useEffect(() => {
    // if (id) {
    fetchData(id);
    // }
  }, [id]);

  // React.useEffect(() => {
  //   if (id) {
  //     let coverType =
  //       data?.coverType === 'SINGLE_TRIP' ? 'Single Trip' : 'Anual Trip';
  //     // console.log('coverType', coverType);
  //     dispatch(setFormStateCoverageType(coverType));

  //     dispatch(setFormStateTravellerType(data?.travellerType?.name));
  //     let adult = Number(data?.adt);
  //     dispatch(setFormStateAdult(adult));

  //     if (data?.from) {
  //       let from = formatDate(data?.from);
  //       // console.log('from', from);
  //       dispatch(
  //         setFormStateStartDate({
  //           startDate: from,
  //         })
  //       );
  //     }

  //     if (data?.to) {
  //       let to = formatDate(data?.to);
  //       dispatch(
  //         setFormEndDate({
  //           endDate: to,
  //         })
  //       );
  //     }
  //     let chd = Number(data?.chd);
  //     dispatch(setFormStateCoverageChild(chd));
  //     if (data?.destinations) {
  //       let countries = data?.destinations?.map((country) => ({
  //         ...country,
  //         value: country.countryName,
  //         label: country.countryName,
  //       }));
  //       dispatch(
  //         setFormStateDestinationCountry({
  //           country: countries,
  //         })
  //       );
  //     }
  //     let travellersData = {
  //       ...list,
  //       bookingId: id,
  //     };

  //     dispatch(setBookingId(travellersData));
  //   }
  // }, [id, dispatch, data, listTravellers]);

  const isLastStep = activeStep === steps.length - 1;
  const hasCompletedAllSteps = activeStep === steps.length;
  const prevUser = usePrevious(user);
  React.useEffect(() => {
    if (user !== null && user !== prevUser) {
      //  Toast({
      //   title: 'Account created.',
      //   status: 'success',
      //   duration: 9000,
      //   isClosable: true,
      //  })
    }
  }, [user, prevUser]);

  const persistedQuotaSearchJSON = localStorage.getItem('persist:root');
  const persistedQuotaSearch = JSON.parse(
    persistedQuotaSearchJSON
  )?.quotaSearch;

  // React.useEffect(() => {
  //   if (id) {
  //     if (messagesTraveller) {
  //       refetch(id);
  //     }
  //   }
  // }, [messagesTraveller, id, refetch]);

  // console.log('quotation setan', quotation);

  const handleBack = () => {
    navigate(-1);
  };

  React.useEffect(() => {
    if (listTravellers) {
      dispatch(setUpgradeDataTravellers([...listTravellers]));
    }
  }, [listTravellers, dispatch]);

  React.useEffect(() => {
    if (data !== undefined) {
      // console.log('babiii', quotation);
      const newdata = {
        ...data,
        from: convertDateToObject(data.from),
        to: convertDateToObject(data.to),
        destinations: data.destinations.map((obj) => ({
          ...obj,
          label: obj.countryName,
          value: obj.countryName,
        })),
      };
      // console.log('tan setan', newdata);
      dispatch(setUpgradeData(newdata));
    }
  }, [data, dispatch]);

  let content;
  if (loadingData) {
    content = <PageLoader loading={loadingData} />;
  } else if (data && upgradeData) {
    content = (
      <Box mt="4em">
        <Box
          display="flex"
          justifyContent={'space-between'}
          w="100%"
          borderBottom="1px"
          borderColor={'#ebebeb'}
        >
          <Box w="100%" pt="15px">
            <Breadcrumb
              spacing="8px"
              pl="1em"
              separator={<ChevronRightIcon color="gray.500" />}
            >
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink as={NavLink} to="/policies/list">
                  <Text
                    as="b"
                    ml="4"
                    fontSize="sm"
                    color="#065BAA"
                    _hover={{
                      borderBottom: '#065BAA',
                      border: '1 px solid',
                    }}
                  >
                    Sales Directory
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink as={NavLink} onClick={handleBack}>
                  <Text as={'p'} color="#065BAA" fontSize={'sm'}>
                    {policyNumberString === undefined
                      ? listTravellersState &&
                        listTravellersState[0]?.policyNumber
                      : policyNumberString}
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink
                  as={NavLink}
                  to="#"
                  style={{ pointerEvents: 'none' }}
                >
                  <Text as={'p'} fontSize={'sm'} color="#231F20">
                    Upgrade policy
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
        </Box>
        <Box m={{ base: '0', md: '2em' }}>
          <Flex flexDir="column" width="100%">
            <Steps
              checkIcon={AiFillCheckCircle}
              variant={'circles-alt'}
              colorScheme="blue"
              activeStep={activeStep}
              bg="white"
              size="sm"
              sx={{
                '& .cui-steps__step-icon-container': {
                  background: 'white',
                  color: 'white',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  '&:hover': {
                    background: '#065baa7d',
                    cursor: 'pointer',
                  },
                  // use _active attribute to target the active step
                  _active: {
                    background: 'blue',
                    color: 'white',
                  },
                },
              }}
            >
              {steps.map(({ label }, step) => (
                <Step label={label} key={label} bg="white">
                  <Box sx={{ p: 8, my: 0, rounded: 'sm', bg: 'white', mt: 0 }}>
                    {upgradeData !== undefined ? (
                      <Forms
                        label={step}
                        hasCompletedAllSteps={hasCompletedAllSteps}
                        activeStep={user?.historyStep}
                        reset={reset}
                        prevStep={handlePrev}
                        nextStep={handleNext}
                        isLastStep={isLastStep}
                      />
                    ) : null}
                  </Box>
                </Step>
              ))}
            </Steps>
          </Flex>
        </Box>
      </Box>
    );
  }

  return content;
};
export default QuotaSearchById;
