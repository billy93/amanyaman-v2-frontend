/* eslint-disable indent */
import React from 'react';
import { useGetPlanTypesQuery } from './planTypeApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import DeleteModal from '../../../components/globalModal';
import {
  usePagination,
  useSortBy,
  useFilters,
  useColumnOrder,
} from 'react-table';
import { useDeletePlanTypesMutation } from './planTypeApiSlice';
import { FaSort } from 'react-icons/fa';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Heading,
  Stack,
  Text,
  Select,
  IconButton,
} from '@chakra-ui/react';
import matchSorter from 'match-sorter';
import { Button } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setStateSelectedt } from '../policy/policySlice';
// import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';
import styled from 'styled-components';
import { useTable, useRowSelect } from 'react-table';
import UseCustomToast from '../../../components/UseCustomToast';
import { CiTrash } from 'react-icons/ci';
import PageLoader from '../../../components/pageLoader';

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
  size,
  pageCount: controlledPageCount,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
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

  // function fuzzyTextFilterFn(rows, id, filterValue) {
  // return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  // }
  const handleAdd = () => {
    navigate('/master-data/plan-types/create');
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.1, duration: 1.1 }}
    >
      <Box mb="1em">
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Heading as={'h6'} size={'sm'}>
            Plan Type
          </Heading>
          <Stack direction="row" spacing={4} m={'2.5'}>
            <Button
              variant="ClaimBtn"
              leftIcon={<AiOutlinePlusCircle />}
              colorScheme="#231F20"
              size={'sm'}
              color="white"
              onClick={handleAdd}
            >
              Add Plan Type
            </Button>
            {/* <button onClick={refetch}>Refresh</button> */}
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
      <Box
        bg="white"
        overflow={'scroll'}
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
                    {/* <div>{column.canFilter ? column.render('Filter') : null} </div> */}

                    {/* <>{column.canFilter ? column.render('Filter') : null}</> */}
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
      </Box>
    </motion.div>
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

const PlanTypes = () => {
  const [size, setSize] = React.useState(5);
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const [page, setPage] = React.useState(0);
  const { showErrorToast, showSuccessToast } = UseCustomToast();
  const [
    deletedPlanTypes,
    { isSuccess, isLoading: processDelete, isError: deletedFailed },
  ] = useDeletePlanTypesMutation();
  const {
    data: { response: planTypes, totalCount } = {},
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetPlanTypesQuery({ page, size: size });

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
          setData(planTypes?.slice(startRow, endRow));
          // Your server could send back total page count.
          // For now we'll just fake it, too
          setPageCount(Math.ceil(totalCount / size));
          setLoading(false);
        }
      }, 1000);
    },
    [planTypes, totalCount, page, size]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        maxWidth: 100,
        minWidth: 50,
        width: 100,
        filter: 'fuzzyText',
        Cell: ({ row }) => (
          <Link
            className="global-td"
            color="#065BAA"
            style={{ textDecoration: 'underline' }}
            to={`/master-data/plan-types/edit/${row.original.id}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.id}
          </Link>
        ),
      },
      {
        Header: 'Name',
        accessor: 'name',
        maxWidth: 200,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Number',
        accessor: 'number',
        maxWidth: 200,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
        Cell: ({ value }) => <div className="global-td">{value}</div>,
      },
      {
        Header: 'Action',
        maxWidth: 100,
        minWidth: 100,
        width: 100,
        accessor: 'delete', // This accessor is not used in the traditional sense
        Cell: ({ row }) => (
          <IconButton
            isLoading={processDelete}
            _hover={{ color: 'white' }}
            icon={<CiTrash color="#065BAA" size={'13px'} />}
            bg="white"
            border="1px solid #ebebeb"
            onClick={() => handleActionClick(row.original.id)}
          />
        ),
      },
      // {
      //   Header: "Create Date",
      //   accessor: "created_date",
      //   maxWidth: 200,
      //   minWidth: 200,
      //   width: 200,
      //   filter: 'fuzzyText',
      // },
      // {
      //   Header: "Update Date",
      //   accessor: "update_date",
      //   maxWidth: 200,
      //   minWidth: 200,
      //   width: 200,
      //   filter: 'fuzzyText',
      // }
    ],
    []
  );

  // const data = React.useMemo(() => tempList);
  // console.log('ddd listParams', listParams)
  React.useEffect(() => {
    refetch({ page, size: size });
  }, [page, refetch, size]);
  const nextPages = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const prevPages = () => {
    setPage((prevPage) => prevPage - 1);
  };
  // eslint-disable-next-line no-unused-vars
  const total = React.useMemo(() => {
    return (page + 1) * size;
  }, [page, size]);
  const goToPageLast = () => {
    setPage(pageCount - 1);
  };

  const goToPageFirst = () => {
    setPage(0);
  };

  const gotoPage = () => {
    setPage(0);
  };
  React.useEffect(() => {
    if (isSuccess) {
      showSuccessToast('Deleted successfully!', 'deletedcitysuccess');
      refetch();
    }
    if (deletedFailed) {
      showErrorToast('Deleted Failed!', 'deletedcityerrors');
    }
  }, [isSuccess, deletedFailed]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [idx, setIdx] = React.useState('');

  const handleActionClick = async (id) => {
    // console.log('handleActionClick', id);
    openModal();
    setIdx(id);
  };

  const handleConfirm = async () => {
    // Place your confirmation logic here
    // console.log('Confirmed!');
    try {
      const res = await deletedPlanTypes(idx);
      if (res?.data) {
        showSuccessToast('successfully to delete the plan type');
      } else {
        showErrorToast('failed to delete the plan type');
      }
    } catch (error) {
      showErrorToast('failed to delete the plan type');
      console.log(error);
    }
  };

  let content;
  if (isLoading) {
    content = <PageLoader loading={isLoading} />;
  } else if (planTypes) {
    // const totalCount = data;
    content = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.9 }}
      >
        <DeleteModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
        >
          <p>Are you sure to delete ?.</p>
        </DeleteModal>
        <Box ml="2em" mr="2em" mt="6em">
          {/* <div>{ console.log('celelng',totalCount)}</div> */}
          <Styles>
            <Tables
              columns={columns}
              data={planTypes}
              fetchData={fetchData}
              loading={loading}
              pageCount={pageCount}
              totalCount={totalCount}
              size={size}
            />
          </Styles>
          {/* <Link to="/welcome">Back to Welcome</Link> */}
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
                    style={{ fontSize: '14px', fontFamily: 'Mulish' }}
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
                      fontSize: '14px',
                      fontFamily: 'Mulish',
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
                  onClick={prevPages}
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
                  onClick={nextPages}
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
export default PlanTypes;
