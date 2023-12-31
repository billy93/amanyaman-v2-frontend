import { apiSlice } from '../../../app/api/apiSlice';

export const policyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductPrice: builder.query({
      query: (data) => {
        let url = '/app/product-travel-agents';
        const params = new URLSearchParams();

        for (const filter in data) {
          if (data[filter] !== '') {
            if (
              filter === 'page' ||
              filter === 'size' ||
              filter === 'productCode' ||
              filter === 'travellerType' ||
              filter === 'travelAgent' ||
              filter === 'bandType' ||
              filter === 'areaGroup' ||
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
    getById: builder.query({
      query: (id) => {
        // const { page, size } = datas;
        return {
          url: `/app/product-travel-agents/${id}`,
        };
      },
    }),
    deleteProductPrice: builder.mutation({
      query: (id) => {
        // const { page, size } = datas;
        return {
          url: `/app/product-travel-agents/${id}`,
          method: 'DELETE',
        };
      },
    }),
    getTemplateFilePrice: builder.query({
      query: (url) => ({
        url: '/app/product-travel-agents/list/template/download',
        method: 'GET',
        responseType: 'blob',
        responseHandler: (response) =>
          response.blob().then((blob) => URL.createObjectURL(blob)),
      }),
    }),
    // exportProductPrices: builder.query({
    //   query: (url) => ({
    //     url: '/app/product-travel-agents/list/export',
    //     method: 'GET',
    //     responseType: 'blob',
    //     responseHandler: (response) =>
    //       response.blob().then((blob) => URL.createObjectURL(blob)),
    //   }),
    // }),
    exportProductPrice: builder.query({
      query: (data) => {
        let url = '/app/product-travel-agents/list/export';
        const params = new URLSearchParams();

        for (const filter in data) {
          if (data[filter] !== '') {
            if (
              filter === 'page' ||
              filter === 'size' ||
              filter === 'productCode' ||
              filter === 'travellerType' ||
              filter === 'travelAgent' ||
              filter === 'bandType' ||
              filter === 'areaGroup' ||
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
          responseType: 'blob',
          responseHandler: (response) =>
            response.blob().then((blob) => URL.createObjectURL(blob)),
          prepareHeaders: (headers) => {
            headers.append('Accept', 'application/json');
            return headers;
          },
        };
      },
    }),
    updateProductPrice: builder.mutation({
      query: (data) => {
        return {
          url: '/app/product-travel-agents',
          method: 'PUT',
          body: { ...data },
        };
      },
    }),
    uploadFilePrice: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/app/product-travel-agents/import',
          method: 'POST',
          body: formData,

          transform: (response) => {
            console.log('repso', response);
            return response;
          },
        };
      },
    }),
  }),
});

export const {
  useGetByIdQuery,
  useGetTemplateFilePriceQuery,
  useGetProductPriceQuery,
  useUploadFilePriceMutation,
  useExportProductPriceQuery,
  useUpdateProductPriceMutation,
  useDeleteProductPriceMutation,
} = policyApiSlice;
