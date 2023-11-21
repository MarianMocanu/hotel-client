import React, { useState } from 'react';
import styles from '@/styles/HeroSection.module.css';
import ButtonGroup from '../atoms/ButtonGroup';
import { FaChevronDown } from 'react-icons/fa';
import HotelsDrawer from '../molecules/HotelsDrawer';
import RoomsDrawer from '../molecules/RoomsDrawer';
import { DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Calendar from '../atoms/Calendar';
import { formatDate } from '@/app/util';
import Button from '../atoms/Button';

type Hotel = {
  _id: string;
  name: string;
  town: string;
};

type Guests = {
  adults: number;
  kids: number;
  infants: number;
};

type Drawer = 'hotels' | 'rooms' | 'dates' | 'none';

function HeroSection() {
  const tabs = ['Acommodation', 'Meeting & Conference', 'Banquet'];
  const [tab, setTab] = useState<number>(0);

  const [drawerOpen, setDrawerOpen] = useState<Drawer>('none');
  const [hotel, setHotel] = useState<Hotel | undefined>(undefined);
  const [guests, setGuests] = useState<Guests | undefined>(undefined);
  const [dates, setDates] = useState<DateRange | undefined>(undefined);

  function handleCloseDrawer(): void {
    setDrawerOpen('none');
  }

  function openHotelsDrawer(): void {
    setDrawerOpen('hotels');
  }

  function openRoomsDrawer(): void {
    setDrawerOpen('rooms');
  }

  function handleHotelSubmit(hotel: Hotel): void {
    setHotel(hotel);
  }

  function handleRoomSubmit(guests: Guests): void {
    setGuests(guests);
  }

  function openCalendar(): void {
    setDrawerOpen('dates');
  }

  function handleDateChange(range: DateRange | undefined): void {
    setDates(range);
  }

  function getGuestsString(): string {
    let result = '';
    if (guests && guests.adults > 0) {
      if (guests.adults === 1) {
        result += guests.adults + ' Adult';
      } else {
        result += guests.adults + ' Adults';
      }
    }
    if (guests && guests.kids > 0) {
      if (guests.kids === 1) {
        result += ', ' + guests.kids + ' Kid';
      } else {
        result += ', ' + guests.kids + ' Kids';
      }
    }
    if (guests && guests.infants > 0) {
      if (guests.infants === 1) {
        result += ', ' + guests.infants + ' Infant';
      } else {
        result += ', ' + guests.infants + ' Infants';
      }
    }
    if (result === '') {
      return 'Add guests';
    }
    return result;
  }

  return (
    <section className={styles.imgbg}>
      <div className={styles.card}>
        <p className={styles.title}>Check in at Comwell and discover Denmark</p>
        <ButtonGroup text={tabs} onButtonClick={setTab} selected={tab} />
        <HotelsDrawer
          isOpen={drawerOpen === 'hotels'}
          onClose={handleCloseDrawer}
          onSubmit={handleHotelSubmit}
        />
        <RoomsDrawer
          isOpen={drawerOpen === 'rooms'}
          onClose={handleCloseDrawer}
          onSubmit={handleRoomSubmit}
        />
        <Calendar
          isOpen={drawerOpen === 'dates'}
          onClose={handleCloseDrawer}
          onSelect={handleDateChange}
          selected={dates}
        />
        {tab === 0 && (
          <div>
            <div className={`${styles.option} ${styles.border}`} onClick={openHotelsDrawer}>
              <div>
                <p className={styles.optionLabel}>Hotel</p>
                <p className={styles.optionValue}>{hotel ? hotel.name : 'Choose hotel'}</p>
              </div>
              <FaChevronDown />
            </div>
            <div className={`${styles.option} ${styles.border}`} onClick={openRoomsDrawer}>
              <div>
                <p className={styles.optionLabel}>Guests</p>
                <p className={styles.optionValue}>{getGuestsString()}</p>
              </div>
              <FaChevronDown />
            </div>
            <div className={`${styles.horizontal} ${styles.border}`} onClick={openCalendar}>
              <div className={styles.option}>
                <div>
                  <p className={styles.optionLabel}>Check in</p>
                  <p className={styles.optionValue}>{formatDate(dates?.from)}</p>
                </div>
                <FaChevronDown />
              </div>
              <div className={styles.separator} />
              <div className={styles.option}>
                <div>
                  <p className={styles.optionLabel}>Check out</p>
                  <p className={styles.optionValue}>{formatDate(dates?.to)}</p>
                </div>
                <FaChevronDown />
              </div>
            </div>
            <Button
              text="Search"
              onClick={() => console.log('Should search for available rooms')}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
