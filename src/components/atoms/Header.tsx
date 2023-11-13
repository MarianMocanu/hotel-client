import React, { FC, MouseEvent, PropsWithChildren, useContext } from 'react';
import styles from '@/styles/Header.module.css';
import Image from 'next/image';
import logo from '@/assets/logo.png';
import { FaChevronDown, FaUser, FaBars } from 'react-icons/fa';
import { Context } from './Context';

interface Props extends PropsWithChildren {
  handleLocationClick: (event: MouseEvent) => void;
  handleProfileClick: (event: MouseEvent) => void;
  handleMenuClick: (event: MouseEvent) => void;
}

const Header: FC<Props> = ({
  handleLocationClick,
  handleMenuClick,
  handleProfileClick,
  children,
}) => {
  const { user } = useContext(Context);

  return (
    <>
      <nav className={styles.nav}>
        <Image src={logo} alt="logo" height="40" />
        <ul className={styles.list}>
          <li className={styles.item} onClick={handleLocationClick}>
            Locations <FaChevronDown />
          </li>
          <li className={styles.item} onClick={handleProfileClick}>
            {user.name ? user.name : 'Profile'} <FaUser />
          </li>
          <li className={styles.item} onClick={handleMenuClick}>
            Menu <FaBars />
          </li>
        </ul>
      </nav>
      {children}
    </>
  );
};

export default Header;
