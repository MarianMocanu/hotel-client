import React, { useState, useContext, MouseEvent } from 'react';
import styles from '@/styles/HeroSection.module.css';
import ButtonGroup from '../atoms/ButtonGroup';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import HotelsDrawer from '../molecules/HotelsDrawer';
import GuestsDrawer from '../molecules/GuestsDrawer';
import 'react-day-picker/dist/style.css';
import CalendarDrawer from '../molecules/CalendarDrawer';
import { formatDate } from '@/app/util';
import Button from '../atoms/Button';
import BookingDrawer from '../molecules/BookingDrawer';
import { Context } from '../atoms/Context';
import EventGuestsDrawer from '../molecules/EventGuestsDrawer';
import EventFieldDrawer from '../molecules/EventFieldDrawer';
import EventBookingDrawer from '../molecules/EventBookingDrawer';

type Drawer =
  | 'hotels'
  | 'rooms'
  | 'dates'
  | 'booking'
  | 'none'
  | 'eventGuests'
  | 'eventField'
  | 'eventBooking';

type Tab = 'Acommodation' | 'Meeting & Conference' | 'Banquet';

type EventField = 'Start Time' | 'End Time' | 'Event Type';

function HeroSection() {
  const { booking, eventBooking, setEventBooking } = useContext(Context);

  const tabs = ['Acommodation', 'Meeting & Conference', 'Banquet'];

  const [tab, setTab] = useState<Tab>('Acommodation');
  const [eventField, setEventField] = useState<EventField>('Start Time');
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

  function openEventGuestsDrawer(): void {
    setDrawerOpen('eventGuests');
  }

  function openEventFieldDrawer(fieldName: EventField): void {
    setEventField(fieldName);
    setDrawerOpen('eventField');
  }

  function openBookingDrawer(): void {
    setDrawerOpen('booking');
  }

  function openEventBookingDrawer(): void {
    tab === 'Meeting & Conference' && setEventBooking({ ...eventBooking, type: 'meeting' });
    setDrawerOpen('eventBooking');
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
        <HotelsDrawer
          isOpen={drawerOpen === 'hotels'}
          onClose={handleCloseDrawer}
          isEvent={tab !== 'Acommodation' ? true : false}
        />
        <GuestsDrawer
          isOpen={drawerOpen === 'rooms'}
          onClose={handleCloseDrawer}
          isEvent={tab !== 'Acommodation' ? true : false}
        />
        <CalendarDrawer
          isOpen={drawerOpen === 'dates'}
          onClose={handleCloseDrawer}
          isEvent={tab !== 'Acommodation' ? true : false}
        />
        <EventGuestsDrawer isOpen={drawerOpen === 'eventGuests'} onClose={handleCloseDrawer} />
        <EventFieldDrawer
          isOpen={drawerOpen === 'eventField'}
          onClose={handleCloseDrawer}
          field={eventField}
        />
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
        {tab === 'Meeting & Conference' && (
          <div>
            <div className={`${styles.option} ${styles.border}`} onClick={openEventGuestsDrawer}>
              <div>
                <p className={styles.optionLabel}>Number of Participants</p>
                <p className={styles.optionValue}>
                  {eventBooking?.guest_amount || 'Add participants'}
                </p>
              </div>
              <FaChevronDown />
            </div>
            <div className={`${styles.option} ${styles.border}`} onClick={openHotelsDrawer}>
              <div>
                <p className={styles.optionLabel}>Hotel</p>
                <p className={styles.optionValue}>
                  {eventBooking.hotel_name ? eventBooking.hotel_name : 'Choose hotel'}
                </p>
              </div>
              <FaChevronDown />
            </div>

            <div className={`${styles.option} ${styles.border}`} onClick={openCalendarDrawer}>
              <div>
                <p className={styles.optionLabel}>Date</p>
                <p className={styles.optionValue}>{formatDate(eventBooking.date)}</p>
              </div>
              <FaChevronDown />
            </div>

            <div className={`${styles.horizontal} ${styles.border}`}>
              <div className={styles.option} onClick={() => openEventFieldDrawer('Start Time')}>
                <div>
                  <p className={styles.optionLabel}>Starts</p>
                  <p className={styles.optionValue}>{eventBooking.start_time || 'Start time'}</p>
                </div>
                <FaChevronDown />
              </div>
              <div className={styles.separator} />
              <div className={styles.option} onClick={() => openEventFieldDrawer('End Time')}>
                <div>
                  <p className={styles.optionLabel}>Ends</p>
                  <p className={styles.optionValue}>{eventBooking.end_time || 'End time'}</p>
                </div>
                <FaChevronDown />
              </div>
            </div>
            <Button
              text="Search"
              onClick={openEventBookingDrawer}
              iconRight={<FaSearch />}
              disabled={
                !eventBooking.hotel_id ||
                !eventBooking.guest_amount ||
                !eventBooking.date ||
                !eventBooking.start_time ||
                !eventBooking.end_time
              }
            />
          </div>
        )}

        {tab === 'Banquet' && (
          <div>
            <div
              className={`${styles.option} ${styles.border}`}
              onClick={() => openEventFieldDrawer('Event Type')}
            >
              <div>
                <p className={styles.optionLabel}>Event Type</p>
                <p className={styles.optionValue}>{eventBooking.type || 'Select type'}</p>
              </div>
              <FaChevronDown />
            </div>
            <div className={`${styles.option} ${styles.border}`} onClick={openEventGuestsDrawer}>
              <div>
                <p className={styles.optionLabel}>Number of Participants</p>
                <p className={styles.optionValue}>
                  {eventBooking?.guest_amount || 'Add participants'}
                </p>
              </div>
              <FaChevronDown />
            </div>
            <div className={`${styles.option} ${styles.border}`} onClick={openHotelsDrawer}>
              <div>
                <p className={styles.optionLabel}>Hotel</p>
                <p className={styles.optionValue}>{eventBooking.hotel_name || 'Choose hotel'}</p>
              </div>
              <FaChevronDown />
            </div>

            <div className={`${styles.horizontal} ${styles.border}`} onClick={openCalendarDrawer}>
              <div className={styles.option}>
                <div>
                  <p className={styles.optionLabel}>Date</p>
                  <p className={styles.optionValue}>{formatDate(eventBooking.date)}</p>
                </div>
                <FaChevronDown />
              </div>
            </div>
            <Button
              text="Search"
              onClick={openEventBookingDrawer}
              iconRight={<FaSearch />}
              disabled={
                !eventBooking.hotel_id ||
                !eventBooking.guest_amount ||
                !eventBooking.date ||
                !eventBooking.type
              }
            />
          </div>
        )}
        <EventBookingDrawer isOpen={drawerOpen === 'eventBooking'} onClose={handleCloseDrawer} />
        <BookingDrawer isOpen={drawerOpen === 'booking'} onClose={handleCloseDrawer} />
      </div>
    </section>
  );
}

export default HeroSection;
