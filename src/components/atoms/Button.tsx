import React, { FC, FormEvent, ReactNode } from 'react';
import styles from '@/styles/Button.module.css';

type Props = {
  onClick: (event: FormEvent) => void;
  text: string;
  secondary?: boolean;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

const Button: FC<Props> = ({ onClick, text, secondary, disabled, iconLeft, iconRight }) => {
  function getButtonStyle() {
    if (secondary) {
      return styles.buttonSecondary;
    }
    if (disabled) {
      return `${styles.buttonPrimary} ${styles.disabled}`;
    }
    return styles.buttonPrimary;
  }

  return (
    <div className={styles.container}>
      <button className={getButtonStyle()} type="submit" onClick={onClick} disabled={disabled}>
        {iconLeft && iconLeft}
        <p className={styles.buttonText}>{text}</p>
        {iconRight && iconRight}
      </button>
    </div>
  );
};

export default Button;
