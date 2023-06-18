import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logOut } from '../../features/auth/authSlice';
import axios from 'axios';

const baseQuery = fetchBaseQuery(
  {
    baseUrl: 'https://amapi.ati-bv.dev/api',
    responseType: 'blob',
    tagTypes: [
      'MasterUser',
      'RoleUser',
      'MasterAgent',
      'cities',
      'MasterQuery',
    ],
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.userLogin?.id_token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  },
  axios
);

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    result?.error?.originalStatus === 401 ||
    result?.error?.status === 'FETCH_ERROR' ||
    localStorage.getItem('root') === undefined
  ) {
    console.log('sending refresh token', localStorage.getItem('root'));
    api.dispatch(logOut());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
