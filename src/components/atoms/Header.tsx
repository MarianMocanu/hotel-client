import React from 'react'
import styles from './Header.module.css'
import Image from 'next/image'
import logo from '@/assets/logo.png'


function Header()  {
  return (
    <nav className={styles.nav}>
        <Image src={logo} alt="logo" height="40" />
        <ul className={styles.list}>
            <li>Locations</li>
            <li>Profile</li>
            <li>Menu</li>
        </ul>
    </nav>
  )
}

export default Header