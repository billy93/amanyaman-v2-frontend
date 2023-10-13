/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useQuery from './useQuery';

import { useGetCheckPaymentQuery } from '../features/dashboard/quota-search/policyApiSlice';
import PageLoader from './pageLoader';

const Redirect = () => {
  const query = useQuery();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const {
    data: checkstatus,
    error,
    isSuccess,
    refetch,
  } = useGetCheckPaymentQuery(
    { id: searchParams.get('RL') },
    {
      onSuccess: (data) => {
        console.log('Data fetched successfully:', data);
        // Handle the successful data response here
      },
    },
    {
      onError: (error) => {
        if (error.response) {
          const status = error.response.status;
          console.error(`Request failed with status: ${status}`);
          // Handle the error based on the response status code
        } else {
          console.error('An unknown error occurred:', error);
        }
      },
    }
  );

  const [loading] = React.useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  React.useEffect(() => {
    // Fetch data initially
    refetch();

    // Call the API every 2 seconds
    const interval = setInterval(refetch, 2000);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [refetch]); // E

  React.useEffect(() => {
    if (isSuccess) {
      navigate(`/payment/success/${searchParams.get('RL')}`);
    }
  }, [isSuccess, searchParams, navigate]);
  // const [queryParams] = React.useState({
  //   LANGUAGE: query.get('language'),
  //   APPROVAL_CODE: query.get('approval_code'),
  //   PAYMENT_TYPE: query.get('payment_type'),
  //   SITE: query.get('site'),
  //   STATUS: query.get('status'),
  //   CHECKSUM: query.get('checksum'),
  //   ACKNOWLEDGEMENT_URL: query.get('acknowledgement_url'),
  //   PAYMENT_REFERENCE: query.get('payment_reference'),
  //   SIGNATURE: query.get('signature'),
  //   MASKED_CARD: query.get('masked_card'),
  //   PROMO_AMOUNT: query.get('promo_amount'),
  //   PROMO_NAME: query.get('promo_name'),
  //   INVOICE_NUMBER: query.get('invoice_number'),
  //   RL: query.get('rl'),
  // });

  // async function fetchData(url, param, route) {
  //   try {
  //     console.log(serialize(param))
  //     let res = await axios.get(`${url}?${serialize(param)}`);
  //     console.log(res);

  //     if (res.data) {
  //       // setResponse(res.data);
  //       localStorage.setItem('voucher', JSON.stringify(res.data));
  //       history.push({
  //         pathname: route,
  //         // search: '?query=abc',
  //         state: { data: res.data },
  //       });
  //       setLoading(false);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // const serialize = (obj) => {
  //   var str = [];
  //   // eslint-disable-next-line no-prototype-builtins
  //   for (var p in obj)
  //     if (obj.hasOwnProperty(p)) {
  //       str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
  //     }
  //   return str.join('&');
  // };

  // return null;
  // return convert(response);
  return <PageLoader loading={loading} />;
};

export default Redirect;
