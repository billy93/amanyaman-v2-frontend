import { apiSlice } from "../../../app/api/apiSlice"

export const policyApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProductsAgent: builder.query({
            query: (data) => {
                let url ='/app/product-travel-agents/agent'
                const queryParams = [];

                 for (const filter in data) {
                    if (data[filter] !== '') {
                        if (filter === 'page' || filter === 'size' || filter === 'productCode' || filter === 'travellerType' || filter ==='travelAgent' || filter ==='bandType' || filter ==='areaGroup' || filter ==='planType') {
                       queryParams.push(`${filter}=${data[filter]}`);
                        } else {
                        queryParams.push(`${filter}=${encodeURIComponent(data[filter])}`);
                        }
                    }
                 }
                 if (queryParams.length > 0) {
                    url += `?${queryParams.join('&')}`;
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
            }),
    })
})

export const {
    useGetProductsAgentQuery
} = policyApiSlice 