import { apiSlice } from '../../../app/api/apiSlice';

export const policyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (data) => {
        const {
          page,
          size,
          productCode,
          bandType,
          planType,
          productType,
          areaGroup,
        } = data;
        let url = '/app/products';
        const params = new URLSearchParams();

        if (productCode !== '') {
          params.append('productCode', productCode);
        }
        if (bandType !== '') {
          params.append('bandType', bandType);
        }
        if (planType !== '') {
          params.append('planType', planType);
        }
        if (areaGroup !== '') {
          params.append('areaGroup', areaGroup);
        }
        if (productType !== '') {
          params.append('productType', productType);
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
        // console.log('resssssss', meta.response.headers.get('X-Total-Count'));
        return {
          response,
          totalCount: Number(meta.response.headers.get('X-Total-Count')),
        };
      },
    }),
    exportFile: builder.query({
      query: (data) => {
        const {
          page,
          size,
          productCode,
          bandType,
          planType,
          productType,
          areaGroup,
        } = data;
        let url = '/app/products/list/export';
        const params = new URLSearchParams();

        if (productCode !== '') {
          params.append('productCode', productCode);
        }
        if (bandType !== '') {
          params.append('bandType', bandType);
        }
        if (planType !== '') {
          params.append('planType', planType);
        }
        if (areaGroup !== '') {
          params.append('areaGroup', areaGroup);
        }
        if (productType !== '') {
          params.append('productType', productType);
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
          responseType: 'blob',
          responseHandler: (response) =>
            response.blob().then((blob) => URL.createObjectURL(blob)),
        };
      },
    }),
    // exportFile: builder.query({
    //   query: () => ({
    //     url: '/app/products/list/export',
    //     method: 'GET',
    //     responseType: 'blob',
    //     responseHandler: (response) =>
    //       response.blob().then((blob) => URL.createObjectURL(blob)),
    //   }),
    // }),
    createMasterProduct: builder.mutation({
      query: (payload) => ({
        url: '/app/products',
        method: 'POST',
        body: { ...payload },
        transformResponse: (response) => {
          // Custom response transformation logic here
          return response.data;
        },
      }),
      // OnQueryError
    }),
    updateMasterProduct: builder.mutation({
      query: (payload) => ({
        url: '/app/products',
        method: 'PUT',
        body: { ...payload },
        transformResponse: (response) => {
          // Custom response transformation logic here
          return response.data;
        },
      }),
      // OnQueryError
    }),
    getProductById: builder.query({
      query: (id) => {
        // const { page, size } = datas;
        return {
          url: `/app/products/${id}`,
        };
      },
    }),
    deleteProduct: builder.mutation({
      query: (id) => {
        // const { page, size } = datas;
        return {
          url: `/app/products/${id}`,
          method: 'DELETE',
        };
      },
    }),
    getProductAdditional: builder.query({
      query: () => {
        // const { page, size } = datas;
        return {
          url: '/app/products/additional-week?page=0&size=9999',
        };
      },
      transformResponse: (response, meta) => {
        return {
          response,
          totalCount: Number(meta.response.headers.get('X-Total-Count')),
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
    getListVariant: builder.query({
      query: () => {
        // const { page, size } = datas;
        return {
          url: '/app/variants?page=0&size=9999',
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
  useExportFileQuery,
  useGetProductAdditionalQuery,
  useUpdateMasterProductMutation,
  useCreateMasterProductMutation,
  useGetProductByIdMutation,
  useDeleteProductMutation,
  useGetProductTravelAgentQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetListVariantQuery,
} = policyApiSlice;
