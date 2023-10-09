import { apiSlice } from '../../../app/api/apiSlice';
// import { setTotalCount } from './systemParamsSlice'

export const listCountry = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListCity: builder.query({
      query: (data) => {
        const { page, size } = data;
        return {
          url: `/app/cities?page=${page}&size=${size}`,
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
    }),
    createCity: builder.mutation({
      query: (users) => ({
        url: '/app/cities',
        method: 'POST',
        body: { ...users },
        transformResponse: (response) => {
          // Custom response transformation logic here
          return response.data;
        },
      }),
      // OnQueryError
    }),
    getCityById: builder.query({
      prepareHeaders: (headers) => {
        headers.set('Cache-Control', 'no-store'); // Disable caching in the request headers
        return headers;
      },
      query: (id) => ({
        url: `/app/cities/${id}`,
        cachePolicy: 'no-cache',
      }),
      provideTags: (result, error, id) =>
        result ? [{ type: 'user', id }] : [],
    }),
    deleteCity: builder.mutation({
      prepareHeaders: (headers) => {
        headers.set('Cache-Control', 'no-store'); // Disable caching in the request headers
        return headers;
      },
      query: (id) => ({
        url: `/app/cities/${id}`,
        method: 'DELETE',
        cachePolicy: 'no-cache',
      }),
      provideTags: (result, error, id) =>
        result ? [{ type: 'user', id }] : [],
    }),
    updateCity: builder.mutation({
      query: (users) => ({
        url: '/app/cities',
        method: 'PUT',
        body: { ...users },
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
  useDeleteCityMutation,
  useGetListCityQuery,
  useCreateCityMutation,
  useGetCityByIdQuery,
  useUpdateCityMutation,
} = listCountry;
