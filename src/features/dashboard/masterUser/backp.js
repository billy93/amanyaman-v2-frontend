import React, { useState } from 'react';
import { useGetUserQuery } from "./userApiSlice"
import { Link, useNavigate } from "react-router-dom";
import Data from './list.json'
import matchSorter from 'match-sorter'
import Table, { usePagination } from "react-table";
import PulseLoader from 'react-spinners/PulseLoader'
import {
 useToast,
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
  IconButton
} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import {listUsers,setMasterUser,listUsersSelection,setListUser, setFormUser,formUser} from './masterUserSlice'
import {MdLogin,MdFilterList,MdWarning} from 'react-icons/md'
import {AiOutlineClose} from 'react-icons/ai'
import {BsFillTrashFill} from 'react-icons/bs'
import {AiOutlinePlusCircle} from 'react-icons/ai'
import {BiSkipPreviousCircle,BiSkipNextCircle} from 'react-icons/bi'
import styled from "styled-components";
import { useTable, useRowSelect } from "react-table";

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


const Tables = ({
  columns,
  data,
  fetchData,
}) => {
 const dispatch = useDispatch()
 const listuser = useSelector(listUsers)
 const selected = useSelector(listUsersSelection)
 const formuser = useSelector(formUser)
 const prevSelected = usePrevious(selected)
 const { isOpen, onOpen, onClose } = useDisclosure()
 const toast = useToast()
   const onOpenModal = () => {
        onOpen()
        // getSelectedRows()
 }
    const onCloseModal = () => {
        onClose()
        dispatch(setMasterUser([]))
        // resetSelectedRows: () => toggleAllRowsSelected(false)
        // getSelectedRows()
    }
     const clearSelect = () => {
     dispatch(setMasterUser([]))
       onClose()
       
     const rowIds = data && data?.map((item,i) =>i);
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
    // Get the state from the instance
    state: { pageIndex, pageSize,selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      // pageCount: controlledPageCount,
    },
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
    
  React.useEffect(() => {
      if (JSON.stringify(prev) !== JSON.stringify(selectedRowIds)) {
          getValues(selectedFlatRows)
      }
  }, [prev, selectedRowIds]);
  
  // Render the UI for your table
    const getValues = (data) => {
     let original = data.map((item) => item.original)
     dispatch(setMasterUser(original))
    }
    
    const deletedUserUpdate = (e) => {
        e.preventDefault()
        const nextState = listuser?.filter(
        item => !selected.some(({ id }) => item.id === id)
        );
        console.log('nextState',nextState)
        dispatch(setListUser(nextState))
        dispatch(setMasterUser([]))
        onClose()
        toast({
                  title: `Deleted Success`,
                  status:"success",
                  position: 'top-right',
                  duration:3000,
                  isClosable: true,
                  variant:"solid",
                })
  } 
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize })
  }, [fetchData, pageIndex, pageSize])
  return (
      <>
          <Modal size="xl" blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="56rem">
                <ModalHeader>
                    <Heading variant="primary" as="div" size="lg" fontFamily={'Mulish'} color={'#231F20'} style={{fontSize:'18px'}}>
                        Delete User
                    </Heading>
                    <Text as="p" fontSize={'sm'} fontFamily={'Mulish'} color={'#231F20'} style={{fontSize:'14px'}} fontWeight={'normal'}>
                        You’re about to delete {selected?.length} users:
                    </Text>
                </ModalHeader>
                <ModalCloseButton onClick={clearSelect}/>
                <ModalBody pb={6}>
                   <TableContainer>
                    <TableNew variant={'simple'}>
                        <Thead>
                        <Tr>
                                    <Th>Fullname</Th>
                                    <Th>Email</Th>
                                    <Th>Travel Agent</Th>
                                    <Th >Role</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                             {
                                    selected?.map((item, i) => {
                                        return (
                                            <Tr key={item.id} >
                                                <Td>{ item.firstName} { item.lastName}</Td>
                                                <Td>{ item.email}</Td>
                                                <Td>{ item.travelAgemt}</Td>
                                                <Td>{ item.authorities}</Td>
                                            </Tr>
                                        )
                                    })
                               }
                        </Tbody>
                         <TableCaption textAlign={'left'} >
                                        <Text as="p" fontSize={'sm'} style={{fontSize:"14px"}} fontFamily={'Mulish'}>
                                         Deleting these users will remove all of their information from the database. This cannot be undone.
                                        </Text>
                         </TableCaption>
                    </TableNew>
                    </TableContainer>
                </ModalBody>

                <ModalFooter>
                        <Button onClick={cancelDelete}>Cancel</Button>
                      <Button colorScheme='blue' mr={3} onClick={ deletedUserUpdate}>
                        Delete User
                        </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
    <Box mb="1em" display="flex" alignItems="center" gap="10px">
        
        {
             selected?.length > 0 && (
                <>
                <Text as="p" size="sm">
                {Object.keys(selectedRowIds).length} Selected
                 </Text>
                 <IconButton border="none" bg={'white'} onClick={clearSelect} size="sm" icon={<AiOutlineClose size="16px" color='black'/>} />
                <Box display="flex" gap="5px" alignItems="center">
                    <IconButton border="none" bg={'white'} size="sm" icon={<BsFillTrashFill size="16px" color='black' onClick={ deletedUser} />} />
                    {/* <Text as="p" size="sm">Delete</Text> */}
                </Box>
                </>
            )
        }
        
    </Box>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.slice(0, 10).map((row, i) => {
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
          })}
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

const MasterUser = () => {
    const [MasterChecked, setMasterChecked] = useState(false)
    const dispatch = useDispatch()
    const tempList = useSelector(listUsers);
    const formuser = useSelector(formUser);
    const selectedUser = useSelector(listUsersSelection);
    const {
        data: listUserAccount,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserQuery({}, { refetchOnMountOrArgChange: true })
    const tableRef = React.useRef(null)
    const [data, setData] = React.useState([])
    const prevData = usePrevious(listUserAccount)
    const [loading, setLoading] = React.useState(false)
    const [pageCount, setPageCount] = React.useState(0)
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
        setData(tempList?.slice(startRow, endRow))

        // Your server could send back total page count.
        // For now we'll just fake it, too
        setPageCount(Math.ceil(tempList?.length / pageSize))

        setLoading(false)
      }
    }, 1000)
    }, [])
  
  React.useEffect(() => {
    if (JSON.stringify(prevData) !== JSON.stringify(listUserAccount)) {
       dispatch(setListUser([...listUserAccount]))
    }
  }, [listUserAccount, prevData, dispatch, tempList])
  
  const handleAddUser = (e) => {
    e.preventDefault()
    const datas = {
          id:'',
          login:'',
          firstName:'',
          lastName:'',
          email:'',
          authorities:[]
    }
    dispatch(setFormUser(datas))
    navigate('/master-data/create-user')
  }
    const columns = React.useMemo(
    () => [
      {
        Header: "Fullname",
        accessor: "firstName",
        filter: 'fuzzyText',
        Cell: ({ row }) => (
       
          <Link
            color="#065BAA"
            style={{textDecoration:"underline"}}
            to={`/master-data/detail-user/${row.original.id}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.firstName} {row.original.lastName} 
          </Link>
       
    ),
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Travel Agent",
        accessor: "travelAgentName"
      },
      {
        Header: "Role",
        accessor: "authorities"
      }
    ],
    []
  );

    // const data = React.useMemo(() => tempList);
    

    let content;
    if (isLoading) {
        content = <Center h='50vh' color='#065BAA'>
                       <PulseLoader color={"#065BAA"} />
                   </Center>;
    } else if (isSuccess) {
        content = (
            <Box pl="2em" pr="2em" mt="5em"> 
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Heading as={'h6'} size={'sm'}>User</Heading>
                <Stack direction='row' spacing={4} m={'2.5'}>
                    <Button leftIcon={<MdFilterList />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Apply Filter
                    </Button>
                    <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Export 
                    </Button>
                    <Button leftIcon={<MdLogin />} colorScheme='#231F20' variant='outline' size={'sm'} color="#231F20">
                        Import 
                    </Button>
                    <Button variant="ClaimBtn" leftIcon={<AiOutlinePlusCircle />} colorScheme='#231F20' size={'sm'} color="white" onClick={handleAddUser}>
                        Add User 
                    </Button>
                </Stack>
            </Box>
            
            <Box bg="white" overflow={'scroll'} p="3">
              <Styles>
                {
                  
                    <Tables
                    columns={columns}
                    data={tempList}
                    fetchData={fetchData}
                    // loading={loading}
                    // pageCount={pageCount}
                    />
                 
                }
                
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
export default MasterUser