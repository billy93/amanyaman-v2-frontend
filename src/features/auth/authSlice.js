import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        otherLogin: {
            username: null,
            password: null,
            role: null
        },
        mainMenu: [
            {
                role: 'admin',
                menu: [
                    {
                        id: "1",
                        name: "Dashboard",
                        link:"/dashboard",
                        icon:""
                    },
                    {
                        id: "2",
                        name: "Users",
                        link: "/master-user",
                        icon:""
                    },
                    {
                        id: "3",
                        name: "Master Data",
                        link:"/master-data/master-products",
                        icon: "",
                         children: [
                            {
                                link: '/master-data/master-products',
                                name: 'Master Products',
                                href: '#',
                            },
                            {
                                link: '/master/price',
                                name: 'Master Price',
                                href: '#',
                            },
                            ],
                    },
                    {
                        id: "4",
                        name: "Policies",
                        link: "/policies/list",
                        icon:""
                    },
                    {
                        id: "5",
                        name: "Products",
                        link: "/products/list",
                        icon:""
                    },
                    {
                        id: "6",
                        name: "Travellers",
                        link: "/travellers",
                        icon:""
                    }
                ]
            }
        ],
        userRole: [
        {
          username:'admin',
          password:"abcd1234",
          role:"admin"  
        },
        {
          username:'bayu',
          password:"abcd1234",
          role:"user"  
        }
        ],
        traveller: {
            insuredName: null,
            policyNumber: null,
            pasportNumber: null
        }
     },
    reducers: {
        setCredentials: (state, action) => {
            const { username, password,role,insuredName,policyNumber,pasportNumber } = action.payload
            state.otherLogin.username = username
            state.otherLogin.password = password
            state.otherLogin.role = role
            state.traveller.insuredName = insuredName
            state.traveller.policyNumber = policyNumber
            state.traveller.pasportNumber = pasportNumber
        },
        logOut: (state, action) => {
            state.otherLogin.username = null
            state.otherLogin.password = null
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.otherLogin.username
export const roleUser = (state) => state.auth.otherLogin.role
export const selectCurrentToken = (state) => state.auth.otherLogin.password
export const selectCurrentTraveller = (state) => state.auth.traveller.insuredName
export const UserRoles = (state) => state.auth.userRole
export const Menulist = (state) => state.auth.mainMenu