import { apiSlice } from '../../../app/api/apiSlice';
// import { setTotalCount } from './systemParamsSlice'

export const listCountry = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListArea: builder.query({
      query: (data) => {
        const { page, size } = data;
        return {
          url: `/app/areas?page=${page}&size=${size}`,
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
    createArea: builder.mutation({
      query: (users) => ({
        url: '/app/areas',
        method: 'POST',
        body: { ...users },
        transformResponse: (response) => {
          // Custom response transformation logic here
          return response.data;
        },
      }),
      // OnQueryError
    }),
    getAreaById: builder.query({
      prepareHeaders: (headers) => {
        headers.set('Cache-Control', 'no-store'); // Disable caching in the request headers
        return headers;
      },
      query: (id) => ({
        url: `/app/areas/${id}`,
        cachePolicy: 'no-cache',
      }),
      provideTags: (result, error, id) =>
        result ? [{ type: 'user', id }] : [],
    }),
    updateArea: builder.mutation({
      query: (users) => ({
        url: '/app/areas',
        method: 'PUT',
        body: { ...users },
        transformResponse: (response) => {
          // Custom response transformation logic here
          return response.data;
        },
      }),
      // OnQueryError
    }),
    deletedArea: builder.mutation({
      query: (id) => ({
        url: `/app/areas/${id}`,
        method: 'DELETE',
        transformResponse: (response) => {
          // Custom response transformation logic here
          return response.data;
        },
      }),
      // OnQueryError
    }),
  }),
});

export const {
  useGetListAreaQuery,
  useCreateAreaMutation,
  useGetAreaByIdQuery,
  useUpdateAreaMutation,
  useDeletedAreaMutation,
} = listCountry;
