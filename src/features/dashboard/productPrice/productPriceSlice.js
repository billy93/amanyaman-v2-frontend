import { createSlice } from "@reduxjs/toolkit"

const createMasterProductPriceSlice = createSlice({
    name: 'masterProductPrice',
    initialState: {
        isRefetch:false,
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
        formData: {
          travelAgentName:null,  
          productName:null,  
          premiumPrice:0,  
          commissionlvl1:0,  
          commissionlvl2:0,  
          commissionlvl3:0,  
          totalCommission:"",  
          afterCommission:"",  
          ppn:"",  
          pph23:"",  
        },
        travelAgent: [
            {
                id: "1",
                name:"Dwi Daya Tour",
                label:"Dwi Daya Tour",
            },
            {
                id: "2",
                name:"Golden Rama",
                label:"Golden Rama",
            },
            {
                id: "3",
                name:"Avia Tour",
                label:"Avia Tour",
            }
        ],
        products: [
            {
                id: "1",
                name:"Product 1",
                label:"Product 1",
            },
            {
                id: "2",
                name:"Product 2",
                label:"Product 2",
            },
            {
                id: "3",
                name:"Product 3",
                label:"Product 3",
            }
        ]
        
    },
    reducers: {
        setMasterProduct: (state, action) => {
            state.list = action.payload
        },
        setListSelectProduct: (state, action) => {
            state.selection = action.payload
        },
        setFormData: (state, action) => {
            state.formData = action.payload
        },
        setRefetch: (state, action) => {
            state.isRefetch = action.payload
        },
        
    },
})

export const {setRefetch,setFormData,setMasterProduct,setListSelectProduct} = createMasterProductPriceSlice.actions

export default createMasterProductPriceSlice.reducer
export const listProduct = (state) => state.productPrice.list
export const listAgent = (state) => state.productPrice.travelAgent
export const refetchdata = (state) => state.productPrice.isRefetch
export const listProducts = (state) => state.productPrice.products
export const formData = (state) => state.productPrice.formData
export const listProductSelection = (state) => state.productPrice.selection