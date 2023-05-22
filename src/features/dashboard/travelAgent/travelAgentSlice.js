import { createSlice } from "@reduxjs/toolkit"
import {apiSlice} from '../../../app/api/apiSlice'
const createMasterAgentSlice = createSlice({
    name: 'masterAgent',
    initialState: { 
        messages:null,
        list:[],
        detail: null,
        editAgent: null,
        detailAgent: {
        productList:[ {
            id:"1",
            product:"product permata",
            productCode:"123908",
            premiumPrice:"123",
            discount1:"123",
            discount2:"123",
            discount3:"123",
            totalCommision:"123",
            netToAgent:"123",
            },
            {
            id:"2",
            product:"product2",
            productCode:"123000",
            premiumPrice:"123",
            discount1:"123",
            discount2:"123",
            discount3:"123",
            totalCommision:"123",
            netToAgent:"123",
            },
            {
            id:"3",
            product:"product3",
            productCode:"1235555",
            premiumPrice:"123",
            discount1:"123",
            discount2:"123",
            discount3:"123",
            totalCommision:"123",
            netToAgent:"123",
            }],
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
        setEditAgent: (state, action) => {
            state.editAgent = action.payload
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

export const {setEditAgent,setProductAgentSelection,setProductAgent,setMasterAgent,setListAgent,setRoleUser,setDetailAgent,setFormAgent} = createMasterAgentSlice.actions

export default createMasterAgentSlice.reducer
export const listRoleUsers = (state) => state.agent.roleUser
export const listDetailAgent = (state) => state.agent.detail
export const editAgentVal = (state) => state.agent.editAgent
export const listAgent = (state) => state.agent.list
export const listAgentSelection = (state) => state.masterUser.selection
export const formAgent = (state) => state.agent.formagent
export const detailAgentProductaList = (state) => state.agent.detailAgent.productList
export const detailAgentProductSelection = (state) => state.agent.detailAgent.selection