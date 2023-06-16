import { apiSlice } from "../../../app/api/apiSlice";
// import OnQueryError from "../../../components/UseCustomToast";

export const getUserList = apiSlice.injectEndpoints({
   endpoints: builder => ({
       getRole: builder.query({
            query: () => ({
                url: `/app/authorities?page=0&size=999`,
                providesTags: [ 'RoleUser' ]
                
            }),
        }),
        getUsersById: builder.query({
           prepareHeaders: (headers) => {
            headers.set('Cache-Control', 'no-store'); // Disable caching in the request headers
            return headers;
            },
            query: (id) => ({
                url: `/app/users/getById/${id}`,
                cachePolicy: 'no-cache',
           }),
           provideTags: (result, error, id) => (result ? [{ type: 'user', id }] : [])
        }),
       downloadTemplate: builder.query({
            query: () => ({
                url: `/list/template/download`,
                
            }),
        }),
       getTemplateFile: builder.query({
            query: () => ({
                url:"/app/users/list/template/download",
                method: 'GET',
                responseType: 'blob',
                responseHandler: (response) => response.blob().then(blob => URL.createObjectURL(blob))
            }),
       }),
       getUser: builder.query({
            query: (datas) => {
                // const { page, size } = datas;
                const { page, size, name, email, role } = datas;
                console.log('name', name, email)
                let url ='/app/users'
                const params = new URLSearchParams();

                if (role !== '') {
                params.append('role', role);
                }
                if (email !== '') {
                params.append('email', email);
                }
                if (page !== '') {
                params.append('page', page);
                }
                if (size !== '') {
                params.append('size', size);
                }

                params.append('sort', 'createdDate,desc');
                if (name !== '') {
                const encodedTravelAgent = name.replace('%', '%25');
                params.append('name', encodedTravelAgent);
                }
            
                // Add other filter parameters if needed

                if (params.toString() !== '') {
                url += `?${params.toString()}`;
                }
                
                return {
                    url: url,
                    // transformResponse(apiResponse, meta) {
                    //         return { apiResponse, totalCount: Number(meta.response.headers.get('X-Total-Count')) }
                    // },
                    providesTags: (result, error, arg) =>
                    result
                    ? [...result.map(({ id }) => ({ type: 'MasterUser', id })), 'MasterUser']
                    : ['MasterUser'],
                }
            },
            transformResponse: (response, meta) => {
                return {response, totalCount: Number(meta.response.headers.get('X-Total-Count'))};
            }
        }),
        uploadFile: builder.mutation({
            query: (file) => {
                const formData = new FormData();
                formData.append('file', file);
                return {
                url: `/app/users/list/import`,
                method: 'POST',
                body: formData,
                // headers: { 'Content-Type': 'multipart/form-data' },
                }
            },
             invalidatesTags: (result, error, arg) => [{ type: 'MasterUser', id: arg.id }],
            
        }),
        exportUserdata: builder.mutation({
            query: () => {
                return {
                url: `/app/users/list/export?page=0&size=99999`,
                method: 'POST',
                responseType: 'blob',
                responseHandler: (response) => response.blob().then(blob => URL.createObjectURL(blob))
                // headers: { 'Content-Type': 'multipart/form-data' },
                }
            },
        }),
        createUser: builder.mutation({
            query: (users) => ({
                url: `/app/users`,
                method: "POST",
                body: { ...users },
                transformResponse: (response) => {
                    // Custom response transformation logic here
                    return response.data;
                },
            }),
                // OnQueryError
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
        
    }),
    onError: (error) => {
    // Modify the error response or handle it as needed
    const statusCode = error?.response?.status;
    const errorMessage = error?.response?.data?.message || 'An error occurred';
    console.error(`Request failed with status code ${statusCode}: ${errorMessage}`);
    throw error; // Re-throw the error to propagate to the query's onError handler
  },
})

export const {
    useGetUsersByIdQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useGetRoleQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetTemplateFileQuery,
    useUploadFileMutation,
    useDownloadTemplateQuery,
    useExportUserdataMutation
} = getUserList

