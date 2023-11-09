import { useState, useEffect } from 'react';
import { userLoginCurrent } from '../auth/authSlice';
import { useSelector } from 'react-redux';
const usePersist = () => {
  const token = useSelector(userLoginCurrent);
  const [persist, setPersist] = useState({
    token: JSON.parse(localStorage.getItem('persist'))
      ? JSON.parse(localStorage.getItem('persist')).token
      : null,
    isPersist: JSON.parse(localStorage.getItem('persist'))
      ? JSON.parse(localStorage.getItem('persist')).isPersist
      : true,
  });
  // console.log('test', persist);
  useEffect(() => {
    // localStorage.setItem(
    //   'persist',
    //   JSON.stringify({ token, isPersist: persist?.isPersist })
    // );
  }, [persist, token]);

  return [persist, setPersist];
};
export default usePersist;
