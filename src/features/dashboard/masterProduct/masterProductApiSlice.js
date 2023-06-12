import { apiSlice } from "../../../app/api/apiSlice"

export const policyApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query({
            query: (data) => {
                const { page, size } = data;
                return {
                url: `/app/products?page=${page}&size=${size}`,
                method:"GET",
                prepareHeaders: (headers) => {
                    headers.append('Accept', 'application/json');
                    return headers;
                    },
                };
           },
            // transformResponse(response, meta) {
            //     console.log('resssssss', meta.response.headers.get('X-Total-Count'))
            //     return {response,totalCount: Number(meta.response.headers.get('X-Total-Count')) }
            // },
            // providesTags: (result, error, arg) =>
            //         result
            //         ? [...result.map(({ id }) => ({ type: 'MasterQuery', id })), 'MasterQuery']
            //        : ['MasterQuery'],
            }),
        
    })
})

export const {
    useGetProductsQuery
} = policyApiSlice 