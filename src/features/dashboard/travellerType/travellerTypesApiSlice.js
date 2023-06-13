import { apiSlice } from "../../../app/api/apiSlice"
// import { setTotalCount } from './systemParamsSlice'

export const systemParamsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
       getTravellerTypes: builder.query({
            query: (data) => {
                const { page, size } = data;
                return {
                url: `/app/traveller-types?page=${page}&size=${size}`,
                method:"GET",
                prepareHeaders: (headers) => {
                    headers.append('Accept', 'application/json');
                    return headers;
                    },
                };
           },
            transformResponse(response, meta) {
                console.log('resssssss', meta.response.headers.get('X-Total-Count'))
                return {response,totalCount: Number(meta.response.headers.get('X-Total-Count')) }
            },
            // providesTags: (result, error, arg) =>
            //         result
            //         ? [...result.map(({ id }) => ({ type: 'MasterQuery', id })), 'MasterQuery']
            //        : ['MasterQuery'],
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
    useGetTravellerTypesQuery,
    useGetSystemParamsQuery,
    useCreateParamsMutation,
    useUpdateParamsMutation,
    useDeleteParamsMutation
} = systemParamsApiSlice 