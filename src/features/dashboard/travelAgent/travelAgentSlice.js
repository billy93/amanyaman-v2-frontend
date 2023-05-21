import { createSlice } from "@reduxjs/toolkit"
import {apiSlice} from '../../../app/api/apiSlice'
const createMasterAgentSlice = createSlice({
    name: 'masterAgent',
    initialState: { 
        messages:null,
        list:[],
        detail: null,
        detailAgent: {
          productList:[],
          selection:[]  
        },
        roleUser:[],
        selection:[],
        formagent: {
        travelAgentName:"",    
        travelAgentEmail:"",    
        travelAgentAddress:"",  
        travelAgentPhone:"",  
        custcode:"",   
        custid:"",   
        cgroup:"",   
        promoInvoiceRecipents:"",   
        allowCreditPayment:'false',   
        city:""
       }
    },
    
    reducers: {
        setMasterAgent: (state, action) => {
            state.selection = action.payload
        },
        setProductAgent: (state, action) => {
            state.productList = action.payload
        },
        setProductAgentSelection: (state, action) => {
            state.selection = action.payload
        },
        setListAgent: (state, action) => {
            state.list = action.payload
        },
        setDetailAgent: (state, action) => {
            // const { id, users } = action.payload
            // const d = users
            state.detail = action.payload
        },
        setRoleUser: (state, action) => {
            state.roleUser = action.payload
        },
        setFormAgent: (state, action) => {
            state.formagent = action.payload
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

export const {setProductAgentSelection,setProductAgent,setMasterAgent,setListAgent,setRoleUser,setDetailAgent,setFormAgent} = createMasterAgentSlice.actions

export default createMasterAgentSlice.reducer
export const listRoleUsers = (state) => state.agent.roleUser
export const listDetailAgent = (state) => state.agent.detail
export const listAgent = (state) => state.agent.list
export const listAgentSelection = (state) => state.masterUser.selection
export const formAgent = (state) => state.agent.formagent
export const detailAgentProductaList = (state) => state.agent.detailAgent.productList
export const detailAgentProductSelection = (state) => state.agent.detailAgent.selection