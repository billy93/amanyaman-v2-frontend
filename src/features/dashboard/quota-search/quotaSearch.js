import { useGetUsersQuery } from "./policyApiSlice"
import { Link } from "react-router-dom";
import { useColorModeValue } from "@chakra-ui/color-mode";
import Toast from '../../../components/toast'
import {useSelector,useDispatch} from 'react-redux'
import { selectCurrentUser } from '../../auth/authSlice'
import Stepper from "./steper";
import Data from './list.json'
import Forms from './form/form'
import { AiFillCheckCircle }from "react-icons/ai";
import {
  Box,
  Flex,
  Text,
  Center,
  Heading
} from '@chakra-ui/react'
import { Step, Steps, useSteps } from "chakra-ui-steps";

import { Button } from '@chakra-ui/react'
import { MdLogin, MdFilterList, MdWarning } from 'react-icons/md'
import React from "react";

const steps = [
  { title: '1', description: 'Search' },
  { title: '2', description: 'Select plan' },
  { title: '3', description: 'Traveller Data' },
  { title: '4', description: 'Payment' },
]

function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const QuotaSearch = () => {
    const dispatch = useDispatch()
    const user = useSelector(selectCurrentUser)
    const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const isLastStep = activeStep === steps.length - 1;
  const hasCompletedAllSteps = activeStep === steps.length;
  const bg = useColorModeValue("gray.200", "gray.700");
  const [isToast, setIsToast] = React.useState(false)
  const prevUser = usePrevious(user)
console.log('has', hasCompletedAllSteps)
 React.useEffect(() => {
     if (user !== null && user !== prevUser) {
        //  Toast({
        //   title: 'Account created.',
        //   status: 'success',
        //   duration: 9000,
        //   isClosable: true,
        //  })
     }
 }, [user, prevUser])
    
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery()

    let content;
    if (isLoading) {
        content = <Center h='50vh' color='#065BAA'>
                    <Text as={'p'} size="xs">
                        Loading...
                    </Text>
                   </Center>;
    } else if (Data) {
        content = (
            <Box pl="4" pr="4" mt="5em">
                    <Box m={{base:"0", md:"4em"}}>
                    <Flex flexDir="column" width="100%">
                       
            <Steps
                checkIcon={AiFillCheckCircle}
                variant={'circles-alt'}
                colorScheme="blue"
                activeStep={activeStep}
                bg="white"
                size="sm"
                sx={{
                    "& .cui-steps__step-icon-container": {
                    background: "white",
                    color: "white",
                    width:"30px",
                    height:"30px",
                    borderRadius: "50%",
                    "&:hover": {
                        background: "#065baa7d",
                        cursor: "pointer",
                    },
                    // use _active attribute to target the active step
                    _active: {
                        background: "blue",
                        color:"white"
                    },
                    },
                }}
            >
                
                {steps.map(({ label }, index) => (
                <Step label={label} key={label} bg="white" >
                    <Box sx={{ p: 8, my: 0, rounded: "sm", bg:"white", mt:0 }} >
                            <Forms label={index} hasCompletedAllSteps={hasCompletedAllSteps} activeStep={activeStep} reset={reset} prevStep={prevStep} nextStep={nextStep} isLastStep={isLastStep } />
                    </Box>
                </Step>
                ))}
            </Steps>
            </Flex>
            </Box>
          </Box>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default QuotaSearch