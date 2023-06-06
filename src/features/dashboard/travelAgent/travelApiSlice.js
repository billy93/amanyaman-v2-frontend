import { apiSlice } from "../../../app/api/apiSlice";
import Toast from '../../../components/toast';

export const getAgentList = apiSlice.injectEndpoints({
   endpoints: builder => ({
        getTravelAgent: builder.query({
            query: (datas) => {
                const { page, size } = datas;
                return {
                    url: `/app/travel-agents?page=${page}&size=${size}`,
                    providesTags: (result, error, arg) =>
                    result
                    ? [...result.map(({ id }) => ({ type: 'MasterAgent', id })), 'MasterAgent']
                    : ['MasterAgent'],
                }
            },
        }), 
       getTemplateFileAgent: builder.query({
            query: (url) => ({
                url:"/app/travel-agents/list/template/download",
                method: 'GET',
                responseType: 'blob',
                responseHandler: (response) => response.blob().then(blob => URL.createObjectURL(blob))
            }),
            }),     
        getCities: builder.query({
            query: (datas) => {
                const { page, size } = datas;
                return {
                    url: `/app/cities?page=${page}&size=${size}`,
                    providesTags: (result, error, arg) =>
                    result
                    ? [...result.map(({ id }) => ({ type: 'cities', id })), 'cities']
                    : ['cities'],
                }
            },
           }),       
           createAgent: builder.mutation({
               query: (users) => {
                   return {
                        url: `/app/travel-agents`,
                        method: "POST",
                        body: { ...users },
                        invalidatesTags: (result, error, arg) =>
                        result
                        ? [...result.map(({ id }) => ({ type: 'MasterAgent', id })), 'MasterAgent']
                        : ['MasterAgent'],
                        }
            }
        }),
           updateAgent: builder.mutation({
               query: (users) => {
                   return {
                        url: `/app/travel-agents`,
                        method: "PUT",
                        body: { ...users },
                        invalidatesTags: (result, error, arg) =>
                        result
                        ? [...result.map(({ id }) => ({ type: 'MasterAgent', id })), 'MasterAgent']
                        : ['MasterAgent'],
                        }
            }
        }),
        uploadFileTravelAgent: builder.mutation({
            query: (file) => {
                return {
                url: `/app/travel-agents/list/import`,
                method: 'POST',
                body:file,
                formData: true,
                
                transform: response => {
                        console.log('repso',response);
                        return response;
                    },
                }
        },
        }),
        deleteAgent: builder.mutation({
            query: (id) => {
                return {
                    url: `/app/travel-agents/${id}`,
                    method: "DELETE",
                    invalidatesTags: (result, error, arg) =>
                        result
                        ? [...result.map(({ id }) => ({ type: 'MasterAgent', id })), 'MasterAgent']
                        : ['MasterAgent'],
                }   
                
            },
            
        }),
    })

})

export const {
    useGetTravelAgentQuery,
    useCreateAgentMutation,
    useUpdateAgentMutation,
    useGetCitiesQuery,
    useDeleteAgentMutation,
    useUploadFileTravelAgentMutation,
    useGetTemplateFileAgentQuery
} = getAgentList