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
  }),
});

export const { useGetListAreaGroupQuery } = listCountry;
