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

// import { selectCurrentTraveller } from '../../auth/authSlice';
import {
  areaList,
  travelDurations,
  planTypes,
  typeProd,
  setMasterProduct,
  listProduct,
  formProduct,
  setProductForm,
  listAdditonal,
} from './masterProductSlice';

// import { SlCalender } from 'react-icons/sl';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { MdAdd } from 'react-icons/md';
import { Select } from 'chakra-react-select';

const CreateProduct = () => {
  const dispatch = useDispatch();
  const listProducts = useSelector(listProduct);
  const listPlanType = useSelector(planTypes);
  const additonal = useSelector(listAdditonal);
  const areaLists = useSelector(areaList);
  const formstate = useSelector(formProduct);
  const typesProduct = useSelector(typeProd);
  const listTravelDurations = useSelector(travelDurations);
  const [isActive] = useState(false);
  const [isActiveDescLoc] = useState(false);
  const hiddenInputIdtty = React.useRef(null);
  const navigate = useNavigate();
  const [fields, setFields] = React.useState(null);
  const toast = useToast();
  const handleUploadIdentity = (e) => {
    hiddenInputIdtty.current.click();
  };

  const handleNext = (e) => {
    e.preventDefault();
    dispatch(setMasterProduct([...listProducts, fields]));
    toast({
      title: 'Created Product Success',
      status: 'success',
      position: 'top-right',
      duration: 3000,
      isClosable: true,
      variant: 'solid',
    });
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
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                value={formstate?.currId}
                name="currId"
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
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="personalAccidentCover"
                value={formstate?.personalAccidentCover}
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
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                value={formstate?.productMedicalCover}
                name="productMedicalCover"
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
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                value={formstate?.productTravelCover}
                name="productTravelCover"
                onChange={handleData}
              />
              <FormLabel
                pt="1.5"
                style={{
                  transform:
                    formstate !== null && formstate?.travelCover !== ''
                      ? 'translate(0, -10px) scale(0.75)'
                      : 'translate(0, 4px) scale(0.75)',
                  color:
                    formstate !== null && formstate?.travelCover !== ''
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
                    onChange={handleTravelDuration}
                    value={formstate?.travelDuration}
                    classNamePrefix="chakra-react-select"
                    options={listTravelDurations}
                    placeholder="Select some colors..."
                    closeMenuOnSelect={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (provided) => ({ ...provided, zIndex: 100 }),
                    }}
                    components={{
                      Placeholder: () => (
                        <span
                          style={{
                            display: formstate?.travelDuration
                              ? 'none'
                              : 'none',
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
                        formstate !== null &&
                        formstate?.travelDuration?.length !== 0
                          ? 'translate(0, -10px) scale(0.75)'
                          : 'translate(0, 4px) scale(0.75)',
                      color:
                        formstate !== null &&
                        formstate?.travelDuration?.length !== 0
                          ? '#065baa'
                          : '#231F20',
                      fontSize: '14px',
                    }}
                    fontFamily={'Mulish'}
                  >
                    Travel Duration
                  </FormLabel>
                </Box>
              </Box>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
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
              !fields?.productCode ||
              !fields?.productName ||
              !fields?.productDetailCode ||
              !fields?.productDescription ||
              !fields?.medicalCover ||
              !fields?.travelCover ||
              !fields?.productType
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
