/* eslint-disable indent */
import { apiSlice } from '../../../app/api/apiSlice';

export const quotSearch = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListCountries: builder.query({
      query: () => {
        // const { page, size } = data;
        return {
          url: '/app/countries?page=0&size=9999&sort=countryName',
          method: 'GET',
          prepareHeaders: (headers) => {
            headers.append('Accept', 'application/json');
            return headers;
          },
        };
      },
      transformResponse(response, meta) {
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
    searchproducts: builder.mutation({
      query: (params) => {
        return {
          url: '/app/bookings/search-product',
          method: 'POST',
          body: { ...params },
          invalidatesTags: (result, error, arg) =>
            result
              ? [
                  ...result.map(({ id }) => ({ type: 'MasterAgent', id })),
                  'MasterAgent',
                ]
              : ['MasterAgent'],
        };
      },
    }),
  }),
});

export const { useGetListCountriesQuery, useSearchproductsMutation } =
  quotSearch;
