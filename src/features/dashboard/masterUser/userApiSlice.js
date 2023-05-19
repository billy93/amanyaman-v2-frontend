import { apiSlice } from "../../../app/api/apiSlice";

export const getUserList = apiSlice.injectEndpoints({
   endpoints: builder => ({
        getUser: builder.query({
            query: () => ({
                url: `/app/users?page=0&size=10`,
                providesTags: (result, error, arg) =>
                result
                ? [...result.map(({ id }) => ({ type: 'MasterUser', id })), 'MasterUser']
                : ['MasterUser'],
            }),
           }),
       getRole: builder.query({
            query: () => ({
                url: `/app/authorities?page=0&size=999`,
                providesTags: [ 'RoleUser' ]
                
            }),
        }),
        createUser: builder.mutation({
            query: (users) => ({
                url: `/app/users`,
                method: "POST",
                body:{...users}
            }),
        }),
        updateUser: builder.mutation({
            query: (users) => ({
                url: `/app/users`,
                method: "PUT",
                body: { ...users },
            }),
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/app/users/${id}`,
                method: "DELETE",
            }),
        }),
        
    })

})

export const {
    useGetUserQuery,
    useCreateUserMutation,
    useGetRoleQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
} = getUserList