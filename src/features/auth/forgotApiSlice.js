import { apiSlice } from "../../app/api/apiSlice";

export const forgotApiSlice = apiSlice.injectEndpoints({
   endpoints: builder => ({
        forgotPass: builder.query({
            query: (email) => ({
                url: `/app/users/getByEmail/${email}`,
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
            query: ({email}) => ({
                url: "/app/account/reset-password/init",
                method: "POST",
                body:{email}
            }),
        }),
        resetNewPassword: builder.mutation({
            query: (user) => ({
                url: "/app/account/reset-password/finish",
                method: "POST",
                body:{...user}
            }),
        })
    })

})

export const {
    useResetNewPasswordMutation,
    useForgotPassQuery,
    useSendEmailConfirmMutation
} = forgotApiSlice