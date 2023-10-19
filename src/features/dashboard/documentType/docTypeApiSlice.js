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
    getDocById: builder.query({
      prepareHeaders: (headers) => {
        headers.set('Cache-Control', 'no-store'); // Disable caching in the request headers
        return headers;
      },
      query: (id) => ({
        url: `/app/document-types/${id}`,
        cachePolicy: 'no-cache',
      }),
      provideTags: (result, error, id) =>
        result ? [{ type: 'user', id }] : [],
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
    updateFileDoc: builder.mutation({
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
    deleteDocument: builder.mutation({
      query: (id) => {
        return {
          url: `/app/document-types/${id}`,
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
  useDeleteDocumentTypesQuery,
  useUploadFileDocMutation,
  useGetDocByIdQuery,
  useUpdateFileDocMutation,
} = systemParamsApiSlice;
