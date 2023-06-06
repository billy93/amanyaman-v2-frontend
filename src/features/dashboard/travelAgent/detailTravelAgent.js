import React from "react";
import { useGetTravelAgentQuery,useDeleteAgentMutation } from "./travelApiSlice"
import { NavLink, useParams, Link, Navigate, useNavigate } from "react-router-dom";
import Table from "react-table";
import { useTable, useRowSelect,useFilters,useSortBy,usePagination  } from "react-table";
import styled from "styled-components";
import matchSorter from 'match-sorter'
import DeleteBtn from './deleteAgent' 
import {
  Box,
  Heading,
  Text,
  Center,
  Button,
  Stack,
  Divider,
  useToast,
  IconButton,
  Input,
  Select
} from '@chakra-ui/react'
import PulseLoader from 'react-spinners/PulseLoader'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react'
import { useSelector } from "react-redux"
import {useDispatch} from 'react-redux'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useMediaQuery } from "@chakra-ui/media-query";
import 'react-calendar/dist/Calendar.css';
import {listAgent,listDetailAgent,setDetailAgent,formAgent,setFormAgent,setProductAgentSelection,setProductAgent,detailAgentProductaList,detailAgentProductSelection} from './travelAgentSlice'
import {AiOutlineClose} from 'react-icons/ai'
import {BsFillTrashFill} from 'react-icons/bs'
import {BsFillPencilFill} from 'react-icons/bs'
import {CiTrash} from 'react-icons/ci'
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronUp, FaSort } from 'react-icons/fa'
import {MdLogin,MdFilterList,MdWarning} from 'react-icons/md'
import {AiOutlinePlusCircle} from 'react-icons/ai'
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

const Tables = ({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
}) => {
 const dispatch = useDispatch()
 const navigate = useNavigate()
 const listuser = useSelector(detailAgentProductaList)
 const selected = useSelector(detailAgentProductSelection)
 const formuser = useSelector(formAgent)
 const prevSelected = usePrevious(selected)
 const [showFilter,setShowFilter] = React.useState(false)
 const [filterProduct,setFilterProduct] = React.useState('')
 const [filterProductCode,setFilterProductCode] = React.useState('')
 const [filterPremiumPrice,setFilterPremiumPrice] = React.useState('')
 const [filterDiscont1,setFilterDiscount1] = React.useState('')
 const [filterDiscont2,setFilterDiscount2] = React.useState('')
 const [filterDiscont3,setFilterDiscount3] = React.useState('')
 const [filterTotalComm,setFilterTotalComm] = React.useState('')
 const [filterNet,setFilterNet] = React.useState('')
 
 
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
    state: { pageIndex, pageSize,selectedRowIds,filters },
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
            <div style={{display:"flex", justifyContent:"center", alignItems:'center'}}>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div style={{display:"flex", justifyContent:"center", alignItems:'center'}}>
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
     dispatch(setProductAgentSelection(original))
   }
  
  React.useEffect(() => {
      if (JSON.stringify(prev) !== JSON.stringify(selectedRowIds)) {
          getValues(selectedFlatRows)
      }
  }, [prev, selectedRowIds,getValues,selectedFlatRows]);
  
  const showFilterBtn = () => {
    setShowFilter(!showFilter)
  }

  // Render the UI for your table
   
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize })
  }, [fetchData, pageIndex, pageSize])
  const spring = React.useMemo(
    () => ({
      type: 'spring',
      damping: 50,
      stiffness: 100,
    }),
    []
  )
  const handleFilterByProduct = e => {
  const value = e.target.value || undefined;
    setFilter("product", value); 
    setFilterProduct(value);
};
  const handleFilterByProductCode = e => {
  const value = e.target.value || undefined;
    setFilter("productCode", value); 
    setFilterProductCode(value);
};
  const handleFilterByPremiumPrice = e => {
  const value = e.target.value || undefined;
  setFilter("premiumPrice", value); 
  setFilterPremiumPrice(value);
};
  const handleFilterByDisc1 = e => {
  const value = e.target.value || undefined;
  setFilter("discount1", value); 
  setFilterDiscount1(value);
};
  const handleFilterByDisc2 = e => {
  const value = e.target.value || undefined;
  setFilter("discount1", value); 
  setFilterDiscount2(value);
};
  const handleFilterByDisc3 = e => {
  const value = e.target.value || undefined;
  setFilter("discount1", value); 
  setFilterDiscount3(value);
};
  const handleFilterByTotComm = e => {
  const value = e.target.value || undefined;
  setFilter("totalCommision", value); 
  setFilterTotalComm(value);
};
  const handleFilterByNetoAgent = e => {
  const value = e.target.value || undefined;
  setFilter("netToAgent", value); 
  setFilterNet(value);
};

  // console.log('filters', filters)
  return (
      <>
          <Box w={{base:"100%", md:"90%"}} display={'flex'} justifyContent={'space-around'} alignItems={'center'} gap="4px">
                <Input
                  value={filterProduct}
                  onChange={handleFilterByProduct}
                  placeholder={"Search by product"}
                  bg="#ebebeb"
                  borderRadius={'5px'}
          />
                <Input
                  value={filterProductCode}
                  onChange={handleFilterByProductCode}
                  placeholder={"Search by product code"}
                  bg="#ebebeb"
                  borderRadius={'5px'}
          />
                <Input
                  value={filterPremiumPrice}
                  onChange={handleFilterByPremiumPrice}
                  placeholder={"Search by premium price"}
                  bg="#ebebeb"
                  borderRadius={'5px'}
          />
                <Input
                  value={filterDiscont1}
                  onChange={handleFilterByDisc1}
                  placeholder={"Search by discount lv 1"}
                  bg="#ebebeb"
                  borderRadius={'5px'}
          />
                <Input
                  value={filterDiscont2}
                  onChange={handleFilterByDisc2}
                  placeholder={"Search by discount lv 2"}
                  bg="#ebebeb"
                  borderRadius={'5px'}
          />
                <Input
                  value={filterDiscont2}
                  onChange={handleFilterByDisc2}
                  placeholder={"Search by discount lv 2"}
                  bg="#ebebeb"
                  borderRadius={'5px'}
          />
                <Input
                  value={filterDiscont3}
                  onChange={handleFilterByDisc3}
                  placeholder={"Search by discount lv 3"}
                  bg="#ebebeb"
                  borderRadius={'5px'}
          />
                <Input
                  value={filterTotalComm}
                  onChange={handleFilterByTotComm}
                  placeholder={"Search by total commision"}
                  bg="#ebebeb"
                  borderRadius={'5px'}
          />
                <Input
                  value={filterNet}
                  onChange={handleFilterByNetoAgent}
                  placeholder={"Search by net to agenr"}
                  bg="#ebebeb"
                  borderRadius={'5px'}
          />
                  
          </Box>
      
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
            {/* <tr>
              {loading ? (
                // Use our custom loading state to show a loading indicator
                <td colSpan="10000">Loading...</td>
              ) : (
                <td colSpan="10000">
                  Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                  results
                </td>
              )}
            </tr> */}
          </tbody>
          </table>
      </Box>
      <Box display="flex" justifyContent={'flex-end'} alignItems={'center'} mt="1em">
        <Box>
          <Button onClick={() => previousPage()} disabled={!canPreviousPage} bg="white" border={'none'} _hover={{
            bg: "#f0eeee",
            borderRadius: "5px",
            WebkitBorderRadius: "5px",
            MozBorderRadius:"5px"
        }}>
            <BiSkipPreviousCircle size="25px" color="black" />
            <Text as="p" fontFamily={'Mulish'} style={{fontSize:"12px"}} color="#231F20" pl="5px">Prev</Text>
        </Button>{' | '}
          <Button _hover={{
            bg: "#f0eeee",
            borderRadius: "5px",
            WebkitBorderRadius: "5px",
            MozBorderRadius:"5px"
        }} onClick={() => nextPage()} disabled={!canNextPage} bg="white" border={'none'}>
            <BiSkipNextCircle size="25px" color="black" />
            <Text fontFamily={'Mulish'} style={{fontSize:"12px"}} color="#231F20" pl="5px">
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

 
const DetailMasterUser = () => {
    // const currentstep = useSelector()
  const dispatch = useDispatch()
  const detailUser = useSelector(listAgent)
  const detail = useSelector(listDetailAgent)
   const [deleteAgent, { isLoading }] = useDeleteAgentMutation({
   skip:false
 })
  const [paginations,setPagination] = React.useState({
      page: 0,
      size:10
    })
    const {id} = useParams()
    const [isMobile] = useMediaQuery("(max-width: 768px)")
    const [onDelete,setOnDelete] = React.useState(false)
    const {
        data: users,
        isSuccess,
        isError,
        error
    } = useGetTravelAgentQuery({count:5}, { refetchOnMountOrArgChange: true })
  const toast = useToast()
  const navigate = useNavigate()
  const Prev = usePrevious(users)
  const [data, setData] = React.useState([])
  const newData = useSelector(detailAgentProductaList)
  const [loading, setLoading] = React.useState(false)
  const [pageCount, setPageCount] = React.useState(0)
   const PageInit = React.useCallback((pageSize,pageIndex) => {
    // console.log('page init', pageSize,pageIndex)
     setPagination({
       page: pageIndex,
       size:pageSize
      })
   }, [paginations?.page, paginations?.size])
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
        setData(newData?.slice(startRow, endRow))
        PageInit(pageSize,pageIndex)
        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(newData?.length / pageSize))

        setLoading(false)
      }
    }, 1000)
    }, [newData])
  
  React.useMemo(() => {
      const dataUserDetail = users?.filter((user) => user.id === parseInt(id))
    if (dataUserDetail) {
        dispatch(setDetailAgent([...dataUserDetail]))
      }
  }, users, dispatch, id)
  
  const handleEditUser = (e) => {
    e.preventDefault()
      const datas = {
            travelAgentName:detail !==null ? detail[0]?.travelAgentName : null,    
            travelAgentEmail:detail !==null ? detail[0]?.travelAgentEmail : null,    
            travelAgentAddress:detail !==null ? detail[0]?.travelAgentAddress : null,  
            travelAgentPhone:detail !==null ? detail[0]?.travelAgentPhone : null,  
            custcode:detail !==null ? detail[0]?.custcode : null,   
            custid:detail !==null ? detail[0]?.custid : null,   
            cgroup:detail !==null ? detail[0]?.cgroup : null,   
            promoInvoiceRecipents:detail !==null ? detail[0]?.promoInvoiceRecipents : null,   
            allowCreditPayment:detail !==null ? detail[0]?.allowCreditPayment : null,   
            city:detail !==null ? detail[0]?.city : null
        }
    dispatch(setFormAgent(datas))
    // dispatch(setDetailAgent([{...datas}]))
    navigate(`/master-data/edit-agent/${id}`)
  }

const handleDeletAgent = async (e) => {
    e.preventDefault()
    try {
      const res = await deleteAgent(parseInt(id))
      const idx="deleteagent"
      if (res) {
         if(!toast.isActive(idx)){
         toast({
                          id:"deleteagent",
                          title: `Delete Agent Success`,
                          status:"success",
                          position: 'top-right',
                          duration:3000,
                          isClosable: true,
                          variant:"solid",
                        })
         }
        navigate('/master-data/travel-agent')
       }
      
    } catch (err) {
       toast({
                          id:"deleteagent",
                          title: `${err?.originalStatus}`,
                          status:"success",
                          position: 'top-right',
                          duration:3000,
                          isClosable: true,
                          variant:"solid",
                        })
       }
}
  
const columns = React.useMemo(
    () => [
      {
        Header: "Product",
        accessor: "product",
        Cell: ({ row }) => (
       
          <Link
            color="#065BAA"
            style={{textDecoration:"underline",color:"#065BAA"}}
            to={`/policies/policy-detail/${row.original.product}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.product}
          </Link>
       
    ),
      },
      {
        Header: "Product Code",
        accessor: "productCode"
      },
      {
        Header: "Premium Price",
        accessor: "premiumPrice"
      },
      {
        Header: "Discount Lv1 (IDR)",
        accessor: "discount1"
      },
      {
        Header: "Discount Lv2 (IDR)",
        accessor: "discount2"
      },
      {
        Header: "Discount Lv3 (IDR)",
        accessor: "discount3"
      },
      {
        Header: "Total Commision",
        accessor: "totalCommision"
      },
      {
        Header: "Net to Agent",
        accessor: "netToAgent"
      }
    ],
    []
  );
    let content;
    if (isLoading) {
        content = <Center h='50vh' color='#065BAA'>
                       <PulseLoader color={"#065BAA"} />
                   </Center>;
    } else if (isSuccess) {
        content = (
            <Box pl="2em" pr="2em">
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={{base:"4em", md:"4em"}}>
                 <Box display="flex" justifyContent={'space-between'} w="100%" borderBottom="1px" borderColor={'#ebebeb'}> 
                  <Box w="100%" pt="15px">  
                    <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
                      <BreadcrumbItem isCurrentPage>
                              <BreadcrumbLink as={NavLink} to='/master-data/master-user'>
                                  <Text as="b" ml="4" fontSize="sm" color="#065BAA"  _hover={{
                                      borderBottom: "#065BAA",
                                      border:"1 px solid"
                                  }}>
                                      Travel Agent 
                                  </Text>
                              </BreadcrumbLink>
                      </BreadcrumbItem>

                      <BreadcrumbItem>
                          <BreadcrumbLink as={NavLink} to='#' style={{ pointerEvents: 'none'}}>
                              <Text as={'b'} fontSize={'sm'} color="#231F20"
                            >
                               {detail !==null ? detail[0]?.id : null } 
                              </Text>
                          </BreadcrumbLink>
                      </BreadcrumbItem>
                      </Breadcrumb>
                  </Box>
                  <Box display={'flex'} alignItems={'center'} gap="5px">
                  <IconButton _hover={{color:"white"}} icon={ <BsFillPencilFill color="#065BAA" size={'16px'}/>} bg="white" border="1px solid #ebebeb" onClick={handleEditUser}/>
                  {/* <IconButton _hover={{color:"white"}} icon={ <CiTrash color="#065BAA" size={'16px'}/>} bg="white" border="1px solid #ebebeb" onClick={handleDeletAgent}/> */}
                   <DeleteBtn
                  showModalButtonText="Delete"
                  modalHeader="Delete Agent"
                  modalBody="Confirm delete Agent ?"
                  />
                  </Box>
                 </Box>
                </Box>
                <Box display={'flex'} gap="10px" >
                    <Box display={'flex'} flexDirection={'column'} mt="1em"  >
                        <Box border="1px solid #ebebeb" borderRadius={'5px'} borderBottom={'none'}>  
                        <Box bg="#ebebeb" w={{base:"100%", md:"386px"}} p={{base:"5px", md:"10px"}} display="flex" justifyContent="space-around" alignItems="center" >
                            <Heading as="h4" variant={'primary'} fontFamily={'Mulish'} style={{fontSize:"17px"}} color={'#231F20'}>{detail !== null ? detail[0]?.id : null} </Heading>
                        </Box>
                        <Box bg="white" w={{base:"100%", md:"386px"}} p={{md:"10px"}}>
                            <Box pb="10px" pt="10px" borderBottom={'1px solid #ebebeb'} display={'flex'} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text as="b" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>{'Travel Agent Name'}</Text>
                                <Text as="p" fontFamily={'Mulish'} style={{fontSize:"14px"}}  fontWeight={'400'}>{detail !==null ? detail[0]?.travelAgentName : null}</Text>
                            </Box>
                            <Box pb="10px" pt="10px" borderBottom={'1px solid #ebebeb'} display={'flex'} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text as="b" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>{'Travel Agent Phone'}</Text>
                                <Text as="p" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'} fontWeight={'normal'}>{detail !==null ? detail[0]?.travelAgentPhone : null}</Text>
                            </Box>
                            <Box pt="10px" pb="10px" borderBottom={'1px solid #ebebeb'} display={'flex'} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text as="b" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>{'Trael Agent Email'}</Text>
                                <Text as="p" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'} fontWeight={'normal'}>{detail !==null ? detail && detail[0]?.travelAgentEmail : null}</Text>
                            </Box>
                        </Box>
                        </Box>
                    </Box>
                    <Box w="100%">
                            <Box bg="white" mt="18px" p="14px" border="1px solid #ebebeb" borderRadius={'5px'}>
                                <Text as="b" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>Travel Agent Detail</Text>
                            </Box>
                            <Box w={{base:"100%"}} display="flex" justifyContent="flex-start" alignItems="center" p={{base:"4px", md:"10px"}} borderBottom={'1px solid #ebebeb'}>     
                                <Box w={{md:"30%"}}>
                                    <Text as="b" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>Travel Agent Address</Text>
                                </Box>
                                <Box w={{md:"70%"}}>
                                    <Text as="p" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} >Travel Agent Address</Text>
                                </Box>
                            </Box>
                            <Box w={{base:"100%"}}  display="flex" justifyContent="flex-start" alignItems="center" p={{base:"4px", md:"10px"}} borderBottom={'1px solid #ebebeb'}>     
                                <Box w={{md:"30%"}}>
                                    <Text as="b" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>Allow Credit Payments</Text>
                                </Box>
                                <Box w={{md:"70%"}}>
                                    <Text as="p" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}}>True</Text>
                                </Box>
                            </Box>
                            <Box w={{base:"100%"}}  display="flex" justifyContent="flex-start" alignItems="center" p={{base:"4px", md:"10px"}} borderBottom={'1px solid #ebebeb'}>     
                                <Box w={{md:"30%"}}>
                                    <Text as="b" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>Cust Id</Text>
                                </Box>
                                <Box w={{md:"70%"}}>
                                    <Text as="p" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} >7</Text>
                                </Box>
                            </Box>
                            <Box w={{base:"100%"}} display="flex" justifyContent="flex-start" alignItems="center" p={{base:"4px", md:"10px"}} borderBottom={'1px solid #ebebeb'}>     
                                <Box w={{md:"30%"}}>
                                    <Text as="b" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>Cust Code</Text>
                                </Box>
                                <Box w={{md:"70%"}}>
                                    <Text as="p" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} >WCAH0006</Text>
                                </Box>
                            </Box>
                            <Box w={{base:"100%"}}  display="flex" justifyContent="flex-start" alignItems="center" p={{base:"4px", md:"10px"}} borderBottom={'1px solid #ebebeb'}>     
                                <Box w={{md:"30%"}}>
                                    <Text as="b" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>Cgroup</Text>
                                </Box>
                                <Box w={{md:"70%"}}>
                                    <Text as="p" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} >WITA_T</Text>
                                </Box>
                            </Box>
                            <Box w={{base:"100%"}}  display="flex" justifyContent="flex-start" alignItems="center" p={{base:"4px", md:"10px"}} borderBottom={'1px solid #ebebeb'}>     
                                <Box w={{md:"30%"}}>
                                    <Text as="b" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>Proforma Invoice Recipients</Text>
                                </Box>
                                <Box w={{md:"70%"}}>
                                    <Text as="p" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} >itdevelopment@atibusinessgroup.com</Text>
                                </Box>
                            </Box>
                            <Box w={{base:"100%"}}  display="flex" justifyContent="flex-start" alignItems="center" p={{base:"4px", md:"10px"}} borderBottom={'1px solid #ebebeb'}>     
                                <Box w={{md:"30%"}}>
                                    <Text as="b" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} color={'#231F20'}>City</Text>
                                </Box>
                                <Box w={{md:"70%"}}>
                                    <Text as="p" size="sm" fontFamily={'Mulish'} style={{fontSize:"14px"}} >JAKARTA PUSAT</Text>
                                </Box>
                            </Box>
                            <Box>
                            </Box>
                        </Box>
                </Box>
                <Box border={'1px solid #ebebeb'} pt="5px" pl="5px" mt="1em" borderRadius={'5px'}>
                  <Box borderBottom={'1px solid #ebebeb'} h="35px" display={'flex'} alignItems={'center'}>
                  <Text p="10px" as="b" size={'sm'} fontFamily={'Mulish'} style={{fontSize:"14px"}} >
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
                                      />
                 
                                </Styles>
                            {/* <Link to="/welcome">Back to Welcome</Link> */}
              </Box>
            </Box>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>;
    }

    return content
}
export default DetailMasterUser