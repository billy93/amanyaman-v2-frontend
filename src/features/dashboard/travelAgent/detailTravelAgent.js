/* eslint-disable indent */
import React from 'react';
import {
  useGetAgentByIdQuery,
  useGetListAgentDetailQuery,
  useUpdateSelectProductMutation,
} from './travelApiSlice';
import { NavLink, useParams, Link, useNavigate } from 'react-router-dom';
import {
  useTable,
  useRowSelect,
  useFilters,
  useSortBy,
  usePagination,
} from 'react-table';
import styled from 'styled-components';
import matchSorter from 'match-sorter';
import DeleteBtn from './deleteAgent';
import {
  Box,
  Heading,
  Text,
  Center,
  IconButton,
  Input,
  Select,
  Button,
} from '@chakra-ui/react';
import PulseLoader from 'react-spinners/PulseLoader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ChevronRightIcon } from '@chakra-ui/icons';
import 'react-calendar/dist/Calendar.css';
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';
import {
  listDetailAgent,
  setDetailAgent,
  setFormAgent,
  setProductAgentSelection,
  setMessage,
  message,
} from './travelAgentSlice';
import { BsFillPencilFill } from 'react-icons/bs';
// import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';
import { motion } from 'framer-motion';
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

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

const Tables = ({
  columns,
  data,
  loading,
  fetchData,
  pageCount: controlledPageCount,
}) => {
  const dispatch = useDispatch();
  const [filterProductCode, setFilterProductCode] = React.useState('');
  const [filterPremiumPrice, setFilterPremiumPrice] = React.useState('');
  const [filterDiscont1, setFilterDiscount1] = React.useState('');
  const [filterDiscont2, setFilterDiscount2] = React.useState('');
  const [filterDiscont3, setFilterDiscount3] = React.useState('');
  const [filterTotalComm, setFilterTotalComm] = React.useState('');
  const [filterNet, setFilterNet] = React.useState('');
  // eslint-disable-next-line no-unused-vars
  const [updateSelectProduct, { isSuccess, isError }] =
    useUpdateSelectProductMutation();
  // const [pageSize, setPageSize] = useState(5);
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
    selectedFlatRows,
    toggleAllRowsSelected,
    toggleRowSelected,
    // which has only the rows for the active page
    setFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, selectedRowIds, pageSize },
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
  const prev = usePrevious(selectedRowIds);
  React.useEffect(() => {
    toggleAllRowsSelected();
  }, []);

  React.useEffect(() => {
    rows.forEach((row) => {
      const rowData = row.original;
      if (rowData.active) {
        toggleRowSelected(row.id, true);
      }
    });
  }, [rows, toggleRowSelected]);

  React.useEffect(() => {
    if (isSuccess) {
      dispatch(setMessage('Successfully'));
    } else {
      dispatch(setMessage('Error'));
    }
  }, [isSuccess, dispatch]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getValues = (data) => {
    let original = data.map((item) => item.original);
    dispatch(setProductAgentSelection(original));
    console.log('test', original);
  };

  React.useEffect(() => {
    if (JSON.stringify(prev) !== JSON.stringify(selectedRowIds)) {
      getValues(selectedFlatRows);
    }
  }, [prev, selectedRowIds, getValues, selectedFlatRows]);

  // Render the UI for your table

  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  // eslint-disable-next-line no-unused-vars
  const handleRowSelectionChange = (rowId, isSelected) => {
    const selectedRow = rows.find((row) => row.id === rowId);
    if (isSelected) {
      console.log('Row selected:', selectedRow.original.id);
      console.log('row ids', rowId);
      // onRowSelectionChange(rowId, true);
      updateData({ id: selectedRow?.original.id, active: true });
    } else {
      const selectedRow = rows.find((row) => row.id === rowId);
      console.log('row id unselect', selectedRow?.original?.id);
      updateData({ id: selectedRow?.original?.id, active: false });
    }
  };

  // console.log('pageIndex', pageIndex);
  // React.useEffect(() => {
  //   const nextPage = () => {
  //     if (canNextPage) {
  //       gotoPage(pageIndex + 1);
  //     }
  //   };
  // }, [canNextPage]);
  const spring = React.useMemo(
    () => ({
      type: 'spring',
      damping: 50,
      stiffness: 100,
    }),
    []
  );
  const handleFilterByProductCode = (e) => {
    const value = e.target.value || undefined;
    setFilter('productMapping.productCode', value);
    setFilterProductCode(value);
  };
  const handleFilterByPremiumPrice = (e) => {
    const value = e.target.value || undefined;
    setFilter('premiumPrice', value);
    setFilterPremiumPrice(value);
  };
  const handleFilterByDisc1 = (e) => {
    const value = e.target.value || undefined;
    setFilter('commisionLv1', value);
    setFilterDiscount1(value);
  };
  const handleFilterByDisc2 = (e) => {
    const value = e.target.value || undefined;
    setFilter('commisionLv2', value);
    setFilterDiscount2(value);
  };
  const handleFilterByDisc3 = (e) => {
    const value = e.target.value || undefined;
    setFilter('commisionLv3', value);
    setFilterDiscount3(value);
  };
  const handleFilterByTotComm = (e) => {
    const value = e.target.value || undefined;
    setFilter('ajiPrice', value);
    setFilterTotalComm(value);
  };
  const handleFilterByNetoAgent = (e) => {
    const value = e.target.value || undefined;
    setFilter('afterCommisionPrice', value);
    setFilterNet(value);
  };

  // const selectedRowIds = selectedFlatRows.map((row) => row.original.id);
  // React.useEffect(() => {
  //   const selectedRowIds = selectedFlatRows.map((row) => row.original.id);
  //   console.log('Selected row IDs:', selectedRowIds);
  //   const unselectedRowIds = data
  //     .map((row) => row.id)
  //     .filter((id) => !selectedRowIds.includes(id));

  // }, [selectedFlatRows, data]);

  const updateData = async (unselectedRowIds) => {
    const payload = {
      ...unselectedRowIds,
    };
    await updateSelectProduct(payload);
  };
  // consoleunselectedRowIds
  return (
    <>
      <Box
        w={{ base: '100%', md: '90%' }}
        display={'flex'}
        justifyContent={'space-around'}
        aligunselectedRowIds
        gap="4px"
      >
        <Input
          value={filterProductCode}
          onChange={handleFilterByProductCode}
          placeholder={'Search by product code'}
          bg="#ebebeb"
          borderRadius={'5px'}
          _placeholder={{
            color: 'black.500', // Replace with your desired color
            fontStyle: 'italic', // Replace with your desired font style
          }}
        />
        <Input
          value={filterPremiumPrice}
          onChange={handleFilterByPremiumPrice}
          placeholder={'Search by premium price'}
          bg="#ebebeb"
          borderRadius={'5px'}
          _placeholder={{
            color: 'black.500', // Replace with your desired color
            fontStyle: 'italic', // Replace with your desired font style
          }}
        />
        <Input
          value={filterDiscont1}
          onChange={handleFilterByDisc1}
          placeholder={'Search by discount lv 1'}
          bg="#ebebeb"
          borderRadius={'5px'}
          _placeholder={{
            color: 'black.500', // Replace with your desired color
            fontStyle: 'italic', // Replace with your desired font style
          }}
        />
        <Input
          value={filterDiscont2}
          onChange={handleFilterByDisc2}
          placeholder={'Search by discount lv 2'}
          bg="#ebebeb"
          borderRadius={'5px'}
          _placeholder={{
            color: 'black.500', // Replace with your desired color
            fontStyle: 'italic', // Replace with your desired font style
          }}
        />
        <Input
          value={filterDiscont2}
          onChange={handleFilterByDisc2}
          placeholder={'Search by discount lv 2'}
          bg="#ebebeb"
          borderRadius={'5px'}
          _placeholder={{
            color: 'black.500', // Replace with your desired color
            fontStyle: 'italic', // Replace with your desired font style
          }}
        />
        <Input
          value={filterDiscont3}
          onChange={handleFilterByDisc3}
          placeholder={'Search by discount lv 3'}
          bg="#ebebeb"
          borderRadius={'5px'}
          _placeholder={{
            color: 'black.500', // Replace with your desired color
            fontStyle: 'italic', // Replace with your desired font style
          }}
        />
        <Input
          value={filterTotalComm}
          onChange={handleFilterByTotComm}
          placeholder={'Search by total commision'}
          bg="#ebebeb"
          borderRadius={'5px'}
          _placeholder={{
            color: 'black.500', // Replace with your desired color
            fontStyle: 'italic', // Replace with your desired font style
          }}
        />
        <Input
          value={filterNet}
          onChange={handleFilterByNetoAgent}
          placeholder={'Search by net to agenr'}
          bg="#ebebeb"
          borderRadius={'5px'}
          _placeholder={{
            color: 'black.500', // Replace with your desired color
            fontStyle: 'italic', // Replace with your desired font style
          }}
        />
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
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  key={row.id}
                  {...row.getRowProps()}
                  onClick={() => {
                    toggleRowSelected(row?.id);
                    handleRowSelectionChange(row?.id, !row.isSelected);
                  }}
                  style={{
                    background: row.isSelected ? 'whitesmoke' : 'white',
                  }}
                >
                  {row.cells.map((cell) => (
                    <td key={cell.id} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>{' '}
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
          <Box display={'flex'} justifyContent={'end'}>
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
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </Box>
          </Box>
          <span></span>
        </Box>
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

const DetailMasterUser = () => {
  // const currentstep = useSelector()
  const dispatch = useDispatch();
  const detail = useSelector(listDetailAgent);
  const msg = useSelector(message);
  // const [deleteAgent] = useDeleteAgentMutation({
  //   skip: false,
  // });
  const { id } = useParams();
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useGetAgentByIdQuery(id, { refetchOnMountOrArgChange: true });
  const {
    data: { response: listTravell, totalCount } = {},
    isLoading: loaded,
    refetch,
  } = useGetListAgentDetailQuery({ id }, { refetchOnMountOrArgChange: true });
  // const toast = useToast();
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);

  React.useEffect(() => {
    // const dataUserDetail = users?.filter((user) => user.id === parseInt(id))
    if (user) {
      // const data = [user]
      const datauser = {
        ...user,
        allowCreditPayment:
          user !== null && user?.allowCreditPayment === false
            ? ''
            : 'allowCreditPayment',
        city:
          user !== null
            ? [
                {
                  ...user?.city,
                  label: detail?.city?.name,
                  value: detail?.city?.id,
                },
              ]
            : null,
      };
      //  dispatch(setEditAgent(datauser))
      dispatch(setDetailAgent([datauser]));
    }
  }, [user, dispatch, id]);

  const fetchIdRef = React.useRef(0);
  // const {data:listUserAccount,isLoading,isSuccess,isError} = useGetUsersQuery()
  const fetchData = React.useCallback(
    ({ pageSize, pageIndex }) => {
      // This will get called when the table needs new data
      // You could fetch your data from literally anywhere,
      // even a server. But for this example, we'll just fake it.

      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // Set the loading state

      // We'll even set a delay to simulate a server here
      setTimeout(() => {
        // Only update the data if this is the latest fetch
        if (fetchId === fetchIdRef.current) {
          const startRow = pageSize * pageIndex;
          const endRow = startRow + pageSize;
          setData(listTravell?.slice(startRow, endRow));
          // Your server could send back total page count.
          // For now we'll just fake it, too
          setPageCount(Math.ceil(totalCount / pageSize));
        }
      }, 1000);
    },
    [listTravell, totalCount]
  );

  // React.useMemo(() => {
  //     const dataUserDetail = user?.filter((user) => user.id === parseInt(id))
  //   if (dataUserDetail) {
  //       dispatch(setDetailAgent([...dataUserDetail]))
  //     }
  // }, user, dispatch, id)

  React.useEffect(() => {
    refetch({ id });
  }, [msg, id, refetch]);

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

  const handleEditUser = (e) => {
    e.preventDefault();
    const datas = {
      travelAgentName: detail !== null ? detail[0]?.travelAgentName : null,
      travelAgentEmail: detail !== null ? detail[0]?.travelAgentEmail : null,
      travelAgentAddress:
        detail !== null ? detail[0]?.travelAgentAddress : null,
      travelAgentPhone: detail !== null ? detail[0]?.travelAgentPhone : null,
      custcode: detail !== null ? detail[0]?.custcode : null,
      custid: detail !== null ? detail[0]?.custid : null,
      cgroup: detail !== null ? detail[0]?.cgroup : null,
      promoInvoiceRecipents:
        detail !== null ? detail[0]?.promoInvoiceRecipents : null,
      allowCreditPayment:
        detail !== null ? detail[0]?.allowCreditPayment : null,
      city: detail !== null ? detail[0]?.city : null,
    };
    dispatch(setFormAgent(datas));
    // dispatch(setDetailAgent([{...datas}]))
    navigate(`/master-data/edit-agent/${id}`);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Product',
        accessor: 'productMapping.productCode',
        Cell: ({ row }) => (
          <Link
            color="#065BAA"
            style={{ textDecoration: 'underline', color: '#065BAA' }}
            to={`/policies/policy-detail/${row.original.productMapping.productCode}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.productMapping.productCode}
          </Link>
        ),
      },
      {
        Header: 'Premium Price',
        accessor: 'premiumPrice',
      },
      {
        Header: 'Discount Lv1 (IDR)',
        accessor: 'commisionLv1',
      },
      {
        Header: 'Discount Lv2 (IDR)',
        accessor: 'commisionLv2',
      },
      {
        Header: 'Discount Lv3 (IDR)',
        accessor: 'commisionLv3',
      },
      {
        Header: 'Total Commision',
        accessor: 'ajiPrice',
      },
      {
        Header: 'Net to Agent',
        accessor: 'afterCommisionPrice',
      },
    ],
    []
  );

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
  } else if (listTravell) {
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
                      {detail !== null ? detail[0]?.id : null}
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
              <DeleteBtn
                showModalButtonText="Delete"
                modalHeader="Delete Agent"
                modalBody="Confirm delete Agent ?"
              />
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
                  {detail !== null ? detail[0]?.id : null}{' '}
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
                    {'Travel Agent Name'}
                  </Text>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    fontWeight={'400'}
                  >
                    {detail !== null ? detail[0]?.travelAgentName : null}
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
                    {'Travel Agent Phone'}
                  </Text>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                    fontWeight={'normal'}
                  >
                    {detail !== null ? detail[0]?.travelAgentPhone : null}
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
                    {'Trael Agent Email'}
                  </Text>
                  <Text
                    as="p"
                    fontFamily={'Mulish'}
                    style={{ fontSize: '14px' }}
                    color={'#231F20'}
                    fontWeight={'normal'}
                  >
                    {detail !== null
                      ? detail && detail[0]?.travelAgentEmail
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
                Travel Agent Detail
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
                  Travel Agent Address
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {detail ? detail[0]?.travelAgentAddress : '-'}
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
                  Allow Credit Payments
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {detail
                    ? detail[0]?.allowCreditPayment
                      ? 'True'
                      : 'False'
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
                  Cust Id
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {detail ? detail[0]?.custid : '-'}
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
                  Cust Code
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {detail ? detail[0]?.custcode : '-'}
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
                  Cgroup
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {detail ? detail[0]?.cgroup : '-'}
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
                  Proforma Invoice Recipients
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {detail ? detail[0]?.proformaInvoiceRecipients : '-'}
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
                  City
                </Text>
              </Box>
              <Box w={{ md: '70%' }}>
                <Text
                  as="p"
                  size="sm"
                  fontFamily={'Mulish'}
                  style={{ fontSize: '14px' }}
                >
                  {detail && detail[0]?.city ? detail[0]?.city[0]?.name : '-'}
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
              loading={loaded}
              pageCount={pageCount}
              totalCount={totalCount}
            />
          </Styles>
          <Box
            display="flex"
            justifyContent={'flex-end'}
            alignItems={'center'}
            mt="1em"
          >
            {/* <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              w="100%"
            >
              {loaded || isFetching ? (
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
            </Box> */}
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
        </Box>
      </Box>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default DetailMasterUser;
