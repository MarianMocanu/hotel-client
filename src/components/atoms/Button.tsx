import React, { FC, FormEvent } from 'react';
import styles from '@/styles/Button.module.css';

type Props = {
  onClick: (event: FormEvent) => void;
  text: string;
  secondary?: boolean;
  disabled?: boolean;
};

const Button: FC<Props> = ({ onClick, text, secondary, disabled }) => {
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
      <input
        className={getButtonStyle()}
        type="submit"
        value={text}
        onClick={onClick}
        disabled={disabled}
      />
    </div>
  );
};

export default Button;
