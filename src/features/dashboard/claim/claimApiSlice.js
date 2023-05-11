import { apiSlice } from "../../../app/api/apiSlice"

export const claimApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/policy',
            keepUnusedDataFor: 5,
        })
    })
})

export const {
    useGetUsersQuery
} = claimApiSlice 