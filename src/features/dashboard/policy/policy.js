/* eslint-disable react/no-children-prop */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { useGetPolicyListQuery } from './policyApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import Data from './list.json';
import { debounce } from 'lodash';
import { SlCalender } from 'react-icons/sl';
import PageLoader from '../../../components/pageLoader';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import {
  usePagination,
  useSortBy,
  useFilters,
  useColumnOrder,
} from 'react-table';
import {
  setHistoryForm,
  historyForm,
  userLoginCurrent,
  setCredentials,
} from '../../auth/authSlice';
import { useGetPlanTypesQuery } from '../planType/planTypeApiSlice';
import { FaSort } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useToast,
  Input,
  InputRightElement,
  FormLabel,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Table as TableNew,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Stack,
  Text,
  FormControl,
  InputGroup,
  Center,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import matchSorter from 'match-sorter';
import { Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import policySlice, {
  listPolicy,
  listSelected,
  setStateSelectedt,
  setStatePolicyList,
} from './policySlice';
import { MdFilterList } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';
import styled from 'styled-components';
import { useTable, useRowSelect } from 'react-table';
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

// eslint-disable-next-line react/display-name
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
  size,
  totalCount,
  pageCount: controlledPageCount,
}) => {
  const dispatch = useDispatch();
  const listuser = useSelector(listPolicy);
  const selected = useSelector(listSelected);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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

  const clearSelect = () => {
    dispatch(setStateSelectedt([]));
    onClose();
    const rowIds = listuser?.map((item, i) => i);
    rowIds.forEach((id) => toggleRowSelected(id, false));
  };
  const cancelDelete = () => {
    onClose();
  };
  const deletedUser = () => {
    //  dispatch(setMasterUser([]))
    onOpen();
    //  const rowIds = listuser?.map((item,i) =>i);
    //  rowIds.forEach(id => toggleRowSelected(id, false));
  };
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    toggleAllRowsSelected,
    toggleRowSelected,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex, pageSize, selectedRowIds },
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
  const prev = usePrevious(selectedRowIds);
  React.useEffect(() => {
    // toggleAllRowsSelected();
  }, []);

  React.useEffect(() => {
    if (JSON.stringify(prev) !== JSON.stringify(selectedRowIds)) {
      getValues(selectedFlatRows);
    }
  }, [prev, selectedRowIds]);

  // Render the UI for your table
  const getValues = (data) => {
    let original = data.map((item) => item.original);
    dispatch(setStateSelectedt(original));
  };

  const deletedUserUpdate = (e) => {
    e.preventDefault();
    const nextState = listuser.filter(
      (item) => !selected.some(({ id }) => item.id === id)
    );
    // console.log('nextState', nextState);
    dispatch(setStatePolicyList(nextState));
    dispatch(setStateSelectedt([]));
    onClose();
    toast({
      title: 'Deleted Success',
      status: 'success',
      position: 'top-right',
      duration: 3000,
      isClosable: true,
      variant: 'solid',
    });
  };
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  const spring = React.useMemo(
    () => ({
      type: 'spring',
      damping: 50,
      stiffness: 100,
    }),
    []
  );

  // function fuzzyTextFilterFn(rows, id, filterValue) {
  // return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  // }

  return (
    <>
      <Modal
        size="xl"
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent maxW="56rem">
          <ModalHeader>
            <Heading
              variant="primary"
              as="div"
              size="lg"
              fontFamily={'Mulish'}
              color={'#231F20'}
              style={{ fontSize: '18px' }}
            >
              Delete User
            </Heading>
            <Text
              as="p"
              fontSize={'sm'}
              fontFamily={'Mulish'}
              color={'#231F20'}
              style={{ fontSize: '14px' }}
              fontWeight={'normal'}
            >
              You’re about to delete {selected?.length} users:
            </Text>
          </ModalHeader>
          <ModalCloseButton onClick={clearSelect} />
          <ModalBody pb={6}>
            <TableContainer>
              <TableNew variant={'simple'}>
                <Thead>
                  <Tr>
                    <Th>Username</Th>
                    <Th>Fullname</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selected?.map((item, i) => {
                    return (
                      <Tr key={item.id}>
                        <Td>{item.username}</Td>
                        <Td>{item.fullname}</Td>
                        <Td>{item.email}</Td>
                        <Td>{item.role}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
                <TableCaption textAlign={'left'}>
                  <Text
                    as="p"
                    fontSize={'sm'}
                    style={{ fontSize: '14px' }}
                    fontFamily={'Mulish'}
                  >
                    Deleting these users will remove all of their information
                    from the database. This cannot be undone.
                  </Text>
                </TableCaption>
              </TableNew>
            </TableContainer>
          </ModalBody>

          <ModalFooter>
            <Button onClick={cancelDelete}>Cancel</Button>
            <Button colorScheme="blue" mr={3} onClick={deletedUserUpdate}>
              Delete User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box mb="1em" display="flex" alignItems="center" gap="10px">
        {selected?.length > 0 && (
          <>
            <Text as="p" size="sm">
              {Object.keys(selectedRowIds).length} Selected
            </Text>
            <IconButton
              border="none"
              bg={'white'}
              onClick={clearSelect}
              size="sm"
              icon={<AiOutlineClose size="16px" color="black" />}
            />
            <Box display="flex" gap="5px" alignItems="center">
              <IconButton
                border="none"
                bg={'white'}
                size="sm"
                icon={
                  <BsFillTrashFill
                    size="16px"
                    color="black"
                    onClick={deletedUser}
                  />
                }
              />
              {/* <Text as="p" size="sm">Delete</Text> */}
            </Box>
          </>
        )}
      </Box>
      <Box
        bg="white"
        overflow={'scroll'}
        style={{ maxHeight: '400px', overflowY: 'auto' }}
      >
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <motion.th
                    className="header-cell"
                    {...column.getHeaderProps({
                      layoutTransition: spring,
                      style: {
                        minWidth: column.minWidth,
                      },
                    })}
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
                  </motion.th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {/* {rows.slice(0, 10).map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })} */}
            <AnimatePresence>
              {rows.slice(0, size).map((row, i) => {
                prepareRow(row);
                return (
                  <motion.tr
                    {...row.getRowProps({
                      layoutTransition: spring,
                      exit: { opacity: 0, maxHeight: 0 },
                    })}
                  >
                    {row.cells.map((cell, i) => {
                      return (
                        <motion.td
                          {...cell.getCellProps({
                            layoutTransition: spring,
                          })}
                        >
                          {cell.render('Cell')}
                        </motion.td>
                      );
                    })}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </Box>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              selectedRowIds: selectedRowIds,
              "selectedFlatRows[].original": selectedFlatRows.map(
                (d) => d.original
              )
            },
            null,
            2
          )}
        </code>
      </pre> */}
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
  const tempList = useSelector(listPolicy);
  const login = useSelector(userLoginCurrent);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(5);
  const { data: planTypes } = useGetPlanTypesQuery({ page: 0, size: 9999 });
  const [dateDisplay, setDateDisplay] = React.useState(null);
  const [reset, setReset] = React.useState(false);
  const [filterQuery, setFilterQuery] = React.useState({
    policyNumber: '',
    traveller: '',
    bookingNumber: '',
    planType: '',
    policyStatus: '',
    purchaseDate: null,
  });
  const [filterQueryDebounce, setFilterQueryDebounce] = React.useState({
    policyNumber: '',
    traveller: '',
    bookingNumber: '',
    planType: '',
    policyStatus: '',
    purchaseDate: '',
  });
  const [showFilter, setShowFilter] = React.useState(false);
  const {
    data: { response: listpolicies, totalCount } = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPolicyListQuery({ page, size: size, ...filterQuery });
  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
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
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;
        setData(tempList?.listPolicy.slice(startRow, endRow));

        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(parseInt(totalCount) / pageSize));

        setLoading(false);
      }
    }, 1000);
  }, []);

  // console.log('totalCount', totalCount);
  function formatDateToLong(dateString) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();
    const monthName = monthNames[monthIndex];

    const formattedDate = `${day} ${monthName} ${year}`;
    return formattedDate;
  }
  const showFilterBtn = () => {
    setShowFilter(!showFilter);
  };

  const handleRedirect = (bookingId) => {
    const addStep = {
      ...login,
      historyStep: 3,
    };
    dispatch(setCredentials({ ...addStep }));
    navigate(`/create-quota/search/${bookingId}`);
  };

  const handleRedirectPaymentPage = (link) => {
    console.log('link', link);
    if (link?.paymentLink !== 'Not available') {
      window.open(link?.paymentLink, '_blank', 'noreferrer');
    } else {
      const addStep = {
        ...login,
        historyStep: 3,
      };
      dispatch(setCredentials({ ...addStep }));
      navigate(`/create-quota/search/${link?.bookingId}`);
    }
  };

  const handleRedirectPaymentPageSuccess = (row) => {
    if (row?.planType === 'Individual') {
      navigate(`/policies/detail/${row.policyNumber}/${row.bookingId}`);
    } else {
      navigate(`/policies/detail/${row.bookingId}`);
    }
  };

  function formatDate(dateObj) {
    if (dateObj.day && dateObj.month && dateObj.year) {
      const day = dateObj.day < 10 ? `0${dateObj.day}` : dateObj.day;
      const month = dateObj.month < 10 ? `0${dateObj.month}` : dateObj.month;

      return `${dateObj.year}-${month}-${day}`;
    }

    return 'Invalid date object';
  }
  const selectDate = (date) => {
    const dates = formatDate(date);
    const filters = {
      ...filterQuery,
      purchaseDate: dates,
    };
    // console.log('fil', filters);
    setFilterQuery(filters);
    setDateDisplay(date);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Policy Number',
        accessor: 'policyNumber',
        maxWidth: 400,
        minWidth: 140,
        width: 200,
        filter: 'fuzzyText',
        Cell: ({ row }) => (
          <Link
            color="#065BAA"
            style={{ textDecoration: 'underline', color: '#065BAA' }}
            to={
              row.original.planType === 'Individual'
                ? `/policies/detail/${row.original.policyNumber}/${row.original.bookingId}`
                : `/policies/detail/${row.original.bookingId}`
            }
          >
            <div className="global-td"> {row.original.policyNumber}</div>
            {/* <AiOutlineFileDone size={25} /> */}
          </Link>
        ),
      },
      {
        Header: 'Traveller',
        accessor: 'traveller',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
        Cell: ({ row }) => (
          <Box
            className="global-td"
            onClick={
              row.original.paymentStatus === 'WAITING_FOR_PAYMENT'
                ? () => handleRedirectPaymentPage(row.original)
                : row.original.paymentStatus === 'SUCCESS'
                ? () => handleRedirectPaymentPageSuccess(row.original)
                : () => handleRedirect(row.original.bookingId)
            }
            // to={`/create-quota/search/${row.original.bookingId}`}
            color="#065BAA"
            style={{
              textDecoration: 'underline',
              color: '#065BAA',
              cursor: 'pointer',
            }}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {`${row.original.title} ${row.original.travellerFirstName} ${row.original.travellerLastName}`}
          </Box>
        ),
      },
      {
        Header: 'Booking ID',
        accessor: 'transactionId',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Premium Price',
        accessor: 'totalPrice',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
        Cell: ({ row }) => (
          <Box className="global-td">
            {row?.original?.totalPrice !== null ? (
              <CurrencyFormatter amount={row.original.totalPrice} />
            ) : (
              '-'
            )}
          </Box>
        ),
      },
      {
        Header: 'Plan',
        accessor: 'productName',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Policy Status',
        accessor: 'statusSales',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
        Cell: ({ row }) => (
          <Box className="global-td">
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.statusSales === 'SUCCESS' ? (
              <Box
                style={{
                  padding: '4px 10px',
                  borderColor: 'teal',
                  color: 'teal',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textAlign: 'center',
                  border: '1px solid',
                }}
                border={'1px solid'}
              >
                {'Success'}
              </Box>
            ) : row.original.statusSales === 'UPGRADED' ? (
              <Box
                bg="#ebebeb"
                border={'1px solid'}
                style={{
                  padding: '4px 10px',
                  borderColor: '#b7791f',
                  color: '#b7791f',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textAlign: 'center',
                  border: '1px solid',
                }}
              >
                {'Upgraded'}
              </Box>
            ) : row.original.statusSales === 'UPDATED' ? (
              <Box
                bg="#ebebeb"
                border={'1px solid'}
                style={{
                  padding: '4px 10px',
                  borderColor: '#b7791f',
                  color: '#b7791f',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textAlign: 'center',
                  border: '1px solid',
                }}
              >
                {'Updated'}
              </Box>
            ) : (
              <Box
                border={'1px solid'}
                style={{
                  padding: '4px 10px',
                  borderColor: '#b7791f',
                  color: '#b7791f',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textAlign: 'center',
                  border: '1px solid',
                }}
              >
                {'Pending'}
              </Box>
            )}
          </Box>
        ),
      },
      {
        Header: 'Payment Status',
        accessor: 'paymentStatus',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        Filter: SelectColumnFilter,
        filter: 'includes',
        Cell: ({ row }) => (
          <Box className="global-td">
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.paymentStatus === 'SUCCESS' ? (
              <Box
                border={'1px solid'}
                borderColor={'teal'}
                variant={'outline'}
                style={{
                  padding: '4px 10px',
                  borderColor: 'teal',
                  color: 'teal',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textAlign: 'center',
                  border: '1px solid',
                }}
              >
                {'Success'}
              </Box>
            ) : row.original.paymentStatus === 'WAITING_FOR_PAYMENT' ? (
              <Box
                border={'1px solid'}
                variant={'outline'}
                borderColor="#b7791f"
                style={{
                  padding: '4px 10px',
                  borderColor: '#b7791f',
                  color: '#b7791f',
                  borderRadius: '4px',
                  textAlign: 'center',
                  border: '1px solid',
                }}
              >
                {'Waiting For Payment'}
              </Box>
            ) : (
              <Box
                style={{
                  padding: '4px 10px',
                  borderColor: '#b7791f',
                  color: '#b7791f',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textAlign: 'center',
                  border: '1px solid',
                }}
                border={'1px solid'}
                borderColor={'red'}
                variant={'outline'}
                colorScheme="red"
              >
                {'Pending'}
              </Box>
            )}
          </Box>
        ),
      },
      {
        Header: 'Payment Code',
        accessor: 'paymentCode',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Issued By',
        accessor: 'issuedByFirstName',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
        Cell: ({ row }) => (
          <Box className="global-td">
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.issuedByFirstName} {row.original.issuedByLastName}
          </Box>
        ),
      },
      {
        Header: 'Start Date',
        accessor: 'startDate',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        Filter: SelectDateColumnFilter,
        filter: 'date',
        Cell: ({ row }) => (
          <Box className="global-td">
            {/* <AiOutlineFileDone size={25} /> */}
            {formatDateToLong(row.original.startDate)}
          </Box>
        ),
      },
      {
        Header: 'Purchase Date',
        accessor: 'purchaseDate',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        Filter: SelectDateColumnFilter,
        filter: 'date',
        Cell: ({ row }) => (
          <Box className="global-td">
            {/* <AiOutlineFileDone size={25} /> */}
            {formatDateToLong(row.original.purchaseDate)}
          </Box>
        ),
      },
      {
        Header: 'Ticket Number',
        Cell: ({ row }) => (
          <Box
            className="global-td"
            style={{
              padding: '4px 10px',
              borderColor: 'teal',
              color: 'teal',
              borderRadius: '4px',
              fontWeight: 600,
              textAlign: 'center',
            }}
            border={'1px solid'}
            variant={'outline'}
            colorScheme="teal"
          >
            {'Active'}
          </Box>
        ),
      },
    ],
    []
  );

  React.useEffect(() => {
    refetch({ page, size: size });
  }, [page, size, refetch]);

  const handleFilter = (e) => {
    const filters = {
      ...filterQuery,
      [e.target.name]: e.target.value,
    };
    // console.log('fil', filters);
    setFilterQuery(filters);
    setPage(0);
  };
  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setFilterQueryDebounce(filterQuery);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [filterQuery]);

  React.useEffect(() => {
    const debouncedRefetch = debounce(refetch, 500);
    debouncedRefetch({ page: page, size: size, ...filterQuery });

    return () => {
      debouncedRefetch.cancel();
    };
  }, [refetch, filterQuery, page, size]);

  React.useEffect(() => {
    if (!showFilter) {
      setFilterQuery({
        policyNumber: '',
        traveller: '',
        policyStatus: '',
        planType: '',
        bookingNumber: '',
        purchaseDate: '',
      });
      setDateDisplay(null);
    }
  }, [showFilter, dateDisplay]);

  const handleNexts = () => {
    setPage((prevPage) => prevPage + 1);
    // setChangePage(true)
  };

  const resetFilter = () => {
    setFilterQuery({
      policyNumber: '',
      traveller: '',
      policyStatus: '',
      planType: '',
      bookingNumber: '',
      purchaseDate: '',
    });
    setDateDisplay(null);
  };

  // React.useEffect(() => {
  //   if (reset === true) {
  //     setFilterQuery({
  //       policyNumber: '',
  //       traveller: '',
  //       policyStatus: '',
  //       planType: '',
  //       bookingNumber: '',
  //       purchaseDate: '',
  //     });
  //     setDateDisplay(null);
  //   }
  // }, [reset]);

  console.log('reset', reset);
  const previousPage = () => {
    setPage((prevPage) => prevPage - 1);
    // setChangePage(true)
  };

  const goToPageLast = () => {
    setPage(Math.ceil(totalCount / size) - 1);
  };

  const goToPageFirst = () => {
    setPage(0);
  };

  const gotoPage = () => {
    setPage(0);
  };

  function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    const formatter = new Intl.DateTimeFormat('en-us', { month: 'long' });

    return formatter.format(date);
  }

  const formatInputValue = () => {
    if (!filterQuery) return '';
    return `${filterQuery?.purchaseDate?.day} ${getMonthName(
      filterQuery?.purchaseDate?.month
    )} ${filterQuery?.purchaseDate?.year}`;
  };

  const renderCustomInput = ({ ref }) => (
    <>
      <FormControl
        variant="floating"
        id="first-name"
        isRequired
        fontFamily={'Mulish'}
      >
        <InputGroup id="float-labelss">
          <Input
            readOnly
            ref={ref}
            fontSize={'12px'}
            placeholder=" "
            _placeholder={{ opacity: 1, color: 'gray.500' }}
            value={
              dateDisplay
                ? `${dateDisplay?.day} ${getMonthName(dateDisplay?.month)} ${
                    dateDisplay?.year
                  }`
                : ''
            }
            h="40px"
          />
          <InputRightElement children={<SlCalender color="green.500" />} />
          <FormLabel
            fontSize="12"
            pt="1.5"
            style={{
              transform:
                dateDisplay !== null ? 'translate(0, -6px) scale(0.75)' : '',
              color: dateDisplay !== null ? '#065baa' : '',
              fontStyle: dateDisplay !== null ? 'italic' : 'italic',
              fontSize: dateDisplay !== null ? '12px' : '12px',
              display: dateDisplay !== null ? 'none' : '',
            }}
            fontFamily={'Mulish'}
          >
            Purchase Date
          </FormLabel>
        </InputGroup>
        {/* It is important that the Label comes after the Control due to css selectors */}
      </FormControl>
    </>
  );

  let content;
  if (isLoading) {
    content = <PageLoader loading={isLoading} />;
  } else if (Data) {
    content = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'spring',
          delay: 1.1,
          duration: 1.1,
        }}
      >
        <Box ml="1em" mr="1em" mt="5em">
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            mt="6em"
            ml="1em"
            mr="1em"
            mb={showFilter ? '1em' : '1em'}
          >
            <Heading as={'h6'} size={'sm'}>
              Policies
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

              <Export query={filterQuery} page={0} size={totalCount} />
            </Stack>
          </Box>
          {showFilter && (
            <Box
              w={{ base: '100%', md: '80%' }}
              display={'flex'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              gap="8px"
              mr="0.5em"
              ml="0.5em"
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
                    damping: 30,
                  },
                }}
                initial={{
                  y: '-100vh',
                }}
              >
                <Input
                  variant={'custom'}
                  value={filterQuery?.policyNumber}
                  onChange={handleFilter}
                  name="policyNumber"
                  placeholder={'Search by policy number'}
                  bg={filterQuery?.policyNumber === '' ? '#ebebeb' : '#e8f0fe'}
                  borderRadius={'5px'}
                  _placeholder={{ textTransform: 'lowercase' }}
                  sx={{
                    '&::placeholder': {
                      color: 'gray',
                      fontStyle: 'italic',
                      fontSize: '12px',
                    },
                  }}
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
                    damping: 35,
                  },
                }}
                initial={{
                  opacity: 1,
                  y: '-100vh',
                }}
              >
                <Input
                  variant={'custom'}
                  value={filterQuery?.traveller}
                  onChange={handleFilter}
                  name="traveller"
                  placeholder={'Search by traveller'}
                  bg={filterQuery?.traveller === '' ? '#ebebeb' : '#e8f0fe'}
                  borderRadius={'5px'}
                  _placeholder={{ textTransform: 'lowercase' }}
                  sx={{
                    '&::placeholder': {
                      color: 'gray',
                      fontStyle: 'italic',
                      fontSize: '12px',
                    },
                  }}
                />
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
                <Input
                  variant={'custom'}
                  value={filterQuery?.bookingNumber}
                  onChange={handleFilter}
                  name="bookingNumber"
                  placeholder={'Search by booking number'}
                  bg={filterQuery?.bookingNumber === '' ? '#ebebeb' : '#e8f0fe'}
                  borderRadius={'5px'}
                  _placeholder={{ textTransform: 'lowercase' }}
                  sx={{
                    '&::placeholder': {
                      color: 'gray',
                      fontStyle: 'italic',
                      fontSize: '12px',
                    },
                  }}
                />
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
                    damping: 45,
                  },
                }}
                initial={{
                  opacity: 1,
                  y: '-100vh',
                }}
              >
                <Select
                  placeholder=""
                  backgroundColor={
                    filterQuery?.policyStatus === '' ? '#ebebeb' : '#e8f0fe'
                  }
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
                  value={filterQuery?.policyStatus}
                  defaultValue={''}
                  name="policyStatus"
                  style={{
                    fontSize: '12px',
                    fontStyle: 'italic',
                    fontWeight: 'normal',
                  }}
                  onChange={handleFilter}
                >
                  <option value="">Select Policy status</option>
                  <option value="SUCCESS">Success</option>
                  <option value="PENDING">Pending</option>
                  <option value="UPDATED">Updated</option>
                  <option value="UPGRADED">Upgraded</option>
                </Select>
              </motion.Box>
              <motion.Box
                w="100%"
                animate={{
                  y: 0,
                  opacity: 0.5,
                  transition: {
                    type: 'spring',
                    stiffness: 400,
                    delay: 0.9,
                    duration: 0.5,
                    staggerChildren: true,
                    damping: 50,
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
                  value={filterQuery?.planType}
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
                animate={{
                  y: 0,
                  opacity: 0.5,
                  transition: {
                    type: 'spring',
                    stiffness: 400,
                    delay: 0.9,
                    duration: 0.5,
                    staggerChildren: true,
                    damping: 50,
                  },
                }}
                initial={{
                  opacity: 1,
                  y: '-100vh',
                }}
              >
                <Box
                  bg={dateDisplay !== null ? '#e8f0fe' : '#ebebeb'}
                  style={{ height: '40px' }}
                >
                  <DatePicker
                    value={dateDisplay}
                    onChange={selectDate}
                    inputPlaceholder="Select a date" // placeholder
                    formatInputText={formatInputValue}
                    inputClassName={
                      dateDisplay !== null ? '' : 'my-custom-input'
                    } // custom class
                    renderInput={renderCustomInput}
                    shouldHighlightWeekends
                    style={{
                      backgroundColor:
                        (dateDisplay !== null) !== null ? '#e8f0fe' : '',
                      height: '40px',
                    }}
                  />
                </Box>
              </motion.Box>
              <motion.Box
                animate={{
                  x: 0,
                  opacity: 0.5,
                  transition: {
                    type: 'spring',
                    stiffness: 400,
                    delay: 0.9,
                    duration: 0.5,
                    staggerChildren: true,
                    damping: 50,
                  },
                }}
                initial={{
                  opacity: 1,
                  x: '-100vw',
                }}
              >
                <Button variant={'outline'} onClick={resetFilter}>
                  Reset
                </Button>
              </motion.Box>
            </Box>
          )}
          <Styles>
            <Tables
              columns={columns}
              data={listpolicies}
              fetchData={fetchData}
              loading={loading}
              pageCount={pageCount}
              size={size}
              totalcount={totalCount}
            />
          </Styles>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            w="100%"
            mt="15px"
          >
            <Box>
              <Box>
                {loading ? (
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
                    }}
                  >
                    Per page
                  </label>
                  <Select
                    style={{
                      fontSize: '12px',
                      fontStyle: 'italic',
                      height: '30px',
                    }}
                    id="pageSize"
                    w="100px"
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                      gotoPage(0);
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
                  {/* <BiSkipPreviousCircle size="25px" color="black" /> */}
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
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
                  {/* <BiSkipNextCircle size="25px" color="black" /> */}
                  <Text
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
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
                  {page + 1} of {Math.ceil(totalCount / size)}
                </Text>{' '}
              </Box>
            </Box>
          </Box>
          {/* <Link to="/welcome">Back to Welcome</Link> */}
        </Box>
      </motion.div>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default Polcies;
