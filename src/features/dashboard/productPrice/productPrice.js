import React from "react";
import styled from "styled-components";
import {Link,useNavigate} from 'react-router-dom' 
import { useTable,useSortBy, usePagination, useGlobalFilter,useRowSelect,useFilters } from "react-table";
import { listProduct,setMasterProduct,setListSelectProduct,listProductSelection } from './productPriceSlice'
import { useSelector, useDispatch } from 'react-redux'
import matchSorter from 'match-sorter'
import {
useToast,
Modal,
Select,
Button,
ModalOverlay,
ModalContent,
ModalHeader,
ModalFooter,
ModalBody,
ModalCloseButton,
Input,
InputGroup,
InputLeftElement,
InputRightAddon,
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
  IconButton
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {AiOutlineClose} from 'react-icons/ai'
import {BsFillTrashFill} from 'react-icons/bs'
import {AiOutlinePlusCircle} from 'react-icons/ai'
import {BiSkipPreviousCircle,BiSkipNextCircle} from 'react-icons/bi'
import { Search2Icon } from "@chakra-ui/icons";
import { MdLogin, MdFilterList, MdWarning } from 'react-icons/md'
import {FaChevronUp, FaSort} from 'react-icons/fa'
// A great library for fuzzy filtering/sorting items

// import makeData from "./mockdata";

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

function SearchBox({ filterValue, setFilter }) {
  console.log('filter val', filterValue)
    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search records...`}
      />
    );
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
const Tables = ({
  columns,
  data,
//   fetchData,
  loading,
  pageCount: controlledPageCount,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const listuser = useSelector(listProduct)
  const selected = useSelector(listProductSelection)
  const prevSelected = usePrevious(selected)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showFilter, setShowFilter] = React.useState(false)
  const [filterName, setFilterName] = React.useState('')
  const [filterEmail, setFilterEmail] = React.useState('')
  const [filterTravelAgent, setFilterTravelAgent] = React.useState('')
  const [filterTravelType, setFilterTravelType] = React.useState('')
  const [filterPlanType, setFilterPlanType] = React.useState('')
  const [filterTravellerType, setFilterTravellerType] = React.useState('')
 
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
  const toast = useToast()
  const onOpenModal = () => {
    onOpen()
    // getSelectedRows()
  }
  const onCloseModal = () => {
    onClose()
    dispatch(setMasterProduct([]))
    // resetSelectedRows: () => toggleAllRowsSelected(false)
    // getSelectedRows()
  }
  const clearSelect = () => {
    dispatch(setMasterProduct([]))
    onClose()
       
    const rowIds = data && data?.map((item, i) => i);
    if (rowIds) {
      rowIds.forEach(id => toggleRowSelected(id, false));
    }
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
    setFilter,
    // Get the state from the instance
    state: { pageIndex, pageSize, selectedRowIds, filters },
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
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          )
        },
        ...columns
      ]);
    }
  );
  const prev = usePrevious(selectedRowIds)
  React.useEffect(() => {
    toggleAllRowsSelected();
  }, []);
    
  const getValues = (data) => {
    let original = data.map((item) => item.original)
    dispatch(setMasterProduct(original))
  }
  
  React.useEffect(() => {
    if (JSON.stringify(prev) !== JSON.stringify(selectedRowIds)) {
      getValues(selectedFlatRows)
    }
  }, [prev, selectedRowIds, getValues, selectedFlatRows]);
  
  const showFilterBtn = () => {
    setShowFilter(!showFilter)
  }

  // Render the UI for your table
   
    
  const deletedUserUpdate = (e) => {
    e.preventDefault()
    const nextState = listuser?.filter(
      item => !selected.some(({ id }) => item.id === id)
    );
    console.log('nextState', nextState)
    dispatch(setListSelectProduct(nextState))
    dispatch(setMasterProduct([]))
    onClose()
    toast({
      title: `Deleted Success`,
      status: "success",
      position: 'top-right',
      duration: 3000,
      isClosable: true,
      variant: "solid",
    })
  }
//   React.useEffect(() => {
//     fetchData({ pageIndex, pageSize })
//   }, [fetchData, pageIndex, pageSize])

  const spring = React.useMemo(
    () => ({
      type: 'spring',
      damping: 50,
      stiffness: 100,
    }),
    []
  )
  const handleFilterByName = e => {
    const value = e.target.value || undefined;
    setFilter("productDetailCode", value);
    setFilterName(value);
  };
  const handleFilterByEmail = e => {
    const value = e.target.value || undefined;
    setFilter("email", value);
    setFilterEmail(value);
  };
  const handleFilterByTravelAgent = e => {
    const value = e.target.value || undefined;
    setFilter("travelAgent", value);
    setFilterTravelAgent(value);
  };
  const handleFilterByTravelType = e => {
    const value = e.target.value || undefined;
    setFilter("coverageType", value);
    setFilterTravelType(value);
  };
  
    const handleFilterByPlanType = e => {
    const value = e.target.value || undefined;
    setFilter("product", value);
    setFilterPlanType(value);
    };
    
    const handleFilterByTravellerType = e => {
    const value = e.target.value || undefined;
    setFilter("travellerType", value);
    setFilterTravellerType(value);
  };

  // console.log('filters', filters)
  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Heading as={'h6'} size={'sm'}>Product Prices</Heading>
        <Stack direction='row' spacing={4} m={'2.5'}>
          <Button leftIcon={<MdFilterList color={showFilter ? '#065BAA' : ''} />} colorScheme='#231F20' variant='outline' size={'sm'} color={showFilter ? '#065BAA' : ''} onClick={showFilterBtn}>
            Apply Filter
          </Button>
          <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
            Export
          </Button>
          <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
            Import
          </Button>
          <Button variant="ClaimBtn" leftIcon={<AiOutlinePlusCircle />} colorScheme='#231F20' size={'sm'} color="white" >
            Add Product Price
          </Button>
        </Stack>
      </Box>
      <Box mt="1em" mb="1em" display="flex" alignItems="center" gap="10px">
        
        {
          selected?.length > 0 && (
            <>
              <Text as="p" size="sm">
                {Object.keys(selectedRowIds).length} Selected
              </Text>
              <IconButton border="none" bg={'white'} onClick={clearSelect} size="sm" icon={<AiOutlineClose size="16px" color='black' />} />
              <Box display="flex" gap="5px" alignItems="center">
                <IconButton border="none" bg={'white'} size="sm" icon={<BsFillTrashFill size="16px" color='black' onClick={deletedUser} />} />
                {/* <Text as="p" size="sm">Delete</Text> */}
              </Box>
            </>
          )
        }
        
      </Box>
      {
        showFilter ? (
          <Box w={{ base: "100%", md: "60%" }} display={'flex'} justifyContent={'space-around'} alignItems={'center'} gap="4px">
            <Select className="floating-select" placeholder='Select Travel duration' _placeholder={{fontSize:"12px"}} style={{fontSize:"12px"}} defaultValue={''} bg="#ebebeb"
              borderRadius={'5px'}
              name="travelAgent" onChange={handleFilterByTravelAgent}>
              <option value="Golden Rama">Golden Rama</option>
              <option value="AVIA TOUR">AVIA TOUR</option>
              <option value="BAYU BUANA">BAYU BUANA</option>
              <option value="PANORAMA">PANORAMA</option>
            </Select>
            <Select className="floating-select" placeholder='Coverage Type' style={{fontSize:"12px"}}  defaultValue={''} bg="#ebebeb"
              borderRadius={'5px'}
              name="typeTrip" onChange={handleFilterByTravelType}>
              <option value="Single Trip">Single Trip</option>
              <option value="Anual Trip">Anual Trip</option>
            </Select>
            <Select className="floating-select" placeholder='Plan Type'style={{fontSize:"12px"}}  defaultValue={''} bg="#ebebeb"
              borderRadius={'5px'}
              name="typeTrip" onChange={handleFilterByPlanType}>
              <option value="ASIA 50">ASIA 50</option>
              <option value="Worldwide 100">Worldwide 100</option>
              <option value="Worldwide 150">Worldwide 150</option>
            </Select>
            <Select className="floating-select" style={{fontSize:"12px"}}  placeholder='Traveller Type' defaultValue={''} bg="#ebebeb"
              borderRadius={'5px'}
              name="typeTrip" onChange={handleFilterByTravellerType}>
              <option value="ASIA 50">ASIA 50</option>
              <option value="Worldwide 100">Worldwide 100</option>
              <option value="Worldwide 150">Worldwide 150</option>
            </Select>
          </Box>
        ) : null
      }
      
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
                    <div {...column.getSortByToggleProps()} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} >
                      {column.render('Header')}
                      <Box>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? <Box><FaSort color='#065BAA' size="14px" style={{ paddingLeft: "4px" }} /></Box>
                            : <Box><FaSort color='#065BAA' size="14px" style={{ paddingLeft: "4px" }} /></Box>
                          : ''}
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
                prepareRow(row)
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
                      )
                    })}
                  </motion.tr>
                )
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
      <Box display="flex" justifyContent={'flex-end'} alignItems={'center'} mt="1em">
        <Box>
          <Button onClick={() => previousPage()} disabled={!canPreviousPage} bg="white" border={'none'} _hover={{
            bg: "#f0eeee",
            borderRadius: "5px",
            WebkitBorderRadius: "5px",
            MozBorderRadius: "5px"
          }}>
            <BiSkipPreviousCircle size="25px" color="black" />
            <Text as="p" fontFamily={'Mulish'} style={{ fontSize: "12px" }} color="#231F20" pl="5px">Prev</Text>
          </Button>{' | '}
          <Button _hover={{
            bg: "#f0eeee",
            borderRadius: "5px",
            WebkitBorderRadius: "5px",
            MozBorderRadius: "5px"
          }} onClick={() => nextPage()} disabled={!canNextPage} bg="white" border={'none'}>
            <BiSkipNextCircle size="25px" color="black" />
            <Text fontFamily={'Mulish'} style={{ fontSize: "12px" }} color="#231F20" pl="5px">
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
}
function MasterProduct() {
  const list = useSelector(listProduct)
  const [loading, setLoading] = React.useState(false)
  const [pageCount, setPageCount] = React.useState(0)
  const [data, setData] = React.useState([])
  const [paginations,setPagination] = React.useState({
      page: 0,
      size:10
    })
   
    const navigate = useNavigate()
    const fetchIdRef = React.useRef(0)
    // const {data:listUserAccount,isLoading,isSuccess,isError} = useGetUsersQuery()
    const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
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
        setData(list?.slice(startRow, endRow))
        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(list?.length / pageSize))

        setLoading(false)
      }
    }, 1000)
    }, [list])
  
  const columns = React.useMemo(
    () => [
      {
        Header: "Price Id",
        accessor: "priceId",
        Cell: ({ row }) => (
       
          <Link
            color="#065BAA"
            style={{textDecoration:"underline"}}
            to={`/product-detail/${row.original.priceId}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.priceId}
          </Link>
       
    ),
      },
      {
        Header: "Travel Agent",
        accessor: "travelAgent",
      },
      {
        Header: "Product Detail Code",
        accessor: "productDetailCode",
      },
      {
        Header: "Premium Price",
        accessor: "premiumPrice"
      },
      {
        Header: "Discount Lvl 1",
        accessor: "discountlvl1"
      },
      {
        Header: "Discount Lvl 2",
        accessor: "discountlvl2"
      },
      {
        Header: "Discount Lvl 3",
        accessor: "discountlvl3"
      },
      {
        Header: "Total Commission",
        accessor: "totalCommission"
      },
      {
        Header: "Net To Agent",
        accessor: "netToAgent",
        enableGlobalFilter: true, 
      },
    ],
    []
  );

  // const data = React.useMemo(() => makeData(100), []);
  // const [data, setData] = React.useState(list);

  // React.useEffect(() => {
  //   setData(makeData(100));
  // }, []);
  

  return (
      <Styles>
        {/* <button onClick={handleReset}>Reset Data</button> */}
        <Box bg="white" overflow={'scroll'} p="3" mt="3em">
              <Styles>
                {
                  
                    <Tables
                    columns={columns}
                    data={data}
                    // fetchData={fetchData}
                    loading={loading}
                    // pageCount={pageCount} 
                    />
                 
                }
                
                </Styles>
                {/* <Link to="/welcome">Back to Welcome</Link> */}
            </Box>
      </Styles>
  );
}

export default MasterProduct;
