/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { userLoginCurrent } from '../../auth/authSlice';
import { historyForm, setHistoryForm } from '../../auth/authSlice';
import { selectTravelInsurance } from './quotaSearchSlice';
import Forms from './form/form';
import { AiFillCheckCircle } from 'react-icons/ai';
import { Box, Flex, Text, Center } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
// import { useSearchproductsMutation } from './policyApiSlice';
// import { step } from './quotaSearchSlice';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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

const QuotaSearch = ({ step }) => {
  const { id } = useParams();
  const user = useSelector(userLoginCurrent);
  const historyform = useSelector(historyForm);
  // const initState = useSelector(selectTravelInsurance);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const steps = useSelector(step);
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: step,
  });
  // const [searchproducts, { isLoading }] = useSearchproductsMutation();
  const isLastStep = activeStep === steps.length - 1;
  const hasCompletedAllSteps = activeStep === steps.length;
  const prevUser = usePrevious(user);
  // const idFromLocalStorage =
  //   JSON.parse(localStorage.getItem('persist:root')).id !== null
  //     ? JSON.parse(localStorage.getItem('persist:root')).id
  //     : '';

  // React.useEffect(() => {
  //   console.log('sus', idFromLocalStorage !== '');
  //   console.log('sus', idFromLocalStorage === '');
  //   // eslint-disable-next-line quotes
  //   console.log('susu', idFromLocalStorage?.replace(/"/g, "'") === '');
  //   // eslint-disable-next-line quotes
  //   console.log('susu', idFromLocalStorage?.replace(/"/g, "'"));
  //   // Remove double quotes from the ID if present
  //   const cleanedId = idFromLocalStorage?.replace(/^"(.*)"$/, '$1');
  //   console.log('cleanedId', cleanedId);
  //   if (
  //     // eslint-disable-next-line quotes
  //     idFromLocalStorage?.replace(/"/g, "'") !== undefined
  //   ) {
  //     navigate(`/create-quota/search/${encodeURI(cleanedId)}`);
  //   }
  // }, [navigate, idFromLocalStorage]);

  // console.log('id', JSON.parse(localStorage.getItem('persist:root')).id);
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

  React.useEffect(() => {
    if (!id) {
      dispatch(setHistoryForm(0));
      reset();
      // prevStep(activeStep - 1);
    }
  }, [dispatch, id]);

  console.log('step', step);
  console.log('step activeStep', activeStep);
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
              activeStep={step}
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
                      activeStep={historyform}
                      reset={reset}
                      prevStep={prevStep}
                      nextStep={nextStep}
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
export default QuotaSearch;
