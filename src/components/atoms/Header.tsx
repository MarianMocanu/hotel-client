import React, { FC } from 'react';
import styles from './Header.module.css';
import Image from 'next/image';
import logo from '@/assets/logo.png';
import { FaChevronDown, FaUser, FaBars } from 'react-icons/fa';

const Header: FC = () => {
  return (
    <nav className={styles.nav}>
      <Image src={logo} alt="logo" height="40" />
      <ul className={styles.list}>
        <li className={styles.item}>
          Locations <FaChevronDown />
        </li>
        <li className={styles.item}>
          Profile <FaUser />
        </li>
        <li className={styles.item}>
          Menu <FaBars />
        </li>
      </ul>
    </nav>
  );
};

export default Header;
