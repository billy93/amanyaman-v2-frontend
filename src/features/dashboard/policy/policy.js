/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { useGetUsersQuery } from './policyApiSlice';
import { Link } from 'react-router-dom';
import Data from './list.json';
import {
  usePagination,
  useSortBy,
  useFilters,
  useColumnOrder,
} from 'react-table';
import PulseLoader from 'react-spinners/PulseLoader';
import { FaSort } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useToast,
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
  Center,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import matchSorter from 'match-sorter';
import { Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listPolicy,
  listSelected,
  setStateSelectedt,
  setStatePolicyList,
} from './policySlice';
import { MdLogin, MdFilterList } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';
import styled from 'styled-components';
import { useTable, useRowSelect } from 'react-table';

const Styles = styled.div`
  padding: 1rem;

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
  pageCount: controlledPageCount,
}) => {
  const dispatch = useDispatch();
  const listuser = useSelector(listPolicy);
  const selected = useSelector(listSelected);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [showFilter, setShowFilter] = React.useState(false);

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
  const showFilterBtn = () => {
    setShowFilter(!showFilter);
  };

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
    page,
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
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  const prev = usePrevious(selectedRowIds);
  React.useEffect(() => {
    toggleAllRowsSelected();
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
    console.log('nextState', nextState);
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
      <Box mb="2em">
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Heading as={'h6'} size={'sm'}>
            Policies
          </Heading>
          <Stack direction="row" spacing={4} m={'2.5'}>
            <Button
              onClick={showFilterBtn}
              leftIcon={<MdFilterList color={showFilter ? '#065BAA' : ''} />}
              colorScheme="#231F20"
              variant="outline"
              size={'sm'}
              color={showFilter ? '#065BAA' : ''}
            >
              Apply Filter
            </Button>
            <Button
              leftIcon={<MdLogin />}
              colorScheme="#231F20"
              variant="outline"
              size={'sm'}
              color="#231F20"
            >
              Export All
            </Button>
          </Stack>
        </Box>
        {/* <Box mb={'3'} bg={'#ffeccc'} border={'1px'} borderColor={'#ffa000'} width={'300px'} height={'100px'} p={'2'} display="flex" justifyContent={'center'} alignItems={'center'}>
                <Box bg="#FFA00">
                    <MdWarning size={'20px'} color="#FFA000"/>
                </Box>
                <Text as={'p'} fontSize='xs' color={'black.200'} p={'3'}>
                        You can only claim policy of Success policy status with maximum 30 days from the end date and no ongoing/successful refund record
                </Text>
            </Box> */}
      </Box>
      <Box bg="white" overflow={'scroll'} p="3">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <motion.th
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
                    {/* <div>{column.canFilter ? column.render('Filter') : null} </div> */}
                    {showFilter ? (
                      <>{column.canFilter ? column.render('Filter') : null}</>
                    ) : null}
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
              {rows.slice(0, 10).map((row, i) => {
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
            <tr>
              {loading ? (
                // Use our custom loading state to show a loading indicator
                <td colSpan="10000">Loading...</td>
              ) : (
                <td colSpan="10000">
                  Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                  results
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </Box>
      <Box
        display="flex"
        justifyContent={'flex-end'}
        alignItems={'center'}
        mt="1em"
      >
        <Box>
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
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
              Prev
            </Text>
          </Button>
          {' | '}
          <Button
            onClick={() => nextPage()}
            disabled={!canNextPage}
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
              Next
            </Text>
          </Button>{' '}
        </Box>
        <Box>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </Box>
        {/* <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
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
  const tempList = useSelector(listPolicy);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

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
        setPageCount(Math.ceil(tempList?.listPolicy.length / pageSize));

        setLoading(false);
      }
    }, 1000);
  }, []);
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
            style={{ textDecoration: 'underline' }}
            to={`/policies/policy-detail/${row.original.policyNumber}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.policyNumber}
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
      },
      {
        Header: 'Booking ID',
        accessor: 'bookingId',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
      },
      {
        Header: 'Product',
        accessor: 'product',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
      },
      {
        Header: 'Status',
        accessor: 'status',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: 'Issued By',
        accessor: 'issuedBy',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
      },
      {
        Header: 'Purchase Date',
        accessor: 'purchaseDate',
        maxWidth: 400,
        minWidth: 200,
        width: 200,
        Filter: SelectDateColumnFilter,
        filter: 'date',
      },
    ],
    []
  );

  // const data = React.useMemo(() => tempList);
  // console.log('ddd', data)
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  let content;
  if (isLoading) {
    content = (
      <Center h="50vh" color="#065BAA">
        <PulseLoader color={'#065BAA'} />
      </Center>
    );
  } else if (Data) {
    content = (
      <Box pl="2em" pr="2em" mt="3em">
        <Styles>
          <Tables
            columns={columns}
            data={data}
            fetchData={fetchData}
            loading={loading}
            pageCount={pageCount}
          />
        </Styles>
        {/* <Link to="/welcome">Back to Welcome</Link> */}
      </Box>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default Polcies;
