/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Button,
  FormControl,
  Input,
  FormLabel,
  useToast,
  Textarea,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useGetBandTypeQuery } from '../bandType/bandTypesApiSlice';
import { useGetPlanTypesQuery } from '../planType/planTypeApiSlice';
import { useGetListAreaGroupQuery } from '../group-area/listApiSlice';
import { useGetTravellerTypesQuery } from '../travellerType/travellerTypesApiSlice';
import UseCustomToast from '../../../components/UseCustomToast';
import {
  useGetListVariantQuery,
  useCreateMasterProductMutation,
} from './masterProductApiSlice';
// import { selectCurrentTraveller } from '../../auth/authSlice';
import {
  areaList,
  travelDurations,
  planTypes,
  typeProd,
  setMasterProduct,
  setListBandType,
  setListArea,
  setListPlanType,
  listarea,
  listbandtype,
  listplantype,
  listProduct,
  formProduct,
  setProductForm,
  listAdditonal,
  listtravellertype,
  setListTravellerType,
  setListVariant,
  listvariant,
} from './masterProductSlice';

// import { SlCalender } from 'react-icons/sl';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { MdAdd } from 'react-icons/md';
import { Select } from 'chakra-react-select';

const CreateProduct = () => {
  const dispatch = useDispatch();
  const listProducts = useSelector(listtravellertype);
  const travelertype = useSelector(listtravellertype);
  const listPlanType = useSelector(listplantype);
  const additonal = useSelector(listbandtype);
  const areaLists = useSelector(listarea);
  const listvariants = useSelector(listvariant);
  const formstate = useSelector(formProduct);
  const typesProduct = useSelector(listplantype);
  const listTravelDurations = useSelector(listbandtype);
  const [isActive] = useState(false);
  const [isActiveDescLoc] = useState(false);
  const { data: { response: variant } = {} } = useGetListVariantQuery();
  const [toastId, setToastId] = React.useState(null);
  const { showErrorToast, showSuccessToast } = UseCustomToast();
  const hiddenInputIdtty = React.useRef(null);
  const navigate = useNavigate();
  const [fields, setFields] = React.useState(null);
  const toast = useToast();
  const handleUploadIdentity = (e) => {
    hiddenInputIdtty.current.click();
  };
  const [
    createMasterProduct,
    { isLoading, isSuccess: success, isError: errorUpload },
  ] = useCreateMasterProductMutation();
  const { data: bandTypes } = useGetBandTypeQuery({ page: 0, size: 9999 });

  const { data: grouparea } = useGetListAreaGroupQuery({ page: 0, size: 9999 });

  const { data: planTypes } = useGetPlanTypesQuery({ page: 0, size: 9999 });

  const { data: travellerTypes } = useGetTravellerTypesQuery({
    page: 0,
    size: 9999,
  });

  React.useEffect(() => {
    if (bandTypes) {
      let duration = bandTypes?.response.map((obj) => ({
        ...obj,
        label: obj.travelDurationName,
        value: obj.travelDurationName,
      }));
      dispatch(setListBandType(duration));
    }
  }, [bandTypes, dispatch]);

  React.useEffect(() => {
    if (grouparea) {
      let area = grouparea?.response.map((obj) => ({
        ...obj,
        label: obj.areaGroupName,
        value: obj.areaGroupName,
      }));
      dispatch(setListArea(area));
    }
  }, [grouparea, dispatch]);

  console.log('variant', variant);

  React.useEffect(() => {
    if (planTypes) {
      let plan = planTypes?.response.map((obj) => ({
        ...obj,
        label: obj.name,
        value: obj.name,
      }));
      dispatch(setListPlanType(plan));
    }
  }, [planTypes, dispatch]);

  React.useEffect(() => {
    if (travellerTypes) {
      let type = travellerTypes?.response.map((obj) => ({
        ...obj,
        label: obj.name,
        value: obj.name,
      }));
      dispatch(setListTravellerType(type));
    }
  }, [travellerTypes, dispatch]);

  React.useEffect(() => {
    if (variant) {
      let type = variant?.map((obj) => ({
        ...obj,
        label: obj.name,
        value: obj.name,
      }));
      dispatch(setListVariant(type));
    }
  }, [variant, dispatch]);

  const handleNext = async (e) => {
    e.preventDefault();
    const constData = {
      productName: formstate?.productName,
      code: '',
      productCode: formstate?.productCode,
      currId: formstate?.currId,
      value: '',
      productDescription: formstate?.productDescription,
      productBrochure: null,
      productPersonalAccidentCover: formstate?.personalAccidentCover,
      productMedicalCover: formstate?.productMedicalCover,
      productTravelCover: formstate?.productTravelCover,
      travellerType: {
        id: formstate?.travellerType[0]?.id,
      },
      bandType: {
        id: formstate?.additionalWeek[0]?.id,
      },
      areaGroup: {
        id: formstate?.groupArea[0]?.id,
      },
      planType: {
        id: formstate?.planType[0]?.id,
      },
      productAdditionalWeek: formstate?.additionalWeek[0]?.travelDurationName,
      benefitDoc: null,
      wordingDoc: null,
      covidDoc: null,
      npwp: true,
      premiumPrice: null,
      commisionLv1: null,
      commisionLv2: null,
      commisionLv3: null,
      totalCommision: null,
      afterCommisionPrice: null,
      ppn: null,
      pph23: null,
      ppnValue: null,
      pph23Value: null,
      ajiPrice: null,
      variants: [{ id: formstate.variant[0].id }],
    };
    try {
      let data = await createMasterProduct(constData);
      if (data?.data) {
        showSuccessToast('Created master product successfully!');
        navigate('/master-data/master-products');
      } else {
        const errorMessage = `Failed to created master product. Status Code: ${data?.error?.status}`;
        showErrorToast(errorMessage);
      }
    } catch (err) {
      const errorMessage = `Failed to created master product. Status Code: ${err?.error?.status}`;
      showErrorToast(errorMessage);
    }
    setFields(null);
    navigate('/master-data/master-products');
  };

  const handleData = (e) => {
    const data = {
      ...formstate,
      [e.target.name]: e.target.value,
    };
    dispatch(setProductForm(data));
  };
  function handleSelectAdditional(data) {
    const forms = {
      ...formstate,
      additionalWeek: [{ ...data }],
    };
    dispatch(setProductForm(forms));
  }

  function handleVariant(data) {
    const forms = {
      ...formstate,
      variant: [...data],
    };
    dispatch(setProductForm(forms));
  }

  function handletravellerType(data) {
    const forms = {
      ...formstate,
      travellerType: [{ ...data }],
    };
    dispatch(setProductForm(forms));
  }

  function handleGroupArea(data) {
    const forms = {
      ...formstate,
      groupArea: [{ ...data }],
    };
    dispatch(setProductForm(forms));
  }
  function handleSelectPlanType(data) {
    const forms = {
      ...formstate,
      planType: [{ ...data }],
    };
    dispatch(setProductForm(forms));
  }
  function handleTravelDuration(data) {
    const forms = {
      ...formstate,
      travelDuration: [{ ...data }],
    };
    dispatch(setProductForm(forms));
  }
  function handleSelectProductType(data) {
    const forms = {
      ...formstate,
      productType: [{ ...data }],
    };
    dispatch(setProductForm(forms));
  }

  return (
    <Stack mt={{ base: '1em', md: '5em' }}>
      <Box
        p="12px"
        display="flex"
        justifyContent={'space-between'}
        alignItems="center"
      >
        <Box
          as="button"
          onClick={'handleBackStep'}
          display="flex"
          textAlign="left"
        >
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink as={NavLink} to="/master-data/master-products">
                <Text
                  as="b"
                  ml="4"
                  fontSize="sm"
                  color="#065BAA"
                  _hover={{
                    borderBottom: '#065BAA',
                    border: '1 px solid',
                  }}
                >
                  Product
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={NavLink}
                to="#"
                style={{ pointerEvents: 'none' }}
              >
                <Text as={'b'} fontSize={'sm'} color="#231F20">
                  Create Product
                </Text>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      </Box>
      <Box border="1px" borderColor={'#ebebeb'} borderTop={'none'}>
        <Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Input
                id="inputs"
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                value={formstate?.productCode}
                name="productCode"
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              <FormLabel
                fontSize="12"
                pt="1.5"
                className={isActive ? 'Active' : ''}
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Product Code
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Input
                id="inputs"
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                value={formstate?.productName}
                name="productName"
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              <FormLabel
                fontSize="12"
                pt="1.5"
                className={isActive ? 'Active' : ''}
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Product Name
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Input
                id="inputs"
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                value={formstate?.currId}
                name="currId"
                onChange={handleData}
                textTransform={'uppercase'}
                h="48px"
                variant={'custom'}
                background={formstate?.currId !== '' ? '#e8f0fe' : '#ebebeb'}
              />
              <FormLabel
                fontSize="12"
                pt="1.5"
                className={isActive ? 'Active' : ''}
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Currency
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Input
                id="inputs"
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                value={formstate?.productDetailCode}
                name="productDetailCode"
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              <FormLabel
                fontSize="12"
                pt="1.5"
                className={isActive ? 'Active' : ''}
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Product Detail Code
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Box className="floating-form">
                <Box className="react-select-container">
                  <Select
                    isMulti={false}
                    name="colors"
                    onChange={handleSelectAdditional}
                    value={formstate?.additionalWeek}
                    classNamePrefix="chakra-react-select"
                    options={additonal}
                    placeholder="Select some colors..."
                    closeMenuOnSelect={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (provided) => ({ ...provided, zIndex: 100 }),
                    }}
                    chakraStyles={{
                      dropdownIndicator: (
                        prev,
                        { selectProps: { menuIsOpen } }
                      ) => ({
                        ...prev,
                        '> svg': {
                          transitionDuration: 'normal',
                          transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
                        },
                      }),
                    }}
                  />
                  <span className="highlight"></span>
                  <FormLabel
                    pt="1.5"
                    style={{
                      transform:
                        formstate !== null &&
                        formstate?.additionalWeek?.length !== 0
                          ? 'translate(0, -10px) scale(0.75)'
                          : 'translate(0, 4px) scale(0.75)',
                      color:
                        formstate !== null &&
                        formstate?.additionalWeek?.length !== 0
                          ? '#065baa'
                          : '#231F20',
                      fontSize: '14px',
                    }}
                    fontFamily={'Mulish'}
                  >
                    Additional Week
                  </FormLabel>
                </Box>
              </Box>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Textarea
                id="myTextarea"
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                value={formstate?.productDescription}
                name="productDescription"
                onChange={handleData}
                h="48px"
              />
              <FormLabel
                fontSize="12"
                pt="1.5"
                className={isActiveDescLoc ? 'Active' : ''}
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Description
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Textarea
                id="myTextarea"
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="personalAccidentCover"
                value={formstate?.personalAccidentCover}
                onChange={handleData}
                h="48px"
                background={
                  formstate?.personalAccidentCover !== '' ? '#e8f0fe' : ''
                }
              />
              <FormLabel
                fontSize="12"
                pt="1.5"
                className={isActiveDescLoc ? 'Active' : ''}
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Personal Accident Cover
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Textarea
                id="myTextarea"
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                value={formstate?.productMedicalCover}
                name="productMedicalCover"
                onChange={handleData}
                h="48px"
                background={
                  formstate?.productMedicalCover !== '' ? '#e8f0fe' : ''
                }
              />
              <FormLabel
                fontSize="12"
                pt="1.5"
                className={isActiveDescLoc ? 'Active' : ''}
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Product Medical Cover
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Textarea
                id="myTextarea"
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                value={formstate?.productTravelCover}
                name="productTravelCover"
                onChange={handleData}
                background={
                  formstate?.productTravelCover !== '' ? '#e8f0fe' : ''
                }
              />
              <FormLabel
                pt="1.5"
                style={{
                  transform:
                    formstate !== null && formstate?.productTravelCover !== ''
                      ? 'translate(0, -10px) scale(0.75)'
                      : 'translate(0, 4px) scale(0.75)',
                  color:
                    formstate !== null && formstate?.productTravelCover !== ''
                      ? '#065baa'
                      : '#231F20',
                  fontSize: '14px',
                }}
                fontFamily={'Mulish'}
              >
                Product Travel Cover
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              fontFamily={'Mulish'}
              id="float-label"
              mt="30px"
            >
              <Button
                bg="white"
                variant={'base'}
                w={{ base: '100%', md: '363px' }}
                onClick={handleUploadIdentity}
                h="48px"
                border={'2px'}
                borderStyle={'dashed'}
                borderColor={'#ebebeb'}
              >
                <MdAdd size={'1em'} color="#065BAA" /> Upload your file
              </Button>
              <Input
                type="file"
                name={'identityCard'}
                // onChange={(e) => handleidentityCard(e, 'File Identity')}
                style={{ display: 'none' }}
                ref={hiddenInputIdtty}
              />
              <FormLabel
                fontSize="14"
                pt="1.5"
                style={{
                  transform: 'translate(-12px, -37px) scale(0.75)',
                  color: '#231F20',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
                fontFamily={'Mulish'}
              >
                Create Product
              </FormLabel>
              <Text
                as="p"
                fontSize={'sm'}
                fontFamily={'Mulish'}
                style={{ fontSize: '12px' }}
              ></Text>
              {/* <Button onClick={handleUploadClick}>Upload</Button> */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Box className="floating-form">
                <Box className="floating-label">
                  <Select
                    isMulti={false}
                    name="colors"
                    onChange={handleSelectProductType}
                    value={formstate?.productType}
                    classNamePrefix="chakra-react-select"
                    options={typesProduct}
                    placeholder="Select some colors..."
                    closeMenuOnSelect={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (provided) => ({ ...provided, zIndex: 100 }),
                    }}
                    chakraStyles={{
                      dropdownIndicator: (
                        prev,
                        { selectProps: { menuIsOpen } }
                      ) => ({
                        ...prev,
                        '> svg': {
                          transitionDuration: 'normal',
                          transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
                        },
                      }),
                    }}
                  />
                  <span className="highlight"></span>
                  <FormLabel
                    pt="1.5"
                    style={{
                      transform:
                        formstate !== null &&
                        formstate?.productType?.length !== 0
                          ? 'translate(0, -10px) scale(0.75)'
                          : 'translate(0, 4px) scale(0.75)',
                      color:
                        formstate !== null &&
                        formstate?.productType?.length !== 0
                          ? '#065baa'
                          : '#231F20',
                      fontSize: '14px',
                    }}
                    fontFamily={'Mulish'}
                  >
                    Product Type
                  </FormLabel>
                </Box>
              </Box>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Box className="floating-form">
                <Box className="floating-label">
                  <Select
                    isMulti={false}
                    name="colors"
                    onChange={handleGroupArea}
                    value={formstate?.groupArea}
                    classNamePrefix="chakra-react-select"
                    options={areaLists}
                    placeholder="Select some colors..."
                    closeMenuOnSelect={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (provided) => ({ ...provided, zIndex: 100 }),
                    }}
                    chakraStyles={{
                      dropdownIndicator: (
                        prev,
                        { selectProps: { menuIsOpen } }
                      ) => ({
                        ...prev,
                        '> svg': {
                          transitionDuration: 'normal',
                          transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
                        },
                      }),
                    }}
                  />
                  <span className="highlight"></span>
                  <FormLabel
                    pt="1.5"
                    style={{
                      transform:
                        formstate !== null && formstate?.groupArea?.length !== 0
                          ? 'translate(0, -10px) scale(0.75)'
                          : 'translate(0, 4px) scale(0.75)',
                      color:
                        formstate !== null && formstate?.groupArea?.length !== 0
                          ? '#065baa'
                          : '#231F20',
                      fontSize: '14px',
                    }}
                    fontFamily={'Mulish'}
                  >
                    Area Group
                  </FormLabel>
                </Box>
              </Box>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '540px' }} m="auto">
            <FormControl
              variant="floating"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Box className="floating-form">
                <Box className="floating-label">
                  <Select
                    isMulti={false}
                    name="colors"
                    onChange={handletravellerType}
                    value={formstate?.travellerType}
                    classNamePrefix="chakra-react-select"
                    options={travelertype}
                    placeholder=""
                    closeMenuOnSelect={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (provided) => ({ ...provided, zIndex: 100 }),
                    }}
                    chakraStyles={{
                      dropdownIndicator: (
                        prev,
                        { selectProps: { menuIsOpen } }
                      ) => ({
                        ...prev,
                        '> svg': {
                          transitionDuration: 'normal',
                          transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
                        },
                      }),
                    }}
                  />
                  <span className="highlight"></span>
                  <FormLabel
                    pt="1.5"
                    style={{
                      transform:
                        formstate !== null &&
                        formstate?.travellerType?.length !== 0
                          ? 'translate(0, -10px) scale(0.75)'
                          : 'translate(0, 4px) scale(0.75)',
                      color:
                        formstate !== null &&
                        formstate?.travellerType?.length !== 0
                          ? '#065baa'
                          : '#231F20',
                      fontSize: '14px',
                    }}
                    fontFamily={'Mulish'}
                  >
                    Traveller Type
                  </FormLabel>
                </Box>
              </Box>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
        </Box>
        <Box width={{ base: '100%', md: '540px' }} m="auto" mb="2em">
          <FormControl
            variant="floating"
            isRequired
            fontFamily={'Mulish'}
            mt="14px"
          >
            <Box className="floating-form">
              <Box className="react-select-container">
                <Select
                  isMulti={false}
                  name="colors"
                  onChange={handleSelectPlanType}
                  value={formstate?.planType}
                  classNamePrefix="chakra-react-select"
                  options={listPlanType}
                  closeMenuOnSelect={true}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (provided) => ({ ...provided, zIndex: 100 }),
                  }}
                  components={{
                    Placeholder: () => (
                      <span
                        style={{
                          display: formstate?.planType ? 'none' : 'none',
                        }}
                      >
                        Select an option
                      </span>
                    ),
                  }}
                  chakraStyles={{
                    dropdownIndicator: (
                      prev,
                      { selectProps: { menuIsOpen } }
                    ) => ({
                      ...prev,
                      '> svg': {
                        transitionDuration: 'normal',
                        transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
                      },
                    }),
                  }}
                />
                <span className="highlight"></span>
                <FormLabel
                  pt="1.5"
                  style={{
                    transform:
                      formstate !== null && formstate?.planType?.length !== 0
                        ? 'translate(0, -10px) scale(0.75)'
                        : 'translate(0, 4px) scale(0.75)',
                    color:
                      formstate !== null && formstate?.planType?.length !== 0
                        ? '#065baa'
                        : '#231F20',
                    fontSize: '14px',
                  }}
                  fontFamily={'Mulish'}
                >
                  Plan Type
                </FormLabel>
              </Box>
            </Box>
            {/* It is important that the Label comes after the Control due to css selectors */}
          </FormControl>
          <Box className="floating-form" mt="1em">
            <Box className="react-select-container">
              <FormControl
                variant="floating"
                isRequired
                fontFamily={'Mulish'}
                mt="14px"
              >
                <Box className="floating-form">
                  <Box className="react-select-container">
                    <Select
                      isMulti
                      name="colors"
                      onChange={handleVariant}
                      value={formstate?.variant}
                      classNamePrefix="chakra-react-select"
                      options={listvariants}
                      closeMenuOnSelect={true}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (provided) => ({
                          ...provided,
                          zIndex: 100,
                        }),
                      }}
                      components={{
                        Placeholder: () => (
                          <span
                            style={{
                              display: formstate?.planType ? 'none' : 'none',
                            }}
                          >
                            Select an option
                          </span>
                        ),
                      }}
                      chakraStyles={{
                        dropdownIndicator: (
                          prev,
                          { selectProps: { menuIsOpen } }
                        ) => ({
                          ...prev,
                          '> svg': {
                            transitionDuration: 'normal',
                            transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
                          },
                        }),
                      }}
                    />
                    <span className="highlight"></span>
                    <FormLabel
                      pt="1.5"
                      style={{
                        transform:
                          formstate !== null && formstate?.variant?.length !== 0
                            ? 'translate(0, -10px) scale(0.75)'
                            : 'translate(0, 4px) scale(0.75)',
                        color:
                          formstate !== null && formstate?.variant?.length !== 0
                            ? '#065baa'
                            : '#231F20',
                        fontSize: '14px',
                      }}
                      fontFamily={'Mulish'}
                    >
                      Variant
                    </FormLabel>
                  </Box>
                </Box>
                {/* It is important that the Label comes after the Control due to css selectors */}
              </FormControl>
            </Box>
          </Box>
        </Box>

        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          p="9px"
          borderRadius={'5px'}
          border="1px"
          borderColor={'#ebebeb'}
        >
          <Button
            isDisabled={
              !formstate?.productCode ||
              !formstate?.productName ||
              !formstate?.productDetailCode ||
              !formstate?.productDescription ||
              !formstate?.productMedicalCover ||
              !formstate?.productTravelCover ||
              !formstate?.productType ||
              !formstate?.variant ||
              !formstate?.travellerType ||
              !formstate?.groupArea ||
              !formstate?.planType
                ? true
                : false
            }
            variant={'ClaimBtn'}
            style={{ textTransform: 'uppercase', fontSize: '14px' }}
            fontFamily="arial"
            fontWeight={'700'}
            onClick={handleNext}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
export default CreateProduct;
