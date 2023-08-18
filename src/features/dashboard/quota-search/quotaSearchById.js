/* eslint-disable no-unused-vars */
import { useSelector, dispatch, useDispatch } from 'react-redux';
import {
  userLoginCurrent,
  historyForm,
  setHistoryForm,
} from '../../auth/authSlice';
import Forms from './form/form';
import { AiFillCheckCircle } from 'react-icons/ai';
import { Box, Flex, Text, Center } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import {
  useGetBookingSearchQuery,
  useGetListTravellerQuery,
} from './policyApiSlice';

import {
  setMessage,
  messages,
  setTravellersData,
  FillTravellersData,
  setBookingId,
  quotState,
  setFormStateCoverageType,
  setFormStateTravellerType,
  setFormStateAdult,
  setFormEndDate,
  setFormStateStartDate,
  setFormStateCoverageChild,
  setFormStateDestinationCountry,
  setStepActive,
} from './quotaSearchSlice';
import React from 'react';
import { useParams } from 'react-router-dom';

const steps = [
  { title: '1', description: 'Search' },
  { title: '2', description: 'Select plan' },
  { title: '3', description: 'Traveller Data' },
  { title: '4', description: 'Payment' },
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
  const historysbumit = useSelector(historyForm);
  const messagesTraveller = useSelector(messages);
  const list = useSelector(FillTravellersData);
  const prevListTraveller = usePrevious(list?.listTravellers);
  // const [skipListTraveller, setSkipListTrave] = React.useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data } = useGetBookingSearchQuery(id);
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
  const handlePrev = () => {
    dispatch(setHistoryForm(historysbumit - 1));
    prevStep();
  };

  const handleNext = () => {
    dispatch(setHistoryForm(historysbumit + 1));
    nextStep();
  };
  React.useEffect(() => {
    if (id) {
      let coverType =
        data?.coverType === 'SINGLE_TRIP' ? 'Single Trip' : 'Anual Trip';
      // console.log('coverType', coverType);
      dispatch(setFormStateCoverageType(coverType));

      dispatch(setFormStateTravellerType(data?.travellerType?.name));
      let adult = Number(data?.adt);
      dispatch(setFormStateAdult(adult));

      if (data?.from) {
        let from = formatDate(data?.from);
        // console.log('from', from);
        dispatch(
          setFormStateStartDate({
            startDate: from,
          })
        );
      }

      if (data?.to) {
        let to = formatDate(data?.to);
        dispatch(
          setFormEndDate({
            endDate: to,
          })
        );
      }
      let chd = Number(data?.chd);
      dispatch(setFormStateCoverageChild(chd));
      if (data?.destinations) {
        let countries = data?.destinations?.map((country) => ({
          ...country,
          value: country.countryName,
          label: country.countryName,
        }));
        dispatch(
          setFormStateDestinationCountry({
            country: countries,
          })
        );
      }
      let travellersData = {
        ...list,
        bookingId: id,
      };

      dispatch(setBookingId(travellersData));
    }
  }, [id, dispatch, data, listTravellers]);

  console.log('listTravellers data', data);
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

  React.useEffect(() => {
    if (id) {
      setStepActive(persistedQuotaSearch);
      dispatch(setHistoryForm(historysbumit));
      // dispatch(setFormStateCoverageType(historysbumit));
    }
  }, [id, persistedQuotaSearch, dispatch, historysbumit]);

  React.useEffect(() => {
    if (id) {
      if (messagesTraveller) {
        refetch(id);
      }
    }
  }, [messagesTraveller, id, refetch]);

  React.useEffect(() => {
    // After 2 seconds, update the message
    const timeoutId = setTimeout(() => {
      dispatch(setMessage(false));
    }, 2000);

    // Clean up the timeout when the component unmounts or when the effect runs again
    return () => clearTimeout(timeoutId);
  }, [messagesTraveller, dispatch]); // Empty dependency array ensures the effect runs only once after mount
  console.log(
    'setHistoryForm',
    JSON.parse(localStorage.getItem('persist:root-form'))
  );

  React.useEffect(() => {
    if (listTravellers) {
      dispatch(setTravellersData([...listTravellers]));
    }
  }, [listTravellers, dispatch]);

  let content;
  if (!user) {
    content = (
      <Center h="50vh" color="#065BAA">
        <Text as={'p'} size="xs">
          Loading...
        </Text>
      </Center>
    );
  } else if (user) {
    content = (
      <Box pl="4" pr="4" mt="5em">
        <Box m={{ base: '0', md: '4em' }}>
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
                    <Forms
                      label={step}
                      hasCompletedAllSteps={hasCompletedAllSteps}
                      activeStep={historysbumit}
                      reset={reset}
                      prevStep={handlePrev}
                      nextStep={handleNext}
                      isLastStep={isLastStep}
                    />
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
