/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-children-prop */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import { useGetBookingByIdQuery } from '../../policy/policyApiSlice';
import { useGetBookingSearchQuery } from '../policyApiSlice';
import {
  setHistoryForm,
  historyForm,
  userLoginCurrent,
  setCredentials,
} from '../../../auth/authSlice';
import usePersist from '../../../../features/hook/usePersist';
import {
  setFormStateAdult,
  setFormStateCoverageChild,
  selectManualInput,
  setFormStateCoverageType,
  setFormStateTravellerType,
  setFormStateTotalPass,
  setFormStateDestinationCountry,
  setFormStateStartDate,
  setFormEndDate,
  setListCountries,
  listcountries,
  setListProducts,
} from '../quotaSearchSlice';
import {
  Text,
  Flex,
  InputRightElement,
  InputGroup,
  Heading,
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumb,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Select } from 'chakra-react-select';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { SlCalender } from 'react-icons/sl';
import Payment from '../../../../img/Payment.png';
import Files from '../../../../img/images/Files.png';
import Plan from '../../../../img/images/Plane.png';
import Pasport from '../../../../img/images/Passport.png';
import Umbrella from '../../../../img/Umbrella.png';
import CurrencyFormatter from '../../../../components/formatCurrency';
import { AiOutlineWarning } from 'react-icons/ai';
import {
  useGetListCountriesQuery,
  useSearchproductsMutation,
} from '../policyApiSlice';
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
const Form1 = ({
  label,
  hasCompletedAllSteps,
  activeStep,
  reset,
  prevStep,
  nextStep,
  isLastStep,
}) => {
  const initState = useSelector(selectManualInput);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isActive] = useState(false);
  const [persist, setPersist] = usePersist();
  const historyForms = useSelector(historyForm);
  const login = useSelector(userLoginCurrent);
  const listCountries = useSelector(listcountries);
  const { data: { response: countries } = {} } = useGetListCountriesQuery();
  const [searchproducts, { isLoading }] = useSearchproductsMutation();
  const [isActives, setActives] = useState(false);
  const {
    data: quotation,
    isLoading: loading,
    isError,
    refetch,
    isSuccess,
  } = useGetBookingByIdQuery(id);
  const { data: dataUpdate } = useGetBookingSearchQuery(id);

  function formatDateObject(date) {
    if (!(date instanceof Date)) {
      throw new Error('Invalid date object');
    }

    const year = date.getFullYear();
    // Add 1 to the month because getMonth() returns values from 0 to 11
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return { year, month, day };
  }

  function convertDateToObject(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return { year, month, day };
  }

  // console.log('dataUpdate', dataUpdate);
  const setDataFromResponse = React.useCallback((datas) => {
    const type =
      datas?.coverType === 'SINGLE_TRIP' ? 'Single Trip' : 'Annual Trip';
    dispatch(setFormStateTravellerType(type));
    const destinationCountry = datas?.destinations.map((obj) => ({
      ...obj,
      label: obj.countryName,
      name: obj.countryName,
    }));
    if (datas?.destinations?.length !== 0) {
      setFormStateDestinationCountry(destinationCountry);
    }
    if (datas?.from) {
      dispatch(
        setFormStateStartDate({
          startDate: convertDateToObject(datas.from),
        })
      );
    }
    if (datas?.to !== undefined) {
      dispatch(
        setFormEndDate({
          endDate: {
            day: 1,
            month: 12,
            year: 2000,
          },
        })
      );
    } else {
      const date = new Date();
      dispatch(
        setFormEndDate({
          endDate: formatDateObject(date),
        })
      );
    }
  }, []);

  React.useEffect(() => {
    if (dataUpdate !== undefined) {
      setDataFromResponse(dataUpdate);
    }
  }, [dataUpdate, setDataFromResponse]);

  const handleTypeTrip = (type) => {
    dispatch(setFormStateCoverageType(type));
  };
  const handleTravellerType = (type) => {
    dispatch(setFormStateTravellerType(type));
  };
  const handleTravellerAdult = (e) => {
    let number = e.target.value;
    dispatch(setFormStateAdult(number));
  };
  const handleTravellerChild = (e) => {
    let number = e.target.value;
    dispatch(setFormStateCoverageChild(number));
  };
  const handleTotalPass = (e) => {
    let number = e.target.value;
    dispatch(setFormStateTotalPass(number));
  };
  function handleSelect(data) {
    // const data = data
    const d = data;
    dispatch(
      setFormStateDestinationCountry({
        country: d,
      })
    );
  }

  const paddedDay = initState?.startDate?.day.toString().padStart(2, '0');
  const paddedMonth = initState?.startDate?.month.toString().padStart(2, '0');
  const paddedEndDay = initState?.endDate?.day.toString().padStart(2, '0');
  const paddedEndMonth = initState?.endDate?.month.toString().padStart(2, '0');
  const handleNext = async () => {
    const payload = {
      coverType:
        initState.coverageType === 'Single Trip' ? 'SINGLE_TRIP' : 'ANNUAL',
      travellerType:
        initState.travellerType === 'Individual'
          ? {
              id: 1,
            }
          : initState.travellerType === 'Group'
          ? { id: 3 }
          : { id: 2 },
      from: `${initState?.startDate.year}-${paddedMonth}-${paddedDay}`,
      to: `${initState?.endDate.year}-${paddedEndMonth}-${paddedEndDay}`,
      destinations:
        initState?.coverageType === 'Single Trip'
          ? initState?.destinationCountry.map((v) => {
              return { id: v.id };
            })
          : [],
      adt: initState.adult,
    };

    try {
      const res = await searchproducts(
        initState?.travellerType === 'Family'
          ? { ...payload, chd: initState.child }
          : payload
      );
      console.log('res', res);
      if (res.data) {
        const addStep = {
          ...login,
          historyStep: 1,
        };
        nextStep();
        dispatch(setCredentials({ ...addStep }));
        // localStorage.setItem('persist', JSON.stringify(addStep));
        dispatch(setListProducts(res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log('login quotation', quotation);
  React.useEffect(() => {
    if (countries) {
      let countriesList = countries?.map((obj) => ({
        ...obj,
        label: obj.countryName,
        value: obj.countryName,
      }));
      dispatch(setListCountries(countriesList));
    }
  }, [countries, dispatch]);

  function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    const formatter = new Intl.DateTimeFormat('en-us', { month: 'long' });

    return formatter.format(date);
  }

  const formatInputValue = () => {
    if (!initState?.startDate) return '';
    return `${initState?.startDate?.day} ${getMonthName(
      initState?.startDate?.month
    )} ${initState?.startDate?.year}`;
  };
  const formatInputValues = () => {
    if (!initState?.endDate) return '';
    return `${initState?.endDate?.day} ${getMonthName(
      initState?.endDate?.month
    )} ${initState?.endDate?.year}`;
  };
  // console.log('manual cover', activeStep);
  const renderCustomInput = ({ ref }) => (
    <>
      <FormControl
        variant="floating"
        id="first-name"
        isRequired
        fontFamily={'Mulish'}
      >
        <InputGroup id="float-labels">
          <Input
            readOnly
            ref={ref}
            placeholder=" "
            _placeholder={{ opacity: 1, color: 'gray.500' }}
            value={
              initState?.startDate
                ? `${initState?.startDate?.day} ${getMonthName(
                    initState?.startDate?.month
                  )} ${initState?.startDate?.year}`
                : ''
            }
            h="48px"
          />
          <InputRightElement children={<SlCalender color="green.500" />} />
          <FormLabel
            fontSize="12"
            pt="1.5"
            className={isActive || initState?.startDate ? 'Active' : ''}
            fontFamily={'Mulish'}
          >
            Start Date
          </FormLabel>
        </InputGroup>
        {/* It is important that the Label comes after the Control due to css selectors */}
      </FormControl>
    </>
  );
  const renderCustomInputs = ({ ref }) => (
    <>
      <FormControl
        variant="floating"
        id="first-name"
        isRequired
        fontFamily={'Mulish'}
      >
        <InputGroup id="float-labels2">
          <Input
            readOnly
            ref={ref}
            placeholder=" "
            _placeholder={{ opacity: 1, color: 'gray.500' }}
            value={
              initState?.endDate
                ? `${initState?.endDate?.day} ${getMonthName(
                    initState?.endDate?.month
                  )} ${initState?.endDate?.year}`
                : ''
            }
            h="48px"
          />
          <InputRightElement children={<SlCalender color="green.500" />} />
          <FormLabel
            fontSize="12"
            pt="1.5"
            className={isActives || initState?.endDate ? 'Active' : ''}
            fontFamily={'Mulish'}
          >
            End Date
          </FormLabel>
        </InputGroup>
        {/* It is important that the Label comes after the Control due to css selectors */}
      </FormControl>
    </>
  );
  const selectDate = (date) => {
    dispatch(
      setFormStateStartDate({
        startDate: date,
      })
    );
    if (initState?.coverageType === 'Single Trip') {
      addOneDayLater(date);
    }
    if (date !== null) {
      //   setActive(true)
    } else {
      //   setActive(false)
    }
  };
  const selectEndDate = (date) => {
    dispatch(
      setFormEndDate({
        endDate: date,
      })
    );
    if (date !== null) {
      setActives(true);
    } else {
      setActives(false);
    }
  };

  // const addOneYear = () => {
  //   // Increment the year value by 1
  //   const updatedYear = initState?.endDate?.year + 1;

  //   // Check if the resulting year is a leap year
  //   const isLeapYear =
  //     (updatedYear % 4 === 0 && updatedYear % 100 !== 0) ||
  //     updatedYear % 400 === 0;
  //   let updatedDay = initState?.endDate?.day - 1;
  //   if (
  //     isLeapYear &&
  //     initState?.startDate?.month === 2 &&
  //     initState?.startDate?.day === 29
  //   ) {
  //     updatedDay = 28;
  //   }

  //   // Update the state with the new date
  //   dispatch(
  //     setFormEndDate({
  //       endDate: {
  //         ...initState?.endDate,
  //         day: updatedDay,
  //         year: updatedYear,
  //       },
  //     })
  //   );
  // };

  // Function to handle adding 1 day to the selected date
  const addOneDayLater = (date) => {
    const { year, month, day } = date;

    // Get the number of days in the selected month
    const lastDayOfMonth = new Date(year, month, 0).getDate();

    // Calculate the new day value
    let newDay = day + 1;

    // Check if the new day exceeds the last day of the month
    if (newDay > lastDayOfMonth) {
      // Increment the month and set the new day to 1
      const newMonth = month + 1;
      const newYear = year + (newMonth > 12 ? 1 : 0);
      newDay = 1;
      dispatch(
        setFormEndDate({
          ...initState.endDate,
          endDate: {
            year: newYear,
            month: newMonth > 12 ? 1 : newMonth,
            day: newDay,
          },
        })
      );
    } else {
      dispatch(
        setFormEndDate({
          ...initState?.endDate,
          endDate: {
            year: year,
            month: month,
            day: newDay,
          },
        })
      );
    }
  };

  function addOneYear(dates) {
    // Create a new Date object with the given date values
    const date = { ...initState?.startDate };
    var currentDate = new Date(dates.year, dates.month - 1, dates.day);

    // Add 1 year
    currentDate.setFullYear(currentDate.getFullYear() + 1);

    // Subtract less than 1 day
    currentDate.setDate(currentDate.getDate() - 1);

    // Check if the updated date is later than the given date
    if (currentDate > new Date(dates.year, dates.month - 1, dates.day)) {
      // Subtract 2 days to ensure it's earlier by less than 1 day
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Obtain the updated date values
    var updatedDate = {
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
    };
    dispatch(
      setFormEndDate({
        endDate: updatedDate,
      })
    );
    return updatedDate;
  }
  const prevType = usePrevious(initState?.travellerType);
  const prevTypeCov = usePrevious(initState?.coverageType);
  // const prevstartdate = usePrevious(initState?.startDate)

  React.useEffect(() => {
    if (prevType !== initState?.travellerType) {
      if (initState?.travellerType === 'Group') {
        dispatch(setFormStateAdult(2));
      } else {
        dispatch(setFormStateAdult(1));
      }
      dispatch(setFormStateCoverageChild(1));
    }
  }, [initState?.travellerType, prevType, dispatch]);

  React.useEffect(() => {
    if (prevTypeCov !== initState?.coverageType) {
      if (initState?.coverageType === 'Single Trip') {
        const date = { ...initState?.endDate };
        dispatch(
          setFormEndDate({
            endDate: {
              ...initState?.startDate,
              day: initState?.startDate.day + 1,
            },
          })
        );
      } else if (initState?.coverageType === 'Anual Trip') {
        addOneYear({ ...initState?.startDate });
      }
    }
  }, [
    initState?.coverageType,
    prevTypeCov,
    dispatch,
    initState?.endDate,
    initState?.startDate,
    addOneYear,
  ]);
  const prevDate = usePrevious(initState?.startDate?.day);
  React.useEffect(() => {
    if (
      prevDate !== initState?.startDate?.day &&
      initState?.coverageType === 'Anual Trip'
    ) {
      addOneYear({ ...initState?.startDate });
    }
  }, [
    initState?.coverageType,
    initState?.startDate,
    prevDate,
    dispatch,
    initState?.endDate,
    initState?.startDate,
    addOneYear,
  ]);

  const currentDate = new Date();

  // Calculate start and end dates
  const startDate = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate(),
  };
  const startToEndDate = {
    year: initState?.startDate.year,
    month: initState?.startDate.month,
    day: initState?.startDate.day + 1,
  };
  //  const tomorrow = utils().getRelativeDate(utils().getToday(), 1);
  const endDate = new Date();
  endDate.setDate(currentDate.getDate() + 180);

  const endDateObj = {
    year: endDate.getFullYear(),
    month: endDate.getMonth() + 1,
    day: endDate.getDate(),
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Box border={'1px'} borderColor="#ebebeb">
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      ></Box>
      <Box
        border={'1px'}
        borderColor="#ebebeb"
        p="12px"
        display="flex"
        justifyContent={'space-between'}
        alignItems="center"
      >
        <Box position={'relative'} m="auto">
          <Heading
            as="h4"
            style={{ fontSize: '18px' }}
            fontSize="sm"
            color="#065BAA"
            textAlign={'center'}
          >
            Upgrade Details{' '}
          </Heading>
        </Box>
      </Box>
      <Box
        position={'relative'}
        w={{ base: '100%' }}
        display="flex"
        justifyContent="space-between"
        // alignItems="center"
        // bg="red"
        top={{ base: '0' }}
        p="10px 20px"
      >
        <Box
          position={'relative'}
          zIndex={'1'}
          w={{ base: '60%' }}
          bg="white"
          mt="1em"
          // boxShadow={'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}
        >
          <Box
            mt="1em"
            display="flex"
            justifyContent="flext-start"
            width={{ base: '100%' }}
            gap="4px"
          >
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              fontFamily={'Mulish'}
            >
              <Button
                bg="#ebebeb"
                w={{ base: '100%' }}
                border={
                  initState?.coverageType === 'Single Trip'
                    ? '2px solid #065BAA'
                    : ''
                }
                h="48px"
                aria-label="Search database"
                color={
                  initState?.coverageType === 'Single Trip'
                    ? '#065BAA'
                    : '#231F20'
                }
                _hover={{
                  bg: '#ebebeb',
                }}
                onClick={() => handleTypeTrip('Single Trip')}
              >
                Single Trip
              </Button>
              <FormLabel
                fontSize="12"
                pt="1.5"
                fontFamily={'Mulish'}
                style={{
                  transform: 'translate(-12px, -40px) scale(0.75)',
                  fontSize: '18px',
                  zIndex: '0',
                }}
              >
                Select Coverage Type
              </FormLabel>
            </FormControl>
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              fontFamily={'Mulish'}
            >
              <Button
                bg="#ebebeb"
                border={
                  initState?.coverageType === 'Anual Trip'
                    ? '2px solid #065BAA'
                    : ''
                }
                w={{ base: '100%' }}
                h="48px"
                aria-label="Search database"
                color={
                  initState?.coverageType === 'Anual Trip'
                    ? '#065BAA'
                    : '#231F20'
                }
                _hover={{
                  bg: '#ebebeb',
                }}
                onClick={() => handleTypeTrip('Anual Trip')}
              >
                Annual Trip
              </Button>
              {/* <FormLabel fontSize="12" pt="1.5" fontFamily={'Mulish'} style={{ transform: "translate(-12px, -31px) scale(0.75)", fontSize:"14px" }}>Select Coverage Type</FormLabel> */}
            </FormControl>
          </Box>
          {initState?.coverageType === '' ||
          initState?.coverageType === 'Single Trip' ? (
            <Box mt="2em" w={{ base: '100%' }} h={{ sm: '48px' }}>
              <FormControl
                variant="floating"
                fontFamily={'Mulish'}
                isRequired
                h="48px"
              >
                <Select
                  size="lg"
                  isMulti
                  variant="outline"
                  onChange={handleSelect}
                  value={initState?.destinationCountry}
                  isSearchable={true}
                  styles={{
                    menuPortal: (provided) => ({ ...provided }),
                  }}
                  options={listCountries}
                />
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  fontFamily={'Mulish'}
                  style={{
                    transform: 'translate(-12px, -40px) scale(0.75)',
                    fontSize: '18px',
                    color: '#171923',
                    zIndex: '0',
                  }}
                >
                  Select Destination Country
                </FormLabel>
              </FormControl>
            </Box>
          ) : null}
          <Box
            mt="1em"
            position={'relative'}
            zIndex={'0'}
            display={'flex'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            gap="4px"
            width={{ base: '100%' }}
          >
            <Box mt="1.5em" h="48px" width={{ base: '100%' }}>
              <FormControl
                mt="10px"
                variant="floating"
                id="first-name"
                isRequired
                fontFamily={'Mulish'}
              >
                <FormLabel
                  fontSize="12"
                  pt="1.5"
                  fontFamily={'Mulish'}
                  style={{
                    transform: 'translate(16px, 2px) scale(0.75)',
                    fontSize: '18px',
                    background: '#ebebeb',
                    color: '#171923',
                  }}
                >
                  Start Date
                </FormLabel>
                <DatePicker
                  width="100%"
                  value={initState?.startDate}
                  onChange={selectDate}
                  inputPlaceholder="Select a date" // placeholder
                  formatInputText={formatInputValue}
                  inputClassName="my-custom-inputs" // custom class
                  renderInput={renderCustomInput}
                  wrapperClassName={'calendarClassName'}
                  shouldHighlightWeekends
                  minimumDate={startDate}
                  // maximumDate={endDateObj}
                />
              </FormControl>
            </Box>
            {initState.coverageType === '' ||
            initState.coverageType === 'Single Trip' ? (
              <Box width={{ base: '100%' }} mt="1.5em" h="48px">
                <FormControl
                  mt="10px"
                  variant="floating"
                  id="first-name"
                  isRequired
                  fontFamily={'Mulish'}
                >
                  <FormLabel
                    fontSize="12"
                    pt="1.5"
                    fontFamily={'Mulish'}
                    style={{
                      transform: 'translate(16px, 2px) scale(0.75)',
                      fontSize: '18px',
                      background: '#ebebeb',
                      color: '#171923',
                    }}
                  >
                    End Date
                  </FormLabel>
                  <DatePicker
                    width="100%"
                    value={initState?.endDate}
                    onChange={selectEndDate}
                    inputPlaceholder="Select a date" // placeholder
                    formatInputText={formatInputValues}
                    inputClassName="my-custom-inputs" // custom class
                    renderInput={renderCustomInputs}
                    shouldHighlightWeekends
                    wrapperClassName={'calendarClassName'}
                    minimumDate={startToEndDate}
                    maximumDate={endDateObj}
                  />
                </FormControl>
              </Box>
            ) : (
              <Box width={{ base: '100%' }} mt="1.5em" h="48px">
                <FormControl
                  mt="10px"
                  variant="floating"
                  id="first-name"
                  isRequired
                  fontFamily={'Mulish'}
                >
                  <FormLabel
                    fontSize="12"
                    pt="1.5"
                    fontFamily={'Mulish'}
                    style={{
                      transform: 'translate(-11px, -32px) scale(0.75)',
                      fontSize: '15px',
                      background: 'white',
                      color: '#171923',
                    }}
                  >
                    End Date
                  </FormLabel>
                  <Box
                    style={{
                      background: 'white',
                      padding: '0.7em',
                    }}
                  >
                    {`${initState?.endDate?.day} ${getMonthName(
                      initState?.endDate?.month
                    )} ${initState?.endDate?.year}`}
                  </Box>
                </FormControl>
              </Box>
            )}
          </Box>
          <Box pt="2em">
            <Box
              style={{
                backgroundColor: 'rgba(255, 160, 0, 0.2)',
                border: '1px solid #ffa000',
                // margin: '0.2em',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '0.2em',
              }}
            >
              <Text as={'p'} fontSize="xs" color={'black.200'} p={'3'}>
                <AiOutlineWarning size="16px" />
              </Text>
              <Text as={'p'} fontSize="xs" color={'black.200'} p={'3'}>
                This policy number will be updated once you upgrade the policy.
              </Text>
            </Box>
          </Box>
          {hasCompletedAllSteps !== undefined && (
            <Box>
              <Heading fontSize="xl" textAlign={'center'}>
                Woohoo! All steps completed! 🎉
              </Heading>
            </Box>
          )}
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          w={{ base: '33%' }}
          border={'1px solid #ebebeb'}
          mr="10px"
          position={'relative'}
          // top="-33"
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
              <Image src={Files} alt="insurance" />
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
                  {'Booking Code'}
                </Text>
                <Text
                  as="b"
                  size={'sm'}
                  fontFamily={'Mulish'}
                  color="#065BAA"
                  style={{ fontSize: '12px' }}
                >
                  {quotation?.transactionId}
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
                    {initState?.coverageType}
                  </Text>
                </Box>
                <Box
                  display={'flex'}
                  gap="2px"
                  flexWrap={'nowrap'}
                  flexDirection={'column'}
                >
                  {initState?.destinationCountry?.map((country, i) => (
                    <Text
                      key={i}
                      as="p"
                      size={'sm'}
                      fontFamily={'Mulish'}
                      color="#065BAA"
                      style={{ fontSize: '12px' }}
                    >
                      {country?.countryName}
                      {i < initState.destinationCountry.length - 1 ? ', ' : ''}
                    </Text>
                  ))}
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
                  {quotation?.selectProduct?.productName}
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
              <Image src={Payment} alt="insurance" />
              <Box
                display={'flex'}
                justifyContent={'center'}
                flexDirection={'column'}
                width={'100%'}
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
                    {'Product Price'}
                  </Text>
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    <CurrencyFormatter
                      amount={quotation?.selectProduct?.finalPrice}
                    />
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
                    {quotation?.travellers.length}
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
                    {'Total Payment'}
                  </Text>
                  <Text
                    as="b"
                    size={'sm'}
                    fontFamily={'Mulish'}
                    style={{ fontSize: '12px' }}
                  >
                    <CurrencyFormatter
                      amount={
                        quotation?.selectProduct?.finalPrice *
                        quotation?.travellers.length
                      }
                    />
                  </Text>
                </Box>
                <Flex width="100%" justify="flex-start" gap={6} mt="2em">
                  {hasCompletedAllSteps !== undefined ? (
                    <></>
                  ) : (
                    <>
                      {initState?.coverageType === 'Single Trip' ? (
                        <Button
                          size="sm"
                          onClick={handleNext}
                          w={{ base: '100%', md: '270px' }}
                          h="48px"
                          isDisabled={
                            initState?.coverageType === '' ||
                            initState?.travellerType === '' ||
                            initState?.destinationCountry?.length === 0 ||
                            initState?.startDate === null ||
                            initState?.endDate === null
                              ? true
                              : false
                          }
                        >
                          {isLastStep ? 'Finish' : 'SEARCH INSURANCE'}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={handleNext}
                          w={{ base: '100%', md: '270px' }}
                          h="48px"
                          isDisabled={
                            initState?.coverageType === '' ||
                            initState?.travellerType === '' ||
                            initState?.startDate === null ||
                            initState?.endDate === null
                              ? true
                              : false
                          }
                        >
                          {isLastStep ? 'Finish' : 'Search Insurance'}
                        </Button>
                      )}
                    </>
                  )}
                </Flex>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default Form1;
