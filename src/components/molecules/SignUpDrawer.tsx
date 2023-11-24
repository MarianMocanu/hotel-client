import React, { ChangeEvent, FC, useState, FormEvent, FocusEvent, useContext } from 'react';
import Drawer from '@/components/atoms/Drawer';
import styles from '@/styles/SignUpDrawer.module.css';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Filler from '../atoms/Filler';
import { signup } from '@/app/authAPI';
import { Context } from '../atoms/Context';
import { toast } from 'react-toastify';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Data = {
  value: string;
  validated: boolean;
  blurred: boolean;
};

type User = {
  name: Data;
  email: Data;
  phone: Data;
  address: Data;
  password: Data;
  confirmPassword: Data;
  dob: Data;
};

const SignUpDrawer: FC<Props> = ({ isOpen, onClose }) => {
  const { setError } = useContext(Context);

  const initialUserState: User = {
    name: { value: '', validated: false, blurred: false },
    email: { value: '', validated: false, blurred: false },
    phone: { value: '', validated: true, blurred: false },
    address: { value: '', validated: true, blurred: false },
    password: { value: '', validated: false, blurred: false },
    confirmPassword: { value: '', validated: false, blurred: false },
    dob: { value: '', validated: true, blurred: false },
  };
  const [user, setUser] = useState<User>(initialUserState);

  function handleClose(): void {
    onClose();
    setUser(initialUserState);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const name = event.target.name as keyof User;
    const userState = JSON.parse(JSON.stringify(user));
    userState[name].value = event.target.value;
    setUser(userState);
  }

  function validateOnBlur(event: FocusEvent<HTMLInputElement>): void {
    const userState = JSON.parse(JSON.stringify(user));
    const name = event.target.name as keyof User;
    userState[name].validated = validateInput(name, userState[name].value);
    userState[name].blurred = true;
    setUser(userState);
  }

  function validateInput(name: keyof User, value: string): boolean {
    switch (name) {
      case 'name':
        return value.length >= 5;
      case 'email':
        return /^.+@.+..+$/.test(value);
      case 'password':
        return value.length >= 5;
      case 'confirmPassword':
        return value === user.password.value;
      default:
        return true;
    }
  }

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    Object.keys(user).forEach((element: string) => {
      if (!user[element as keyof User].validated) {
        validateOnBlur({ target: { name: element as keyof User } } as FocusEvent<HTMLInputElement>);
      }
    });

    if (isUserValid()) {
      const userToSignUp: Record<keyof User, string> = {} as Record<keyof User, string>;
      Object.keys(user).forEach((element: string) => {
        if (user[element as keyof User].value) {
          userToSignUp[element as keyof User] = user[element as keyof User].value;
        }
      });
      try {
        const response = await signup(userToSignUp);
        if (response && response.ok) {
          const data = await response.json();
          if (data) {
            toast.success('Your account was created successfully!');
          } else {
            throw new Error('Error parsing response');
          }
        } else {
          throw new Error('Error signing up');
        }
      } catch (error) {
        console.error(error);
        setError({
          message: 'We could not sign you up. Make sure the information provided is correct.',
          shouldRefresh: true,
        });
      } finally {
        handleClose();
      }
    } else {
      setError({
        message: 'The information provided is not valid and needs to be modified',
        shouldRefresh: true,
      });
    }
  }

  function isUserValid(): boolean {
    return Object.keys(user).every((element: string) => user[element as keyof User].validated);
  }

  return (
    <Drawer
      title="Sign up for Comwell Club"
      subtitle="Become a member of Comwell Club for free and earn points everytime you stay with us.
      You'll also receive 25 points when you sign up."
      open={isOpen}
      onClose={handleClose}
      size={'25rem'}
      zIndex={1001}
    >
      <form className={styles.form}>
        <Input
          value={user.name.value}
          onChange={handleChange}
          placeholder="Full name"
          name="name"
          type="text"
          onBlur={validateOnBlur}
          showError={user.name.blurred ? !user.name.validated : false}
        />
        <Input
          value={user.email.value}
          onChange={handleChange}
          placeholder="Email"
          name="email"
          type="email"
          onBlur={validateOnBlur}
          showError={user.email.blurred ? !user.email.validated : false}
        />
        <Input
          value={user.address.value}
          onChange={handleChange}
          placeholder="Address"
          name="address"
          onBlur={validateOnBlur}
          type="text"
        />
        <Input
          value={user.phone.value}
          onChange={handleChange}
          placeholder="Phone number"
          onBlur={validateOnBlur}
          name="phone"
          type="text"
        />
        <Input
          value={user.password.value}
          onChange={handleChange}
          onBlur={validateOnBlur}
          placeholder="Password"
          showError={user.password.blurred ? !user.password.validated : false}
          name="password"
          type="password"
        />
        <Input
          value={user.confirmPassword.value}
          onBlur={validateOnBlur}
          onChange={handleChange}
          placeholder="Confirm password"
          name="confirmPassword"
          showError={user.confirmPassword.blurred ? !user.confirmPassword.validated : false}
          type="password"
        />
        <Input
          value={user.dob.value}
          onChange={handleChange}
          placeholder="Birthdate"
          onBlur={validateOnBlur}
          name="dob"
          type="date"
          animated={false}
        />
        <Filler />
        <Button onClick={handleSubmit} text="Sign up" />
      </form>
    </Drawer>
  );
};

export default SignUpDrawer;
