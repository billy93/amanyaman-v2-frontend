/* eslint-disable no-unused-vars */
import { useSelector } from 'react-redux';
import { userLoginCurrent } from '../../auth/authSlice';
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
  const user = useSelector(userLoginCurrent);
  const navigate = useNavigate();
  // const steps = useSelector(step);
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: step,
  });
  // const [searchproducts, { isLoading }] = useSearchproductsMutation();
  const isLastStep = activeStep === steps.length - 1;
  const hasCompletedAllSteps = activeStep === steps.length;
  const prevUser = usePrevious(user);

  React.useEffect(() => {
    const idFromLocalStorage = JSON.parse(
      localStorage.getItem('persist:root')
    ).id;

    // Remove double quotes from the ID if present
    const cleanedId = idFromLocalStorage?.replace(/^"(.*)"$/, '$1');
    if (JSON.parse(localStorage.getItem('persist:root')).id !== '') {
      navigate(`/create-quota/search/${encodeURI(cleanedId)}`);
    }
  }, [navigate]);

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
                      activeStep={activeStep}
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
