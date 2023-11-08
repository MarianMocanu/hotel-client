import { Head } from 'next/document';
import Header from '../components/atoms/Header';
import HeroSection from '@/components/molecules/HeroSection';
import CardsSection from '@/components/molecules/CardsSection';
import OffersSection from '@/components/molecules/OffersSection';
import Footer from '@/components/atoms/Footer';
import { MouseEvent } from 'react';
import Modal from '@/components/atoms/Modal';
import React, { useState } from 'react';
import Login from '@/components/molecules/Login';

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function closeModal(): void {
    setIsOpen(false);
  }

  function openModal(event: MouseEvent): void {
    setIsOpen(true);
  }

  return (
    <div>
      {/* <Head>
        <title>Comwell Hotels</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='description' content='Generated by bla bla bla' />
        <link rel='icon' href='/favicon.ico' />
      </Head> */}
      <div>
        <Header
          handleLocationClick={() => console.log('TODO')}
          handleProfileClick={openModal}
          handleMenuClick={() => console.log('TODO')}
        >
          <Login isOpen={isOpen} closeModal={closeModal} />
        </Header>
        <main>
          <HeroSection />
          <CardsSection />
          <OffersSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
