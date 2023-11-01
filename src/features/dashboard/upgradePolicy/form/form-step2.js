/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from 'react';
// import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ModalForm from '../form/modal';

// import usePersist from '../../../../features/hook/usePersist';
import {
  setHistoryForm,
  historyForm,
  setId,
  userLoginCurrent,
  setCredentials,
} from '../../../auth/authSlice';
import {
  setBookingId,
  selectedTravelInsurance,
  setSelectTravelInsurancePlan,
  selectTravelInsurance,
  selectManualInput,
  setStepActive,
  setGetById,
  FillTravellersData,
} from '../../quota-search/quotaSearchSlice';
import {
  Text,
  Image,
  Flex,
  Heading,
  Box,
  Button,
  useDisclosure,
  ButtonGroup,
} from '@chakra-ui/react';
import {
  upgradeProducts,
  travellerUpgrade,
  setUpgradeData,
} from '../upgradeQuotaSearchSlice';
import {
  useUpgradePolicyMutation,
  useGetDetailBenefitQuery,
} from '../policyApiSlice';

import Hospital from '../../../../img/images/Hospital.png';
import Medicine from '../../../../img/images/Medicine.png';
import TravelCaover from '../../../../img/images/Plane.png';
import { ArrowBackIcon } from '@chakra-ui/icons';
import CurrencyFormatter from '../../../../components/formatCurrency';

const Form2 = ({
  label,
  hasCompletedAllSteps,
  activeStep,
  reset,
  prevStep,
  nextStep,
  isLastStep,
}) => {
  const [upgradePolicy, { isLoading }] = useUpgradePolicyMutation();
  // const [booksProducts, { isLoading }] = useUpgradePolicyMutation();
  const [triggers, setTriggers] = React.useState(false);
  const [ids, setIds] = React.useState('');
  const listTravellers = useSelector(FillTravellersData);
  const selectedInsurance = useSelector(travellerUpgrade);
  const { id, policyNumberString } = useParams();
  const initState = useSelector(selectTravelInsurance);
  const initStateUpgrade = useSelector(upgradeProducts);
  const login = useSelector(userLoginCurrent);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [persist] = usePersist();
  // const { id } = useParams();
  const stateInt = useSelector(selectManualInput);
  const list = useSelector(FillTravellersData);
  // const selectedInsurance = useSelector(selectedTravelInsurance);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const historyForms = useSelector(historyForm);
  // console.log('activeStep', activeStep);

  const selectProduct = (data) => {
    const dataUpgrade = {
      // ...selectedInsurance,
      // ...selectedInsurance?.bookingProduct,
      ...selectedInsurance?.bookingProduct?.product,
      ...data,
      // {...selectedInsurance?.bookingProduct?.product, ...data}},
    };
    console.log('product upgrade', dataUpgrade);
    dispatch(
      setUpgradeData({
        ...selectedInsurance,
        ...selectedInsurance?.bookingProduct,
        ...dataUpgrade,
      })
    );
  };
  // eslint-disable-next-line no-unused-vars
  const SelectInsurancePlan = (e) => {
    // console.log('d', e);
    // console.log('d', i)
    dispatch(
      setSelectTravelInsurancePlan({
        // travelInsurancePlan:data
      })
    );
  };
  // console.log('detailBenefit', detailBenefit);
  const paddedDay = stateInt?.startDate?.day.toString().padStart(2, '0');
  const paddedMonth = stateInt?.startDate?.month.toString().padStart(2, '0');
  const paddedEndDay = stateInt?.endDate?.day.toString().padStart(2, '0');
  const paddedEndMonth = stateInt?.endDate?.month.toString().padStart(2, '0');

  function filterObjectsWithProperty(array, property) {
    // eslint-disable-next-line no-prototype-builtins
    return array.filter((obj) => obj.hasOwnProperty(property));
  }

  // console.log('list suu', listTravellers?.listTravellers);
  const handleNext = async (e) => {
    const payload = {
      bookingId: id,
      travellers: filterObjectsWithProperty(
        listTravellers?.listTravellers,
        'id'
      ),
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
    // console.log('payload', payload);
    try {
      const res = await upgradePolicy(
        stateInt?.travellerType === 'Family'
          ? { ...payload, chd: stateInt.child }
          : { ...payload, chd: 0 }
      );
      console.log('res upgrade', res);
      if (res?.data?.id) {
        dispatch(setStepActive(activeStep + 2));
        dispatch(setHistoryForm(2));
        if (policyNumberString !== undefined) {
          navigate(
            `/upgrade-quote/search/${policyNumberString}/${res?.data?.id}`
          );
        } else {
          navigate(`/upgrade-quota/search/${res?.data?.id}`);
        }
        let travellersData = {
          ...list,
          bookingId: res?.data?.id,
        };
        // console.log('test', list);
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

  const handleNexts = () => {
    const addStep = {
      ...login,
      historyStep: 3,
    };

    dispatch(setCredentials({ ...addStep }));
    dispatch(setHistoryForm(historyForms + 2));
    nextStep();
  };

  const handlePrev = () => {
    const addStep = {
      ...login,
      historyStep: login?.historyStep - 1,
    };
    // console.log('res', addStep);
    dispatch(setCredentials({ ...addStep }));
    prevStep();
  };

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = 'Are you sure you want to leave?'; // Display a confirmation message

      if (window.confirm('Are you sure you want to leave?')) {
        handlePrev(); // Call your handlePrev function

        // Clear service workers cache (if applicable)
        if (
          'serviceWorker' in navigator &&
          navigator.serviceWorker.controller
        ) {
          navigator.serviceWorker.controller.postMessage({
            action: 'clearCache',
          });
        }

        window.location.reload(true); // Force a hard refresh
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  // console.log('initstate', initState);

  const openNewTab = async (url) => {
    const newTab = window.open('', '_blank');
    if (newTab) {
      newTab.location.href = url;
      return newTab;
    } else {
      console.error('Failed to open a new tab.');
      return null;
    }
  };

  const downloadAndOpenPdfInNewTab = async (pdfData) => {
    if (!pdfData) {
      console.error('PDF data is missing.');
      return;
    }

    const newTab = await openNewTab(pdfData);

    if (newTab) {
      // Create an iframe in the new tab and set its source to the PDF data URL
      const iframe = document.createElement('iframe');
      iframe.src = pdfData;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      newTab.document.body.appendChild(iframe);

      // Clean up the blob URL when the new tab is closed
      newTab.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(pdfData);
      });
    }
  };

  const handleViewBenefit = (id) => {
    setIds(id);
    // setTriggers(true);
    // downloadAndOpenPdfInNewTab(data, 'benefit.pdf');
    onOpen();
  };

  return (
    <Box border={'1px'} borderColor="#ebebeb">
      <ModalForm
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        id={ids}
        download={downloadAndOpenPdfInNewTab}
      />
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
            Change Upgrade
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
            Select Product{' '}
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
        {initStateUpgrade?.map((products, i) => {
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
                products.productId ===
                selectedInsurance?.bookingProduct?.product?.id
                  ? '2px solid #065BAA'
                  : ''
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
                  {<CurrencyFormatter amount={products.finalPrice} />}
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
                  {products.productDescription}
                </Heading>
                <ButtonGroup gap="5px">
                  <Button
                    variant="base"
                    onClick={() => handleViewBenefit(products.productId)}
                  >
                    View Benefits
                  </Button>
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
                  {selectedInsurance?.bookingProduct?.productName}
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
                  {isLastStep ? 'Finish' : 'CALCULATE PAYMENT'}
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
