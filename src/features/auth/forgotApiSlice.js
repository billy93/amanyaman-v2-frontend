import { apiSlice } from '../../app/api/apiSlice';

export const forgotApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    forgotPass: builder.query({
      query: (email) => ({
        url: `/app/users/getByEmail/${email}`,
      }),
    }),
    sendEmailConfirm: builder.mutation({
      query: ({ email }) => ({
        url: '/app/account/reset-password/init',
        method: 'POST',
        body: { email },
      }),
    }),
    resetNewPassword: builder.mutation({
      query: (user) => ({
        url: '/app/account/reset-password/finish',
        method: 'POST',
        body: { ...user },
      }),
    }),
  }),
});

export const {
  useResetNewPasswordMutation,
  useForgotPassQuery,
  useSendEmailConfirmMutation,
} = forgotApiSlice;
