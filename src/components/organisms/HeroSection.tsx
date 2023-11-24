import React, { useState, useContext, MouseEvent } from 'react';
import styles from '@/styles/HeroSection.module.css';
import ButtonGroup from '../atoms/ButtonGroup';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import HotelsDrawer from '../molecules/HotelsDrawer';
import GuestsDrawer from '../molecules/GuestsDrawer';
import 'react-day-picker/dist/style.css';
import CalendarDrawer from '../molecules/CalendarDrawer';
import { formatDate, getGuestsString } from '@/app/util';
import Button from '../atoms/Button';
import BookingDrawer from '../molecules/BookingDrawer';
import { Context } from '../atoms/Context';

type Drawer = 'hotels' | 'rooms' | 'dates' | 'booking' | 'none';

type Tab = 'Acommodation' | 'Meeting & Conference' | 'Banquet';

function HeroSection() {
  const { booking } = useContext(Context);

  const tabs = ['Acommodation', 'Meeting & Conference', 'Banquet'];

  const [tab, setTab] = useState<Tab>('Acommodation');
  const [drawerOpen, setDrawerOpen] = useState<Drawer>('none');

  function handleCloseDrawer(): void {
    setDrawerOpen('none');
  }

  function openHotelsDrawer(): void {
    setDrawerOpen('hotels');
  }

  function openRoomsDrawer(): void {
    setDrawerOpen('rooms');
  }

  function openCalendarDrawer(): void {
    setDrawerOpen('dates');
  }

  function openBookingDrawer(): void {
    setDrawerOpen('booking');
  }

  function handleOnTabClick(event: MouseEvent): void {
    const target = event.target as HTMLDivElement;
    setTab(target.id as Tab);
  }

  return (
    <section className={styles.imgbg}>
      <div className={styles.card}>
        <p className={styles.title}>Check in at Comwell and discover Denmark</p>
        <ButtonGroup text={tabs} onButtonClick={handleOnTabClick} selected={tab} />
        <HotelsDrawer isOpen={drawerOpen === 'hotels'} onClose={handleCloseDrawer} />
        <GuestsDrawer isOpen={drawerOpen === 'rooms'} onClose={handleCloseDrawer} />
        <CalendarDrawer isOpen={drawerOpen === 'dates'} onClose={handleCloseDrawer} />
        {tab === 'Acommodation' && (
          <div>
            <div className={`${styles.option} ${styles.border}`} onClick={openHotelsDrawer}>
              <div>
                <p className={styles.optionLabel}>Hotel</p>
                <p className={styles.optionValue}>
                  {booking.hotel ? booking.hotel.name : 'Choose hotel'}
                </p>
              </div>
              <FaChevronDown />
            </div>
            <div className={`${styles.option} ${styles.border}`} onClick={openRoomsDrawer}>
              <div>
                <p className={styles.optionLabel}>Guests</p>
                <p className={styles.optionValue}>{booking.guest?.guestsString || 'Add guests'}</p>
              </div>
              <FaChevronDown />
            </div>
            <div className={`${styles.horizontal} ${styles.border}`} onClick={openCalendarDrawer}>
              <div className={styles.option}>
                <div>
                  <p className={styles.optionLabel}>Check in</p>
                  <p className={styles.optionValue}>{formatDate(booking.checkin)}</p>
                </div>
                <FaChevronDown />
              </div>
              <div className={styles.separator} />
              <div className={styles.option}>
                <div>
                  <p className={styles.optionLabel}>Check out</p>
                  <p className={styles.optionValue}>{formatDate(booking.checkout)}</p>
                </div>
                <FaChevronDown />
              </div>
            </div>
            <Button
              text="Search"
              onClick={openBookingDrawer}
              iconRight={<FaSearch />}
              disabled={!booking.hotel || !booking.guest || !booking.checkin || !booking.checkout}
            />
          </div>
        )}
        <BookingDrawer isOpen={drawerOpen === 'booking'} onClose={handleCloseDrawer} />
      </div>
    </section>
  );
}

export default HeroSection;
