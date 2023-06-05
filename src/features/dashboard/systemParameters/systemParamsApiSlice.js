import { apiSlice } from "../../../app/api/apiSlice"

export const systemParamsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSystemParams: builder.query({
            query: (data) => {
                const { page, size } = data;
                return {
                    url: `/app/system-parameters?page=${page}&size=${size}`,
                    providesTags: (result, error, arg) =>
                    result
                    ? [...result.map(({ id }) => ({ type: 'MasterQuery', id })), 'MasterQuery']
                    : ['MasterQuery'],
                }
            },
    }),
        createParams: builder.mutation({
            query: (data) => {
                return {
                    url: `/app/system-parameters`,
                    method: "POST",
                    body:{...data},
                    invalidatesTags: (result, error, arg) =>
                    result
                    ? [...result.map(({ id }) => ({ type: 'MasterQuery', id })), 'MasterQuery']
                    : ['MasterQuery'],
                }
            },
    }),
        updateParams: builder.mutation({
            query: (data) => {
                return {
                    url: `/app/system-parameters`,
                    method: "PUT",
                    body:{...data},
                    invalidatesTags: (result, error, arg) =>
                    result
                    ? [...result.map(({ id }) => ({ type: 'MasterQuery', id })), 'MasterQuery']
                    : ['MasterQuery'],
                }
            },
        }),
        deleteParams: builder.mutation({
            query: (id) => {
                return {
                    url: `/app/system-parameters/${id}`,
                    method: "DELETE",
                    invalidatesTags: (result, error, arg) =>
                        result
                        ? [...result.map(({ id }) => ({ type: 'MasterQuery', id })), 'MasterQuery']
                        : ['MasterQuery'],
                }   
                
            },
            
        }),
    })
})

export const {
    useGetSystemParamsQuery,
    useCreateParamsMutation,
    useUpdateParamsMutation,
    useDeleteParamsMutation
} = systemParamsApiSlice 