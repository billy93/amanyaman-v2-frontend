import { apiSlice } from "../../../app/api/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/app/users?page=0&size=10',
        })
    })
})

export const {
    useGetUsersQuery
} = userApiSlice 