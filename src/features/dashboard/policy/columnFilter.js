import React from 'react'
import { Box, Input ,FormControl,FormLabel} from '@chakra-ui/react'

const columnFilter = ({ column }) => {
    const { filterValue, setFilter } = column
    console.log('column', column)
  return (
      <Box borderRadius={'5px'}>
           <FormControl variant="floating" id="first-name" isRequired >
              <Input placeholder={`Filter By ${column.Header}`} _placeholder={{ opacity: 1, color: '#231F20' }} fontFamily={'Mulish'} fontWeight={'500'} style={{fontSize:"12px"}} value={filterValue || '' } onChange={setFilter} h="25px"/>
                {/* <FormLabel fontSize="12" pt="1.5">Enter Username</FormLabel> */}
            </FormControl>
    </Box>
  )
}

export default columnFilter