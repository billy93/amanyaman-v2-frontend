/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetProductsAgentQuery,
  useGetProductsBenefitByIdQuery,
} from './productAgenApiSlice';
import { useGetBandTypeQuery } from '../bandType/bandTypesApiSlice';
import { useGetPlanTypesQuery } from '../planType/planTypeApiSlice';
import { useGetTravelAgentQuery } from '../travelAgent/travelApiSlice';
import { useGetListAreaGroupQuery } from '../group-area/listApiSlice';
import { useGetTravellerTypesQuery } from '../travellerType/travellerTypesApiSlice';
import {
  selectedTravelInsurance,
  setSelectTravelInsurancePlan,
} from '../quota-search/quotaSearchSlice';
import {
  Select,
  Stack,
  Text,
  Image,
  Heading,
  Input,
  Box,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import ModalView from './view';
// import { Select } from 'chakra-react-select'
import Hospital from '../../../img/images/Hospital.png';
import Medicine from '../../../img/images/Medicine.png';
import TravelCaover from '../../../img/images/Plane.png';
import { MdLogin, MdFilterList } from 'react-icons/md';
import CurrencyFormatter from '../../../components/formatCurrency';

export const useInfiniteLoading = (props) => {
  const { getItems } = props;
  const [items, setItems] = useState([]);
  const pageToLoad = React.useRef(
    new URLSearchParams(window.location.search).get('page') || 1
  );
  const initialPageLoaded = React.useRef(false);
  const [hasNext, setHasNext] = useState(true); /* 1 */
  const [hasPrevious, setHasPrevious] = useState(
    () => pageToLoad.current !== 1
  ); /* 2 */
  const history = useNavigate();

  const loadItems = React.useCallback(async (page, itemCombineMethod) => {
    const data = await getItems({ page });
    setHasNext(data.totalPages > pageToLoad.current); /* 3 */
    setHasPrevious(pageToLoad.current > 1); /* 4 */
    setItems((prevItems) => {
      /* 5 */
      return itemCombineMethod === 'prepend'
        ? [...data.items, ...prevItems]
        : [...prevItems, ...data.items];
    });
  });

  const loadNext = () => {
    pageToLoad.current = Number(pageToLoad.current) + 1;
    history.replace(`?page=${pageToLoad.current}`);
    loadItems(pageToLoad.current, 'append');
  };

  const loadPrevious = () => {
    pageToLoad.current = Number(pageToLoad.current) - 1;
    history.replace(`?page=${pageToLoad.current}`);
    loadItems(pageToLoad.current, 'prepend');
  };

  React.useEffect(() => {
    if (initialPageLoaded.current) {
      return;
    }

    loadItems(pageToLoad.current, 'append');
    initialPageLoaded.current = true;
  }, [loadItems]);

  return {
    items,
    hasNext,
    hasPrevious,
    loadNext,
    loadPrevious,
  };
};
const Form2 = () => {
  const selectedInsurance = useSelector(selectedTravelInsurance);
  const [idx, setIdx] = React.useState('');
  // const [trigger, setSe] = React.useState('');
  const {
    data,
    refetch: isRefetching,
    isLoading,
  } = useGetProductsBenefitByIdQuery(idx, {
    skip: true,
  });
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterby] = React.useState({
    travelAgentName: '',
    custCode: '',
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterQuery, setFilterQuery] = React.useState({
    productCode: '',
    travellerType: '',
    bandType: '',
    areaGroup: '',
    planType: '',
    travelAgent: '',
  });
  const [page] = React.useState(0);
  const { data: travellerTypes } = useGetTravellerTypesQuery({
    page: 0,
    size: 9999,
  });

  const { data: bandTypes } = useGetBandTypeQuery({ page: 0, size: 9999 });

  const { data: grouparea } = useGetListAreaGroupQuery({ page: 0, size: 9999 });

  const { data: planTypes } = useGetPlanTypesQuery({ page: 0, size: 9999 });

  const { data: travelagents } = useGetTravelAgentQuery({
    page: 0,
    size: 9999,
    ...filterby,
  });

  const { data: products, refetch } = useGetProductsAgentQuery({
    page: page,
    size: 100,
    ...filterQuery,
  });

  const dispatch = useDispatch();
  const handleFilter = (e) => {
    const filters = {
      ...filterQuery,
      [e.target.name]: e.target.value,
    };
    setFilterQuery(filters);
  };
  const selectProduct = (data) => {
    dispatch(
      setSelectTravelInsurancePlan({
        travelInsurancePlan: { ...data },
      })
    );
  };

  const showFilterBtn = () => {
    setShowFilter(!showFilter);
  };
  React.useEffect(() => {
    const debouncedRefetch = debounce(refetch, 500);
    debouncedRefetch({ page: page, size: 10, ...filterQuery });

    return () => {
      debouncedRefetch.cancel();
    };
  }, [debouncedSearchTerm, refetch, filterQuery, page]);

  React.useEffect(() => {
    if (!showFilter) {
      setFilterQuery({
        productCode: '',
        travellerType: '',
        bandType: '',
        areaGroup: '',
        planType: '',
        travelAgent: '',
      });
    }
  }, [showFilter]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, filterQuery]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setFilterQuery({
        ...filterQuery,
        productCode: searchTerm,
      });
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  const handleSearchTermChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleActionClick = async ({ id }) => {
    openModal();
    setIdx(id);
    await isRefetching(id);
  };

  console.log('data', data);
  console.log('idx', idx);
  const iframeRef = React.useRef(null);

  const handleIframeLoad = () => {
    // Access the iframe's contentDocument and body
    const iframeDoc = iframeRef.current.contentDocument;
    const iframeBody = iframeDoc.body;

    // Add your custom iframe styles here if needed
    iframeRef.current.style.width = '100%';
    iframeRef.current.style.height = '100vh';

    // Clean up the iframe when the modal is closed
    // onClose && onClose();

    // Clean up any event listeners or resources as needed
    // You can use the 'beforeunload' event if required
  };
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
  const handleConfirm = async () => {
    await downloadAndOpenPdfInNewTab(data);
  };

  return (
    <Box mt="5em" mr="2em" ml="2em">
      <ModalView
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      >
        <iframe
          ref={iframeRef}
          src={data}
          title="Embedded Content"
          width="800px"
          height="600px"
          frameBorder="0"
          onLoad={handleIframeLoad}
          scrolling="no"
        ></iframe>
      </ModalView>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        m="1.5em"
      >
        <Heading as={'h6'} size={'sm'}>
          products
        </Heading>
        <Stack direction="row" spacing={4} m={'2.5'}>
          <Button
            leftIcon={<MdFilterList />}
            colorScheme="#231F20"
            variant="outline"
            size={'sm'}
            color={showFilter ? '#065BAA' : ''}
            onClick={showFilterBtn}
          >
            Apply Filter
          </Button>
          <Button
            leftIcon={<MdLogin />}
            colorScheme="#231F20"
            variant="outline"
            size={'sm'}
            color="#231F20"
            onClick={handleConfirm}
          >
            Download
          </Button>
          <Button
            leftIcon={<MdLogin />}
            colorScheme="#231F20"
            variant="outline"
            size={'sm'}
            color="#231F20"
          >
            Compare
          </Button>
        </Stack>
      </Box>
      {showFilter && (
        <Box
          w={{ base: '100%', md: '70%' }}
          display={'flex'}
          justifyContent={'space-around'}
          alignItems={'center'}
          gap="4px"
          p="20px"
        >
          <Input
            variant={'custom'}
            value={searchTerm}
            onChange={handleSearchTermChange}
            name="productCode"
            placeholder={'Search by product code'}
            _placeholder={{ textTransform: 'lowercase' }}
            bg="#ebebeb"
            borderRadius={'5px'}
            textTransform={'uppercase'}
          />
          <Select
            backgroundColor={
              filterQuery?.travellerType === '' ? '#ebebeb' : '#e8f0fe'
            }
            placeholder="Select by Traveller Type"
            style={{
              fontSize: '14px',
              fontFamily: 'Mulish',
              fontWeight: 'normal',
            }}
            _placeholder={{
              color: 'grey',
            }}
            defaultValue={''}
            name="travellerType"
            onChange={handleFilter}
          >
            {travellerTypes?.response.map((types, i) => {
              return (
                <option value={types.id} key={i}>
                  {types.name}
                </option>
              );
            })}
          </Select>
          <Select
            placeholder="Select by Plan Type"
            backgroundColor={
              filterQuery?.planType === '' ? '#ebebeb' : '#e8f0fe'
            }
            style={{
              fontSize: '14px',
              fontFamily: 'Mulish',
              fontWeight: 'normal',
            }}
            _placeholder={{
              color: 'grey',
            }}
            defaultValue={''}
            name="planType"
            onChange={handleFilter}
          >
            {planTypes?.response.map((types, i) => {
              return (
                <option value={types.id} key={i}>
                  {types.name}
                </option>
              );
            })}
          </Select>
          <Select
            placeholder="Select by Travel duration "
            backgroundColor={
              filterQuery?.bandType === '' ? '#ebebeb' : '#e8f0fe'
            }
            style={{
              fontSize: '14px',
              fontFamily: 'Mulish',
              fontWeight: 'normal',
            }}
            _placeholder={{
              color: 'grey',
            }}
            defaultValue={''}
            name="bandType"
            onChange={handleFilter}
          >
            {bandTypes?.response.map((types, i) => {
              return (
                <option value={types.id} key={i}>
                  {types.travelDurationName}
                </option>
              );
            })}
          </Select>
          <Select
            placeholder="Select by Travel Agent"
            backgroundColor={
              filterQuery?.travelAgent === '' ? '#ebebeb' : '#e8f0fe'
            }
            style={{
              fontSize: '14px',
              fontFamily: 'Mulish',
              fontWeight: 'normal',
            }}
            _placeholder={{
              color: 'grey',
            }}
            defaultValue={''}
            name="travelAgent"
            onChange={handleFilter}
          >
            {travelagents?.response.map((types, i) => {
              return (
                <option value={types.id} key={i}>
                  {types.travelAgentName}
                </option>
              );
            })}
          </Select>
          {/* <Button variant={'outline'} onClick={handleSearch}>Search</Button> */}
        </Box>
      )}
      <Box
        w={{ base: '100%' }}
        bg="white"
        p={'20px'}
        borderRadius={'5px'}
        textAlign={'left'}
        border="2px #ebebeb"
      >
        {products?.map((products, i) => {
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
                  {products?.productMapping?.productName}
                </Heading>
                <Heading
                  variant="primary"
                  as="h4"
                  size="md"
                  style={{ fontSize: '18px' }}
                >
                  {<CurrencyFormatter amount={products.premiumPrice} />}
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
                      {products?.productMapping?.productPersonalAccidentCover}
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
                      {'Product Medical Cover'}
                    </Text>
                    <Text
                      as="p"
                      fontSize={'sm'}
                      style={{ fontSize: '12px' }}
                      fontFamily={'Mulish'}
                    >
                      {products?.productMapping?.productMedicalCover}
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
                      {'Product Travel Cover'}
                    </Text>
                    <Text
                      as="p"
                      fontSize={'sm'}
                      style={{ fontSize: '12px' }}
                      fontFamily={'Mulish'}
                    >
                      {products?.productMapping?.productTravelCover}
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
                  <Button
                    variant="base"
                    onClick={(products) => handleActionClick(products.id)}
                  >
                    View Benefits
                  </Button>
                  <Button
                    variant="base"
                    onClick={(products) => handleConfirm(products.id)}
                  >
                    Download PDF
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
export default Form2;
