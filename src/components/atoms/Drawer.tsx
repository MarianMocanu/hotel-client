import React, { FC, PropsWithChildren } from 'react';
import ModernDrawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import styles from '@/styles/Drawer.module.css';
import { FaTimes } from 'react-icons/fa';

interface Props extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: string;
  zIndex?: number;
}

const Drawer: FC<Props> = ({ open, onClose, children, title, subtitle, size, zIndex }) => {
  return (
    <ModernDrawer direction="right" open={open} onClose={onClose} size={size} zIndex={zIndex}>
      <div className={styles.container}>
        <div className={styles.horizontal}>
          <p className={styles.title}>{title}</p>
          <div className={styles.icon} onClick={onClose}>
            <FaTimes size={'1.1rem'} />
          </div>
        </div>
        {subtitle && <p className={styles.info}>{subtitle}</p>}
        {children}
      </div>
    </ModernDrawer>
  );
};
export default Drawer;
