import { apiSlice } from '../../../app/api/apiSlice';
// import { setTotalCount } from './systemParamsSlice'

export const listCountry = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListAreaGroup: builder.query({
      query: (data) => {
        const { page, size } = data;
        return {
          url: `/app/area-groups?page=${page}&size=${size}`,
          method: 'GET',
          prepareHeaders: (headers) => {
            headers.append('Accept', 'application/json');
            return headers;
          },
        };
      },
      transformResponse(response, meta) {
        console.log('resssssss', meta.response.headers.get('X-Total-Count'));
        return {
          response,
          totalCount: Number(meta.response.headers.get('X-Total-Count')),
        };
      },
    }),
    createGroupArea: builder.mutation({
      query: (users) => ({
        url: '/app/area-groups',
        method: 'POST',
        body: { ...users },
        transformResponse: (response) => {
          // Custom response transformation logic here
          return response.data;
        },
      }),
      // OnQueryError
    }),
    getGroupAreaById: builder.query({
      prepareHeaders: (headers) => {
        headers.set('Cache-Control', 'no-store'); // Disable caching in the request headers
        return headers;
      },
      query: (id) => ({
        url: `/app/area-groups/${id}`,
        cachePolicy: 'no-cache',
      }),
      provideTags: (result, error, id) =>
        result ? [{ type: 'user', id }] : [],
    }),
    updateGroupArea: builder.mutation({
      query: (users) => ({
        url: '/app/area-groups',
        method: 'PUT',
        body: { ...users },
        transformResponse: (response) => {
          // Custom response transformation logic here
          return response.data;
        },
      }),
      // OnQueryError
    }),
    deletedGroupArea: builder.mutation({
      prepareHeaders: (headers) => {
        headers.set('Cache-Control', 'no-store'); // Disable caching in the request headers
        return headers;
      },
      query: (id) => ({
        url: `/app/area-groups/${id}`,
        method: 'DELETE',
        cachePolicy: 'no-cache',
      }),
      provideTags: (result, error, id) =>
        result ? [{ type: 'user', id }] : [],
    }),
  }),
});

export const {
  useDeletedGroupAreaMutation,
  useGetListAreaGroupQuery,
  useCreateGroupAreaMutation,
  useUpdateGroupAreaMutation,
  useGetGroupAreaByIdQuery,
} = listCountry;
