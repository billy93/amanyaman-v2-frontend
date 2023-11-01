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
    booksProducts: builder.mutation({
      query: (params) => {
        return {
          url: '/app/bookings',
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
    addTravellerData: builder.mutation({
      query: (params) => {
        return {
          url: '/app/bookings/fill-traveler-data/single',
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
    getExistingTraveller: builder.mutation({
      query: (params) => {
        return {
          url: '/app/bookings/travellers/existing',
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
    checkAvailabilityCredit: builder.mutation({
      query: (params) => {
        return {
          url: '/app/top/check-credit-limit',
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
    paymentProcced: builder.mutation({
      query: (params) => {
        return {
          url: '/app/bookings/payment/upgrade',
          method: 'POST',
          body: { ...params },
        };
      },
    }),
    editTravellerData: builder.mutation({
      query: (params) => {
        return {
          url: '/app/bookings/travellers/edit',
          method: 'PUT',
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
    deleteTravellerData: builder.mutation({
      query: (id) => {
        return {
          url: `/app/bookings/travellers/${id}`,
          method: 'Delete',
        };
      },
    }),
    getBookingSearch: builder.query({
      query: (id) => {
        return {
          url: `/app/bookings/search/${id}`,
          method: 'GET',
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
    getDetailBenefit: builder.query({
      query: (id) => {
        return {
          url: `/app/file-upload/product/brochure/files/brochure/${id}`,
          method: 'GET',
          // responseType: 'arrayBuffer',
          responseType: 'blob',
          responseHandler: (response) =>
            response.blob().then((blob) => URL.createObjectURL(blob)),
        };
      },
    }),
    getTemplate: builder.query({
      query: (url) => ({
        url: '/app/bookings/travellers/template/download',
        method: 'GET',
        responseType: 'blob',
        responseHandler: (response) =>
          response.blob().then((blob) => URL.createObjectURL(blob)),
      }),
    }),
    getCheckPayment: builder.query({
      query: (id) => ({
        url: `/app/payment/check/${id.id}`,
        method: 'GET',
      }),
    }),
    getListTraveller: builder.query({
      query: (id) => {
        return {
          url: `/app/bookings/travellers/${id}`,
          method: 'GET',
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
    getBookingsQuotation: builder.query({
      query: (id) => {
        return {
          url: `/app/bookings/quotation/${id}`,
          method: 'GET',
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
    importFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        // console.log('file', file);
        // console.log('file id', file?.id);
        formData.append('file', file.filesUpload);
        return {
          url: `/app/bookings/travellers/import/${file.id}`,
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
  useGetExistingTravellerMutation,
  useGetDetailBenefitQuery,
  useGetBookingsQuotationQuery,
  useGetCheckPaymentQuery,
  usePaymentProccedMutation,
  useCheckAvailabilityCreditMutation,
  useImportFileMutation,
  useGetTemplateQuery,
  useGetListTravellerQuery,
  useDeleteTravellerDataMutation,
  useEditTravellerDataMutation,
  useAddTravellerDataMutation,
  useGetBookingSearchQuery,
  useBooksProductsMutation,
  useGetListCountriesQuery,
  useSearchproductsMutation,
} = quotSearch;
