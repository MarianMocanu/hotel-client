import React, { FC, useState, MouseEvent, useContext } from 'react';
import Drawer from '../atoms/Drawer';
import { FaMinus, FaPlus } from 'react-icons/fa';
import styles from '@/styles/GuestsDrawer.module.css';
import Button from '../atoms/Button';
import Filler from '../atoms/Filler';
import { Context, Guest } from '../atoms/Context';
import { getGuestsString } from '@/app/util';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Guests = {
  adults: number;
  kids: number;
  infants: number;
};

const GuestsDrawer: FC<Props> = ({ onClose, isOpen }) => {
  const { booking, setBooking } = useContext(Context);
  const [guests, setGuests] = useState<Guests>({ adults: 1, kids: 0, infants: 0 } as Guests);

  function increment(event: MouseEvent): void {
    const target = event.currentTarget.parentElement?.getAttribute('datatype');
    if (target === 'adults' || target === 'kids' || target === 'infants') {
      if (guests[target] < 4) {
        setGuests(previousGuests => {
          return { ...previousGuests, [target]: previousGuests[target] + 1 };
        });
      }
    }
  }

  function decrement(event: MouseEvent): void {
    const target = event.currentTarget.parentElement?.getAttribute('datatype');
    if (target === 'adults' || target === 'kids' || target === 'infants') {
      if (guests[target] > 0) {
        setGuests(previousGuests => {
          return { ...previousGuests, [target]: previousGuests[target] - 1 };
        });
      }
    }
  }

  function handleSubmit(): void {
    if (guests.adults > 0) {
      const newBooking = { ...booking };
      if (!newBooking.guest) {
        newBooking.guest = {} as Guest;
      }
      newBooking.guest.guestsString = getGuestsString(guests);
      newBooking.guest.numberOfGuests = guests.adults;
      setBooking(newBooking);
      onClose();
    }
  }

  return (
    <Drawer onClose={onClose} open={isOpen} title="Guests & Rooms" size={'25rem'} zIndex={1001}>
      <div className={styles.content}>
        <div className={`${styles.horizontal} ${styles.justify}`}>
          <p>Adults</p>
          <div className={styles.horizontal} datatype="adults">
            <div
              className={`${styles.icon} ${!guests.adults ? styles.disabled : ''}`}
              onClick={decrement}
            >
              <FaMinus size={'0.8rem'} />
            </div>
            <p className={styles.inputText}>{guests.adults}</p>
            <div
              className={`${styles.icon} ${guests.adults === 4 ? styles.disabled : ''}`}
              onClick={increment}
            >
              <FaPlus size={'0.8rem'} />
            </div>
          </div>
        </div>
        <div className={`${styles.horizontal} ${styles.justify}`}>
          <div className={styles.column}>
            <p>Kids</p>
            <p className={styles.label}>3-11 years</p>
          </div>
          <div className={styles.horizontal} datatype="kids">
            <div
              className={`${styles.icon} ${guests.kids === 0 ? styles.disabled : ''}`}
              onClick={decrement}
            >
              <FaMinus size={'0.8rem'} />
            </div>
            <p className={styles.inputText}>{guests.kids}</p>
            <div
              className={`${styles.icon} ${guests.kids === 4 ? styles.disabled : ''}`}
              onClick={increment}
            >
              <FaPlus size={'0.8rem'} />
            </div>
          </div>
        </div>
        <div className={`${styles.horizontal} ${styles.justify}`}>
          <div className={styles.column}>
            <p>Infants</p>
            <p className={styles.label}>0-2 years</p>
          </div>
          <div className={styles.horizontal} datatype="infants">
            <div
              className={`${styles.icon} ${guests.infants === 0 ? styles.disabled : ''}`}
              onClick={decrement}
            >
              <FaMinus size={'0.8rem'} />
            </div>
            <p className={styles.inputText}>{guests.infants}</p>
            <div
              className={`${styles.icon} ${guests.infants === 4 ? styles.disabled : ''}`}
              onClick={increment}
            >
              <FaPlus size={'0.8rem'} />
            </div>
          </div>
        </div>
        <Filler />
        <Button text="Select" onClick={handleSubmit} />
      </div>
    </Drawer>
  );
};
export default GuestsDrawer;
