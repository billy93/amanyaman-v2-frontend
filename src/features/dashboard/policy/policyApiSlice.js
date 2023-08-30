/* eslint-disable indent */
import { apiSlice } from '../../../app/api/apiSlice';

export const policyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPolicyList: builder.query({
      query: (datas) => {
        const { page, size } = datas;
        return {
          url: `/app/bookings/policies?page=${page}&size=${size}`,
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
  }),
});

export const { useGetPolicyListQuery } = policyApiSlice;
