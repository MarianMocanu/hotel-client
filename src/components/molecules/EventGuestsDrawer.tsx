import React, { FC, useState, MouseEvent, useContext } from 'react';
import Drawer from '../atoms/Drawer';
import { FaMinus, FaPlus } from 'react-icons/fa';
import styles from '@/styles/GuestsDrawer.module.css';
import Button from '../atoms/Button';
import Filler from '../atoms/Filler';
import { Context } from '../atoms/Context';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const EventGuestsDrawer: FC<Props> = ({ onClose, isOpen }) => {
  const { eventBooking, setEventBooking } = useContext(Context);
  const [guests, setGuests] = useState<number>(25);

  function increment(event: MouseEvent): void {
        setGuests(prev => prev +1);
  }

  function decrement(event: MouseEvent): void {
    if(guests > 0 ) {
        setGuests(prev => prev - 1);
    }
 
  }

  function handleSubmit(): void {
    if (guests > 0) {
      setEventBooking({...eventBooking, guest_amount: guests });
      onClose();
    }
  }

  return (
    <Drawer onClose={onClose} open={isOpen} title="Guests" size={'25rem'} zIndex={1001}>
      <div className={styles.content}>
        <div className={`${styles.horizontal} ${styles.justify}`}>
          <p>Participants</p>
          <div className={styles.horizontal} datatype="adults">
            <div
              className={`${styles.icon} ${guests === 0 ? styles.disabled : ''}`}
              onClick={decrement}
            >
              <FaMinus size={'0.8rem'} />
            </div>
            <p className={styles.inputText}>{guests}</p>
            <div
              className={styles.icon}
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
export default EventGuestsDrawer;
