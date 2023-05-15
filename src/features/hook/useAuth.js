import { useSelector } from 'react-redux'
import { userLoginCurrent } from "../auth/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(userLoginCurrent)
    let isSales = false
    let isAdmin = false
    let status = "Employee"

    if (token?.id_token) {
        const decoded = jwtDecode(token?.id_token)
        const { firstName, role } = decoded
        
        isSales = role[0].name.includes('ROLE_SALES')
        isAdmin = role[0].name.includes('ROLE_ADMIN')

        if (isSales) status = "Manager"
        if (isAdmin) status = "Admin"

        return { firstName, role, status, isSales, isAdmin }
    }

    return { firstName: '', role: [], isSales, isAdmin, status }
}
export default useAuth