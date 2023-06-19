import { apiSlice } from '../../../app/api/apiSlice';

export const policyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (data) => {
        const { page, size, productCode, bandType } = data;
        let url = '/app/products';
        const params = new URLSearchParams();

        if (productCode !== '') {
          params.append('productCode', productCode);
        }
        if (bandType !== '') {
          params.append('bandType', bandType);
        }
        if (page !== '') {
          params.append('page', page);
        }
        if (size !== '') {
          params.append('size', size);
        }

        // params.append('sort', 'createdDate,desc');

        // Add other filter parameters if needed

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
        console.log('resssssss', meta.response.headers.get('X-Total-Count'));
        return {
          response,
          totalCount: Number(meta.response.headers.get('X-Total-Count')),
        };
      },
    }),
    getProductById: builder.query({
      query: (id) => {
        // const { page, size } = datas;
        return {
          url: `/app/products/${id}`,
        };
      },
    }),
    getProductTravelAgent: builder.query({
      query: (id) => {
        // const { page, size } = datas;
        return {
          url: `/app/products/travel-agents/${id}`,
        };
      },
      transformResponse: (response, meta) => {
        return {
          response,
          totalCount: Number(meta.response.headers.get('X-Total-Count')),
        };
      },
    }),
  }),
});

export const {
  useGetProductTravelAgentQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
} = policyApiSlice;
