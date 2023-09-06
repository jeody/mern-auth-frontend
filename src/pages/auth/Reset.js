import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './auth.module.scss';
import Card from '../../components/card/Card';
import { MdPassword } from 'react-icons/md';
import PasswordInput from '../../components/passwordInput/PasswordInput';
import Loader from '../../components/loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { RESET, resetPassword } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';

const initialState = {
  password: '',
  password2: '',
};

const Reset = () => {
  const [formData, setFormData] = useState(initialState);
  const { password, password2 } = formData;

  const { resetToken } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isSuccess, message } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const reset = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      return toast.error('Passwords do not match');
    }

    if (password.length < 8) {
      return toast.error('Password must be up to 8 characters');
    }

    const userData = {
      password,
    };

    await dispatch(resetPassword({ userData, resetToken }));
  };

  useEffect(() => {
    if (isSuccess && message.includes('Reset succesful')) {
      navigate('/login');
    }

    dispatch(RESET());
  }, [dispatch, navigate, message, isSuccess]);

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className='--flex-center'>
            <MdPassword size={35} color='#999' />
          </div>

          <h2>Reset Password</h2>

          <form onSubmit={reset}>
            <PasswordInput
              placeholder='New Password'
              name='password'
              value={password}
              onChange={handleInputChange}
            />
            <PasswordInput
              placeholder='Confirm New Password'
              name='password2'
              value={password2}
              onChange={handleInputChange}
            />

            <button type='submit' className='--btn --btn-primary --btn-block'>
              Reset Password
            </button>
            <div className={styles.links}>
              <p>
                <Link to='/'>- Home</Link>
              </p>

              <p>
                <Link to='/login'>- Login</Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Reset;
