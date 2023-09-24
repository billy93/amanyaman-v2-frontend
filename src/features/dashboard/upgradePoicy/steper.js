import React from 'react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Box, Button } from '@chakra-ui/react';

const Stepper = () => {
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 1,
  });

  return (
    <Box width="100%">
      <Steps activeStep={activeStep}>
        <Step key={2}></Step>
        <Step label={'User Login'} key={1}>
          hihi
        </Step>
        <Step label={'Interests'} key={2}>
          haha
        </Step>
        <Step label={'Portfolio'} key={3}>
          hehe
        </Step>
      </Steps>
      <Button
        onClick={() => {
          nextStep(1);
        }}
      >
        Forward
      </Button>
      <Button
        onClick={() => {
          prevStep(1);
        }}
      >
        Previous
      </Button>
    </Box>
  );
};

export default Stepper;
