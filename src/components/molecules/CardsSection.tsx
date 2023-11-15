import React from 'react';
import styles from '@/styles/CardsSection.module.css';

function CardsSection() {
  const cardsData = [
    {
      title: 'Let us help you with your next meeting',
      tag: 'see premises and meeting packages',
      subtitle: 'We have the premises, the good catering and professional meeting planning.',
    },
    {
      title: 'Christmas party with food and music',
      tag: 'put a mark in your calendar',
      subtitle: "See the hotels' Christmas offers for you.",
    },
  ];
  return (
    <section className={styles.grid}>
      {cardsData.map((card, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.grad}>
            <div className={styles.tag}>{card.tag}</div>
            <div className={styles.container}>
              <p className={styles.title}>{card.title}</p>
              <p className={styles.subtitle}>{card.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default CardsSection;
