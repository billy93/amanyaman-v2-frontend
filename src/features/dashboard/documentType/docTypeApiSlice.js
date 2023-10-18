/* eslint-disable indent */
import { apiSlice } from '../../../app/api/apiSlice';
// import { setTotalCount } from './systemParamsSlice'

export const systemParamsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentTypes: builder.query({
      query: (data) => {
        const { page, size } = data;
        return {
          url: `/app/document-types?page=${page}&size=${size}`,
          method: 'GET',
          prepareHeaders: (headers) => {
            headers.append('Accept', 'application/json');
            return headers;
          },
        };
      },
      transformResponse(response, meta) {
        // console.log('resssssss', meta.response.headers.get('X-Total-Count'))
        return {
          response,
          totalCount: Number(meta.response.headers.get('X-Total-Count')),
        };
      },
      // providesTags: (result, error, arg) =>
      //         result
      //         ? [...result.map(({ id }) => ({ type: 'MasterQuery', id })), 'MasterQuery']
      //        : ['MasterQuery'],
    }),
    uploadFileDoc: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/app/document-types',
          method: 'POST',
          body: formData,

          transform: (response) => {
            console.log('repso', response);
            return response;
          },
        };
      },
    }),
    updateParams: builder.mutation({
      query: (data) => {
        return {
          url: '/app/system-parameters',
          method: 'PUT',
          body: { ...data },
          invalidatesTags: (result, error, arg) =>
            result
              ? [
                  ...result.map(({ id }) => ({ type: 'MasterQuery', id })),
                  'MasterQuery',
                ]
              : ['MasterQuery'],
        };
      },
    }),
    deleteParams: builder.mutation({
      query: (id) => {
        return {
          url: `/app/system-parameters/${id}`,
          method: 'DELETE',
          invalidatesTags: (result, error, arg) =>
            result
              ? [
                  ...result.map(({ id }) => ({ type: 'MasterQuery', id })),
                  'MasterQuery',
                ]
              : ['MasterQuery'],
        };
      },
    }),
  }),
});

export const {
  useGetDocumentTypesQuery,
  useGetSystemParamsQuery,
  useCreateParamsMutation,
  useUpdateParamsMutation,
  useDeleteParamsMutation,
  useUploadFileDocMutation,
} = systemParamsApiSlice;
