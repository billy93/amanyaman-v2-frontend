import { apiSlice } from '../../../app/api/apiSlice';

export const systemParamsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVariants: builder.query({
      query: (data) => {
        const { page, size } = data;
        return {
          url: `/app/variants?page=${page}&size=${size}`,
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
      // providesTags: (result, error, arg) =>
      //         result
      //         ? [...result.map(({ id }) => ({ type: 'MasterQuery', id })), 'MasterQuery']
      //        : ['MasterQuery'],
    }),
    createVariant: builder.mutation({
      query: (users) => ({
        url: '/app/variants',
        method: 'POST',
        body: { ...users },
        transformResponse: (response) => {
          // Custom response transformation logic here
          return response.data;
        },
      }),
      // OnQueryError
    }),
    getVariantById: builder.query({
      prepareHeaders: (headers) => {
        headers.set('Cache-Control', 'no-store'); // Disable caching in the request headers
        return headers;
      },
      query: (id) => ({
        url: `/app/variants/${id}`,
        cachePolicy: 'no-cache',
      }),
      provideTags: (result, error, id) =>
        result ? [{ type: 'user', id }] : [],
    }),
    updateVariant: builder.mutation({
      query: (users) => ({
        url: '/app/variants',
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
  useGetVariantsQuery,
  useCreateVariantMutation,
  useGetVariantByIdQuery,
  useUpdateVariantMutation,
} = systemParamsApiSlice;
