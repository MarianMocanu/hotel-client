import React, { FC, useState, ChangeEvent, HTMLInputTypeAttribute, FocusEvent } from 'react';
import styles from '@/styles/Input.module.css';
import { FaInfoCircle } from 'react-icons/fa';

const UX_ERRORS = {
  name: 'Minimum required length is 5 characters',
  email: 'Invalid email',
  address: 'Minimum required length is 5 characters',
  phone: 'Required length is 8 characters',
  password: 'Minimum required length is 5 characters',
  confirmPassword: 'Passwords do not match',
  dob: 'Required date selection',
};

type Props = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (target: FocusEvent<HTMLInputElement>) => void;
  placeholder: string;
  name: 'name' | 'password' | 'confirmPassword' | 'email' | 'address' | 'phone' | 'dob';
  type?: HTMLInputTypeAttribute;
  animated?: boolean;
  showError?: boolean;
};

const Input: FC<Props> = ({
  value,
  onChange,
  placeholder,
  name,
  type,
  animated,
  onBlur,
  showError,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur(event);
  };

  return (
    <div>
      <div
        className={
          !showError
            ? isFocused
              ? styles.focusedInputContainer
              : styles.inputContainer
            : styles.errorInputContainer
        }
      >
        <label
          htmlFor="animatedInput"
          className={
            animated
              ? !!value || isFocused
                ? styles.focusedLabel
                : styles.label
              : styles.focusedLabel
          }
        >
          {placeholder}
        </label>
        <input
          className={styles.input}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          id="animatedInput"
        />
      </div>
      <div className={!showError ? styles.horizontal : styles.error}>
        <FaInfoCircle color="red" />
        <div className={styles.message}>{UX_ERRORS[name]}</div>
      </div>
    </div>
  );
};

Input.defaultProps = {
  animated: true,
};

export default Input;
