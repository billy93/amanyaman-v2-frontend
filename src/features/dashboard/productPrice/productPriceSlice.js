import { createSlice } from "@reduxjs/toolkit"

const createMasterProductPriceSlice = createSlice({
    name: 'masterProductPrice',
    initialState: {
        list: [
            {
                priceId: "1",
                travelAgent: "CUSTOMER GENERAL	",
                coverageType: "single",
                travellerType:"family",
                product: "Asia 50 Family (1 - 5 days)	",
                productDetailCode: "A1F1",
                premiumPrice:"115.000",
                discountlvl1: "35.00%",
                discountlvl2: "0.00%",
                discountlvl3: "0.00%",
                totalCommission:"40.2499",
                netToAgent:"73.000",
            },
            {
                priceId: "2",
                travelAgent: "PANORAMA	",
                coverageType: "anual",
                travellerType:"single",
                product: "Asia 50 Family (1 - 5 days)	",
                productDetailCode: "A1F1",
                premiumPrice:"115.000",
                discountlvl1: "35.00%",
                discountlvl2: "0.00%",
                discountlvl3: "0.00%",
                totalCommission:"40.2499",
                netToAgent:"73.000",
            },
            {
                priceId: "3",
                travelAgent: " Golden Rama",
                coverageType: "single",
                travellerType:"single",
                product: "Asia 50 Family (1 - 5 days)	",
                productDetailCode: "A1F1",
                premiumPrice:"115.000",
                discountlvl1: "35.00%",
                discountlvl2: "0.00%",
                discountlvl3: "0.00%",
                totalCommission:"40.2499",
                netToAgent:"73.000",
            },
            {
                priceId: "4",
                travelAgent: "AVIA TOUR	",
                coverageType: "anual",
                travellerType:"family",
                product: "Asia 50 Family (1 - 5 days)	",
                productDetailCode: "A1F1",
                premiumPrice:"115.000",
                discountlvl1: "35.00%",
                discountlvl2: "0.00%",
                discountlvl3: "0.00%",
                totalCommission:"40.2499",
                netToAgent:"73.000",
            },
        ],
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

export const {setMasterProduct,setListSelectProduct} = createMasterProductPriceSlice.actions

export default createMasterProductPriceSlice.reducer
export const listProduct = (state) => state.productPrice.list
export const listProductSelection = (state) => state.productPrice.selection