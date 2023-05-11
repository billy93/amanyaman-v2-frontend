import { createSlice } from "@reduxjs/toolkit"

const createClaimSlice = createSlice({
    name: 'createClaimStep',
    initialState: { 
        formState: {
            selectClaim: "",
            selectTraveller: "",
            timeLocation: {
             expirationDate:null,   
             time:"",   
             country:"",   
             descLocation:""   
            },
            incidentDescs: "",
            uploadDocument: [],
            financialDetails: {
              bankName:"",  
              bankNumber:"",  
              holderName:""  
            },
            defaultComponent: {
            input:[
				{
			    defaultForm: "GroupInput",
                    inputs: [
                    {
                    label: "Incident Date",
                    type: "date",
                    name: "incedentdate",
                    placeholder: "Incident Date",
                    value: "",
                    key:"1"
                    },
                    {
                        label: "Receipt Provider",
                        type: "text",
                        name: "receiptprovider",
                        placeholder: "Receipt Provider",
                        value: "",
                        key:"1"
                    },
                    {
                        label: "IDR",
                        type: "number",
                        name: "amount",
                        placeholder: "IDR",
                        value: "",
                        key:"1"
                    }
					]
				}
	  ]
            },
            expenses: [],
            
        },
        step:1
     },
    reducers: {
        setFormState: (state, action) => {
            const { step, selected } = action.payload
            state.formState.selectClaim = selected
            state.step = step
        },
        setFormStateTraveller: (state, action) => {
            const { step, selectTraveller } = action.payload
            state.formState.selectTraveller = selectTraveller
            state.step = step
        },
        setFormStateLocation: (state, action) => {
            const { step, timeLocation } = action.payload
            state.formState.timeLocation = timeLocation
            state.step = step
        },
        setFormStateIncidentDesc: (state, action) => {
            const { step, incidentDesc } = action.payload
            state.formState.incidentDescs = incidentDesc
            state.step = step
        },
        setFormStateExpenses: (state, action) => {
            const { step, expensesData } = action.payload
            console.log('act',action.payload)
            state.formState.expenses = expensesData
            state.step = step
        },
        addEpensesForm: (state, action) => {
            const { step, updateExpensesForm } = action.payload
            console.log('updateExpensesForm',action.payload)
            state.formState.defaultComponent = updateExpensesForm
            state.step = step
        },
        setuploadDoc: (state, action) => {
            const { step, document } = action.payload
            state.formState.uploadDocument = document
            state.step = step
        },
        setFinancialDetails: (state, action) => {
            const { step, financial } = action.payload
            state.formState.financialDetails = financial
            state.step = step
        },
        // setFormValueTempo: (state, action) => {
            
        // }
    },
})

export const { setFinancialDetails,setFormState,setFormStateTraveller,setFormStateLocation,setFormStateIncidentDesc,setFormStateExpenses,addEpensesForm,setuploadDoc } = createClaimSlice.actions

export default createClaimSlice.reducer

export const selectCurrentStep = (state) => state.createClaimForm?.step
export const selectClaimType = (state) => state.createClaimForm?.formState?.selectClaim
export const selectedTraveller = (state) => state.createClaimForm?.formState?.selectTraveller
export const selectedTimeLocation = (state) => state.createClaimForm?.formState?.timeLocation
export const incidentDescription = (state) => state.createClaimForm?.formState?.incidentDescs
export const expenses = (state) => state.createClaimForm?.formState?.expenses
export const listDoc = (state) => state.createClaimForm?.formState?.uploadDocument
export const financial = (state) => state.createClaimForm?.formState?.financialDetails
export const defaultForm = (state) => state.createClaimForm?.formState?.defaultComponent
