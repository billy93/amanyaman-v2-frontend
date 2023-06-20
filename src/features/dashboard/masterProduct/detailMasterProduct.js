/* eslint-disable indent */
import React from 'react';
import {
  useGetProductByIdQuery,
  useGetProductTravelAgentQuery,
} from './masterProductApiSlice';
import { NavLink, useParams, useNavigate, Link } from 'react-router-dom';
import {
  useTable,
  useRowSelect,
  useFilters,
  useSortBy,
  usePagination,
} from 'react-table';
import styled from 'styled-components';
import matchSorter from 'match-sorter';
// import DeleteBtn from './deleteAgent';
import {
  Box,
  Heading,
  Text,
  Center,
  Button,
  IconButton,
} from '@chakra-ui/react';
import PulseLoader from 'react-spinners/PulseLoader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
import { ChevronRightIcon } from '@chakra-ui/icons';
import 'react-calendar/dist/Calendar.css';

import { BsFillPencilFill } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSort } from 'react-icons/fa';

const Styles = styled.div`
  padding-top: 1rem;

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

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid #ebebeb;
      border-right: 1px solid #ebebeb;

      :last-child {
        border-right: 0;
      }
    }
  }
  .pagination {
    padding: 0.5rem;
  }
`;

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
  column: { filterValue, preFilteredRows, Header },
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

fuzzyTextFilterFn.autoRemove = (val) => !val;

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

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    toggleAllRowsSelected,
    // toggleRowSelected,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      pageCount: controlledPageCount,
      autoResetPage: false,
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

  React.useEffect(() => {
    toggleAllRowsSelected();
  }, [toggleAllRowsSelected]);

  // Render the UI for your table

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize, pageOptions });
    // setPageCount({pageIndex, pageSize})
  }, [fetchData, pageIndex, pageSize, pageOptions]);

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
      <Box
        bg="white"
        overflow={'scroll'}
        mt="0.5em"
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
          </tbody>
        </table>
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          mt="1em"
          mb="1em"
          mr="10px"
        >
          <Button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            background="blue"
          >
            {'<<'}
          </Button>
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'< '}
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            {' >'}
          </Button>
          <Button
            background="blue"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </Button>
          <Box display={'flex'} alignItems={'center'}>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </Box>
          <span></span>
        </Box>
      </Box>
    </>
  );
};

const DetailMasterUser = () => {
  // const currentstep = useSelector()
  // const [deleteAgent] = useDeleteAgentMutation({
  //   skip: false,
  // });
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(id, { refetchOnMountOrArgChange: true });
  const { data: { response: listTravell, totalCount } = {}, refetch } =
    useGetProductTravelAgentQuery(id, { refetchOnMountOrArgChange: true });
  // const toast = useToast();
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
      // We'll even set a delay to simulate a server here
      setLoading(true);
      setTimeout(() => {
        // Only update the data if this is the latest fetch
        if (fetchId === fetchIdRef.current) {
          const startRow = pageSize * pageIndex;
          const endRow = startRow + pageSize;
          setData(listTravell?.slice(startRow, endRow));
          // Your server could send back total page count.
          // For now we'll just fake it, too
          setPageCount(Math.ceil(totalCount / pageSize));
          // setPageCount(100)
          setLoading(false);
        }
      }, 1000);
    },
    [listTravell, totalCount]
  );
  const handleEditUser = (e) => {
    e.preventDefault();
    navigate(`/master-data/edit-master-product/${id}`);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'TravelAgent',
        accessor: 'travelAgentName',
        Cell: ({ row }) => (
          <Link
            color="#065BAA"
            style={{ textDecoration: 'underline', color: '#065BAA' }}
            to={`/policies/policy-detail/${row.original.travelAgentName}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.travelAgentName}
          </Link>
        ),
      },
      {
        Header: 'Cust Code',
        accessor: 'custcode',
      },
      {
        Header: 'CGroup',
        accessor: 'cgroup',
      },
    ],
    []
  );
  console.log('productName', user);
  React.useEffect(() => {
    refetch({ id });
  }, [refetch, id]);

  let content;
  if (isLoading) {
    content = (
      <Center h="50vh" color="#065BAA">
        <PulseLoader color={'#065BAA'} />
      </Center>
    );
  } else if (user !== null || listTravell) {
    content = (
      <Box pl="2em" pr="2em">
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mt={{ base: '4em', md: '4em' }}
        >
          <Box
            display="flex"
            justifyContent={'space-between'}
            w="100%"
            borderBottom="1px"
            borderColor={'#ebebeb'}
          >
            <Box w="100%" pt="15px">
              <Breadcrumb
                spacing="8px"
                separator={<ChevronRightIcon color="gray.500" />}
              >
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink as={NavLink} to="/master-data/master-user">
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
                      Travel Agent
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
                      {user !== null ? user?.id : null}
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </Box>
            <Box display={'flex'} alignItems={'center'} gap="5px">
              <IconButton
                _hover={{ color: 'white' }}
                icon={<BsFillPencilFill color="#065BAA" size={'16px'} />}
                bg="white"
                border="1px solid #ebebeb"
                onClick={handleEditUser}
              />
              {/* <IconButton _hover={{color:"white"}} icon={ <CiTrash color="#065BAA" size={'16px'}/>} bg="white" border="1px solid #ebebeb" onClick={handleDeletAgent}/> */}
              {/* <DeleteBtn
                showModalButtonText="Delete"
                modalHeader="Delete Agent"
                modalBody="Confirm delete Agent ?"
              /> */}
            </Box>
          </Box>
        </Box>
        <Box display={'flex'} gap="10px">
          <Box display={'flex'} flexDirection={'column'} mt="1em">
            <Box
              border="1px solid #ebebeb"
              borderRadius={'5px'}
              borderBottom={'none'}
            >
              <Box
                bg="#ebebeb"
                w={{ base: '100%', md: '386px' }}
                p={{ base: '5px', md: '10px' }}
                display="flex"
                justifyContent="space-around"
                alignItems="center"
              >
                <Heading
                  as="h4"
                  variant={'primary'}
                  fontFamily={'Mulish'}
                  style={{ fontSize: '17px' }}
                  color={'#231F20'}
                >
                  {user !== null ? user?.id : null}{' '}
                </Heading>
              </Box>
              <Box
                bg="white"
                w={{ base: '100%', md: '386px' }}
                p={{ md: '10px' }}
              >
                <Box
                  pb="10px"
                  pt="10px"
                  borderBottom={'1px solid #ebebeb'}
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                  justifyContent={'center'}
                >
                  <Text
                    as="b"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                  >
                    {'Product Name'}
                  </Text>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    fontWeight={'400'}
                  >
                    {user !== null ? user?.productName : null}
                  </Text>
                </Box>
                <Box
                  pb="10px"
                  pt="10px"
                  borderBottom={'1px solid #ebebeb'}
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                  justifyContent={'center'}
                >
                  <Text
                    as="b"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                  >
                    {'Plan Type'}
                  </Text>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                    fontWeight={'normal'}
                  >
                    {user !== null ? user?.planType?.name : null}
                  </Text>
                </Box>
                <Box
                  pt="10px"
                  pb="10px"
                  borderBottom={'1px solid #ebebeb'}
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                  justifyContent={'center'}
                >
                  <Text
                    as="b"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                  >
                    {'Product Detail Code'}
                  </Text>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                    fontWeight={'normal'}
                  >
                    {user !== null ? user && user?.productCode : null}
                  </Text>
                </Box>
                <Box
                  pt="10px"
                  pb="10px"
                  borderBottom={'1px solid #ebebeb'}
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                  justifyContent={'center'}
                >
                  <Text
                    as="b"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                  >
                    {'Currency'}
                  </Text>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                    fontWeight={'normal'}
                  >
                    {user !== null ? user && user?.currId : null}
                  </Text>
                </Box>
                <Box
                  pt="10px"
                  pb="10px"
                  borderBottom={'1px solid #ebebeb'}
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                  justifyContent={'center'}
                >
                  <Text
                    as="b"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                  >
                    {'Additional Week'}
                  </Text>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                    fontWeight={'normal'}
                  >
                    {user !== null
                      ? user && user?.productAdditionalWeek?.productName
                      : null}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box w="100%">
            <Box
              bg="white"
              mt="18px"
              p="14px"
              border="1px solid #ebebeb"
              borderRadius={'5px'}
            >
              <Text
                as="b"
                fontFamily={'Mulish'}
                style={{ fontSize: '14px' }}
                color={'#231F20'}
              >
                Product Detail
              </Text>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '10px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Description
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? user?.productDescription : '-'}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '10px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Personal Accident Cover
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? user?.productPersonalAccidentCover : '-'}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '10px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Medical Cover
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? user?.productMedicalCover : '-'}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '10px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Travel Cover
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? user?.productTravelCover : '-'}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '10px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Product Type
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? user?.travellerType.name : '-'}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '10px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Area
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user ? user?.areaGroup?.areaGroupName : '-'}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '10px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Travel Duration
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {user && user?.bandType
                    ? user?.bandType?.travelDurationName
                    : '-'}
                </Text>
              </Box>
            </Box>
            <Box
              w={{ base: '100%' }}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              p={{ base: '4px', md: '10px' }}
              borderBottom={'1px solid #ebebeb'}
            >
              <Box w={{ md: '30%' }}>
                <Text
                  as="b"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                  color={'#231F20'}
                >
                  Product Wording
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {'download'}
                </Text>
              </Box>
            </Box>
            <Box></Box>
          </Box>
        </Box>
        <Box
          border={'1px solid #ebebeb'}
          pt="5px"
          pl="5px"
          mt="1em"
          borderRadius={'5px'}
        >
          <Box
            borderBottom={'1px solid #ebebeb'}
            h="35px"
            display={'flex'}
            alignItems={'center'}
          >
            <Text
              p="10px"
              as="b"
              size={'sm'}
              fontFamily={'Mulish'}
              style={{ fontSize: '14px' }}
            >
              Product
            </Text>
          </Box>
          <Styles>
            <Tables
              columns={columns}
              data={data}
              fetchData={fetchData}
              loading={loading}
              pageCount={pageCount}
              totalCount={totalCount}
            />
          </Styles>
        </Box>
      </Box>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default DetailMasterUser;
