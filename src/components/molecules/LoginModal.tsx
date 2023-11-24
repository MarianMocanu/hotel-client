import React, { FC, useState, ChangeEvent, FormEvent, useContext, useEffect } from 'react';
import Modal from '@/components/atoms/Modal';
import styles from '@/styles/Login.module.css';
import Button from '../atoms/Button';
import { fetchProfile, login } from '@/app/authAPI';
import { Context, User } from '../atoms/Context';
import Input from '../atoms/Input';

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  onSignUpClick: () => void;
};

type Data = {
  value: string;
  validated: boolean;
  blurred: boolean;
};

const Login: FC<Props> = ({ isOpen, closeModal, onSignUpClick }) => {
  const [email, setEmail] = useState<Data>({} as Data);
  const [password, setPassword] = useState<Data>({} as Data);
  const { user, setUser, setError } = useContext(Context);

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail({ ...email, value: event.target.value });
  }

  function validateEmailOnBlur() {
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

  function validatePasswordOnBlur() {
    const newPasswordState = { ...password };
    if (password.value && password.value.length >= 5) {
      newPasswordState.validated = true;
    }
    if (!newPasswordState.blurred) {
      newPasswordState.blurred = true;
    }
    setPassword(newPasswordState);
  }

  async function handleLogin(event: FormEvent): Promise<void> {
    event.preventDefault();
    validateEmailOnBlur();
    validatePasswordOnBlur();
    if (email.validated && password.validated) {
      try {
        const response = await login(email.value, password.value);
        if (response && response.ok && response.json) {
          const data = await response.json();
          if (data && data.token) {
            localStorage.setItem('@token', data.token);
            const profile: User = await getLogin();
            if (profile.name && profile.email) {
              setUser(profile);
            }
          } else {
            throw new Error('Token not found');
          }
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error(error);
        setError({
          message:
            'An error occured when you tried to log in. Make sure your credentials are valid.',
          shouldRefresh: true,
        });
      } finally {
        closeModal();
      }
    }
  }

  async function getLogin() {
    try {
      const response = await fetchProfile();
      if (response && response.ok) {
        return await response.json();
      }
    } catch (error) {
      throw new Error('Error parsing response');
    }
  }

  async function handleLogout(event: FormEvent) {
    event.preventDefault();
    localStorage.removeItem('@token');
    setUser({} as User);
    closeModal();
  }

  // reinitialize form on close modal
  useEffect(() => {
    if (!isOpen) {
      setEmail({ value: '', validated: false, blurred: false } as Data);
      setPassword({ value: '', validated: false, blurred: false } as Data);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} top={'6.5rem'} right={'35rem'}>
      {!user.name ? (
        <form className={styles.form}>
          <Input
            onBlur={validateEmailOnBlur}
            name="email"
            type="email"
            placeholder="Email"
            value={email.value}
            onChange={handleEmailChange}
            showError={email.blurred ? !email.validated : false}
          />
          <Input
            name="password"
            onBlur={validatePasswordOnBlur}
            type="password"
            placeholder="Password"
            value={password.value}
            onChange={handlePasswordChange}
            showError={password.blurred ? !email.validated : false}
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
