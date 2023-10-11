/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from 'react';
import {
  useGetProductByIdQuery,
  useGetProductTravelAgentQuery,
} from './masterProductApiSlice';
import {
  useUpdateSelectProductMutation,
  useUpdateSelectProductMultpleMutation,
} from '../travelAgent/travelApiSlice';
import PageLoader from '../../../components/pageLoader';
import { NavLink, useParams, useNavigate, Link } from 'react-router-dom';
import {
  useTable,
  useRowSelect,
  useFilters,
  useSortBy,
  usePagination,
} from 'react-table';
import { setMessage, message } from '../travelAgent/travelAgentSlice';
import styled from 'styled-components';
import matchSorter from 'match-sorter';
// import DeleteBtn from './deleteAgent';
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';
import {
  Input,
  Box,
  Heading,
  Text,
  Center,
  Button,
  IconButton,
  Stack,
  Radio,
  RadioGroup,
  Select,
} from '@chakra-ui/react';
import PulseLoader from 'react-spinners/PulseLoader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
import { ChevronRightIcon } from '@chakra-ui/icons';
import 'react-calendar/dist/Calendar.css';
// eslint-disable-next-line no-unused-vars
import UseCustomToast from '../../../components/UseCustomToast';
import { BsFillPencilFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

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
  getSelectAll,
  loading,
  setPageCount,
  isFetching,
  pageCount: controlledPageCount,
  totalCount,
}) => {
  const [updateSelectProduct, { isSuccess }] = useUpdateSelectProductMutation();

  const [updateSelectProductMultple, { isSuccess: success }] =
    useUpdateSelectProductMultpleMutation();
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { showErrorToast, showSuccessToast } = UseCustomToast();
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
    toggleRowSelected,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, selectedRowIds },
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

  // Render the UI for your table
  React.useEffect(() => {
    rows.forEach((row) => {
      const rowData = row.original;
      if (rowData?.productTravelAgent.active) {
        toggleRowSelected(row.id, true);
      }
    });
  }, [rows, toggleRowSelected]);

  React.useEffect(() => {
    if (isSuccess || success) {
      dispatch(setMessage('Successfully'));
    } else {
      dispatch(setMessage('Error'));
      // showErrorToast('Failed', 'detailMasterFailSelect');
    }
  }, [isSuccess, dispatch, success]);

  // eslint-disable-next-line no-unused-vars
  const handleRowSelectionChange = (rowId, isSelected) => {
    const selectedRow = rows.find((row) => row.id === rowId);
    if (isSelected) {
      updateData({
        id: selectedRow?.original?.productTravelAgent?.id,
        active: true,
      });
    } else {
      const selectedRow = rows.find((row) => row.id === rowId);

      updateData({
        id: selectedRow?.original?.productTravelAgent?.id,
        active: false,
      });
    }
  };

  const updateDataMulti = React.useCallback(
    async (select) => {
      let res = await updateSelectProductMultple(select);
      console.log('res', res);
      if (res.data && res.data) {
        showSuccessToast('Success ', `${res.data.id}`);
      } else {
        showErrorToast('Fail', 'failsselect');
      }
    },
    [updateSelectProductMultple]
  );

  const updateData = async (unselectedRowIds) => {
    const payload = {
      ...unselectedRowIds,
    };
    const res = await updateSelectProduct(payload);
    // console.log('res', res);
    if (res.data && res.data.active === true) {
      showSuccessToast('Success to select a product', `${res.data.id}`);
    } else if (res.data && res.data.active === false) {
      showSuccessToast('Success to unselect a product', `${res.data.id}`);
    } else {
      showErrorToast('Fail to select a product', 'failsselect');
    }
  };
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize, pageOptions });
    // setPageCount({pageIndex, pageSize})
  }, [fetchData, pageIndex, pageSize, pageOptions]);

  const handleToggleAllRows = (event) => {
    let idSlect = [];
    const original = rows.map((row) => row.original);
    console.log('ori', getSelectAll());
    // alert('click uncheck all rows');

    toggleAllRowsSelected(event.target.checked);
    getSelectAll().forEach((row) => {
      if (row?.productTravelAgent?.id) {
        idSlect.push(row?.productTravelAgent?.id);
      }
    });
    // console.log('rowIdUnSelect', idSlect);
    if (event.target.checked) {
      updateDataMulti({ ids: idSlect, active: event.target.checked });
    } else {
      updateDataMulti({ ids: idSlect, active: event.target.checked });
    }
  };
  console.log('data table', rows);
  return (
    <>
      <Box
        bg="white"
        overflow={'scroll'}
        mt="0.5em"
        pr="1em"
        pl="1em"
        style={{ maxHeight: '400px', overflowY: 'auto' }}
      >
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    style={{
                      textAlign: column?.id === 'selection' ? 'center' : 'left',
                    }}
                    className="header-cell"
                    key={column.id}
                    {...column.getHeaderProps()}
                  >
                    {column.id !== 'selection' ? (
                      column.render('Header')
                    ) : (
                      <input
                        type="checkbox"
                        checked={
                          Object.keys(selectedRowIds).length === rows.length
                        }
                        onChange={handleToggleAllRows}
                      />
                    )}
                    {/* <div>
                      {column.canFilter ? column.render('Filter') : null}{' '}
                    </div> */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                // <tr
                //   key={row.id}
                //   {...row.getRowProps()}
                //   onClick={() => {
                //     toggleRowSelected(row?.id);
                //     handleRowSelectionChange(row?.id, !row.isSelected);
                //   }}
                //   style={{
                //     background: row.isSelected ? 'whitesmoke' : 'white',
                //   }}
                // >
                //   {row.cells.map((cell) => (
                //     <td key={cell.id} {...cell.getCellProps()}>
                //       {cell.render('Cell')}
                //     </td>
                //   ))}
                // </tr>
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell, index) => {
                    if (index === 0) {
                      return (
                        <td
                          key={cell.id}
                          {...cell.getCellProps()}
                          style={{ cursor: 'pointer', textAlign: 'center' }}
                          onClick={() => {
                            toggleRowSelected(row?.id);
                            handleRowSelectionChange(row?.id, !row.isSelected);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={row.isSelected}
                            onChange={() => {}}
                          />
                        </td>
                      );
                    } else {
                      return (
                        <td key={index} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mt="1em"
          mb="1em"
          mr="10px"
        >
          <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
            <label htmlFor="select" style={{ paddingRight: '5px' }}>
              Per page
            </label>
            <Select
              id="pageSize"
              w="100px"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
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
          <Box display={'flex'} justifyContent={'end'} w="80%">
            <Button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              _hover={{
                bg: '#f0eeee',
                borderRadius: '5px',
                WebkitBorderRadius: '5px',
                MozBorderRadius: '5px',
              }}
              bg="white"
              border={'none'}
            >
              <Text
                fontFamily={'Mulish'}
                style={{ fontSize: '12px' }}
                color="#231F20"
                pl="5px"
              >
                {'<< '}
              </Text>
            </Button>
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              _hover={{
                bg: '#f0eeee',
                borderRadius: '5px',
                WebkitBorderRadius: '5px',
                MozBorderRadius: '5px',
              }}
              bg="white"
              border={'none'}
            >
              <Text
                fontFamily={'Mulish'}
                style={{ fontSize: '12px' }}
                color="#231F20"
                pr="5px"
              >
                {'< '}
              </Text>
              <BiSkipPreviousCircle size="25px" color="black" />
            </Button>
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              _hover={{
                bg: '#f0eeee',
                borderRadius: '5px',
                WebkitBorderRadius: '5px',
                MozBorderRadius: '5px',
              }}
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
                {' >'}
              </Text>
            </Button>
            <Button
              _hover={{
                bg: '#f0eeee',
                borderRadius: '5px',
                WebkitBorderRadius: '5px',
                MozBorderRadius: '5px',
                color: 'white.400',
              }}
              bg="white"
              border={'none'}
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <Text
                fontFamily={'Mulish'}
                style={{ fontSize: '12px' }}
                color="#231F20"
                pl="5px"
              >
                {' >> '}
              </Text>
            </Button>
            <Box display={'flex'} alignItems={'center'}>
              Page{' '}
              <strong>
                {pageIndex + 1} of{' '}
                {getSelectAll() && getSelectAll().length / pageSize}
              </strong>{' '}
            </Box>
          </Box>
          <span></span>
        </Box>
      </Box>
    </>
  );
};

const DetailMasterUser = () => {
  const dispatch = useDispatch();
  const msg = useSelector(message);
  // const [deleteAgent] = useDeleteAgentMutation({
  //   skip: false,
  // });
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [defaultSelected, setDefaultSelected] = React.useState('all');
  const [pageCount, setPageCount] = React.useState(0);
  const [searchAgent, setSearchAgent] = React.useState('');
  const [searchCGroup, setSearchCGroup] = React.useState('');
  const [searchCustCode, setSearchCustCode] = React.useState('');
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
          // console.log('select', defaultSelected);
          if (defaultSelected === 'unselected') {
            const filteredData = listTravell.filter(
              (item) => item.productTravelAgent.active === false
            );
            // setData(filteredData);
            setData(filteredData?.slice(startRow, endRow));
          } else if (defaultSelected === 'selected') {
            const filteredData = listTravell.filter(
              (item) => item.productTravelAgent.active === true
            );
            setData(filteredData?.slice(startRow, endRow));
            // setData(filteredData);
          } else {
            setData(listTravell?.slice(startRow, endRow));
          }

          // Your server could send back total page count.
          // For now we'll just fake it, too
          setPageCount(Math.ceil(totalCount / pageSize));
          // setPageCount(100)
          setLoading(false);
        }
      }, 1000);
    },
    [listTravell, totalCount, defaultSelected]
  );
  const handleEditUser = (e) => {
    e.preventDefault();
    navigate(`/master-data/edit-master-product/${id}`);
  };

  // const prevSelect = usePrevious(defaultSelected);
  // React.useEffect(() => {
  //   // if (prevSelect !== defaultSelected) {
  //   // const nextSelect = listTravell;
  //   if (defaultSelected === 'unselected') {
  //     const filteredData = listTravell.filter(
  //       (item) => item.productTravelAgent.active === false
  //     );
  //     setData(filteredData);
  //   } else if (defaultSelected === 'selected') {
  //     const filteredData = listTravell.filter(
  //       (item) => item.productTravelAgent.active === true
  //     );
  //     setData(filteredData);
  //   } else {
  //     setData(listTravell);
  //   }
  //   // }
  // }, [defaultSelected, prevSelect, listTravell]);

  React.useEffect(() => {
    let timer;

    if (msg) {
      timer = setTimeout(() => {
        dispatch(setMessage(null));
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, msg]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'TravelAgent',
        accessor: 'travelAgentName',
        Cell: ({ row }) => (
          <Link
            className="global-td"
            color="#065BAA"
            style={{ textDecoration: 'underline', color: '#065BAA' }}
            to={`/master-data/detail-product-price/${row.original?.productTravelAgent?.id}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.travelAgentName}
          </Link>
        ),
      },
      {
        Header: 'Cust Code',
        accessor: 'custcode',
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'CGroup',
        accessor: 'cgroup',
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
    ],
    []
  );
  // console.log('productName', user);
  React.useEffect(() => {
    refetch({ id });
  }, [refetch, id]);

  const prevSelect = usePrevious(defaultSelected);
  React.useEffect(() => {
    if (prevSelect !== defaultSelected) {
      setSearchAgent('');
      setSearchCustCode('');
      setSearchCGroup('');
    }
  }, [prevSelect, defaultSelected]);

  const handleSearchAgentName = (e) => {
    const { value } = e.target;
    setSearchAgent(value);
    const strgval = value.toUpperCase();
    const dataf = data.filter((data) => data.travelAgentName.includes(strgval));
    setData(dataf);
  };

  const handleSearchCustCode = (e) => {
    const { value } = e.target;
    setSearchCustCode(value);
    const strgval = value.toUpperCase();
    const dataf = data.filter((data) => data.custcode.includes(strgval));
    setData(dataf);
    // setPage(0);
  };
  const handleSearchCGroup = (e) => {
    const { value } = e.target;
    setSearchCGroup(value);
    const strgval = value.toUpperCase();
    const dataf = data.filter((data) => data.cgroup.includes(strgval));
    setData(dataf);
    // setPage(0);
  };
  const getSelectAll = () => {
    return listTravell && listTravell;
  };
  console.log('listTravell', listTravell);
  let content;
  if (isLoading) {
    content = <PageLoader loading={isLoading} />;
  } else if (user !== null || listTravell) {
    content = (
      <Box>
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
            <Box w="100%" pt="15px" pl="0.5em">
              <Breadcrumb
                spacing="8px"
                separator={<ChevronRightIcon color="gray.500" />}
              >
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink
                    as={NavLink}
                    to="/master-data/master-products"
                  >
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
                      Detail Master Proudct
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
        <Box display={'flex'} gap="10px" pr="1.5em" pl="1.5em">
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
                  pb="18px"
                  pt="18px"
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
                  pb="18px"
                  pt="18px"
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
                  pt="18px"
                  pb="18px"
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
                    {user !== null ? user && user?.code : null}
                  </Text>
                </Box>
                <Box
                  pt="18px"
                  pb="18px"
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
                  pt="18px"
                  pb="18px"
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
                      ? user && user?.productAdditionalWeek?.productCode
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
          // border={'1px solid #ebebeb'}
          pr="1em"
          pl="1em"
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
          <RadioGroup
            onChange={setDefaultSelected}
            value={defaultSelected}
            style={{ fontSize: '12px', fontFamily: 'Mulish' }}
          >
            <Stack direction="row" pl="0.5em" pt="1em" className="global-td">
              <Radio value="all">
                <Text fontSize={'sm'} className="global-td">
                  Show All
                </Text>
              </Radio>
              <Radio value="selected">
                <Text fontSize={'sm'} className="global-td">
                  Show Only Selected
                </Text>
              </Radio>
              <Radio value="unselected">
                <Text fontSize={'sm'} className="global-td">
                  Show Only Unselected
                </Text>
              </Radio>
            </Stack>
          </RadioGroup>
          <Box
            w={{ base: '100%', md: '50%' }}
            display={'flex'}
            justifyContent={'space-around'}
            alignItems={'center'}
            gap="4px"
            mr="2em"
            pl="0.5em"
            pt="1em"
          >
            <Input
              variant={'custom'}
              value={searchAgent}
              onChange={handleSearchAgentName}
              name="travelAgentName"
              placeholder={'Search by Agentname'}
              bg="#ebebeb"
              borderRadius={'5px'}
              textTransform={'uppercase'}
              _placeholder={{ textTransform: 'lowercase' }}
              sx={{
                '&::placeholder': {
                  color: 'gray',
                  fontStyle: 'italic',
                  fontSize: '12px',
                },
              }}
            />
            <Input
              variant={'custom'}
              value={searchCustCode}
              onChange={handleSearchCustCode}
              name="custCode"
              placeholder={'Search by Cust Code'}
              bg="#ebebeb"
              borderRadius={'5px'}
              textTransform={'uppercase'}
              _placeholder={{ textTransform: 'lowercase' }}
              sx={{
                '&::placeholder': {
                  color: 'gray',
                  fontStyle: 'italic',
                  fontSize: '12px',
                },
              }}
            />
            <Input
              variant={'custom'}
              value={searchCGroup}
              onChange={handleSearchCGroup}
              name="group"
              placeholder={'Search by CGroup'}
              bg="#ebebeb"
              borderRadius={'5px'}
              textTransform={'uppercase'}
              _placeholder={{ textTransform: 'lowercase' }}
              sx={{
                '&::placeholder': {
                  color: 'gray',
                  fontStyle: 'italic',
                  fontSize: '12px',
                },
              }}
            />
          </Box>
          <Styles>
            <Tables
              columns={columns}
              data={data}
              fetchData={fetchData}
              loading={loading}
              pageCount={pageCount}
              totalCount={totalCount}
              getSelectAll={getSelectAll}
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
