import React, { ChangeEvent, FC, useState, FormEvent, FocusEvent } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import styles from '@/styles/SignUpDrawer.module.css';
import { FaTimes } from 'react-icons/fa';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Filler from '../atoms/Filler';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type User = {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  dob: string;
};

type InputField = 'name' | 'password' | 'confirmPassword' | 'email' | 'address' | 'phone' | 'dob';

const SignUpDrawer: FC<Props> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    dob: '',
  } as User);
  const [invalidInputs, setInvalidInputs] = useState<Set<InputField>>(new Set());

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { value, name } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  }

  function handleBlur(target: string): void {
    setInvalidInputs(prevState => {
      const newInvalidInputs = new Set(prevState);
      switch (target) {
        case 'name':
          if (!user.name || user.name.length < 5) {
            newInvalidInputs.add('name');
          } else {
            newInvalidInputs.delete('name');
          }
          break;
        case 'email':
          if (!user.email || !/^.+@.+..+$/.test(user.email)) {
            newInvalidInputs.add('email');
          } else {
            newInvalidInputs.delete('email');
          }
          break;
        case 'address':
          if (!user.address || user.address.length < 5) {
            newInvalidInputs.add('address');
          } else {
            newInvalidInputs.delete('address');
          }
          break;
        case 'phone':
          if (!user.phone || user.phone.length !== 8) {
            newInvalidInputs.add('phone');
          } else {
            newInvalidInputs.delete('phone');
          }
          break;
        case 'password':
          if (!user.password || user.password.length < 5) {
            newInvalidInputs.add('password');
          } else {
            newInvalidInputs.delete('password');
          }
          break;
        case 'confirmPassword':
          if (!user.confirmPassword || user.password !== user.confirmPassword) {
            newInvalidInputs.add('confirmPassword');
          } else {
            newInvalidInputs.delete('confirmPassword');
          }
          break;
        case 'dob':
          if (!user.dob) {
            newInvalidInputs.add('dob');
          } else {
            newInvalidInputs.delete('dob');
          }
          break;
        default:
          break;
      }
      return newInvalidInputs;
    });
  }

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();
    Object.keys(user).forEach(element => handleBlur(element));
  }

  return (
    <Drawer direction="right" open={isOpen} onClose={onClose} size={'25rem'} zIndex={1001}>
      <div className={styles.container}>
        <div className={styles.horizontal}>
          <p className={styles.title}>Sign up for Comwell Club</p>
          <div className={styles.icon} onClick={onClose}>
            <FaTimes size={'1.1rem'} />
          </div>
        </div>
        <p className={styles.info}>
          Become a member of Comwell Club for free and earn points everytime you stay with us.
          You'll also receive 25 points when you sign up.
        </p>

        <form className={styles.form}>
          <Input
            value={user.name}
            onChange={handleChange}
            placeholder="Full name"
            name="name"
            type="text"
            onBlur={handleBlur}
            isValid={!invalidInputs.has('name')}
          />
          <Input
            value={user.email}
            onChange={handleChange}
            placeholder="Email"
            name="email"
            type="email"
            onBlur={handleBlur}
            isValid={!invalidInputs.has('email')}
          />
          <Input
            value={user.address}
            onChange={handleChange}
            placeholder="Address"
            name="address"
            onBlur={handleBlur}
            type="text"
            isValid={!invalidInputs.has('address')}
          />
          <Input
            value={user.phone}
            onChange={handleChange}
            placeholder="Phone number"
            onBlur={handleBlur}
            name="phone"
            isValid={!invalidInputs.has('phone')}
            type="text"
          />
          <Input
            value={user.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Password"
            isValid={!invalidInputs.has('password')}
            name="password"
            type="password"
          />
          <Input
            value={user.confirmPassword}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Confirm password"
            name="confirmPassword"
            isValid={!invalidInputs.has('confirmPassword')}
            type="password"
          />
          <Input
            value={user.dob}
            onChange={handleChange}
            placeholder="Birthdate"
            onBlur={handleBlur}
            isValid={!invalidInputs.has('dob')}
            name="dob"
            type="date"
            animated={false}
          />
          <Filler />
          <Button onClick={handleSubmit} text="Sign up" />
        </form>
      </div>
    </Drawer>
  );
};

export default SignUpDrawer;
