import React, { FC, useState, ChangeEvent, FormEvent, useContext, FocusEvent } from 'react';
import Modal from '@/components/atoms/Modal';
import styles from '@/styles/Login.module.css';
import Button from '../atoms/Button';
import { login } from '@/app/authAPI';
import { Context, User } from '../atoms/Context';
import Input from '../atoms/Input';

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  onSignUpClick: () => void;
};

const Login: FC<Props> = ({ isOpen, closeModal, onSignUpClick }) => {
  const [email, setEmail] = useState({ value: '', validated: false, blurred: false });
  const [password, setPassword] = useState({ value: '', validated: false, blurred: false });
  const { user, setUser } = useContext(Context);

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail({ ...email, value: event.target.value });
  }

  function handleEmailBlur(target: string) {
    const newEmailState = { ...email };
    if (newEmailState.value && /^.+@.+..+$/.test(email.value)) {
      newEmailState.validated = true;
    }
    if (!newEmailState.blurred) {
      newEmailState.blurred = true;
    }
    setEmail(newEmailState);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword({ ...password, value: event.target.value });
  }

  function handlePasswordBlur(target: string) {
    const newPasswordState = { ...password };
    if (password.value && password.value.length >= 5) {
      newPasswordState.validated = true;
    }
    if (!newPasswordState.blurred) {
      newPasswordState.blurred = true;
    }
    setPassword(newPasswordState);
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    if (email && password) {
      const response = await login(email.value, password.value);
      if (response?.ok) {
        try {
          const data = await response.json();
          localStorage.setItem('@token', data.token);
          // TODO: set user data after endpint gets fixed
          setUser({
            address: 'Here and there',
            dob: '1212123',
            email: 'm@m.com',
            name: 'Marian',
            phone: '12341324',
          });
        } catch (error) {
          console.error('Error parsing response', error);
        } finally {
          // closeModal();
          // setEmail('');
          // setPassword('');
        }
      }
    }
  }

  async function handleLogout(event: FormEvent) {
    event.preventDefault();
    localStorage.removeItem('@token');
    setUser({} as User);
    closeModal();
  }

  console.log(!!user.name);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} top={'6.5rem'} right={'35rem'}>
      {!user.name ? (
        <form className={styles.form}>
          <Input
            onBlur={handleEmailBlur}
            name="email"
            type="email"
            placeholder="Email"
            value={email.value}
            onChange={handleEmailChange}
            isValid={email.blurred ? email.validated : true}
          />
          <Input
            name="password"
            onBlur={handlePasswordBlur}
            type="password"
            placeholder="Password"
            value={password.value}
            onChange={handlePasswordChange}
            isValid={password.blurred ? email.validated : true}
          />
          <div className={styles.infoContainer}>
            <p className={styles.title}>Don't have an account?</p>
            <p className={styles.link} onClick={onSignUpClick}>
              Sign up for Comwell Club
            </p>
          </div>
          <Button text="Log in" onClick={handleLogin} />
        </form>
      ) : (
        <div className={styles.container}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, rem consectetur,
          exercitationem ipsam aspernatur nam temporibus id, sunt assumenda voluptates quos officia!
          Animi doloribus saepe ab iusto consequuntur non qui!
          <Button text="Log out" onClick={handleLogout} secondary />
        </div>
      )}
    </Modal>
  );
};

export default Login;
