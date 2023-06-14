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
    })
})

export const {
    useGetProductPriceQuery
} = policyApiSlice 