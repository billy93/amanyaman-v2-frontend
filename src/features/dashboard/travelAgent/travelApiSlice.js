/* eslint-disable indent */
import { apiSlice } from '../../../app/api/apiSlice';

export const getAgentList = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTravelAgent: builder.query({
      query: (datas) => {
        const { page, size, custCode, travelAgentName } = datas;
        // console.log('agens', datas)
        let url = '/app/travel-agents';
        const params = new URLSearchParams();

        if (custCode !== '') {
          params.append('custcode', custCode);
        }
        if (page !== '') {
          params.append('page', page);
        }
        if (size !== '') {
          params.append('size', size);
        }

        if (travelAgentName !== '') {
          const encodedTravelAgent = travelAgentName.replace('%', '%25');
          params.append('travelAgentName', encodedTravelAgent);
        }

        // Add other filter parameters if needed

        if (params.toString() !== '') {
          url += `?${params.toString()}`;
        }

        return {
          url: url,
          providesTags: (result, error, arg) =>
            result
              ? [
                  ...result.map(({ id }) => ({ type: 'MasterAgent', id })),
                  'MasterAgent',
                ]
              : ['MasterAgent'],
        };
      },
      transformResponse: (response, meta) => {
        return {
          response,
          totalCount: Number(meta.response.headers.get('X-Total-Count')),
        };
      },
    }),
    getTemplateFileAgent: builder.query({
      query: (url) => ({
        url: '/app/travel-agents/list/template/download',
        method: 'GET',
        responseType: 'blob',
        responseHandler: (response) =>
          response.blob().then((blob) => URL.createObjectURL(blob)),
      }),
    }),
    getCities: builder.query({
      query: (datas) => {
        const { page, size } = datas;
        return {
          url: `/app/cities?page=${page}&size=${size}`,
          providesTags: (result, error, arg) =>
            result
              ? [...result.map(({ id }) => ({ type: 'cities', id })), 'cities']
              : ['cities'],
        };
      },
    }),
    getAgentById: builder.query({
      query: (id) => {
        // const { page, size } = datas;
        return {
          url: `/app/travel-agents/${id}`,
        };
      },
    }),
    getListAgentDetail: builder.query({
      query: (datas) => {
        const { id } = datas;
        return {
          url: `/app/travel-agents/products/${id}?page=0&size=9999`,
        };
      },
      transformResponse: (response, meta) => {
        return {
          response,
          totalCount: Number(meta.response.headers.get('X-Total-Count')),
        };
      },
    }),
    createAgent: builder.mutation({
      query: (users) => {
        return {
          url: '/app/travel-agents',
          method: 'POST',
          body: { ...users },
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
    updateAgent: builder.mutation({
      query: (users) => {
        return {
          url: '/app/travel-agents',
          method: 'PUT',
          body: { ...users },
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
    updateSelectProduct: builder.mutation({
      query: (payload) => {
        console.log('tesss', payload);
        return {
          url: '/app/product-travel-agents/active',
          method: 'PUT',
          body: { ...payload },
          invalidatesTags: (result, error, arg) =>
            result
              ? [
                  ...result.map(({ id }) => ({ type: 'MasterProduct', id })),
                  'MasterProduct',
                ]
              : ['MasterProduct'],
        };
      },
    }),
    uploadFileTravelAgent: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/app/travel-agents/list/import',
          method: 'POST',
          body: formData,

          transform: (response) => {
            console.log('repso', response);
            return response;
          },
        };
      },
    }),
    deleteAgent: builder.mutation({
      query: (id) => {
        return {
          url: `/app/travel-agents/${id}`,
          method: 'DELETE',
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

export const {
  useUpdateSelectProductMutation,
  useGetListAgentDetailQuery,
  useGetAgentByIdQuery,
  useGetTravelAgentQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useGetCitiesQuery,
  useDeleteAgentMutation,
  useUploadFileTravelAgentMutation,
  useGetTemplateFileAgentQuery,
} = getAgentList;
