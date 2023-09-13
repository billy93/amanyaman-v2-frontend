/* eslint-disable indent */
import { apiSlice } from '../../../app/api/apiSlice';

export const policyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPolicyList: builder.query({
      query: (data) => {
        let url = '/app/bookings/policies';
        const params = new URLSearchParams();
        console.log('quer', data);
        for (const filter in data) {
          if (data[filter] !== '') {
            if (
              filter === 'page' ||
              filter === 'size' ||
              filter === 'policyNumber' ||
              filter === 'traveller' ||
              filter === 'policyStatus' ||
              filter === 'purchaseDate' ||
              filter === 'planType'
            ) {
              params.append(filter, data[filter]);
            } else {
              params.append(filter, encodeURIComponent(data[filter]));
            }
          }
        }
        if (params.toString() !== '') {
          url += `?${params.toString()}`;
        }
        return {
          url: url,
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
    getBookingById: builder.query({
      query: (id) => {
        // const { page, size } = datas;
        return {
          url: `/app/bookings/${id}`,
        };
      },
    }),
  }),
});

export const { useGetPolicyListQuery, useGetBookingByIdQuery } = policyApiSlice;
