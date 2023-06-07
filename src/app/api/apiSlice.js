import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://amapi.ati-bv.dev/api',
    responseType:"blob",
    tagTypes: ['MasterUser','RoleUser','MasterAgent','cities','MasterQuery'],
    refetchOnMountOrArgChange: 30,
    refetchOnReconnect: true,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.userLogin?.id_token
        // console.log('tt', getState())
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
            // headers.set('Content-Type', 'application/json') 
        }
        return headers
    },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    //    console.log('ssssiiss', result?.meta?.headers)
    if (result?.error?.originalStatus === 401 || result?.error?.status ==='FETCH_ERROR' || localStorage.getItem('root')===undefined) {
        console.log('sending refresh token', localStorage.getItem('root'))
        // send refresh token to get new access token
        // const refreshResult = await baseQuery('/refresh', api, extraOptions)
        // console.log(refreshResult)
        // if (refreshResult?.data) {
        //     const user = api.getState().auth.user
        //     // store the new token
        //     api.dispatch(setCredentials({ ...refreshResult.data, user }))
        //     // retry the original query with new access token
        //     result = await baseQuery(args, api, extraOptions)
        // } else {
        //     api.dispatch(logOut())
        // }
        api.dispatch(logOut())
    } 

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})