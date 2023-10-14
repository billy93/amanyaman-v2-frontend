/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState } from 'react';
import { useGetProductPriceQuery } from './productPriceApi';
import { Link, useNavigate } from 'react-router-dom';
import { useGetBandTypeQuery } from '../bandType/bandTypesApiSlice';
import { useGetPlanTypesQuery } from '../planType/planTypeApiSlice';
import { useGetTravelAgentQuery } from '../travelAgent/travelApiSlice';
import { useGetListAreaGroupQuery } from '../group-area/listApiSlice';
import { useGetTravellerTypesQuery } from '../travellerType/travellerTypesApiSlice';
import PageLoader from '../../../components/pageLoader';
import {
  usePagination,
  useSortBy,
  useFilters,
  useColumnOrder,
} from 'react-table';
import { FaSort } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import {
  Select,
  Box,
  Heading,
  Stack,
  Text,
  Center,
  useDisclosure,
  Input,
} from '@chakra-ui/react';
import matchSorter from 'match-sorter';
import { Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { refetchdata, setRefetch } from './productPriceSlice';
import { MdFilterList } from 'react-icons/md';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';
import styled from 'styled-components';
import { useTable, useRowSelect } from 'react-table';
import CustomModal from './ModalImport';
import CurrencyFormatter from '../../../components/formatCurrency';
import Export from './export';

const Styles = styled.div`
  // padding: 1rem;

  table {
    width: 100%;
    border-spacing: 0;
    border-top: 1px solid #ebebeb;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th {
      background-color: #fff;
      color: #231f20;
      padding: 13px 15px;
      border-top: 1px solid #ebebeb;
      border-bottom: 1px solid #ebebeb;
      text-align: left;
      white-space: nowrap;
      font-weight: bold;
      min-width: 40px;
      vertical-align: bottom;
      background-clip: padding-box;
      font-family: 'Mulish';
    }
    ,
    td {
      background-color: #fff;
      font-family: 'Mulish';
      color: #231f20;
      padding: 13px 15px;
      border-top: 1px solid #ebebeb;
      border-bottom: 1px solid #ebebeb;
      text-align: left;
      white-space: nowrap;
      font-weight: normal;
      min-width: 40px;
      vertical-align: bottom;
      background-clip: padding-box;
    }
  }
`;

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, Header },
}) {
  return (
    <input
      style={{
        color: '#231F20',
        fontFamily: 'Mulish',
        fontWeight: '500',
        padding: '5px',
        fontSize: '13px',
        border: '1px solid #ebebeb',
        borderRadius: '5px',
        background: '#ebebeb',
      }}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      // eslint-disable-next-line react/no-unknown-property
      _placeholder={{ opacity: 1, color: '#231F20' }}
      fontFamily={'Mulish'}
      fontWeight={'500'}
      placeholder={`Search by ${Header} `}
    />
  );
}
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// eslint-disable-next-line no-unused-vars
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// const formatInputValue = () => {
//     if (!initState?.startDate) return '';
//     return `${initState?.startDate?.day} ${getMonthName(initState?.startDate?.month)} ${initState?.startDate?.year}`;
// };

// eslint-disable-next-line no-unused-vars
function SelectDateColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  // eslint-disable-next-line no-unused-vars
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <input
      type="date"
      width="100%"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    />
  );
}

// eslint-disable-next-line react/display-name, no-unused-vars
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);
// eslint-disable-next-line no-unused-vars
function shuffle(arr) {
  arr = [...arr];
  const shuffled = [];
  while (arr.length) {
    const rand = Math.floor(Math.random() * arr.length);
    shuffled.push(arr.splice(rand, 1)[0]);
  }
  return shuffled;
}
// fuzzyTextFilterFn.autoRemove = val => !val

const Tables = ({
  columns,
  data,
  fetchData,
  loading,
  totalCount,
  pageCount: controlledPageCount,
}) => {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    toggleAllRowsSelected,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    pageOptions,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
      filterTypes,
    },
    useColumnOrder,
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect
  );

  React.useEffect(() => {
    toggleAllRowsSelected();
  }, []);

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize, pageOptions });
  }, [fetchData, pageIndex, pageSize, pageOptions]);

  const spring = React.useMemo(
    () => ({
      type: 'spring',
      damping: 50,
      stiffness: 100,
    }),
    []
  );

  const [expandedRows, setExpandedRows] = useState([]);

  const handleRowClick = (rowIndex) => {
    const expandedRowsCopy = [...expandedRows];
    const index = expandedRows.indexOf(rowIndex);

    if (index > -1) {
      expandedRowsCopy.splice(index, 1);
    } else {
      expandedRowsCopy.push(rowIndex);
    }

    setExpandedRows(expandedRowsCopy);
  };

  const isRowExpanded = (rowIndex) => expandedRows.includes(rowIndex);
  return (
    <>
      <Box
        bg="white"
        overflow={'scroll'}
        pl="2em"
        pr="2em"
        style={{ maxHeight: '400px', overflowY: 'auto' }}
      >
        <table {...getTableProps()} className="my-table">
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <motion.th
                    className="header-cell"
                    key={column.id}
                    {...column.getHeaderProps({
                      layoutTransition: spring,
                      style: {
                        minWidth: column.minWidth,
                      },
                    })}
                    style={{
                      // backgroundColor: 'red',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      padding: '10px',
                      fontFamily: 'Mulish',
                      fontSize: '14px',
                    }}
                  >
                    <div
                      {...column.getSortByToggleProps()}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {column.render('Header')}
                      <Box>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <Box>
                              <FaSort
                                color="#065BAA"
                                size="14px"
                                style={{ paddingLeft: '4px' }}
                              />
                            </Box>
                          ) : (
                            <Box>
                              <FaSort
                                color="#065BAA"
                                size="14px"
                                style={{ paddingLeft: '4px' }}
                              />
                            </Box>
                          )
                        ) : (
                          ''
                        )}
                      </Box>
                    </div>
                    <div>
                      {/* {column.canFilter ? column.render('Filter') : null}{' '} */}
                    </div>
                  </motion.th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              const isExpanded = isRowExpanded(rowIndex);

              return (
                <React.Fragment key={rowIndex}>
                  <tr
                    {...row.getRowProps()}
                    onClick={() => handleRowClick(rowIndex)}
                  >
                    {row.cells.map((cell) => (
                      <td
                        key={cell.id}
                        {...cell.getCellProps()}
                        className={`${
                          cell.column.id === 'value' && isExpanded
                            ? 'expanded'
                            : ''
                        }`}
                      >
                        {cell.column.id === 'value' && cell.value.length > 30
                          ? isExpanded
                            ? cell.value
                            : cell.value.substring(0, 30) + '...'
                          : cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </Box>
    </>
  );
};

function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== 'number';

const Polcies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [size, setSize] = React.useState(5);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const fetchdata = useSelector(refetchdata);
  const [page, setPage] = React.useState(0);
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { data: travellerTypes } = useGetTravellerTypesQuery({
    page: 0,
    size: 9999,
  });
  const [filterQuery, setFilterQuery] = React.useState({
    productCode: '',
    travellerType: '',
    bandType: '',
    areaGroup: '',
    planType: '',
    travelAgent: '',
  });
  const [filterby] = React.useState({
    travelAgentName: '',
    custCode: '',
  });
  const {
    data: { response: systemParams, totalCount } = {},
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetProductPriceQuery({ page: page, size: size, ...filterQuery });
  const { data: bandTypes } = useGetBandTypeQuery({ page: 0, size: 9999 });

  const { data: grouparea } = useGetListAreaGroupQuery({ page: 0, size: 9999 });

  const { data: planTypes } = useGetPlanTypesQuery({ page: 0, size: 9999 });

  const { data: { response: travelagents } = {} } = useGetTravelAgentQuery({
    page: 0,
    size: 9999,
    ...filterby,
  });

  const showFilterBtn = () => {
    setShowFilter(!showFilter);
  };
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
  // console.log('travellerTypes', travelagents)
  const fetchData = React.useCallback(
    ({ pageSize, pageIndex, pageOptions }) => {
      // This will get called when the table needs new data
      // You could fetch your data from literally anywhere,
      // even a server. But for this example, we'll just fake it.

      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // Set the loading state
      setLoading(true);

      // We'll even set a delay to simulate a server here
      setTimeout(() => {
        // Only update the data if this is the latest fetch
        if (fetchId === fetchIdRef.current) {
          const startRow = size * page;
          const endRow = startRow + size;
          setData(systemParams.slice(startRow, endRow));
          // Your server could send back total page count.
          // For now we'll just fake it, too
          setPageCount(Math.ceil(totalCount / size));

          setLoading(false);
        }
      }, 1000);
    },
    [systemParams, totalCount, page, size]
  );

  const handleFilter = (e) => {
    const filters = {
      ...filterQuery,
      [e.target.name]: e.target.value,
    };
    setFilterQuery(filters);
    setPage(0);
  };
  // console.log('query filter',travelagents)
  const columns = React.useMemo(
    () => [
      {
        Header: 'Price Id',
        accessor: 'id',
        Cell: ({ row }) => (
          <Link
            className="global-td"
            color="#065BAA"
            style={{ textDecoration: 'underline' }}
            to={`/master-data/detail-product-price/${row.original.id}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.id}
          </Link>
        ),
      },
      {
        Header: 'Travel Agent',
        accessor: 'travelAgent.travelAgentName',
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Product Detail Code',
        accessor: 'productMapping.productCode',
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Premium Price',
        accessor: 'premiumPrice',
        Cell: ({ row }) => (
          <Box className="global-td">
            {row?.original?.premiumPrice !== null ? (
              <CurrencyFormatter amount={row.original.premiumPrice} />
            ) : (
              '-'
            )}
          </Box>
        ),
      },
      {
        Header: 'Discount Lvl 1',
        accessor: 'commisionLv1',
        Cell: ({ value }) => (
          <div className="global-td">
            {value}
            {'%'}
          </div>
        ),
      },
      {
        Header: 'Discount Lvl 2',
        accessor: 'commisionLv2',
        Cell: ({ value }) => (
          <div className="global-td">
            {value} {'%'}
          </div>
        ),
      },
      {
        Header: 'Discount Lvl 3',
        accessor: 'commisionLv3',
        Cell: ({ value }) => (
          <div className="global-td">
            {value}
            {'%'}
          </div>
        ),
      },
      {
        Header: 'Total Commission',
        accessor: 'totalCommision',
        Cell: ({ row }) => (
          <Box className="global-td">
            {row?.original?.totalCommision !== null ? (
              <CurrencyFormatter amount={row.original.totalCommision} />
            ) : (
              '-'
            )}
          </Box>
        ),
      },
      {
        Header: 'Net To Agent',
        accessor: 'afterCommisionPrice',
        enableGlobalFilter: true,
        Cell: ({ row }) => (
          <Box className="global-td">
            {row?.original?.afterCommisionPrice !== null ? (
              <CurrencyFormatter amount={row.original.afterCommisionPrice} />
            ) : (
              '-'
            )}
          </Box>
        ),
      },
    ],
    []
  );

  // const data = React.useMemo(() => tempList);
  //   console.log('ddd listParams', systemParams)
  // React.useEffect(() => {
  //   refetch({ page, size: 10, ...filterQuery })

  // }, [page, refetch, filterQuery])

  const nextPages = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const prevPages = () => {
    setPage((prevPage) => prevPage - 1);
  };

  React.useEffect(() => {
    const debouncedRefetch = debounce(refetch, 500);
    debouncedRefetch({ page: page, size: size, ...filterQuery });

    return () => {
      debouncedRefetch.cancel();
    };
  }, [debouncedSearchTerm, refetch, filterQuery, page, size]);

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
    setPage(0);
  };

  React.useEffect(() => {
    refetch({ page: page, size: size, ...filterQuery });
  }, [fetchdata]);

  React.useEffect(() => {
    let timer;

    if (fetchdata) {
      timer = setTimeout(() => {
        dispatch(setRefetch(false));
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, fetchdata]);
  const handleNexts = () => {
    setPage((prevPage) => prevPage + 1);
    // setChangePage(true)
  };

  const previousPage = () => {
    setPage((prevPage) => prevPage - 1);
    // setChangePage(true)
  };

  const total = React.useMemo(() => {
    return (page + 1) * 10;
  }, [page]);
  const handeADD = () => {
    navigate('/master-data/create-product-price');
  };
  const goToPageLast = () => {
    setPage(pageCount - 1);
  };

  const goToPageFirst = () => {
    setPage(0);
  };

  const gotoPage = () => {
    setPage(0);
  };
  let content;
  if (isLoading) {
    content = <PageLoader loading={isLoading} />;
  } else if (systemParams) {
    content = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1.1 }}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mt="6em"
          ml="2em"
          mr="2em"
          mb={showFilter ? '1em' : '2em'}
        >
          <Heading as={'h6'} size={'sm'}>
            Master Product Price
          </Heading>
          <Stack direction="row" spacing={4} mr="0">
            <Button
              leftIcon={<MdFilterList color={showFilter ? '#065BAA' : ''} />}
              colorScheme="#231F20"
              variant="outline"
              size={'sm'}
              color={showFilter ? '#065BAA' : ''}
              onClick={showFilterBtn}
            >
              Apply Filter
            </Button>
            <CustomModal
              showModalButtonText="Import"
              modalHeader="Import Excel File"
              modalBody="Import Excel File"
            />
            <Export params={filterQuery} page={0} size={totalCount} />
            {/* <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Export 
                    </Button> */}
            <Button
              variant="ClaimBtn"
              leftIcon={<AiOutlinePlusCircle />}
              colorScheme="#231F20"
              size={'sm'}
              color="white"
              onClick={handeADD}
            >
              Add Proudct Price
            </Button>
          </Stack>
        </Box>
        {showFilter && (
          <motion.div
            initial={{ y: -55, zIndex: 999 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Box
              w={{ base: '100%', md: '70%' }}
              display={'flex'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              gap="8px"
              mr="2em"
              ml="2em"
              mb="1em"
              mt={'1em'}
            >
              <motion.Box
                w="100%"
                animate={{
                  y: 0,
                  opacity: 0.5,
                  transition: {
                    type: 'spring',
                    stiffness: 200,
                    delay: 0.5,
                    duration: 0.5,
                    staggerChildren: true,
                    damping: 40,
                  },
                }}
                initial={{
                  opacity: 1,
                  y: '-100vh',
                }}
              >
                <Input
                  fontStyle={'italic'}
                  variant={'custom'}
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  name="productCode"
                  placeholder={'Search by product code'}
                  bg="#ebebeb"
                  borderRadius={'5px'}
                  sx={{
                    '&::placeholder': {
                      color: 'gray',
                      fontStyle: 'italic',
                      fontSize: '12px',
                    },
                  }}
                  textTransform={'uppercase'}
                  _placeholder={{ textTransform: 'lowercase' }}
                />
              </motion.Box>
              <motion.Box
                w="100%"
                animate={{
                  y: 0,
                  opacity: 0.5,
                  transition: {
                    type: 'spring',
                    stiffness: 250,
                    delay: 0.6,
                    duration: 0.5,
                    staggerChildren: true,
                    damping: 40,
                  },
                }}
                initial={{
                  opacity: 1,
                  y: '-100vh',
                }}
              >
                <Select
                  placeholder="Select by Traveller Type"
                  backgroundColor={
                    filterQuery?.travellerType === '' ? '#ebebeb' : '#e8f0fe'
                  }
                  _placeholder={{
                    color: 'grey',
                  }}
                  style={{
                    fontSize: '12px',
                    fontStyle: 'italic',
                    fontWeight: 'normal',
                  }}
                  sx={{
                    '&::placeholder': {
                      color: 'gray',
                      fontStyle: 'italic',
                      fontSize: '12px',
                    },
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
              </motion.Box>
              <motion.Box
                w="100%"
                animate={{
                  y: 0,
                  opacity: 0.5,
                  transition: {
                    type: 'spring',
                    stiffness: 300,
                    delay: 0.7,
                    duration: 0.5,
                    staggerChildren: true,
                    damping: 40,
                  },
                }}
                initial={{
                  opacity: 1,
                  y: '-100vh',
                }}
              >
                <Select
                  placeholder="Select by Plan Type"
                  backgroundColor={
                    filterQuery?.planType === '' ? '#ebebeb' : '#e8f0fe'
                  }
                  style={{
                    fontSize: '12px',
                    fontStyle: 'italic',
                    fontWeight: 'normal',
                  }}
                  _placeholder={{
                    color: 'grey',
                  }}
                  sx={{
                    '&::placeholder': {
                      color: 'gray',
                      fontStyle: 'italic',
                      fontSize: '12px',
                    },
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
              </motion.Box>
              <motion.Box
                w="100%"
                animate={{
                  y: 0,
                  opacity: 0.5,
                  transition: {
                    type: 'spring',
                    stiffness: 300,
                    delay: 0.7,
                    duration: 0.5,
                    staggerChildren: true,
                    damping: 40,
                  },
                }}
                initial={{
                  opacity: 1,
                  y: '-100vh',
                }}
              >
                <Select
                  placeholder="Select by Travel Duration"
                  backgroundColor={
                    filterQuery?.bandType === '' ? '#ebebeb' : '#e8f0fe'
                  }
                  style={{
                    fontSize: '12px',
                    fontStyle: 'italic',
                    fontWeight: 'normal',
                  }}
                  sx={{
                    '&::placeholder': {
                      color: 'gray',
                      fontStyle: 'italic',
                      fontSize: '12px',
                    },
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
              </motion.Box>
              <motion.Box
                w="100%"
                animate={{
                  y: 0,
                  opacity: 0.5,
                  transition: {
                    type: 'spring',
                    stiffness: 350,
                    delay: 0.8,
                    duration: 0.5,
                    staggerChildren: true,
                    damping: 40,
                  },
                }}
                initial={{
                  opacity: 1,
                  y: '-100vh',
                }}
              >
                <Select
                  placeholder="Select by Travel Agent"
                  backgroundColor={
                    filterQuery?.travelAgent === '' ? '#ebebeb' : '#e8f0fe'
                  }
                  sx={{
                    '&::placeholder': {
                      color: 'gray',
                      fontStyle: 'italic',
                      fontSize: '12px',
                    },
                  }}
                  style={{
                    fontSize: '12px',
                    fontStyle: 'italic',
                    fontWeight: 'normal',
                  }}
                  _placeholder={{
                    color: 'grey',
                  }}
                  defaultValue={''}
                  name="travelAgent"
                  onChange={handleFilter}
                >
                  {travelagents?.map((types, i) => {
                    return (
                      <option value={types.id} key={i}>
                        {types.travelAgentName}
                      </option>
                    );
                  })}
                </Select>
              </motion.Box>
              {/* <Button variant={'outline'} onClick={handleSearch}>Search</Button> */}
            </Box>
          </motion.div>
        )}
        <Styles>
          <Tables
            columns={columns}
            data={systemParams}
            fetchData={fetchData}
            loading={loading}
            pageCount={pageCount}
            totalCount={totalCount}
          />
        </Styles>
        {/* <Link to="/welcome">Back to Welcome</Link> */}
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          w="100%"
          mt="15px"
          pl="2em"
          pr="2em"
        >
          <Box>
            <Box>
              {loading || isFetching ? (
                // Use our custom loading state to show a loading indicator
                <td colSpan="10000">Loading...</td>
              ) : (
                <td
                  colSpan="10000"
                  style={{ fontSize: '12px', fontFamily: 'Mulish' }}
                >
                  Showing {size} of {totalCount} results
                </td>
              )}
            </Box>
            <Box>
              <Box
                display={'flex'}
                justifyContent={'start'}
                alignItems={'center'}
              >
                <label
                  htmlFor="select"
                  style={{
                    paddingRight: '5px',
                    fontSize: '12px',
                    fontFamily: 'Mulish',
                    fontStyle: 'normal',
                  }}
                >
                  Per page
                </label>
                <Select
                  id="pageSize"
                  w="100px"
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    gotoPage(0);
                  }}
                  style={{
                    fontSize: '12px',
                    fontStyle: 'italic',
                    height: '30px',
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  {/* Add more options as needed */}
                </Select>
              </Box>
            </Box>
          </Box>
          <Box>
            <Box display={'flex'} alignItems={'center'}>
              <Button
                isDisabled={page === 0 ? true : false}
                onClick={goToPageFirst}
                bg="white"
                border={'none'}
                _hover={{
                  bg: '#f0eeee',
                  borderRadius: '5px',
                  WebkitBorderRadius: '5px',
                  MozBorderRadius: '5px',
                }}
              >
                <Text
                  as="p"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '12px' }}
                  color="#231F20"
                  pl="2px"
                >
                  {'<<'}
                </Text>
              </Button>
              <Button
                isDisabled={page === 0 ? true : false}
                onClick={previousPage}
                bg="white"
                border={'none'}
                _hover={{
                  bg: '#f0eeee',
                  borderRadius: '5px',
                  WebkitBorderRadius: '5px',
                  MozBorderRadius: '5px',
                }}
              >
                <BiSkipPreviousCircle size="25px" color="black" />
                <Text
                  as="p"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '12px' }}
                  color="#231F20"
                  pl="5px"
                >
                  {'<'}
                </Text>
              </Button>
              {' | '}
              <Button
                isDisabled={Math.ceil(totalCount / size) === page + 1}
                _hover={{
                  bg: '#f0eeee',
                  borderRadius: '5px',
                  WebkitBorderRadius: '5px',
                  MozBorderRadius: '5px',
                }}
                onClick={handleNexts}
                bg="white"
                border={'none'}
              >
                <BiSkipNextCircle size="25px" color="black" />
                <Text
                  fontFamily={'Mulish'}
                  style={{ fontSize: '12px' }}
                  color="#231F20"
                  pl="5px"
                >
                  {'>'}
                </Text>
              </Button>{' '}
              <Button
                isDisabled={pageCount === page ? true : false}
                onClick={goToPageLast}
                bg="white"
                border={'none'}
                _hover={{
                  bg: '#f0eeee',
                  borderRadius: '5px',
                  WebkitBorderRadius: '5px',
                  MozBorderRadius: '5px',
                }}
              >
                <Text
                  as="p"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '12px' }}
                  color="#231F20"
                  pl="5px"
                >
                  {'>>'}
                </Text>
              </Button>
              <Text as="p" style={{ fontSize: '14px', fontFamily: 'Mulish' }}>
                Page{' '}
              </Text>
              <Text as="b" style={{ fontSize: '14px', fontFamily: 'Mulish' }}>
                {page + 1} of {pageCount}
              </Text>{' '}
            </Box>
          </Box>
        </Box>
      </motion.div>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default Polcies;
