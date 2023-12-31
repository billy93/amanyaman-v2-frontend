/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable no-undef */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import usePersist from '../../../hook/usePersist';
import { useParams, useNavigate } from 'react-router-dom';
import { userLoginCurrent, setCredentials } from '../../../auth/authSlice';
import {
  useGetListTravellerQuery,
  useGetBookingSearchUpgradedQuery,
  usePaymentUpgradeMutation,
  useCheckAvailabilityCreditMutation,
} from '../policyApiSlice';
import {
  setUpgradeData,
  travellerUpgrade,
  upgradeListTravellers,
} from '../upgradeQuotaSearchSlice';

import UseCustomToast from '../../../../components/UseCustomToast';
import {
  Center,
  Text,
  Image,
  Flex,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Box,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import Plan from '../../../../img/images/Plane.png';
import Umbrella from '../../../../img/Umbrella.png';
import Payment from '../../../../img/Payment.png';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { BsWallet2 } from 'react-icons/bs';
import CurrencyFormatter from '../../../../components/formatCurrency';
// import usePersist from '../../../../features/hook/usePersist';
// import { setTravellersData } from '../quotaSearchSlice';

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef();
  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

const Form3 = ({
  label,
  hasCompletedAllSteps,
  activeStep,
  reset,
  prevStep,
  nextStep,
  isLastStep,
}) => {
  // const initManual = useSelector(selectManualInput);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [persist] = usePersist();
  // const checkToken = localStorage.getItem('persist').token;
  const login = useSelector(userLoginCurrent);
  const initState = useSelector(travellerUpgrade);
  const initStateListTravellers = useSelector(upgradeListTravellers);
  const { showErrorToast, showSuccessToast } = UseCustomToast();
  const [paymentUpgrade, { isLoading }] = usePaymentUpgradeMutation();
  const [checkAvailabilityCredit, { isLoading: loading }] =
    useCheckAvailabilityCreditMutation();
  const [creditLimit, setCreditLimit] = React.useState(null);
  const { id } = useParams();
  // const selectedInsurance = useSelector(selectedTravelInsurance);
  // const listTravellers = useSelector(FillTravellersData);
  const { data: newlistTravellers, refetch } = useGetListTravellerQuery(id);

  const { data: payload, refetch: refetchBooking } =
    useGetBookingSearchUpgradedQuery(id);
  const [tabIndex, setTabIndex] = React.useState(0);
  const handlePrev = () => {
    const addStep = {
      ...login,
      historyStep: login?.historyStep - 1,
    };

    dispatch(setCredentials({ ...addStep }));
    refetch(id);
    prevStep();
  };

  React.useEffect(() => {
    if (newlistTravellers) {
      refetch();
      // dispatch(setTravellersData([...newlistTravellers]));
    }
  }, [dispatch, newlistTravellers, refetch]);

  React.useEffect(() => {
    // if (payload) {
    refetchBooking(id);
    // dispatch(setTravellersData([...newlistTravellers]));
    // }
  }, [id, refetchBooking]);

  // console.log('payload', payload);
  const continuePay = async () => {
    const payloadData = {
      bookingId: payload.newBooking?.id,
      paymentMethod: tabIndex === 0 ? 'BANK_TRANSFER_BCA' : 'CREDIT_LIMIT',
    };
    try {
      const res = await paymentUpgrade(payloadData);
      console.log('cuk cuk', res);
      if (res?.data?.paymentLink) {
        const addStep = {
          ...login,
          historyStep: 0,
        };

        dispatch(setCredentials({ ...addStep }));
        window.location.replace(res?.data?.paymentLink);
      } else if (
        res?.data?.paymentLink === null &&
        res?.data?.paymentMethod === 'CREDIT_LIMIT' &&
        res?.data?.paymentStatus === 'SUCCESS'
      ) {
        navigate(`/payment/success/${payload?.newBooking?.transactionId}`);
      }
      // console.log('res', res);
    } catch (error) {
      console.log('err', error);
    }
  };

  const continuePayCredit = async () => {
    const payloadData = {
      amount: payload?.newPrice,
    };
    try {
      const res = await checkAvailabilityCredit(payloadData);
      showSuccessToast('Check Credit limit successfully!');
      if (res?.data) {
        // console.log('CHECK LIMIT', res?.data);
        setCreditLimit(res?.data);
        // window.location.replace(res?.data?.paymentLink);
      }
    } catch (error) {
      console.log('err', error);
      const errorMessage = `Failed to check credit limit. Status Code: ${data?.error?.status}`;
      showErrorToast(errorMessage);
    }
  };

  const checkCallbacks = React.useCallback((creditLimit) => {
    setCreditLimit(creditLimit);
  }, []);
  React.useEffect(() => {
    if (creditLimit) {
      checkCallbacks(creditLimit);
    }
  }, [creditLimit, checkCallbacks]);
  const prevTab = usePrevious(tabIndex);
  React.useEffect(() => {
    if (prevTab !== tabIndex && tabIndex === 1) {
      continuePayCredit();
    }
  }, [tabIndex, prevTab]);

  // console.log('credit creditLimit', creditLimit);

  return (
    <Box border={'1px'} borderColor="#ebebeb">
      <Box
        border={'1px'}
        borderColor="#ebebeb"
        p="12px"
        display="flex"
        justifyContent={'space-between'}
        alignItems="center"
      >
        <Box
          as="button"
          isDisabled={activeStep === 0}
          onClick={handlePrev}
          display="flex"
          textAlign="left"
        >
          <ArrowBackIcon boxSize={4} size="sm" w={5} h={5} color="#065BAA" />
          <Heading
            fontSize="sm"
            as="b"
            color="#065BAA"
            style={{ fontSize: '16px' }}
            fontFamily="Mulish"
            fontWeight={'700'}
          >
            {' Change Product'}
          </Heading>
        </Box>
        <Box position={'relative'} m="auto">
          <Heading
            variant="primary"
            as="h4"
            size="md"
            style={{ fontSize: '18px' }}
            fontSize="sm"
            color="#065BAA"
            textAlign={'center'}
          >
            Payment{' '}
          </Heading>
        </Box>
      </Box>
      <Box display={'flex'}>
        <Box w={{ base: '100%', md: '70%', sm: '60%' }}>
          <Tabs
            position="relative"
            isFitted
            variant="unstyled"
            mt="1em"
            // eslint-disable-next-line no-undef
            onChange={(index) => setTabIndex(index)}
            // eslint-disable-next-line no-undef
            defaultValue={tabIndex}
          >
            <TabList mb="1em">
              <Tab
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
                fontWeight={'900'}
              >
                Prepayment
              </Tab>

              <Tab
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
                fontWeight={'900'}
              >
                Credit
              </Tab>
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="blue.500"
              borderRadius="1px"
            />
            <TabPanels>
              <TabPanel>
                <Center
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  h={{ base: 'auto', md: '400px' }}
                >
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    textAlign={'center'}
                    fontWeight={'900'}
                  >
                    You will be redirected to our payment page to continue the
                    payment. Click the continue button to proceed.
                  </Text>
                </Center>
              </TabPanel>
              <TabPanel>
                <Center
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  h={{ base: 'auto', md: '400px' }}
                >
                  <Box>
                    {creditLimit?.limitEnough &&
                    creditLimit?.status === 'OK' ? (
                      <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        flexDirection={'column'}
                      >
                        <Box
                          style={{
                            marginBottom: '1em',
                            justifyContent: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1em',
                            background: '#50b84857',
                            border: '1px solid #50b848',
                            borderRadius: '5px',
                          }}
                        >
                          <Text asp="p" fontSize="sm">
                            Credit Limit Enough
                          </Text>
                        </Box>

                        <Box>
                          <BsWallet2 size="2em" />
                        </Box>
                        <Box
                          display={'flex'}
                          alignItems={'center'}
                          flexDirection={'column'}
                          pb="1em"
                        >
                          <Text as="p" fontSize="sm">
                            Current Balance
                          </Text>
                          <Text as="b" fontSize="sm">
                            <CurrencyFormatter
                              amount={creditLimit?.amountResponse}
                            />
                          </Text>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        style={{
                          marginBottom: '1em',
                          justifyContent: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '1em',
                          background: '#c33f19a3',
                          border: '1px solid #c33f19',
                          borderRadius: '5px',
                        }}
                      >
                        Credit Limit Not Enough
                      </Box>
                    )}
                    <Text
                      as="b"
                      size={'sm'}
                      fontFamily={'Mulish'}
                      style={{ fontSize: '14px' }}
                      textAlign={'center'}
                      fontWeight={'900'}
                    >
                      <Button
                        variant="outline"
                        onClick={continuePayCredit}
                        isLoading={loading}
                      >
                        Re-check Availability Credit
                      </Button>
                    </Text>
                  </Box>
                </Center>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          w={{ base: '100%', md: '30%', sm: '40%' }}
          border={'1px solid #ebebeb'}
          mt="10px"
          mr="10px"
        >
          <Box bg="#F0F3F8" p="10px">
            <Text
              as="b"
              size={'sm'}
              fontFamily={'Mulish'}
              style={{ fontSize: '14px' }}
            >
              {'Current Summary'}
            </Text>
          </Box>
          <Box bg="white" p="10px">
            <Box
              display={'flex'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              boxSizing="borderBox"
              borderBottom={'1px solid #ebebeb'}
              pb="10px"
              pt="10px"
              gap="1em"
            >
              <Image src={Umbrella} alt="insurance" />
              <Box
                display={'flex'}
                justifyContent={'center'}
                flexDirection={'column'}
              >
                <Text
                  as="b"
                  size={'sm'}
                  fontFamily={'Mulish'}
                  style={{ fontSize: '12px' }}
                >
                  {'Select Product'}
                </Text>
                <Text
                  as="b"
                  size={'sm'}
                  fontFamily={'Mulish'}
                  color="#065BAA"
                  style={{ fontSize: '12px' }}
                >
                  {payload?.newBooking?.bookingProduct?.productName}
                </Text>
              </Box>
            </Box>
            <Box
              display={'flex'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              boxSizing="borderBox"
              borderBottom={'1px solid #ebebeb'}
              pb="10px"
              pt="10px"
              gap="1em"
            >
              <Image src={Plan} alt="insurance" />
              <Box
                display={'flex'}
                justifyContent={'center'}
                flexDirection={'column'}
              >
                <Text
                  as="b"
                  size={'sm'}
                  fontFamily={'Mulish'}
                  style={{ fontSize: '12px' }}
                >
                  {'Travel Details'}
                </Text>
                <Box>
                  <Text
                    as="p"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    color="#065BAA"
                    style={{ fontSize: '12px' }}
                    gap="1em"
                  >
                    {payload?.newBooking?.coverType}
                  </Text>
                </Box>
                <Box display={'flex'} gap="2px" flexWrap={'nowrap'}>
                  {payload?.newBooking?.destinations?.map((country, i) => {
                    return (
                      <Text
                        key={i}
                        as="p"
                        size={'sm'}
                        fontFamily={'Mulish'}
                        color="#065BAA"
                        style={{ fontSize: '12px' }}
                      >
                        {country.countryName}
                      </Text>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            <Box
              display={'flex'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              boxSizing="borderBox"
              borderBottom={'1px solid #ebebeb'}
              pb="10px"
              pt="10px"
              gap="1em"
            >
              <Image src={Payment} alt="insurance" />
              <Box
                display={'flex'}
                justifyContent={'center'}
                flexDirection={'column'}
                w="100%"
              >
                <Text
                  as="b"
                  size={'sm'}
                  fontFamily={'Mulish'}
                  style={{ fontSize: '12px' }}
                >
                  {'Payment Summary'}
                </Text>
                <Box
                  w="100%"
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  gap="1em"
                  borderBottom="1px solid #ebebeb"
                  pb="10px"
                  pt="5px"
                >
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    {'Upgraded Price'}
                  </Text>
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    <CurrencyFormatter amount={payload?.newPrice} />
                  </Text>
                </Box>
                <Box
                  w="100%"
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  gap="1em"
                  borderBottom="1px solid #ebebeb"
                  pb="10px"
                  pt="5px"
                >
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    {'Previous Price'}
                  </Text>
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    <CurrencyFormatter amount={payload?.oldPrice} />
                  </Text>
                </Box>
                <Box
                  w="100%"
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  gap="1em"
                  borderBottom="1px solid #ebebeb"
                  pb="10px"
                  pt="5px"
                >
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    {'Quantity'}
                  </Text>
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    {'x'}
                    {payload?.newBooking?.travellerType?.name === 'Group'
                      ? initStateListTravellers?.length
                      : 1}
                  </Text>
                </Box>
                <Box
                  w="100%"
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  gap="1em"
                  borderBottom="1px solid #ebebeb"
                  pb="10px"
                  pt="5px"
                >
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    {'Stamp Duty'}
                  </Text>
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    {payload?.newBooking?.stampDuty > 0 ? (
                      <CurrencyFormatter
                        amount={payload?.newBooking?.stampDuty}
                      />
                    ) : (
                      'IDR 0'
                    )}
                  </Text>
                </Box>
                <Box
                  w="100%"
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  gap="1em"
                  borderBottom="1px solid #ebebeb"
                  pb="10px"
                  pt="5px"
                >
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    {'Additional Premium'}
                  </Text>
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    {payload?.finalPrice > 0 ? (
                      <CurrencyFormatter amount={payload?.finalPrice} />
                    ) : (
                      'IDR 0'
                    )}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {hasCompletedAllSteps !== undefined && (
        <Box>
          <Heading fontSize="xl" textAlign={'center'}>
            Woohoo! All steps completed! 🎉
          </Heading>
        </Box>
      )}
      <Flex width="100%" justify="space-between" gap={6} mt="2em" mb="2em">
        {hasCompletedAllSteps !== undefined ? (
          <Button size="sm" onClick={reset}>
            Reset
          </Button>
        ) : (
          <>
            <Box
              w={'100%'}
              display={'flex'}
              justifyContent={'flex-end'}
              alignItems={'center'}
              p="1em"
            >
              <ButtonGroup>
                <Button
                  size="sm"
                  onClick={continuePay}
                  w={{ base: '100%', md: '270px' }}
                  h="48px"
                  isLoading={isLoading}
                  disabled={
                    isLoading ||
                    loading ||
                    (tabIndex === 1 && creditLimit?.status !== 'OK')
                      ? true
                      : false
                  }
                >
                  {isLastStep ? 'CONTINUE PAYMENT' : 'CONTINUE PAYMENT'}
                </Button>
              </ButtonGroup>
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
};
export default Form3;
