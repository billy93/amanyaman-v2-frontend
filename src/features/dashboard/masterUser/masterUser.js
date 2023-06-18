/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useGetUserQuery, useGetRoleQuery } from './userApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import matchSorter from 'match-sorter';
import { usePagination } from 'react-table';
import PulseLoader from 'react-spinners/PulseLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSort } from 'react-icons/fa';
import ExportData from './export';
import { debounce } from 'lodash';
import {
  useToast,
  Select,
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
  Center,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setRefetch,
  refetchdata,
  listUsers,
  setMasterUser,
  listUsersSelection,
  setListUser,
  setFormUser,
} from './masterUserSlice';
import { MdFilterList } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';
import styled from 'styled-components';
import { useTable, useRowSelect, useFilters, useSortBy } from 'react-table';
import CustomModal from './customModal';

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
const Tables = ({
  columns,
  data,
  fetchData,
  loading,
  setPageCount,
  isFetching,
  pageCount: controlledPageCount,
  totalCount,
}) => {
  const dispatch = useDispatch();
  const listuser = useSelector(listUsers);
  const selected = useSelector(listUsersSelection);
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
    dispatch(setMasterUser([]));
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
    page,
    pageOptions,
    // Get the state from the instance
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      pageCount: controlledPageCount,
      filterTypes,
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      // pageCount: controlledPageCount,
    },
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

  const getValues = (data) => {
    let original = data.map((item) => item.original);
    dispatch(setMasterUser(original));
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
    dispatch(setListUser(nextState));
    dispatch(setMasterUser([]));
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
    fetchData({ pageIndex, pageSize, pageOptions });
    // setPageCount({pageIndex, pageSize})
  }, [fetchData, pageIndex, pageSize]);

  console.log('test', pageIndex);

  const spring = React.useMemo(
    () => ({
      type: 'spring',
      damping: 50,
      stiffness: 100,
    }),
    []
  );
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

      <Box bg="white" overflow={'scroll'} p="3">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <motion.th
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
                    {/* <div>{column.canFilter ? column.render('Filter') : null} </div> */}
                    {/* {column.canFilter ? column.render('Filter') : null} */}
                    {/* {column.canFilter ? column.render('Filter') : null} */}
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
                    key={i}
                    {...row.getRowProps({
                      layoutTransition: spring,
                      exit: { opacity: 0, maxHeight: 0 },
                    })}
                  >
                    {row.cells.map((cell, i) => {
                      return (
                        <motion.td
                          key={i}
                          {...cell.getCellProps({
                            layoutTransition: spring,
                          })}
                          style={{
                            // backgroundColor: 'red',
                            fontWeight: 'normal',
                            textAlign: 'left',
                            padding: '10px',
                            fontFamily: 'Mulish',
                            fontSize: '14px',
                          }}
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
              {loading || isFetching ? (
                // Use our custom loading state to show a loading indicator
                <td colSpan="10000">Loading...</td>
              ) : (
                <td colSpan="10000">
                  Showing {page.length} of {totalCount} results
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </Box>
    </>
  );
};

const MasterUser = () => {
  const dispatch = useDispatch();
  const fetchdata = useSelector(refetchdata);
  const [paginations, setPagination] = React.useState({
    page: 0,
    size: 10,
  });
  const [page, setPage] = React.useState(0);
  const [filterby, setFilterBy] = React.useState({
    name: '',
    email: '',
    role: '',
  });
  const {
    data: { response: listUserAccount, totalCount } = {},
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetUserQuery({ page, size: 10, ...filterby });

  const [data, setData] = React.useState([]);
  const prevData = usePrevious(listUserAccount);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [showFilter, setShowFilter] = React.useState(false);
  const [filterName, setFilterName] = React.useState('');
  const [filterEmail, setFilterEmail] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('');
  const [debounceName, setDebounceName] = React.useState('');
  const [debounceEmail, setDebounceEmail] = React.useState('');
  const [debounceRole, setDebounceRole] = React.useState('');

  const { data: rolesData } = useGetRoleQuery();
  const PageInit = React.useCallback(
    (pageSize, pageIndex) => {
      // console.log('page init', pageSize,pageIndex)
      setPagination({
        page: pageIndex,
        size: pageSize,
      });
    },
    [paginations?.page, paginations?.size]
  );
  const navigate = useNavigate();
  const fetchIdRef = React.useRef(0);
  // const {data:listUserAccount,isLoading,isSuccess,isError} = useGetUsersQuery()
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
          const startRow = pageSize * pageIndex;
          const endRow = startRow + pageSize;
          setData(listUserAccount?.slice(startRow, endRow));
          PageInit(pageSize, pageIndex);
          // Your server could send back total page count.
          // For now we'll just fake it, too
          setPageCount(Math.ceil(totalCount / pageSize));
          // setPageCount(100)
          setLoading(false);
        }
      }, 1000);
    },
    [listUserAccount]
  );

  const showFilterBtn = () => {
    setShowFilter(!showFilter);
  };
  React.useEffect(() => {
    if (!showFilter) {
      setFilterBy({
        name: '',
        email: '',
        role: '',
      });
      setFilterRole('');
      setFilterName('');
      setFilterEmail('');
    }
  }, [showFilter]);
  // console.log('uploadFilesMessages 111', uploadFilesMessages ==='success')

  React.useEffect(() => {
    if (
      listUserAccount !== null &&
      JSON.stringify(prevData) !== JSON.stringify(listUserAccount)
    ) {
      dispatch(setListUser([...listUserAccount]));
    }
    //  dispatch(setListUser([...listUserAccount]))
  }, [listUserAccount, prevData]);

  // React.useEffect(() => {
  //  refetch({page,size:10})
  // }, [page])

  React.useEffect(() => {
    const debouncedRefetch = debounce(refetch, 500);
    debouncedRefetch({ page: page, size: 10, ...filterby });

    return () => {
      debouncedRefetch.cancel();
    };
  }, [debounceName, refetch, filterby, page]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebounceName(filterName);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [filterName]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setFilterBy({
        ...filterby,
        name: filterName,
      });
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [filterName]);

  React.useEffect(() => {
    const debouncedRefetch = debounce(refetch, 500);
    debouncedRefetch({ page: page, size: 10, ...filterby });

    return () => {
      debouncedRefetch.cancel();
    };
  }, [debounceEmail, refetch, filterby, page]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebounceEmail(filterEmail);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [filterEmail]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setFilterBy({
        ...filterby,
        email: filterEmail,
      });
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [filterEmail]);

  React.useEffect(() => {
    const debouncedRefetch = debounce(refetch, 500);
    debouncedRefetch({ page: page, size: 10, ...filterby });

    return () => {
      debouncedRefetch.cancel();
    };
  }, [debounceRole, refetch, filterby, page]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebounceRole(filterRole);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [filterRole]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setFilterBy({
        ...filterby,
        role: filterRole,
      });
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [filterRole]);

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

  const columns = React.useMemo(
    () => [
      {
        Header: 'Fullname',
        accessor: 'firstName',
        maxWidth: 400,
        minWidth: 140,
        width: 200,
        headerProps: {
          style: {
            backgroundColor: 'red',
            fontWeight: 'bold',
            textAlign: 'left',
            padding: '8px',
          },
        },
        Cell: ({ row }) => (
          <Link
            color="#065BAA"
            style={{ textDecoration: 'underline', fontSize: '12px' }}
            to={`/master-data/detail-user/${row.original.id}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.firstName} {row.original.lastName}
          </Link>
        ),
      },
      {
        Header: 'Email',
        accessor: 'email',
        maxWidth: 400,
        minWidth: 140,
        width: 200,
        headerClassName: 'custom-header',
      },
      {
        Header: 'Travel Agent',
        accessor: 'travelAgent.travelAgentName',
        maxWidth: 400,
        minWidth: 140,
        width: 200,
      },
      {
        Header: 'Role',
        accessor: 'authorities',
        maxWidth: 400,
        minWidth: 140,
        width: 200,
      },
    ],
    []
  );

  const handleNexts = () => {
    setPage((prevPage) => prevPage + 1);
    // setChangePage(true)
  };

  const previousPage = () => {
    setPage((prevPage) => prevPage - 1);
    // setChangePage(true)
  };

  // const data = React.useMemo(() => tempList);
  // const handleNameDeb =  debounce((value) => {
  //   // Perform filtering logic here
  //   console.log('Filtering by name:', value);
  // }, 00);

  const handleFilterByName = (e) => {
    const { value } = e.target;
    setFilterName(value);
    // handleNameDeb(value)
  };
  const handleFilterByEmail = (e) => {
    const { value } = e.target;
    setFilterEmail(value);
  };
  const handleFilterByRole = (e) => {
    const { value } = e.target;
    setFilterRole(value);
  };

  const handleAddUser = () => {
    const stateUser = {
      login: '',
      firstName: '',
      lastName: '',
      area: '',
      authorities: [],
      travelAgent: '',
    };
    dispatch(setFormUser(stateUser));
    navigate('/master-data/create-user');
  };

  let content;
  if (isLoading) {
    content = (
      <Center h="50vh" color="#065BAA">
        <PulseLoader color={'#065BAA'} />
      </Center>
    );
  } else if (listUserAccount) {
    content = (
      <Box pl="2em" pr="2em" mt="5em">
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Heading as={'h6'} size={'sm'}>
            User
          </Heading>
          <Stack direction="row" spacing={4} m={'2.5'}>
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
            <ExportData />
            <CustomModal
              showModalButtonText="Import"
              modalHeader="Import Excel File"
              modalBody="Import Excel File"
            />
            {/* <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Import 
                    </Button> */}
            <Button
              variant="ClaimBtn"
              leftIcon={<AiOutlinePlusCircle />}
              colorScheme="#231F20"
              size={'sm'}
              color="white"
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </Stack>
        </Box>
        {showFilter ? (
          <Box
            w={{ base: '100%', md: '650px' }}
            display={'flex'}
            justifyContent={'space-around'}
            alignItems={'center'}
            gap="4px"
            mt="1.5em"
          >
            <Input
              value={filterName}
              onChange={handleFilterByName}
              placeholder={'Search by name'}
              bg="#ebebeb"
              borderRadius={'5px'}
              variant={'custom'}
            />
            <Input
              value={filterEmail}
              onChange={handleFilterByEmail}
              placeholder={'Search by email'}
              bg="#ebebeb"
              borderRadius={'5px'}
              variant={'custom'}
            />
            <Select
              placeholder="Select Role"
              style={{
                fontSize: '14px',
                fontFamily: 'Mulish',
                fontWeight: 'normal',
              }}
              _placeholder={{
                color: 'grey',
              }}
              defaultValue={filterRole}
              name="authorities"
              onChange={handleFilterByRole}
            >
              {rolesData?.map((role, i) => {
                return (
                  <option value={role.name} key={i}>
                    {role.name}
                  </option>
                );
              })}
            </Select>
          </Box>
        ) : null}
        <Box bg="white" overflow={'scroll'} p="3">
          <Styles>
            {
              <Tables
                columns={columns}
                data={data}
                fetchData={fetchData}
                loading={loading}
                isFetching={isFetching}
                pageCount={pageCount}
                setPageCount={setPageCount}
                totalCount={totalCount}
              />
            }
          </Styles>
          <Box
            display="flex"
            justifyContent={'flex-end'}
            alignItems={'center'}
            mt="1em"
          >
            <Box>
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
                  Prev
                </Text>
              </Button>
              {' | '}
              <Button
                isDisabled={Math.ceil(totalCount / 10) === page + 1}
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
                  Next
                </Text>
              </Button>{' '}
            </Box>
            <Box>
              Page{' '}
              <strong>
                {page + 1} of {pageCount}
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
          {/* <Link to="/welcome">Back to Welcome</Link> */}
        </Box>
      </Box>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default MasterUser;
