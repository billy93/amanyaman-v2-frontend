/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useGetProductsQuery } from './masterProductApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import matchSorter from 'match-sorter';
import { usePagination } from 'react-table';
import PulseLoader from 'react-spinners/PulseLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSort } from 'react-icons/fa';
// import ExportData from './export'
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
  Link as Links,
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
  listProduct,
  setMasterProduct,
  listProductSelection,
  setListSelectProduct,
} from './masterProductSlice';
import { MdFilterList } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';
import styled from 'styled-components';
import { useTable, useRowSelect, useFilters, useSortBy } from 'react-table';
// import CustomModal from './customModal';
import { useGetBandTypeQuery } from '../bandType/bandTypesApiSlice';

const Styles = styled.div`
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
  totalCount,
  pageCount: controlledPageCount,
}) => {
  const dispatch = useDispatch();
  const listuser = useSelector(listProduct);
  const selected = useSelector(listProductSelection);
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
    dispatch(setListSelectProduct([]));
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
    pageOptions,
    setFilter,
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
    dispatch(setListSelectProduct(original));
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
    dispatch(setMasterProduct(nextState));
    dispatch(setListSelectProduct([]));
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
              Delete Product
            </Heading>
            <Text
              as="p"
              fontSize={'sm'}
              fontFamily={'Mulish'}
              color={'#231F20'}
              style={{ fontSize: '14px' }}
              fontWeight={'normal'}
            >
              You’re about to delete {selected?.length} products:
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
              Delete Products
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
            <AnimatePresence>
              {rows.map((row, rowIndex) => {
                prepareRow(row);
                const isExpanded = isRowExpanded(rowIndex);

                return (
                  <motion.tr
                    key={rowIndex}
                    {...row.getRowProps()}
                    onClick={() => handleRowClick(rowIndex)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {row.cells.map((cell) => {
                      let cellContent;

                      if (
                        (cell.column.id === 'productPersonalAccidentCover' ||
                          cell.column.id === 'productDescription' ||
                          cell.column.id === 'productMedicalCover') &&
                        cell.value.length > 20
                      ) {
                        cellContent = isExpanded
                          ? cell.value
                          : cell.value.substring(0, 20) + '...';
                      } else {
                        cellContent = cell.render('Cell');
                      }

                      return (
                        <motion.td
                          key={cell.getCellProps().key}
                          {...cell.getCellProps()}
                          className={`${
                            (cell.column.id ===
                              'productPersonalAccidentCover' ||
                              cell.column.id === 'productDescription' ||
                              cell.column.id === 'productMedicalCover') &&
                            isExpanded
                              ? 'expanded'
                              : ''
                          }`}
                        >
                          {cellContent}
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
    </>
  );
};

const MasterUser = () => {
  const dispatch = useDispatch();
  const [filterQuery, setFilterQuery] = useState({
    productCode: '',
    bandType: '',
  });
  const [page, setPage] = React.useState(0);

  const {
    data: { response: listUserAccount, totalCount } = {},
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetProductsQuery({ page, size: 10, ...filterQuery });

  const { data: bandTypes } = useGetBandTypeQuery({ page: 0, size: 9999 });

  const [data, setData] = React.useState([]);
  const prevData = usePrevious(listUserAccount);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchBandType, setSearchBandType] = useState('');
  const [debouncedSearchName, setDebouncedSearchName] = useState('');
  const [debouncedSearchBandType, setDebouncedSearchBandType] = useState('');

  const navigate = useNavigate();
  const fetchIdRef = React.useRef(0);
  // const {data:listUserAccount,isLoading,isSuccess,isError} = useGetUsersQuery()
  const fetchData = React.useCallback(
    ({ pageSize, pageIndex, pageOptions }) => {
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
          // Your server could send back total page count.
          // For now we'll just fake it, too
          setPageCount(Math.ceil(totalCount / pageSize));

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
    if (
      listUserAccount !== null &&
      JSON.stringify(prevData) !== JSON.stringify(listUserAccount)
    ) {
      dispatch(setMasterProduct([...listUserAccount]));
    }
    //  dispatch(setListUser([...listUserAccount]))
  }, [listUserAccount, prevData]);

  const handleAddUser = () => {
    navigate('/master-data/create-master-product');
  };

  React.useEffect(() => {
    if (!showFilter) {
      setSearchBandType('');
      setSearchName('');
      setFilterQuery({
        productCode: '',
        bandType: '',
      });
    }
  }, [showFilter]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Product Id',
        accessor: 'id',
        Cell: ({ row }) => (
          <Link
            color="#065BAA"
            style={{ textDecoration: 'underline' }}
            to={`/master-data/detail-master-product/${row.original.id}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.id}
          </Link>
        ),
      },
      {
        Header: 'Product Code',
        accessor: 'productCode',
      },
      {
        Header: 'Currency',
        accessor: 'currId',
      },
      {
        Header: 'Product Description',
        accessor: 'productDescription',
      },
      {
        Header: 'Personal Accident Cover',
        accessor: 'productPersonalAccidentCover',
      },
      {
        Header: 'Medical Cover',
        accessor: 'productMedicalCover',
      },
      {
        Header: 'Travel Cover',
        accessor: 'productTravelCover',
      },
      {
        Header: 'Product Type',
        accessor: 'planType.name',
        enableGlobalFilter: true,
      },
      {
        Header: 'Additional Week',
        accessor: 'productAdditionalWeek',
        Cell: ({ row }) => (
          <span>
            {row.original.productAdditionalWeek === null
              ? row.original.productAdditionalWeek
              : ''}
          </span>
        ),
      },
      // {
      //   Header: "Additional Week",
      //   accessor: "productAdditionalWeek"
      // },
      // {
      //   Header: "Updated Data",
      //   accessor: "updatedData"
      // }
    ],
    []
  );

  const handleNexts = () => {
    setPage((prevPage) => prevPage + 1);
    // setChangePage(true)
  };

  React.useEffect(() => {
    const debouncedRefetch = debounce(refetch, 500);
    debouncedRefetch({ page: page, size: 10, ...filterQuery });

    return () => {
      debouncedRefetch.cancel();
    };
  }, [debouncedSearchName, refetch, filterQuery, page]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebouncedSearchName(searchName);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchName, filterQuery]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setFilterQuery({
        ...filterQuery,
        productCode: searchName,
      });
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchName]);

  React.useEffect(() => {
    const debouncedRefetch = debounce(refetch, 500);
    debouncedRefetch({ page: page, size: 10, ...filterQuery });

    return () => {
      debouncedRefetch.cancel();
    };
  }, [debouncedSearchBandType, refetch, filterQuery, page]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebouncedSearchBandType(searchBandType);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchBandType, filterQuery]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setFilterQuery({
        ...filterQuery,
        bandType: searchBandType,
      });
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchBandType]);

  const handleSearchTermChange = (e) => {
    const { value } = e.target;
    setSearchName(value);
    setPage(0);
  };

  const handleSearchBandTypeChange = (e) => {
    const { value } = e.target;
    setSearchBandType(value);
    setPage(0);
  };

  const previousPage = () => {
    setPage((prevPage) => prevPage - 1);
    // setChangePage(true)
  };
  const total = React.useMemo(() => {
    return (page + 1) * 10;
  }, [page]);

  let content;
  if (isLoading) {
    content = (
      <Center h="50vh" color="#065BAA">
        <PulseLoader color={'#065BAA'} />
      </Center>
    );
  } else if (listUserAccount) {
    content = (
      <Box pl="2em" pr="2em" mt="6em">
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={showFilter ? '1.5em' : '2em'}
        >
          <Heading as={'h6'} size={'sm'}>
            Product
          </Heading>
          <Stack direction="row" spacing={4}>
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
            {/* <ExportData /> */}

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
              Add Product
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
            mb="1.5em"
          >
            <Input
              value={searchName}
              onChange={handleSearchTermChange}
              placeholder={'Search by product code'}
              bg="#ebebeb"
              borderRadius={'5px'}
              variant={'custom'}
              backgroundColor={searchName === '' ? '#ebebeb' : '#e8f0fe'}
            />
            <Select
              placeholder="Select by Travel Duration"
              backgroundColor={searchBandType === '' ? '#ebebeb' : '#e8f0fe'}
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
              onChange={handleSearchBandTypeChange}
            >
              {bandTypes?.response.map((types, i) => {
                return (
                  <option value={types.id} key={i}>
                    {types.travelDurationName}
                  </option>
                );
              })}
            </Select>
          </Box>
        ) : null}
        <>
          <Styles>
            {
              <Tables
                columns={columns}
                data={data}
                fetchData={fetchData}
                loading={loading}
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
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              w="100%"
            >
              {loading || isFetching ? (
                // Use our custom loading state to show a loading indicator
                <td colSpan="10000">Loading...</td>
              ) : (
                <td colSpan="10000">
                  Showing {total} of {totalCount} results
                </td>
              )}
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
                Page{' '}
                <strong>
                  {page + 1} of {pageCount}
                </strong>{' '}
              </Box>
            </Box>
          </Box>
          {/* <Link to="/welcome">Back to Welcome</Link> */}
        </>
      </Box>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default MasterUser;
