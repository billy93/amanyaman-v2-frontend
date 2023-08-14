/* eslint-disable indent */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setHistoryForm, historyForm, setId } from '../../../auth/authSlice';
import {
  setBookingId,
  selectedTravelInsurance,
  setSelectTravelInsurancePlan,
  selectTravelInsurance,
  selectManualInput,
  setStepActive,
  setGetById,
  FillTravellersData,
} from '../quotaSearchSlice';
import {
  Text,
  Image,
  Flex,
  Heading,
  Box,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { useBooksProductsMutation } from '../policyApiSlice';
import Hospital from '../../../../img/images/Hospital.png';
import Medicine from '../../../../img/images/Medicine.png';
import TravelCaover from '../../../../img/images/Plane.png';
import { ArrowBackIcon } from '@chakra-ui/icons';

const Form2 = ({
  label,
  hasCompletedAllSteps,
  activeStep,
  reset,
  prevStep,
  nextStep,
  isLastStep,
}) => {
  const [booksProducts, { isLoading }] = useBooksProductsMutation();
  const initState = useSelector(selectTravelInsurance);
  const stateInt = useSelector(selectManualInput);
  const list = useSelector(FillTravellersData);
  const selectedInsurance = useSelector(selectedTravelInsurance);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const historyForms = useSelector(historyForm);
  console.log('activeStep', activeStep);
  const selectProduct = (data) => {
    dispatch(
      setSelectTravelInsurancePlan({
        travelInsurancePlan: { ...data },
      })
    );
  };
  // eslint-disable-next-line no-unused-vars
  const SelectInsurancePlan = (e) => {
    console.log('d', e);
    // console.log('d', i)
    dispatch(
      setSelectTravelInsurancePlan({
        // travelInsurancePlan:data
      })
    );
  };
  // console.log('stateInt', stateInt);
  const paddedDay = stateInt?.startDate?.day.toString().padStart(2, '0');
  const paddedMonth = stateInt?.startDate?.month.toString().padStart(2, '0');
  const paddedEndDay = stateInt?.endDate?.day.toString().padStart(2, '0');
  const paddedEndMonth = stateInt?.endDate?.month.toString().padStart(2, '0');
  const handleNext = async (e) => {
    const payload = {
      coverType:
        stateInt.coverageType === 'Single Trip' ? 'SINGLE_TRIP' : 'ANNUAL',
      travellerType:
        stateInt.travellerType === 'Individual'
          ? {
              id: 1,
            }
          : stateInt.travellerType === 'Group'
          ? { id: 3 }
          : { id: 2 },
      from: `${stateInt?.startDate.year}-${paddedMonth}-${paddedDay}`,
      to: `${stateInt?.endDate.year}-${paddedEndMonth}-${paddedEndDay}`,
      destinations: stateInt?.destinationCountry.map((v) => {
        return { id: v.id };
      }),
      adt: stateInt.adult,
      product: selectedInsurance.id,
    };
    console.log('payload', payload);
    try {
      const res = await booksProducts(
        stateInt?.travellerType === 'Family'
          ? { ...payload, chd: stateInt.child }
          : { ...payload, chd: 0 }
      );
      if (res?.data?.id) {
        dispatch(setStepActive(activeStep + 1));
        dispatch(setHistoryForm(activeStep + 1));
        navigate(`/create-quota/search/${res?.data?.id}`);
        let travellersData = {
          ...list,
          bookingId: res?.data?.id,
        };
        console.log('test', list);
        dispatch(setBookingId(travellersData));
        dispatch(setId(res?.data?.id));
        dispatch(setGetById(res));
      }
      handleNexts();
      // dispatch(setListProducts(res.data));
    } catch (error) {
      console.log(error);
    }
  };
  const handlePrev = () => {
    dispatch(setHistoryForm(historyForms - 1));
    prevStep();
  };

  const handleNexts = () => {
    dispatch(setHistoryForm(historyForms + 1));
    nextStep();
  };

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
            Change Search
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
            Select Insurance Plan{' '}
          </Heading>
        </Box>
      </Box>
      <Box
        w={{ base: '100%' }}
        bg="white"
        p={'20px'}
        borderRadius={'5px'}
        textAlign={'left'}
        border="2px #ebebeb"
        style={{
          overflowY: 'auto',
          height: '400px',
        }}
      >
        {initState?.map((products, i) => {
          return (
            <Box
              mb="1em"
              key={i}
              onClick={() => selectProduct(products)}
              as="div"
              cursor={'pointer'}
              _hover={{
                border: '2px solid #0358a8',
                transition: '.5s ',
              }}
              boxShadow={'0px 0px 5px 5px rgba(153, 180, 206, 0.2)'}
              p="20px"
              border={
                products.id === selectedInsurance?.id ? '2px solid #065BAA' : ''
              }
            >
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Heading as="h4" size="md" style={{ fontSize: '18px' }}>
                  {products.productName}
                </Heading>
                <Heading
                  variant="primary"
                  as="h4"
                  size="md"
                  style={{ fontSize: '18px' }}
                >
                  {products.finalPrice}
                </Heading>
              </Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Box display="flex" justifyContent={'center'}>
                  <Image src={Hospital} alt="hospital" />
                  <Box>
                    <Text
                      as="b"
                      fontSize={'sm'}
                      style={{ fontSize: '12px' }}
                      fontFamily={'Mulish'}
                    >
                      {'Personal Accident Cover'}
                    </Text>
                    <Text
                      as="p"
                      fontSize={'sm'}
                      style={{ fontSize: '12px' }}
                      fontFamily={'Mulish'}
                    >
                      {products?.productPersonalAccidentCover}
                    </Text>
                  </Box>
                </Box>
                <Box display="flex" justifyContent={'center'}>
                  <Image src={Medicine} alt="hospital" />
                  <Box>
                    <Text
                      as="b"
                      fontSize={'sm'}
                      style={{ fontSize: '12px' }}
                      fontFamily={'Mulish'}
                    >
                      {'Medical Cover'}
                    </Text>
                    <Text
                      as="p"
                      fontSize={'sm'}
                      style={{ fontSize: '12px' }}
                      fontFamily={'Mulish'}
                    >
                      {products.productMedicalCover}
                    </Text>
                  </Box>
                </Box>
                <Box display="flex" justifyContent={'center'}>
                  <Image src={TravelCaover} alt="hospital" />
                  <Box>
                    <Text
                      as="b"
                      fontSize={'sm'}
                      style={{ fontSize: '12px' }}
                      fontFamily={'Mulish'}
                    >
                      {'Travel Cover'}
                    </Text>
                    <Text
                      as="p"
                      fontSize={'sm'}
                      style={{ fontSize: '12px' }}
                      fontFamily={'Mulish'}
                    >
                      {products.productTravelCover}
                    </Text>
                  </Box>
                </Box>
              </Box>
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                mt="1em"
              >
                <Heading
                  as="h4"
                  size="md"
                  style={{ fontSize: '14px' }}
                  fontFamily={'Mulish'}
                >
                  With Additional benefits and Assistance Cover.
                </Heading>
                <ButtonGroup gap="5px">
                  <Button variant="base">View Benefits</Button>
                </ButtonGroup>
              </Box>
            </Box>
          );
        })}
      </Box>
      {hasCompletedAllSteps !== undefined && (
        <Box>
          <Heading fontSize="xl" textAlign={'center'}>
            Woohoo! All steps completed! 🎉
          </Heading>
        </Box>
      )}
      <Flex
        width="100%"
        justify="space-between"
        gap={6}
        mt="2em"
        mb="2em"
        position={'relative'}
      >
        {hasCompletedAllSteps !== undefined ? (
          <Button size="sm" onClick={reset}>
            Reset
          </Button>
        ) : (
          <>
            <Box
              w={'100%'}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              p="1em"
              style={{
                position: 'absolute',
                bottom: '-28px',
              }}
            >
              <Box
                display={'flex'}
                justifyContent={'flex-start'}
                alignItems={'center'}
              >
                <Text as="p" fontSize={'sm'} fontFamily={'Mulish'}>
                  Travel Insurance Selected :
                </Text>
                <Text as="b" fontFamily={'Mulish'} pl="5px">
                  {selectedInsurance?.productName}
                </Text>
              </Box>
              <ButtonGroup>
                <Button
                  isLoading={isLoading}
                  size="sm"
                  onClick={handleNext}
                  w={{ base: '100%', md: '270px' }}
                  h="48px"
                  isDisabled={selectedInsurance !== null ? false : true}
                >
                  {isLastStep ? 'Finish' : 'FILL TRAVELLERS DATA'}
                </Button>
              </ButtonGroup>
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
};
export default Form2;
