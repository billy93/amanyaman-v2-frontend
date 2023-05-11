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
        selection:[]
     },
    reducers: {
        setMasterUser: (state, action) => {
            console.log('datas', action.payload)
            state.selection = action.payload
        },
        setListUser: (state, action) => {
            state.list = action.payload
        },
        
    },
})

export const {setMasterUser,setListUser} = createMasterUserSlice.actions

export default createMasterUserSlice.reducer
export const listUsers = (state) => state.masterUser.list
export const listUsersSelection = (state) => state.masterUser.selection