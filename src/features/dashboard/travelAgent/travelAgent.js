/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useGetTravelAgentQuery } from './travelApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import matchSorter from 'match-sorter';
import { usePagination } from 'react-table';
import PageLoader from '../../../components/pageLoader';
import { motion } from 'framer-motion';
import { FaSort } from 'react-icons/fa';
import { debounce } from 'lodash';
import {
  useToast,
  Input,
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
  useDisclosure,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isRefetch,
  setRefetch,
  listAgent,
  setMasterAgent,
  listAgentSelection,
  setListAgent,
  setFormAgent,
} from './travelAgentSlice';
import { MdFilterList } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';
import styled from 'styled-components';
import { useTable, useRowSelect, useFilters, useSortBy } from 'react-table';
import CustomModal from '../../../components/customModal';
// import 'react-table-6/react-table.css';

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

const Tables = ({
  columns,
  data,
  fetchData,
  loading,
  load,
  page,
  size,
  pageCount: controlledPageCount,
}) => {
  const dispatch = useDispatch();
  const listuser = useSelector(listAgent);
  const selected = useSelector(listAgentSelection);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
  const toast = useToast();

  const clearSelect = () => {
    dispatch(setMasterAgent([]));
    onClose();

    const rowIds = data && data?.map((item, i) => i);
    if (rowIds) {
      rowIds.forEach((id) => toggleRowSelected(id, false));
    }
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

    // Get the state from the instance
    state: { selectedRowIds, pageSize, pageIndex },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      pageCount: controlledPageCount,
      filterTypes,
      autorResetPagination: false,
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      // pageCount: controlledPageCount,
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect
  );
  const prev = usePrevious(selectedRowIds);
  React.useEffect(() => {
    toggleAllRowsSelected();
  }, []);

  const getValues = (data) => {
    let original = data.map((item) => item.original);
    dispatch(setMasterAgent(original));
  };

  React.useEffect(() => {
    if (JSON.stringify(prev) !== JSON.stringify(selectedRowIds)) {
      getValues(selectedFlatRows);
    }
  }, [prev, selectedRowIds, getValues, selectedFlatRows]);

  // Render the UI for your table

  const deletedUserUpdate = (e) => {
    e.preventDefault();
    const nextState = listuser?.filter(
      (item) => !selected.some(({ id }) => item.id === id)
    );
    console.log('nextState', nextState);
    dispatch(setListAgent(nextState));
    dispatch(setMasterAgent([]));
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

  React.useEffect(() => {}, [page, size]);

  console.log('ddd', page);
  console.log('ddd size', size);
  console.log('ddd data', data);
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
  // console.log('filters', filters)
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
                    <Th>Fullname</Th>
                    <Th>Email</Th>
                    <Th>Travel Agent</Th>
                    <Th>Role</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selected?.map((item, i) => {
                    return (
                      <Tr key={item.id}>
                        <Td>
                          {item.firstName} {item.lastName}
                        </Td>
                        <Td>{item.email}</Td>
                        <Td>{item.travelAgemt}</Td>
                        <Td>{item.authorities}</Td>
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

      <Box display="flex" alignItems="center" gap="10px">
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
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <motion.th
                    className="header-cell"
                    key={i}
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
                    {/* <div>{column.canFilter ? column.render('Filter') : null} </div> */}
                    {/* {column.canFilter ? column.render('Filter') : null} */}
                    {/* {column.canFilter ? column.render('Filter') : null} */}
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
                    {row.cells.map((cell, i) => (
                      <td
                        key={i}
                        {...cell.getCellProps()}
                        className={isExpanded && isExpanded ? 'expanded' : ''}
                      >
                        {cell?.column.id === 'travelAgentAddress' &&
                        cell?.value?.length > 30
                          ? isExpanded
                            ? cell.value
                            : cell.value.substring(0, 30) + '...'
                          : cell.render('Cell')}
                      </td>
                    ))}
                    {isExpanded && (
                      <tr>
                        <td colSpan={columns.length}>
                          <div>
                            {
                              row.cells.find(
                                (cell) =>
                                  cell.column.id === 'travelAgentAddress'
                              ).value
                            }
                          </div>
                        </td>
                      </tr>
                    )}
                  </tr>
                  {/* {isExpanded && (
                <tr>
                  <td colSpan={columns.length}>
                    <div>{row.cells.find((cell) => cell.column.id === 'travelAgentAddress').value}</div>
                  </td>
                </tr>
              )} */}
                </React.Fragment>
              );
            })}
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

const MasterUser = () => {
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(0);

  // eslint-disable-next-line no-unused-vars
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchAgent, setSearchAgent] = useState('');
  const [debouncedSearchAgent, setDebouncedSearchAgent] = useState('');
  const [searchCustCode, setSearchCustCode] = useState('');
  const [size, setSize] = useState(5);
  const [debouncedSearchCustCode, setDebouncedSearchCustCode] = useState('');
  const [filterby, setFilterBy] = React.useState({
    travelAgentName: '',
    custCode: '',
  });
  const {
    data: { response: listUserAccount, totalCount } = {},
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useGetTravelAgentQuery({ page, size: size, ...filterby });
  const fetchdata = useSelector(isRefetch);
  const prevData = usePrevious(listUserAccount);
  const navigate = useNavigate();
  const fetchIdRef = React.useRef(0);
  const [load, setLoad] = React.useState(false);
  // const {data:listUserAccount,isLoading,isSuccess,isError} = useGetUsersQuery()
  const fetchData = React.useCallback(
    ({ pageSize, pageIndex, pageOptions }) => {
      // This will get called when the table needs new data
      // You could fetch your data from literally anywhere,
      // even a server. But for this example, we'll just fake it.

      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // Set the loading state
      console.log('dddss', pageIndex, pageSize);
      console.log('dddss2', page, size);
      setLoading(true);
      // We'll even set a delay to simulate a server here
      setTimeout(() => {
        // Only update the data if this is the latest fetch
        if (fetchId === fetchIdRef.current) {
          // const startRow = size * page;
          // const endRow = startRow + size;
          const startRow = size * page;
          const endRow = startRow + size;
          console.log('test1', listUserAccount?.slice(startRow, endRow));
          // console.log('test2', listUserAccount?.slice(startRow1, endRow1));
          setData(listUserAccount?.slice(startRow, endRow));
          // Your server could send back total page count.
          // For now we'll just fake it, too
          setPageCount(Math.ceil(totalCount / size));
          // setPageCount(100)
          setLoading(false);
        }
      }, 1000);
    },
    [listUserAccount]
  );

  React.useEffect(() => {
    if (
      listUserAccount !== null &&
      JSON.stringify(prevData) !== JSON.stringify(listUserAccount)
    ) {
      // const startRow = page * 10
      // const endRow = startRow + 10
      // setData(listUserAccount?.slice(startRow, endRow))
      dispatch(setListAgent([...listUserAccount]));
    }
    //  dispatch(setListUser([...listUserAccount]))
  }, [listUserAccount, prevData]);

  React.useEffect(() => {
    refetch({ page, size: size, ...filterby });
  }, [page, filterby, size]);

  React.useEffect(() => {
    fetchData({ page, size: size });
  }, [page, size]);

  const handleAddUser = (e) => {
    e.preventDefault();
    const datas = {
      travelAgentName: '',
      travelAgentEmail: '',
      travelAgentAddress: '',
      travelAgentPhone: '',
      custcode: '',
      custid: '',
      cgroup: '',
      promoInvoiceRecipents: '',
      allowCreditPayment: '',
      city: '',
    };
    dispatch(setFormAgent(datas));
    navigate('/master-data/create-agent');
  };
  React.useEffect(() => {
    if (!showFilter) {
      setSearchAgent('');
      setSearchCustCode('');
      setFilterBy({
        travelAgentName: '',
        custCode: '',
      });
    }
  }, [showFilter]);

  // console.log('listUserAccount', listUserAccount)
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        maxWidth: 100,
        minWidth: 50,
        width: 50,
        Cell: ({ row }) => (
          <Link
            className="global-td"
            color="#065BAA"
            style={{ textDecoration: 'underline' }}
            to={`/master-data/detail-agent/${row.original.id}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.id}
          </Link>
        ),
      },
      {
        Header: 'travel Agent Name',
        accessor: 'travelAgentName',
        maxWidth: 400,
        minWidth: 140,
        width: 200,
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'travel Agent Phone',
        accessor: 'travelAgentPhone',
        maxWidth: 400,
        minWidth: 140,
        width: 200,
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Travel Agent Email',
        accessor: 'travelAgentEmail',
        maxWidth: 400,
        minWidth: 140,
        width: 200,
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Travel Agent Address',
        accessor: 'travelAgentAddress',
        maxWidth: 200,
        minWidth: 140,
        width: 200,
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Commission',
        accessor: 'commission',
        maxWidth: 400,
        minWidth: 140,
        width: 200,
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Payment Type',
        accessor: 'paymentType',
        maxWidth: 400,
        minWidth: 140,
        width: 200,
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Cust Code',
        accessor: 'custcode',
        maxWidth: 200,
        minWidth: 140,
        width: 100,
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Cust Id',
        accessor: 'custid',
        maxWidth: 200,
        minWidth: 140,
        width: 100,
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'CustGroup',
        accessor: 'cgroup',
        maxWidth: 200,
        minWidth: 140,
        width: 100,
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'City',
        accessor: 'city.name',
        maxWidth: 200,
        minWidth: 140,
        width: 100,
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Allow Credit Payment',
        accessor: 'allowCreditPayment',
        maxWidth: 300,
        minWidth: 140,
        width: 200,
        Cell: ({ row }) => (
          <Link color="#065BAA" className="global-td">
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.allowCreditPayment ? 'True' : 'False'}
          </Link>
        ),
      },
    ],
    []
  );

  // const data = React.useMemo(() => tempList);

  const handleNexts = () => {
    setPage((prevPage) => prevPage + 1);
    // setChangePage(true)
  };

  const previousPage = () => {
    setPage((prevPage) => prevPage - 1);
    // setChangePage(true)
  };

  React.useEffect(() => {
    const debouncedRefetch = debounce(refetch, 500);
    debouncedRefetch({ page: page, size: size, ...filterby });

    return () => {
      debouncedRefetch.cancel();
    };
  }, [
    debouncedSearchAgent,
    debouncedSearchCustCode,
    refetch,
    filterby,
    page,
    size,
  ]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebouncedSearchAgent(searchAgent);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchAgent, filterby]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebouncedSearchCustCode(searchCustCode);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchCustCode, filterby]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setFilterBy({
        ...filterby,
        travelAgentName: searchAgent,
      });
      setPage(0);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchAgent]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setFilterBy({
        ...filterby,
        custCode: searchCustCode,
      });
      setPage(0);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchCustCode]);

  const handleSearchAgentName = (e) => {
    const { value } = e.target;
    setSearchAgent(value);
  };

  const handleSearchCustCode = (e) => {
    const { value } = e.target;
    setSearchCustCode(value);
    setPage(0);
  };
  const showFilterBtn = () => {
    setShowFilter(!showFilter);
    setPage(0);
  };

  React.useEffect(() => {
    refetch({ page: page, size: 10, ...filterby });
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

  const handleFetchLoad = (val) => {
    setLoad(val);
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

  const lazyLoad = debounce(handleFetchLoad, 400);
  React.useEffect(() => {
    if (isFetching) {
      lazyLoad(true);
    } else {
      lazyLoad(false);
    }
  }, [isFetching]);

  // eslint-disable-next-line no-unused-vars
  const total = React.useMemo(() => {
    return (page + 1) * size;
  }, [page]);

  let content;
  if (isLoading) {
    content = <PageLoader loading={isLoading} />;
  } else if (listUserAccount) {
    content = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1.1 }}
      >
        <Box pl="2em" pr="2em" mt="6em">
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            mb={showFilter ? '1.5em' : '2em'}
          >
            <Heading as={'h6'} size={'sm'}>
              Travel Agent
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
              {/* <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Export 
                    </Button> */}
              <CustomModal
                showModalButtonText="Import"
                modalHeader="Import Excel File"
                modalBody="Import Excel File"
              />
              <Button
                variant="ClaimBtn"
                leftIcon={<AiOutlinePlusCircle />}
                colorScheme="#231F20"
                size={'sm'}
                color="white"
                onClick={handleAddUser}
              >
                Add Agent
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
                w={{ base: '100%', md: '50%' }}
                display={'flex'}
                justifyContent={'space-around'}
                alignItems={'center'}
                gap="4px"
                mr="2em"
                mb="1em"
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
                    variant={'custom'}
                    value={searchAgent}
                    onChange={handleSearchAgentName}
                    name="travelAgentName"
                    placeholder={'Search by agentname'}
                    bg="#ebebeb"
                    borderRadius={'5px'}
                    textTransform={'uppercase'}
                    sx={{
                      '&::placeholder': {
                        color: 'gray',
                        fontStyle: 'italic',
                        fontSize: '12px',
                      },
                    }}
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
                  <Input
                    variant={'custom'}
                    value={searchCustCode}
                    onChange={handleSearchCustCode}
                    name="custCode"
                    placeholder={'Search by cust code'}
                    bg="#ebebeb"
                    borderRadius={'5px'}
                    textTransform={'uppercase'}
                    sx={{
                      '&::placeholder': {
                        color: 'gray',
                        fontStyle: 'italic',
                        fontSize: '12px',
                      },
                    }}
                    _placeholder={{ textTransform: 'lowercase' }}
                  />
                </motion.Box>
              </Box>
            </motion.div>
          )}
          <Styles>
            {
              <Tables
                columns={columns}
                data={listUserAccount}
                fetchData={fetchData}
                loading={loading}
                load={load}
                pageCount={pageCount}
                setPageCount={setPageCount}
                totalCount={totalCount}
                page={page}
                size={size}
              />
            }
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
        </Box>
      </motion.div>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default MasterUser;
