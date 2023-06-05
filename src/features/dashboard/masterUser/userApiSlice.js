import { apiSlice } from "../../../app/api/apiSlice";
import Toast from '../../../components/toast';

export const getUserList = apiSlice.injectEndpoints({
   endpoints: builder => ({
        getUser: builder.query({
            query: (datas) => {
                const { page, size } = datas;
                return {
                    url: `/app/users?page=${page}&size=${size}`,
                    providesTags: (result, error, arg) =>
                    result
                    ? [...result.map(({ id }) => ({ type: 'MasterUser', id })), 'MasterUser']
                    : ['MasterUser'],
                }
            },
           
            // async onQueryStarted(id, { dispatch, queryFulfilled }) {
            //     // `onStart` side-effect
            //     dispatch(Toast('Fetching post...'))
            //     try {
            //     const { data } = await queryFulfilled
            //     // `onSuccess` side-effect
            //         dispatch(Toast({
            //         title: 'Success',
            //         status: 'success',
            //         duration: 5,
            //         isClosable: true,
            //         position:'top-right'
            //     }))
            //     } catch (err) {
            //     // `onError` side-effect
            //     dispatch(Toast('Error fetching post!'))
            //     }
            // },
           }),
       getRole: builder.query({
            query: () => ({
                url: `/app/authorities?page=0&size=999`,
                providesTags: [ 'RoleUser' ]
                
            }),
        }),
        getTemplateFile: builder.query({
           query() {
                return {
                url: `/app/users/list/template/download`,
                method: "GET",
                responseHandler: (response) => response.blob().then(blob => URL.createObjectURL(blob)),
                cache: "no-cache",
                };
        //    query: () => {
        //        return {
        //             url: `/app/users/list/template/download`,
        //             method:"GET",
        //        }
            }
            
        }),
        
        uploadFile: builder.mutation({
            query: (file) => {
                const formData = new FormData();
                formData.append('file', file, file.name);
                console.log('body file', file)
                console.log('body', formData)
                return {
                url: `/app/users/list/import`,
                method: 'POST',
                body: formData
                // headers: { 'Content-Type': 'multipart/form-data' },
                }
        },
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
            invalidatesTags: (result, error, arg) => [{ type: 'MasterUser', id: arg.id }],
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
    useDeleteUserMutation,
    useGetTemplateFileQuery,
    useUploadFileMutation
} = getUserList