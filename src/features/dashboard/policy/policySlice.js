import { createSlice } from "@reduxjs/toolkit"

const createPolicySlice = createSlice({
    name: 'policySlice',
    initialState: { 
        policy: {
            masterChecked: false,
            listPolicy: [
            {
                id: 1,
                policyNumber: "13562452",
                traveller: "Mr. Bayu Purnama",
                bookingId: "12345",
                product: "Amanyaman Asia 50",
                status:"Success",
                issuedBy:"Mr. Fadli as",
                purchaseDate:"15 november 2022",
                select:"false"
            },
            {
                id: 2,
                policyNumber: "94735395",
                traveller: "Mr. Dudung",
                bookingId: "12345",
                product: "Amanyaman Worldwide 50",
                status:"Success",
                issuedBy:"Mr. Rama ",
                purchaseDate: "25 november 2022",
                select:"false"
            }
            ],
            selectedPolicy:[]
        }
     },
    reducers: {
        setStatePolicyList: (state, action) => {
            const { data } = action.payload
            state.policy = action.payload
        },
        setStateSelectedt: (state, action) => {
            state.policy.selectedPolicy = action.payload
        },
    },
})

export const {setStatePolicyList,setStateSelectedt} = createPolicySlice.actions

export default createPolicySlice.reducer
export const listPolicy = (state) => state.policyList.policy
export const listSelected = (state) => state.policyList.policy?.selectedPolicy

