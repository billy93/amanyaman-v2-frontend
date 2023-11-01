/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from 'react';
import { Box } from '@chakra-ui/react';
import FormStep1 from './form-step1';
import FormStep2 from './form-step2';
import FormStep3 from './form-step3';
import FormStep4 from './form-step4';

const Forms = ({
  label,
  hasCompeltedAllSteps,
  activeStep,
  reset,
  prevStep,
  nextStep,
  isLastStep,
}) => {
  return (
    <Box>
      {(() => {
        switch (label) {
          case 0:
            return (
              <FormStep1
                label={label}
                hasCompeltedAllSteps={hasCompeltedAllSteps}
                activeStep={activeStep}
                reset={reset}
                prevStep={prevStep}
                nextStep={nextStep}
                isLastStep={isLastStep}
              />
            );
          // case 1:
          //   return (
          //     <FormStep2
          //       label={label}
          //       hasCompeltedAllSteps={hasCompeltedAllSteps}
          //       activeStep={activeStep}
          //       reset={reset}
          //       prevStep={prevStep}
          //       nextStep={nextStep}
          //       isLastStep={isLastStep}
          //     />
          //   );
          // case 2:
          //   return (
          //     <FormStep4
          //       label={label}
          //       hasCompeltedAllSteps={hasCompeltedAllSteps}
          //       activeStep={activeStep}
          //       reset={reset}
          //       prevStep={prevStep}
          //       nextStep={nextStep}
          //       isLastStep={isLastStep}
          //     />
          //   );
          // case 3:
          //   return (
          //     <FormStep3
          //       label={label}
          //       hasCompeltedAllSteps={hasCompeltedAllSteps}
          //       activeStep={activeStep}
          //       reset={reset}
          //       prevStep={prevStep}
          //       nextStep={nextStep}
          //       isLastStep={isLastStep}
          //     />
          //   );
          default:
            return null;
        }
      })()}
    </Box>
  );
};
export default Forms;
