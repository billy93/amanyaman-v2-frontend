import React, { useState } from 'react';
import { useGetProductPriceQuery } from "./productPriceApi"
import { Link, useNavigate } from "react-router-dom";
import { useGetBandTypeQuery } from '../bandType/bandTypesApiSlice'
import { useGetPlanTypesQuery } from '../planType/planTypeApiSlice'
import { useGetTravelAgentQuery } from '../travelAgent/travelApiSlice'
import { useGetListAreaGroupQuery } from '../group-area/listApiSlice'
import { useGetTravellerTypesQuery } from "../travellerType/travellerTypesApiSlice"
import Table, { usePagination,useSortBy, useFilters, useColumnOrder } from "react-table";
import PulseLoader from 'react-spinners/PulseLoader'
import {FaChevronUp, FaSort} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { debounce } from 'lodash';
import {
  useToast,
  Select,
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
  Tfoot,
  LinkOverlay,
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
  AbsoluteCenter,
  Input
} from '@chakra-ui/react'
import matchSorter from 'match-sorter'
import { Button } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import {MdLogin,MdFilterList,MdWarning} from 'react-icons/md'
import {AiOutlineClose} from 'react-icons/ai'
import {BsFillTrashFill} from 'react-icons/bs'
import {AiOutlinePlusCircle} from 'react-icons/ai'
import {BiSkipPreviousCircle,BiSkipNextCircle} from 'react-icons/bi'
import styled from "styled-components";
import { useTable, useRowSelect } from "react-table";
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';

const Styles = styled.div`
  padding: 1rem;

  table {
    width:100%;
    border-spacing: 0;
    border-top: 1px solid #ebebeb;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th{
    background-color: #fff;
    color: #231F20;
    padding: 13px 15px;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    text-align: left;
    white-space: nowrap;
    font-weight: bold;
    min-width: 40px;
    vertical-align: bottom;
    background-clip: padding-box;
    font-family:"Mulish";
    },
    td {
      background-color: #fff;
      font-family:"Mulish";
      color: #231F20;
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
  column: { filterValue, preFilteredRows, setFilter,Header },
}) {
  
  return (
    <input
      style={{color:"#231F20",fontFamily:'Mulish', fontWeight:'500', padding:"5px",fontSize:"13px",border:"1px solid #ebebeb",borderRadius:"5px", background:"#ebebeb"}}
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      _placeholder={{ opacity: 1, color: '#231F20' }} fontFamily={'Mulish'} fontWeight={'500'}
      placeholder={`Search by ${Header} `}
    />
  )
}
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val
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
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
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
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
     <input type="date"
        width="100%"
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
                                    />
  )
}

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
function shuffle(arr) {
  arr = [...arr]
  const shuffled = []
  while (arr.length) {
    const rand = Math.floor(Math.random() * arr.length)
    shuffled.push(arr.splice(rand, 1)[0])
  }
  return shuffled
}
// fuzzyTextFilterFn.autoRemove = val => !val

const Tables = ({
  columns,
  data,
  fetchData,
  loading,
  totalCount,
  pageCount: controlledPageCount}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [showFilter,setShowFilter] = React.useState(false)
    const [pages]= React.useState(0)
    const {
        data: systemParams,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        response,
        extra
    } = useGetProductPriceQuery({ page:0, size: 10 }, {
      onSuccess: (response, { requestId }, meta) => {
        const totalCount = response.headers.get('X-Total-Count');
      // handleSuccess(totalCount); // Update the total count in the component state
      return response;
    },
    })
    const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )
const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )
  const showFilterBtn = () => {
    setShowFilter(!showFilter)
  }

   const onOpenModal = () => {
        onOpen()
        // getSelectedRows()
 }
     const cancelDelete = () => {
     onClose()
 }
    const deletedUser = () => {
    //  dispatch(setMasterUser([]))
     onOpen()
    //  const rowIds = listuser?.map((item,i) =>i);
    //  rowIds.forEach(id => toggleRowSelected(id, false));
 }
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
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize,selectedRowIds },
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
      filterTypes
    },
    useColumnOrder,
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
      );
  const prev = usePrevious(selectedRowIds)
  React.useEffect(() => {
      toggleAllRowsSelected();
  }, []);
    
  
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize,pageOptions })
  }, [fetchData, pageIndex, pageSize,pageOptions])

    const spring = React.useMemo(
    () => ({
      type: 'spring',
      damping: 50,
      stiffness: 100,
    }),
    []
  )

  // function fuzzyTextFilterFn(rows, id, filterValue) {
  // return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  // }
 
    const handleAdd = (e) => {
        e.preventDefault()
        navigate('/master-data/create-product-price')
    }
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
      <Box bg="white" overflow={'scroll'} p="3">
      <table {...getTableProps()} className='my-table'>
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
                  style={{ 
                            // backgroundColor: 'red',
                            fontWeight: 'bold',
                            textAlign: 'left',
                            padding: '10px',
                            fontFamily: 'Mulish',
                            fontSize: '14px'
                          }}
                  >
                    <div {...column.getSortByToggleProps()} style={{display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer"}} >
                    {column.render('Header')}
                    <Box>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <Box><FaSort color='#065BAA' size="14px" style={{paddingLeft:"4px"}} /></Box>
                          : <Box><FaSort color='#065BAA' size="14px" style={{paddingLeft:"4px"}} /></Box>
                        : ''}
                    </Box>
                  </div>
                  {/* <div>{column.canFilter ? column.render('Filter') : null} </div> */}
                      {showFilter ? <>{column.canFilter ? column.render('Filter') : null}</> : null }
                </motion.th>
                
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} >
           {rows.map((row, rowIndex) => {
          prepareRow(row);
          const isExpanded = isRowExpanded(rowIndex);

          return (
            <React.Fragment key={rowIndex}>
              <tr {...row.getRowProps()} onClick={() => handleRowClick(rowIndex)}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className={`${cell.column.id === 'value' && isExpanded ? 'expanded' : ''}`}
                  >
                    {cell.column.id === 'value' && cell.value.length > 30
                      ? (isExpanded ? cell.value : cell.value.substring(0, 30) + '...')
                      : cell.render('Cell')}
                  </td>
                ))}
              </tr>
            </React.Fragment>
          );
        })}
        <tr>
              {loading ? (
                // Use our custom loading state to show a loading indicator
                <td colSpan="10000">Loading...</td>
              ) : (
                <td colSpan="10000">
                    Showing {page.length} of ~{totalCount}{' '}
                  results
                </td>
              )}
            </tr>
        </tbody>
        </table>
        </Box>
      
    </>
  );
}

function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

const Polcies = () => {
    const [MasterChecked, setMasterChecked] = useState(false)
    const dispatch = useDispatch()
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [pageCount, setPageCount] = React.useState(0)
    const [count,setCount] = React.useState(0)
    const fetchIdRef = React.useRef(0)
    const [page,setPage] = React.useState(0)
    const [showFilter,setShowFilter] = React.useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const {
        data: travellerTypes,
    } = useGetTravellerTypesQuery({ page:0, size: 9999 })
    const [filterQuery, setFilterQuery] = React.useState({
          productCode:'',
          travellerType:'',
          bandType:'',
          areaGroup:'',
          planType:'',
          travelAgent:'',
    })
    const [paginations,setPagination] = React.useState({
      page: 0,
      size:1000
    })
  const [filterby,setFilterBy] = React.useState({
      travelAgentName: '',
      custCode :''
    })
    const {
        data: {response:systemParams, totalCount}={},
        isLoading,
        isSuccess,
        isError,
        error,
        refetch,
        response,
        extra,
        accessHeaders,
    } = useGetProductPriceQuery({ page:page, size: 10, ...filterQuery})
        const {
              data: bandTypes,
      } = useGetBandTypeQuery({ page: 0, size: 9999 })
      
      const {
              data: grouparea,
      } = useGetListAreaGroupQuery({ page: 0, size: 9999 })

      const {
              data: planTypes,
      } = useGetPlanTypesQuery({ page: 0, size: 9999 })
      
      const {
        data: {response:travelagents} = {},
      } = useGetTravelAgentQuery({ page: 0, size: 9999, ...filterby })
  
    const showFilterBtn = () => {
    setShowFilter(!showFilter)
    }
  React.useEffect(() => {
      if(!showFilter){
        setFilterQuery({
          productCode:'',
          travellerType:'',
          bandType:'',
          areaGroup:'',
          planType:'',
          travelAgent:'',
        })
      }
    },[showFilter])
  console.log('travellerTypes', travelagents)
    const fetchData = React.useCallback(({ pageSize, pageIndex,pageOptions }) => {
    // This will get called when the table needs new data
    // You could fetch your data from literally anywhere,
    // even a server. But for this example, we'll just fake it.

    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current

    // Set the loading state
    setLoading(true)
    
    // We'll even set a delay to simulate a server here
    setTimeout(() => {
      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex
        const endRow = startRow + pageSize
        setData(systemParams.slice(startRow, endRow))
        setCount(pageOptions)
        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(systemParams?.length / pageSize))
          setPagination({
            page:pageIndex,
            size:pageSize
        })
        setLoading(false)
      }
    }, 1000)
    }, [systemParams])
    
  React.useEffect(() => {
    
  if (systemParams && 'totalCount' in systemParams) {
    // Retrieve the value of the "X-Total-Count" header
    const totalCount = systemParams.totalCount;

    // Print the total count
    console.log('cccxxxx',totalCount);
  } else {
    // If the "X-Total-Count" header is not present in the response
    console.log('X-Total-Count header not found.', response);
  }

  }, [data,response])
  
  const handleFilter = (e) => {
    const filters = {
      ...filterQuery,
      [e.target.name]:e.target.value
    }
    setFilterQuery(filters)
  }
  // console.log('query filter',travelagents)
    const columns = React.useMemo(
    () => [
      {
        Header: "Price Id",
        accessor: "id",
        Cell: ({ row }) => (
       
          <Link
            color="#065BAA"
            style={{textDecoration:"underline"}}
            to={`/product-detail/${row.original.id}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.id}
          </Link>
       
    ),
      },
      {
        Header: "Travel Agent",
        accessor: "travelAgent.travelAgentName",
      },
      {
        Header: "Product Detail Code",
        accessor: "productMapping.productCode",
      },
      {
        Header: "Premium Price",
        accessor: "premiumPrice"
      },
      {
        Header: "Discount Lvl 1",
        accessor: "commisionLv1"
      },
      {
        Header: "Discount Lvl 2",
        accessor: "commisionLv2"
      },
      {
        Header: "Discount Lvl 3",
        accessor: "commisionLv3"
      },
      {
        Header: "Total Commission",
        accessor: "totalCommision"
      },
      {
        Header: "Net To Agent",
        accessor: "netToAgent",
        enableGlobalFilter: true, 
      },
    ],
    []
  );


    // const data = React.useMemo(() => tempList);
  //   console.log('ddd listParams', systemParams)
  // React.useEffect(() => {
  //   refetch({ page, size: 10, ...filterQuery })
    
  // }, [page, refetch, filterQuery])
  
  const nextPages = () => {
    setPage(prevPage => prevPage+1)
  }
  const prevPages = () => {
    setPage(prevPage => prevPage-1)
  }
  const handleSearch = () => {
    refetch({page:page,size:10, ...filterQuery})
  }
  
  React.useEffect(() => {
    const debouncedRefetch = debounce(refetch, 500);
    debouncedRefetch({page:page,size:10, ...filterQuery});

    return () => {
      debouncedRefetch.cancel();
    };
  }, [debouncedSearchTerm, refetch,filterQuery,page]);

  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, filterQuery]);
  
  React.useEffect(() => {
    const debouncedSearch = debounce(() => {
      setFilterQuery({
        ...filterQuery,
        productCode:searchTerm
      })
    }, 1000);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  const handleSearchTermChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

    let content;
    if (isLoading) {
        content = <Center h='50vh' color='#065BAA'>
                       <PulseLoader color={"#065BAA"} />
                   </Center>;
    } else if (systemParams) {
      content = (
          <>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt="6em" ml="2em" mr="2em">
                <Heading as={'h6'} size={'sm'}>Master Product Price</Heading>
                <Stack direction='row' spacing={4} m={'2.5'}>
                    <Button leftIcon={<MdFilterList color={showFilter ? '#065BAA' : '' }/>} colorScheme='#231F20' variant='outline' size={'sm'} color={showFilter ? '#065BAA' : '' } onClick={showFilterBtn}>
                        Apply Filter
                    </Button>
                    {/* <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Export 
                    </Button> */}
                    <Button variant="ClaimBtn" leftIcon={<AiOutlinePlusCircle />} colorScheme='#231F20' size={'sm'} color="white">
                        Add Proudct Price 
                    </Button>
                </Stack>
          </Box>
            {
              showFilter && (
                <Box w={{ base: "100%", md: "70%" }} display={'flex'} justifyContent={'space-around'} alignItems={'center'} gap="4px" mr="2em" ml="2em" mt="1em">
                  <Input
                    variant={'custom'}
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    name="productCode"
                    placeholder={"Search by product code"}
                    bg="#ebebeb"
                    borderRadius={'5px'}
                    textTransform={'uppercase'}
                    _placeholder={{textTransform:'lowercase'}}
                  />
                  <Select 
                  placeholder='Select by Traveller Type'
                  backgroundColor={filterQuery?.travellerType ==='' ? '#ebebeb' : '#e8f0fe'} 
                  style={{ fontSize: "14px", fontFamily: "Mulish", fontWeight: "normal" }} _placeholder={{
                    color:"grey"
                  }} defaultValue={''}
                  name="travellerType"
                  onChange={handleFilter}>  
                                  {
                                    travellerTypes?.response.map((types, i) => {
                                      return (
                                        <option value={types.id} key={i}>{types.name}</option>
                                      )
                                    })
                                  }
                </Select>
                <Select
                  placeholder='Select by Plan Type'
                  backgroundColor={filterQuery?.planType ==='' ? '#ebebeb' : '#e8f0fe'} 
                  style={{ fontSize: "14px", fontFamily: "Mulish", fontWeight: "normal" }} _placeholder={{
                    color:"grey"
                  }} defaultValue={''}
                  name="planType"
                  onChange={handleFilter}>  
                                  {
                                    planTypes?.response.map((types, i) => {
                                      return (
                                        <option value={types.id} key={i}>{types.name}</option>
                                      )
                                    })
                                  }
                  </Select>
                <Select
                  placeholder='Select by Travel Duration'
                  backgroundColor={filterQuery?.bandType ==='' ? '#ebebeb' : '#e8f0fe'} 
                  style={{ fontSize: "14px", fontFamily: "Mulish", fontWeight: "normal" }} _placeholder={{
                    color:"grey"
                  }} defaultValue={''}
                  name="bandType"
                  onChange={handleFilter}>  
                                  {
                                    bandTypes?.response.map((types, i) => {
                                      return (
                                        <option value={types.id} key={i}>{types.travelDurationName}</option>
                                      )
                                    })
                                  }
                  </Select>
                <Select
                  placeholder='Select by Travel Agent'
                  backgroundColor={filterQuery?.travelAgent ==='' ? '#ebebeb' : '#e8f0fe'} 
                  style={{ fontSize: "14px", fontFamily: "Mulish", fontWeight: "normal" }} _placeholder={{
                    color:"grey"
                  }} defaultValue={''}
                  name="travelAgent"
                  onChange={handleFilter}>  
                                  {
                                    travelagents?.map((types, i) => {
                                      return (
                                        <option value={types.id} key={i}>{types.travelAgentName}</option>
                                      )
                                    })
                                  }
                  </Select>
                  {/* <Button variant={'outline'} onClick={handleSearch}>Search</Button> */}
                </Box>
                )}
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
            <Box display="flex" justifyContent={'flex-end'} alignItems={'center'} mt="1em" ml="2em" mr="2em">
        <Box>
          <Button onClick={prevPages} isDisabled={page ===0 ? true : false} bg="white" border={'none'} _hover={{
            bg: "#f0eeee",
            borderRadius: "5px",
            WebkitBorderRadius: "5px",
            MozBorderRadius:"5px"
        }}>
            <BiSkipPreviousCircle size="25px" color="black" />
            <Text as="p" fontFamily={'Mulish'} style={{fontSize:"12px"}} color="#231F20" pl="5px">Prev</Text>
        </Button>{' | '}
          <Button onClick={nextPages} bg="white" border={'none'} isDisabled={Math.ceil(totalCount/10) ===page+1}>
            <BiSkipNextCircle size="25px" color="black" />
            <Text fontFamily={'Mulish'} style={{fontSize:"12px"}} color="#231F20" pl="5px">
            Next
            </Text>
          </Button>{' '}
          
        </Box>
        <Box>
          Page{' '}
          <strong>
            {page + 1} of {Math.ceil(totalCount/10)}
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
          </>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default Polcies