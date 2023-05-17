import { useLocation, Navigate, Outlet } from "react-router-dom"
import Navbar from "./navbar"
import { Box } from '@chakra-ui/react'
import useAuth from "../features/hook/useAuth"
import usePersist from "../features/hook/usePersist"
import { useSelector } from 'react-redux'
import { userLoginCurrent } from "../features/auth/authSlice"

const LayoutDashboard = ({allowedRoles}) => {
    const token = useSelector(userLoginCurrent)
    const {role} = useAuth()
    const location = useLocation()
    const [persist] = usePersist()
    const content = (
        token !==null && role.some(role => allowedRoles.includes(role))
            ?
            <Box w="100%">
                <Navbar allowedRoles={allowedRoles}/>
                <Outlet />
            </Box>
            :
            <Navigate to="/" state={{ from: location }} replace />
    )
    return content
}

export default LayoutDashboard