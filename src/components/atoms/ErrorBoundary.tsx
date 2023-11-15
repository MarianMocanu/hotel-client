import React, { useContext, FC, MouseEvent } from 'react';
import { Context } from './Context';
import styles from '@/styles/ErrorBoundary.module.css';
import { FaTimes } from 'react-icons/fa';
import Button from './Button';

const ErrorBoundary: FC = () => {
  const { error, setError } = useContext(Context);

  function handleClick(): void {
    setError(null);
  }

  function handleContentClick(e: MouseEvent<HTMLDivElement>): void {
    e.stopPropagation();
  }

  function handleReload(): void {
    window.location.reload();
  }

  return (
    <>
      {error && (
        <div className={styles.modal} onClick={handleClick}>
          <div className={styles.modalContent} onClick={handleContentClick}>
            <div className={styles.horizontal}>
              <h2>Something went wrong</h2>
              <div className={styles.icon} onClick={handleClick}>
                <FaTimes size={'1.1rem'} />
              </div>
            </div>
            <p className={styles.message}>{error.message}</p>
            <p className={styles.message}>Please refresh the page and try again</p>
            {error.shouldRefresh && (
              <Button secondary onClick={handleReload} text="Reload"></Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorBoundary;
