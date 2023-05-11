import React, { useState } from 'react';
import { useGetUsersQuery } from "./policyApiSlice"
import { Link } from "react-router-dom";
import Data from './list.json'
import Table from "react-table";
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
import {listUsers,setMasterUser,listUsersSelection,setListUser} from './masterUserSlice'
import {MdLogin,MdFilterList,MdWarning} from 'react-icons/md'
import {AiOutlineClose} from 'react-icons/ai'
import {BsFillTrashFill} from 'react-icons/bs'
import {AiOutlinePlusCircle} from 'react-icons/ai'
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

const Tables = ({ columns, data }) => {
 const dispatch = useDispatch()
 const listuser = useSelector(listUsers)
 const selected = useSelector(listUsersSelection)
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
     const rowIds = listuser?.map((item,i) =>i);
     rowIds.forEach(id => toggleRowSelected(id, false));
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
    state: { selectedRowIds }
  } = useTable(
    {
      columns,
      data
    },
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
        const nextState = listuser.filter(
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
 console.log('id', listuser)
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
                                   <Th>Username</Th>
                                    <Th>Fullname</Th>
                                    <Th>Email</Th>
                                    <Th >Role</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                             {
                                    selected?.map((item, i) => {
                                        return (
                                            <Tr key={item.id} >
                                                <Td>{item.username }</Td>
                                                <Td>{ item.fullname}</Td>
                                                <Td>{ item.email}</Td>
                                                <Td>{ item.role}</Td>
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
        </tbody>
      </table>
      
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
    const selectedUser = useSelector(listUsersSelection);
    const tableRef = React.useRef(null)
    const columns = React.useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
        Cell: ({ row }) => (
       
          <Link
            color="#065BAA"
            style={{textDecoration:"underline"}}
            to={`/user-detail/${row.original.username}`}
          >
            {/* <AiOutlineFileDone size={25} /> */}
            {row.original.username}
          </Link>
       
    ),
      },
      {
        Header: "Fullname",
        accessor: "fullname"
      },
      {
        Header: "Email",
        accessor: "email"
      },
      {
        Header: "Role",
        accessor: "role"
      }
    ],
    []
  );

    const data = React.useMemo(() => tempList);
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery()

    let content;
    if (isLoading) {
        content = <Center h='50vh' color='#065BAA'>
                    <Text as={'p'} size="xs">
                        Loading...
                    </Text>
                   </Center>;
    } else if (Data) {
        content = (
            <Box pl="4" pr="4" mt="5em"> 
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
                    <Button variant="ClaimBtn" leftIcon={<AiOutlinePlusCircle />} colorScheme='#231F20' size={'sm'} color="white">
                        Add User 
                    </Button>
                </Stack>
            </Box>
            
            <Box bg="white" overflow={'scroll'} p="3">
                <Styles>
                <Tables columns={columns} data={data} />
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