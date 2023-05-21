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
           createAgent: builder.mutation({
               query: (users) => {
                   return {
                        url: `/app/travel-agent`,
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
                        url: `/app/travel-agent`,
                        method: "PUT",
                        body: { ...users },
                        invalidatesTags: (result, error, arg) =>
                        result
                        ? [...result.map(({ id }) => ({ type: 'MasterAgent', id })), 'MasterAgent']
                        : ['MasterAgent'],
                        }
            }
        }),
    })

})

export const {
    useGetTravelAgentQuery,
    useCreateAgentMutation,
    useUpdateAgentMutation
} = getAgentList