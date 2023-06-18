/* eslint-disable indent */
import React from 'react';
import { useGetTravellerTypesQuery } from './travellerTypesApiSlice';
import { Link } from 'react-router-dom';
import {
  usePagination,
  useSortBy,
  useFilters,
  useColumnOrder,
} from 'react-table';
import PulseLoader from 'react-spinners/PulseLoader';
import { FaSort } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Heading, Stack, Text, Center } from '@chakra-ui/react';
import matchSorter from 'match-sorter';
import { Button } from '@chakra-ui/react';
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
  // Use the state and functions returned from useTable to build your UI
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

  return (
    <>
      <Box mb="1em">
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Heading as={'h6'} size={'sm'}>
            Traveller Type
          </Heading>
          <Stack direction="row" spacing={4} m={'2.5'}>
            {/* <Button variant="ClaimBtn" leftIcon={<AiOutlinePlusCircle />} colorScheme='#231F20' size={'sm'} color="white" onClick={handleAdd}>
                        Add Traveller Type 
                    </Button> */}
            {/* <button onClick={refetch}>Refresh</button> */}
          </Stack>
        </Box>
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
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const [page, setPage] = React.useState(0);
  const {
    data: { response: systemParams, totalCount } = {},
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetTravellerTypesQuery({ page, size: 10 });

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
          setData(systemParams?.slice(startRow, endRow));
          // Your server could send back total page count.
          // For now we'll just fake it, too
          setPageCount(Math.ceil(totalCount / pageSize));
          setLoading(false);
        }
      }, 1000);
    },
    [systemParams, totalCount]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        maxWidth: 200,
        minWidth: 140,
        width: 100,
        filter: 'fuzzyText',
        Cell: ({ row }) => (
          <Link
            color="#065BAA"
            style={{ textDecoration: 'underline' }}
            to={`/master-data/detail-system-params/${row.original.id}`}
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
      },
      {
        Header: 'Description',
        accessor: 'description',
        maxWidth: 200,
        minWidth: 200,
        width: 200,
        filter: 'fuzzyText',
      },
    ],
    []
  );

  React.useEffect(() => {
    refetch({ page, size: 10 });
  }, [page, refetch]);
  const nextPages = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const prevPages = () => {
    setPage((prevPage) => prevPage - 1);
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
  } else if (systemParams) {
    // const totalCount = data;
    content = (
      <Box pl="2em" pr="2em" mt="4.5em">
        {/* <div>{ console.log('celelng',totalCount)}</div> */}
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
        {/* <Link to="/welcome">Back to Welcome</Link> */}
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
                onClick={nextPages}
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
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};
export default Polcies;
