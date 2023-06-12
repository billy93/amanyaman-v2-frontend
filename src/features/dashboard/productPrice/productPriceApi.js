import { apiSlice } from "../../../app/api/apiSlice"

export const policyApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProductPrice: builder.query({
            query: (data) => {
                const { page, size } = data;
                return {
                url: `/app/product-travel-agents?page=${page}&size=${size}`,
                method:"GET",
                prepareHeaders: (headers) => {
                    headers.append('Accept', 'application/json');
                    return headers;
                    },
                };
           },
            }),
    })
})

export const {
    useGetProductPriceQuery
} = policyApiSlice 