import React, { FC, useState, ChangeEvent, FormEvent } from 'react';
import Modal from '../atoms/Modal';
import styles from './Login.module.css';

type Props = {
  isOpen: boolean;
  closeModal: () => void;
};

const Login: FC<Props> = ({ isOpen, closeModal }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (email && password) {
      try {
        const response = await fetch('http://localhost:4200/auth/login', {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        const userData = await response.json();
        console.log(userData);
      } catch (error) {
        console.error('Error fetching login', error);
      }
    }
  }

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} top={100} right={150}>
      <form className={styles.form}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <input className={styles.submit} type="submit" value="Log in" onClick={handleSubmit} />
      </form>
    </Modal>
  );
};

export default Login;
