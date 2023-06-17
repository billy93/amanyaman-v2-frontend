import { apiSlice } from "../../../app/api/apiSlice"

export const policyApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProductPrice: builder.query({
            query: (data) => {
                let url ='/app/product-travel-agents'
                const params = new URLSearchParams();

                 for (const filter in data) {
                    if (data[filter] !== '') {
                        if (filter === 'page' || filter === 'size' || filter === 'productCode' || filter === 'travellerType' || filter ==='travelAgent' || filter ==='bandType' || filter ==='areaGroup' || filter ==='planType') {
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
                method:"GET",
                prepareHeaders: (headers) => {
                    headers.append('Accept', 'application/json');
                    return headers;
                    },
                };
             },
             transformResponse(response, meta) {
                // console.log('resssssss', meta.response.headers.get('X-Total-Count'))
                return {response,totalCount: Number(meta.response.headers.get('X-Total-Count')) }
            },
            }),
            getTemplateFilePrice: builder.query({
            query: (url) => ({
                url:"/app/product-travel-agents/list/template/download",
                method: 'GET',
                responseType: 'blob',
                responseHandler: (response) => response.blob().then(blob => URL.createObjectURL(blob))
            }),
            }), 
            uploadFilePrice: builder.mutation({
            query: (file) => {
                return {
                url: `/app/product-travel-agents/import`,
                method: 'POST',
                body:file,
                formData: true,
                
                transform: response => {
                        console.log('repso',response);
                        return response;
                    },
                }
        },
        }),
    })
})

export const {
    useGetTemplateFilePriceQuery,
    useGetProductPriceQuery,
    useUploadFilePriceMutation
} = policyApiSlice 