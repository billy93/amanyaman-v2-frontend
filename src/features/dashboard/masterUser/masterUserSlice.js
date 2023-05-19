import { createSlice } from "@reduxjs/toolkit"

const createMasterUserSlice = createSlice({
    name: 'masterUser',
    initialState: { 
        list:[{
         id: "1",
         username: "bayu",
         fullname: "bayu wardana",
         email: "bayu@gmail.com",
         role:"user"
    },
     {
         id: "2",
         username: "andre",
         fullname: "andre wardana",
         email: "andre@gmail.com",
         role:"user"
    },
     {
         id: "3",
         username: "admin",
         fullname: "fajar wardana",
         email: "fajare@gmail.com",
         role:"admin"
    }],
       detail:null,
       roleUser:[],
       selection:[],
       formuser: {
        login:"",    
        firstName:"",    
        lastName:"",  
        area:"",  
        authorities:[]    
       }
    },
    
    reducers: {
        setMasterUser: (state, action) => {
            console.log('datas', action.payload)
            state.selection = action.payload
        },
        setListUser: (state, action) => {
            state.list = action.payload
        },
        setDetailUser: (state, action) => {
            // const { id, users } = action.payload
            // const d = users
            state.detail = action.payload
        },
        setRoleUser: (state, action) => {
            state.roleUser = action.payload
        },
        setFormUser: (state, action) => {
            state.formuser = action.payload
        },
        
    },
})

export const {setMasterUser,setListUser,setRoleUser,setDetailUser,setFormUser} = createMasterUserSlice.actions

export default createMasterUserSlice.reducer
export const listRoleUsers = (state) => state.masterUser.roleUser
export const listDetailUsers = (state) => state.masterUser.detail
export const listUsers = (state) => state.masterUser.list
export const listUsersSelection = (state) => state.masterUser.selection
export const formUser = (state) => state.masterUser.formuser