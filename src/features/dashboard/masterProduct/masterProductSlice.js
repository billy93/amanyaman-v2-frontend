import { createSlice } from "@reduxjs/toolkit"

const createMasterProductSlice = createSlice({
    name: 'masterProduct',
    initialState: {
        list: [
            {
                id: "1",
                productId: "13562452",
                productCode: "OT",
                productDetailCode: "A1F1",
                currency: "Rupiah",
                productDescription: "Asia 50 Family	",
                personalAccidentCover: "Coverage up to Rp. 50.000.000,-",
                medicalCover: "Coverage up to Rp. 50.000.000,",
                travelCover: "Coverage up to Rp. 50.000.000,-",
                productType: "Family",
                travelDuration: "1 - 5 days",
                additionalWeek: "-",
                updatedData: "27/10/20, at 13:54 PM"
            },
            {
                id: "2",
                productId: "13562452",
                productCode: "OT",
                productDetailCode: "A1F1",
                currency: "Rupiah",
                productDescription: "Asia 50 Family	",
                personalAccidentCover: "Coverage up to Rp. 50.000.000,-",
                medicalCover: "Coverage up to Rp. 50.000.000,",
                travelCover: "Coverage up to Rp. 50.000.000,-",
                productType: "Family",
                travelDuration: "1 - 5 days",
                additionalWeek: "-",
                updatedData: "27/10/20, at 13:54 PM"
            },
            {
                id: "3",
                productId: "13562452",
                productCode: "OT",
                productDetailCode: "A1F1",
                currency: "Rupiah",
                productDescription: "Asia 50 Family	",
                personalAccidentCover: "Coverage up to Rp. 50.000.000,-",
                medicalCover: "Coverage up to Rp. 50.000.000,",
                travelCover: "Coverage up to Rp. 50.000.000,-",
                productType: "Family",
                travelDuration: "1 - 5 days",
                additionalWeek: "-",
                updatedData: "27/10/20, at 13:54 PM"
            }],
        selection: [],
        
    },
    reducers: {
        setMasterProduct: (state, action) => {
            state.list = action.payload
        },
        setListSelectProduct: (state, action) => {
            state.selection = action.payload
        },
        
    },
})

export const {setMasterProduct,setListSelectProduct} = createMasterProductSlice.actions

export default createMasterProductSlice.reducer
export const listProduct = (state) => state.masterProduct.list
export const listProductSelection = (state) => state.masterProduct.selection