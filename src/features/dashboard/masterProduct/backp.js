/* eslint-disable indent */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import {
  Box,
  Text,
  FormControl,
  Input,
  FormLabel,
  useToast,
  Textarea,
  Button,
  Flex,
  Stack,
  InputGroup,
  InputRightAddon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useGetBandTypeQuery } from '../bandType/bandTypesApiSlice';
import { useGetPlanTypesQuery } from '../planType/planTypeApiSlice';
import { useGetListAreaGroupQuery } from '../group-area/listApiSlice';
import { useGetTravelAgentQuery } from '../travelAgent/travelApiSlice';
import { useGetTravellerTypesQuery } from '../travellerType/travellerTypesApiSlice';
import UseCustomToast from '../../../components/UseCustomToast';
import {
  useGetListVariantQuery,
  useCreateMasterProductMutation,
  useGetProductAdditionalQuery,
} from './masterProductApiSlice';
// import { selectCurrentTraveller } from '../../auth/authSlice';
import {
  listAdditonalWeeks,
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
  listtravelagents,
  setListTravellAgents,
  setListAdditionalWeeks,
} from './masterProductSlice';
import { MdAdd } from 'react-icons/md';
import { Select } from 'chakra-react-select';

const CommisionForm = () => {
  const dispatch = useDispatch();
  const listProducts = useSelector(listtravellertype);
  const listAddWeeks = useSelector(listAdditonalWeeks);
  const listAgents = useSelector(listtravelagents);
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
  const { data: { response: additionalWeeks } = {} } =
    useGetProductAdditionalQuery();
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
  const [filterby] = React.useState({
    travelAgentName: '',
    custCode: '',
  });
  const { data: { response: travelagents } = {} } = useGetTravelAgentQuery({
    page: 0,
    size: 9999,
    ...filterby,
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
    if (travelagents) {
      let agents = travelagents?.map((obj) => ({
        ...obj,
        label: obj.travelAgentName,
        value: obj.travelAgentName,
      }));
      dispatch(setListTravellAgents(agents));
    }
  }, [travelagents, dispatch]);

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

  // console.log('variant', variant);

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

  const total = React.useMemo(() => {
    let tot;
    tot =
      parseInt(formstate?.commissionlvl1) +
      parseInt(formstate?.commissionlvl2) +
      parseInt(formstate?.commissionlvl3);
    return tot;
  }, [
    formstate?.commissionlvl1,
    formstate?.commissionlvl2,
    formstate?.commissionlvl3,
  ]);

  const handleNext = async (e) => {
    e.preventDefault();
    const constData = {
      productName: formstate?.productName,
      code: formstate?.productCode,
      productCode: formstate?.productCode,
      currId: formstate?.currId,
      value: '100',
      productDescription: formstate?.productDescription,
      productBrochure: 'http://example.com/brochure.pdf',
      productPersonalAccidentCover: formstate?.personalAccidentCover,
      productMedicalCover: formstate?.productMedicalCover,
      productTravelCover: formstate?.productTravelCover,
      travellerType: {
        id: formstate?.planType[0]?.id,
      },
      bandType: {
        id: formstate?.bandType[0]?.id,
      },
      areaGroup: {
        id: formstate?.groupArea[0]?.id,
      },
      planType: {
        id: formstate?.planType[0]?.id,
      },
      productAdditionalWeek:
        formstate?.additionalWeek === ''
          ? null
          : {
              id: formstate?.additionalWeek[0].id,
            },
      benefitDoc: null,
      wordingDoc: null,
      covidDoc: null,
      npwp: true,
      premiumPrice: Number(formstate?.premiumPrice),
      commisionLv1: Number(formstate?.commissionlvl1),
      commisionLv2: Number(formstate?.commissionlvl2),
      commisionLv3: Number(formstate?.commissionlvl3),
      totalCommision: (
        Math.ceil(total * formstate?.premiumPrice) / 100
      ).toFixed(0),
      afterCommisionPrice: Math.ceil(
        formstate?.premiumPrice - (total * formstate?.premiumPrice) / 100
      ).toFixed(0),
      ppn: 10.0,
      pph23: 2.0,
      ppnValue: 8.25,
      pph23Value: 1.65,
      ajiPrice: 92.4,
      variants: formstate?.variants.map((v) => {
        return { id: v.id };
      }),
    };
    try {
      let data = await createMasterProduct(constData);
      if (data?.data) {
        showSuccessToast('Created master product successfully!');
        dispatch(
          setProductForm({
            productName: '',
            code: '',
            productCode: '',
            currId: '',
            value: '',
            productDescription: '',
            productBrochure: '',
            productPersonalAccidentCover: '',
            productMedicalCover: '',
            productTravelCover: '',
            travellerType: '',
            bandType: '',
            areaGroup: '',
            planType: '',
            productAdditionalWeek: null,
            benefitDoc: null,
            wordingDoc: null,
            covidDoc: null,
            npwp: false,
            premiumPrice: 0,
            commisionLv1: 0,
            commisionLv2: 0,
            commisionLv3: 0,
            totalCommision: 0,
            afterCommisionPrice: 0,
            ppn: 0,
            pph23: 0,
            ppnValue: 0,
            pph23Value: 0,
            ajiPrice: 0,
            variant: [],
          })
        );
        navigate('/master-data/master-products');
      } else {
        const errorMessage = `Failed to created master product. Status Code: ${data?.error?.status}`;
        showErrorToast(errorMessage);
        dispatch(
          setProductForm({
            productName: '',
            code: '',
            productCode: '',
            currId: '',
            value: '',
            productDescription: '',
            productBrochure: '',
            productPersonalAccidentCover: '',
            productMedicalCover: '',
            productTravelCover: '',
            travellerType: '',
            bandType: '',
            areaGroup: '',
            planType: '',
            productAdditionalWeek: null,
            benefitDoc: null,
            wordingDoc: null,
            covidDoc: null,
            npwp: false,
            premiumPrice: 0,
            commisionLv1: 0,
            commisionLv2: 0,
            commisionLv3: 0,
            totalCommision: 0,
            afterCommisionPrice: 0,
            ppn: 0,
            pph23: 0,
            ppnValue: 0,
            pph23Value: 0,
            ajiPrice: 0,
            variant: [],
          })
        );
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
  function handleSelectBandType(data) {
    const forms = {
      ...formstate,
      bandType: [{ ...data }],
    };
    dispatch(setProductForm(forms));
  }

  function handleVariant(data) {
    const forms = {
      ...formstate,
      variants: [...data],
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

  function handleSelectAgent(data) {
    console.log('data', data);
    const newData = {
      ...formstate,
      travelAgentName: { ...data },
    };
    dispatch(setProductForm(newData));
  }
  function handleSelectProduct(data) {
    console.log('data', data);
    const newData = {
      ...formstate,
      productName: [{ ...data }],
    };
    dispatch(setProductForm(newData));
  }
  const handleDatas = (e) => {
    const newData = {
      ...formstate,
      [e.target.name]: e.target.value,
    };

    dispatch(setProductForm(newData));
  };

  React.useMemo(() => {
    if (additionalWeeks) {
      let list = [
        { label: 'SELECT OPTION', value: '', id: '', name: '' },
        // eslint-disable-next-line no-unsafe-optional-chaining
        ...additionalWeeks?.map((obj, i) => ({
          ...obj,
          productCode: obj.productCode,
          label: obj.productCode,
          name: obj.productCode,
          value: obj.id,
          idx: i,
        })),
      ];
      dispatch(setListAdditionalWeeks(list));
    }
  }, [additionalWeeks, dispatch]);

  return (
    <Box>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box
          display="flex"
          justifyContent={'space-between'}
          w="100%"
          borderBottom="1px"
          borderColor={'#ebebeb'}
        >
          <Box w="100%" pt="15px" pl="1em" pr="1em">
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
                    Proudcts
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
                    create product
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
        </Box>
      </Box>
      <Flex
        width="100%"
        justifyContent="center"
        alignItems="center"
        mx="auto"
        gap="10px"
      >
        <Flex
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
          gap="20px"
        >
          <Box w="260px">
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
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Product Code
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box w="260px">
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
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Product Name
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
        </Flex>
      </Flex>
      <Flex
        width="100%"
        justifyContent="center"
        alignItems="center"
        mx="auto"
        gap="10px"
      >
        <Flex
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
          gap="20px"
        >
          <Box width={{ base: '100%', md: '260px' }}>
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
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Currency
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
          <Box width={{ base: '100%', md: '260px' }}>
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
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
              >
                Product Detail Code
              </FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
        </Flex>
      </Flex>
      <Flex width="100%" justifyContent="center" alignItems="center" mx="auto">
        <Flex
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
        >
          <Box width={{ base: '100%', md: '540px' }}>
            <FormControl
              variant="floating"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Box>
                <Box className="floating-label">
                  <Select
                    isMulti={false}
                    name="colors"
                    onChange={handleSelectBandType}
                    value={formstate?.bandType}
                    classNamePrefix="chakra-react-select"
                    options={additonal}
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
                        formstate !== null && formstate?.bandType?.length !== 0
                          ? 'translate(-1px, -7px) scale(0.75)'
                          : 'translate(0px, 3px) scale(0.75)',
                      color:
                        formstate !== null && formstate?.bandType?.length !== 0
                          ? '#065baa'
                          : '#231F20',
                      fontSize: '14px',
                    }}
                    fontFamily={'Mulish'}
                  >
                    Band Type
                  </FormLabel>
                </Box>
              </Box>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>
        </Flex>
      </Flex>
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
            background={formstate?.productMedicalCover !== '' ? '#e8f0fe' : ''}
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
            background={formstate?.productTravelCover !== '' ? '#e8f0fe' : ''}
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
      {/* <Box width={{ base: '100%', md: '540px' }} m="auto">
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
          <Button onClick={handleUploadClick}>Upload</Button>
        </FormControl>
      </Box> */}
      <Flex
        width="100%"
        justifyContent="center"
        alignItems="center"
        mx="auto"
        gap="10px"
      >
        <Flex
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
          gap="20px"
        >
          <Box width={{ base: '100%', md: '260px' }} m="auto">
            <FormControl
              variant="floating"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Box>
                <Box className="floating-label">
                  <Select
                    isMulti={false}
                    name="colors"
                    onChange={handleGroupArea}
                    value={formstate?.groupArea}
                    classNamePrefix="chakra-react-select"
                    options={areaLists}
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
          <Box width={{ base: '100%', md: '260px' }} m="auto">
            <FormControl
              variant="floating"
              isRequired
              fontFamily={'Mulish'}
              mt="14px"
            >
              <Box>
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
        </Flex>
      </Flex>

      <Flex
        width="100%"
        justifyContent="center"
        alignItems="center"
        mx="auto"
        gap="10px"
      >
        <Flex
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
          gap="20px"
        >
          <FormControl variant="floating" isRequired fontFamily={'Mulish'}>
            <Box w="540px">
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
        </Flex>
      </Flex>
      <Flex
        width="100%"
        justifyContent="center"
        alignItems="center"
        mx="auto"
        gap="10px"
      >
        <Flex
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
          gap="20px"
        >
          <Box className="react-select-container" mt="1em">
            <FormControl variant="floating" isRequired fontFamily={'Mulish'}>
              <Box w="540px">
                <Box className="react-select-container">
                  <Select
                    isMulti
                    name="colors"
                    onChange={handleVariant}
                    value={formstate?.variants}
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
        </Flex>
      </Flex>
      <Flex width="100%" justifyContent="center" alignItems="center" mx="auto">
        <Flex
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
          gap="20px"
        >
          <Box w="260px">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="premiumPrice"
                value={formstate?.premiumPrice}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                zIndex={'0'}
                style={{
                  zIndex: 0,
                  color:
                    formstate !== null && formstate?.premiumPrice !== ''
                      ? '#065baa'
                      : '#171923',
                  fontWeight: 'normal',
                  paddingBottom: '4px',
                }}
              >
                Premium Price
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box w="260px">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Stack>
                <InputGroup size="sm">
                  <Input
                    type="number"
                    placeholder=" "
                    _placeholder={{ opacity: 1, color: 'gray.500' }}
                    name="commissionlvl1"
                    value={formstate?.commissionlvl1}
                    onChange={handleData}
                    h="48px"
                    variant={'custom'}
                  />
                  <InputRightAddon children="%" h="48px" />
                  <FormLabel
                    fontSize="12"
                    pt="1.5"
                    style={{
                      transform:
                        formstate?.commissionlvl2 !== ''
                          ? 'translate(-3px, -8px) scale(0.75)'
                          : 'translate(0px, 2px) scale(0.75)',
                      fontSize: '14px',
                      background: 'transparent',
                      color:
                        formstate !== null && formstate?.commissionlvl1 !== ''
                          ? '#065baa'
                          : '#171923',
                      zIndex: '0',
                      fontWeight: 'normal',
                    }}
                  >
                    Commission Level 1
                  </FormLabel>
                </InputGroup>
              </Stack>
            </FormControl>
          </Box>
        </Flex>
      </Flex>
      <Flex width="100%" justifyContent="center" alignItems="center" mx="auto">
        <Flex
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
          gap="20px"
        >
          <Box w="260px">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Input
                placeholder=" "
                _placeholder={{ opacity: 1, color: 'gray.500' }}
                name="commissionlvl2"
                value={formstate?.commissionlvl2}
                onChange={handleData}
                h="48px"
                variant={'custom'}
              />
              {/* It is important that the Label comes after the Control due to css selectors */}
              <FormLabel
                fontSize="12"
                pt="1.5"
                zIndex={'0'}
                style={{
                  zIndex: 0,
                  color:
                    formstate !== null && formstate?.commissionlvl2 !== ''
                      ? '#065baa'
                      : '#171923',
                  fontWeight: 'normal',
                  paddingBottom: '4px',
                }}
              >
                Commission Level 2
              </FormLabel>
              {/* {isErrorUser ==='' && <FormErrorMessage>Your Username is invalid</FormErrorMessage>} */}
            </FormControl>
          </Box>
          <Box w="260px">
            <FormControl
              variant="floating"
              id="first-name"
              isRequired
              mt="14px"
            >
              <Stack>
                <InputGroup size="sm">
                  <Input
                    type="number"
                    placeholder=" "
                    _placeholder={{ opacity: 1, color: 'gray.500' }}
                    name="commissionlvl3"
                    value={formstate?.commissionlvl3}
                    onChange={handleData}
                    h="48px"
                    variant={'custom'}
                  />
                  <InputRightAddon children="%" h="48px" />
                  <FormLabel
                    fontSize="12"
                    pt="1.5"
                    style={{
                      transform:
                        formstate?.commissionlvl3 !== ''
                          ? 'translate(-3px, -8px) scale(0.75)'
                          : 'translate(0px, 2px) scale(0.75)',
                      fontSize: '14px',
                      background: 'transparent',
                      color:
                        formstate !== null && formstate?.commissionlvl3 !== ''
                          ? '#065baa'
                          : '#171923',
                      zIndex: '0',
                      fontWeight: 'normal',
                    }}
                  >
                    Commission Level 3
                  </FormLabel>
                </InputGroup>
              </Stack>
            </FormControl>
          </Box>
        </Flex>
      </Flex>
      <Flex
        mt="1em"
        width={{ base: '100%' }}
        gridTemplateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        justifyContent="center"
        alignItems="center"
        gap="20px"
        flexWrap="wrap"
        mx="auto"
      >
        <Box
          border="1px solid #ebebeb"
          p="10px"
          flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
          fontSize="14px"
          fontFamily="Mulish"
        >
          Total Commission
        </Box>
        <Box
          border="1px solid #ebebeb"
          p="10px"
          flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
          fontSize="14px"
          fontFamily="Mulish"
        >
          {'Rp '}
          {(Math.ceil(total * formstate?.premiumPrice) / 100).toFixed(0)}
        </Box>
        <Box
          p="10px"
          flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
          border="none"
        >
          <Flex alignItems="center" gap="5px">
            <RiErrorWarningLine size="25px" color="blue" />
            <Box display="flex" flexDirection="column">
              <Text
                as="b"
                fontSize="sm"
                style={{ fontSize: '12px', fontFamily: 'Mulish' }}
              >
                {' '}
                Total commission:
              </Text>
              <Text
                as="p"
                fontSize="sm"
                style={{ fontSize: '12px', fontFamily: 'Mulish' }}
              >
                Calculated from commission level 1, 2 & 3
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Flex
        width={{ base: '100%' }}
        gridTemplateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        justifyContent="center"
        alignItems="center"
        gap="20px"
        flexWrap="wrap"
        mx="auto"
      >
        <Box
          border="1px solid #ebebeb"
          p="10px"
          flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
          fontSize="14px"
          fontFamily="Mulish"
        >
          After Commision
        </Box>
        <Box
          border="1px solid #ebebeb"
          p="10px"
          flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
          fontSize="14px"
          fontFamily="Mulish"
        >
          {'Rp '}
          {Math.ceil(
            formstate?.premiumPrice - (total * formstate?.premiumPrice) / 100
          ).toFixed(0)}
        </Box>
        <Box
          p="10px"
          flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg: '25%' }}
          border="none"
        >
          <Flex alignItems="center" gap="5px">
            <RiErrorWarningLine size="25px" color="blue" />
            <Box display="flex" flexDirection="column">
              <Text
                as="b"
                fontSize="sm"
                style={{ fontSize: '12px', fontFamily: 'Mulish' }}
              >
                {' '}
                After commission price:
              </Text>
              <Text
                as="p"
                fontSize="sm"
                style={{ fontSize: '12px', fontFamily: 'Mulish' }}
              >
                Premium price - total commission
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        pr="2em"
      >
        <Button
          onClick={handleNext}
          variant={'ClaimBtn'}
          style={{ textTransform: 'uppercase', fontSize: '14px' }}
          fontFamily="arial"
          fontWeight={'700'}
        >
          ADD
        </Button>
      </Box>
    </Box>
  );
};

export default CommisionForm;
