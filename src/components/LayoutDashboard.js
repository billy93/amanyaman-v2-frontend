import React from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom"
import Navbar from "./navbar"
import { Box } from '@chakra-ui/react'
import useAuth from "../features/hook/useAuth"
import usePersist from "../features/hook/usePersist"
import { useSelector,useDispatch } from 'react-redux'
import { setAuth, userLoginCurrent } from "../features/auth/authSlice"
import { logOut,isAuthenticate } from "../features/auth/authSlice"

const LayoutDashboard = ({ allowedRoles }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(isAuthenticate);
    const token = useSelector(userLoginCurrent)
    const {role} = useAuth()
    const location = useLocation()
    const [persist] = usePersist()

    React.useEffect(() => {
    const checkLocalStorage = setInterval(() => {
      if (!localStorage.getItem('persist')) {
        dispatch(logOut());
      }
    }, 1000); // Adjust the interval as needed

    return () => clearInterval(checkLocalStorage);
    }, [dispatch]);
    
    React.useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.storageArea === localStorage && event.key === 'persist') {
        if (!JSON.parse(localStorage.getItem('persist')).token?.id_token) {
          dispatch(logOut());
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    }, [dispatch]);
    
    const content = (
        isAuthenticated && role.some(role => allowedRoles.includes(role))
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