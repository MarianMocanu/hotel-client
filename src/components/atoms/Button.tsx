import React, { FC, FormEvent } from 'react';
import styles from '@/styles/Button.module.css';

type Props = {
  onClick: (event: FormEvent) => void;
  text: string;
  secondary?: boolean;
};

const Button: FC<Props> = ({ onClick, text, secondary }) => {
  function getButtonStyle() {
    if (secondary) {
      return styles.buttonSecondary;
    }
    return styles.buttonPrimary;
  }

  return (
    <div className={styles.container}>
      <input className={getButtonStyle()} type="submit" value={text} onClick={onClick} />
    </div>
  );
};

export default Button;
