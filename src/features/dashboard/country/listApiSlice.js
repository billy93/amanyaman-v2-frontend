import { apiSlice } from '../../../app/api/apiSlice';
// import { setTotalCount } from './systemParamsSlice'

export const listCountry = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListCountry: builder.query({
      query: (data) => {
        const { page, size } = data;
        return {
          url: `/app/countries?page=${page}&size=${size}`,
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
    createCountry: builder.mutation({
      query: (users) => ({
        url: '/app/countries',
        method: 'POST',
        body: { ...users },
        transformResponse: (response) => {
          // Custom response transformation logic here
          return response.data;
        },
      }),
      // OnQueryError
    }),
    getCountryById: builder.query({
      prepareHeaders: (headers) => {
        headers.set('Cache-Control', 'no-store'); // Disable caching in the request headers
        return headers;
      },
      query: (id) => ({
        url: `/app/countries/${id}`,
        cachePolicy: 'no-cache',
      }),
      provideTags: (result, error, id) =>
        result ? [{ type: 'user', id }] : [],
    }),
    updateCountry: builder.mutation({
      query: (users) => ({
        url: '/app/countries',
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
  useGetListCountryQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useGetCountryByIdQuery,
} = listCountry;
