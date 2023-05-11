import { Outlet } from "react-router-dom"
import Navbar from "./navbar"
import { Box } from '@chakra-ui/react'

const LayoutDashboard = () => {
    return (
        <Box w="100%">
            <Navbar/>
            <Outlet />
        </Box>
    )
}

export default LayoutDashboard