import { apiSlice } from "../../../app/api/apiSlice";

export const getUserList = apiSlice.injectEndpoints({
   endpoints: builder => ({
        getUser: builder.query({
            query: () => ({
                url: `/app/users?page=0&size=10`,
                
            }),
        }),
        
    })

})

export const {
    useGetUserQuery
} = getUserList