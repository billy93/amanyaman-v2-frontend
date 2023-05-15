import { apiSlice } from "../../app/api/apiSlice";

export const forgotApiSlice = apiSlice.injectEndpoints({
   endpoints: builder => ({
        forgotPass: builder.query({
            query: () => ({
                url: `/app/users/getByEmail/andreas.sutandi@atibusinessgroup.com`,
                // method: "GET",
                // body:{...email}
            }),
            // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
            //     try {
            //         const { data } = await queryFulfilled
            //         console.log('refresh token',data)
            //         const { accessToken } = data
            //         // dispatch(setCredentials({ accessToken }))
            //         console.log('ddddd', data)
            //     } catch (err) {
            //         console.log(err)
            //     }
            // }
        }),
        sendEmailConfirm: builder.mutation({
            query: init => ({
                url: "/app/account/reset-password/init",
                method: "POST",
                body:init
            }),
        })
    })

})

export const {
    useForgotPassQuery,
    useSendEmailConfirmMutation
} = forgotApiSlice