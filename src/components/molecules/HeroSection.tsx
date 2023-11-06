import React from 'react'
import styles from './HeroSection.module.css'
import SearchEngine from './SearchEngine'

function HeroSection() {
  return (
    <section className={styles.imgbg}>
        <SearchEngine />
    </section>
  )
}

export default HeroSection