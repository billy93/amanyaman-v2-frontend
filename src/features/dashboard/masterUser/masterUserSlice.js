import { createSlice } from "@reduxjs/toolkit"
import {apiSlice} from '../../../app/api/apiSlice'
const createMasterUserSlice = createSlice({
    name: 'masterUser',
    initialState: { 
        messages: null,
        uploadMessage:'',
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
        uploadFile:null,
        listAgentSelect:null,
        roleUser:[],
        selection:[],
        formuser: {
        login:"",    
        firstName:"",    
        lastName:"",  
        area:"",  
        authorities:[],
        travelAgent:''
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
        setFormSelectAgent: (state, action) => {
            state.listAgentSelect = action.payload
        },
        setUploadFile: (state, action) => {
            state.uploadFile = action.payload
        },
        setUploadMessage: (state, action) => {
            state.uploadMessage = action.payload
        },
        
    },
    extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        state.messages = payload
      }
    )
  },
})

export const {setUploadMessage,setUploadFile,setFormSelectAgent,setMasterUser,setListUser,setRoleUser,setDetailUser,setFormUser} = createMasterUserSlice.actions

export default createMasterUserSlice.reducer
export const listRoleUsers = (state) => state.masterUser.roleUser
export const listDetailUsers = (state) => state.masterUser.detail
export const listUsers = (state) => state.masterUser.list
export const listUsersSelection = (state) => state.masterUser.selection
export const formUser = (state) => state.masterUser.formuser
export const selectAgentList = (state) => state.masterUser.listAgentSelect
export const uploadFiles = (state) => state.masterUser.uploadFile
export const uploadFilesMessage = (state) => state.masterUser.uploadMessage