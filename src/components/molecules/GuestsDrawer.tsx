import React, { FC, useState, MouseEvent, useContext } from 'react';
import Drawer from '../atoms/Drawer';
import { FaMinus, FaPlus } from 'react-icons/fa';
import styles from '@/styles/GuestsDrawer.module.css';
import Button from '../atoms/Button';
import Filler from '../atoms/Filler';
import { BookedRoom, Context, Guest } from '../atoms/Context';
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
  const [roomGuests, setRoomGuests] = useState<Guests[]>([{ adults: 0, kids: 0, infants: 0 }]);

  function increment(event: MouseEvent): void {
    const target = event.currentTarget.parentElement?.getAttribute('datatype');
    const id: number = Number(event.currentTarget.parentElement?.getAttribute('id'));
    if (target === 'adults' || target === 'kids' || target === 'infants') {
      if (roomGuests[id][target] < 4) {
        setRoomGuests(previousGuests => {
          const newGuests = [...previousGuests];
          newGuests[id][target] = previousGuests[id][target] + 1;
          return newGuests;
        });
      }
    }
  }

  function decrement(event: MouseEvent): void {
    const target = event.currentTarget.parentElement?.getAttribute('datatype');
    const id: number = Number(event.currentTarget.parentElement?.getAttribute('id'));
    if (target === 'adults' || target === 'kids' || target === 'infants') {
      if (roomGuests[id][target] > 0) {
        setRoomGuests(previousGuests => {
          const newGuests = [...previousGuests];
          newGuests[id][target] = previousGuests[id][target] - 1;
          return newGuests;
        });
      }
    }
  }

  function handleSubmit(): void {
    const guests = roomGuests.reduce((total, room) => total + room.adults, 0);
    if (guests > 0) {
      const newBooking = { ...booking };
      newBooking.rooms = roomGuests.map(
        room => ({ room: {}, guest: { numberOfGuests: room.adults } } as BookedRoom),
      );
      newBooking.guest = {
        numberOfGuests: guests,
        guestsString: getGuestsString(roomGuests),
      } as Guest;
      setBooking(newBooking);
      onClose();
    }
  }

  function handleAddRoom(): void {
    setRoomGuests(previousGuests => {
      const newGuests = [...previousGuests];
      newGuests.push({ adults: 0, kids: 0, infants: 0 });
      return newGuests;
    });
  }

  function handleRemoveRoom(): void {
    setRoomGuests(previousGuests => {
      const newGuests = [...previousGuests];
      newGuests.pop();
      return newGuests;
    });
  }

  return (
    <Drawer onClose={onClose} open={isOpen} title="Guests & Rooms" size={'25rem'} zIndex={1001}>
      {roomGuests.map((guests, index) => (
        <div className={styles.content} key={index.toString()}>
          <div className={`${styles.horizontal} ${styles.justify}`}>
            <p>Adults</p>
            <div className={styles.horizontal} datatype="adults" id={index.toString()}>
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
            <div className={styles.horizontal} datatype="kids" id={index.toString()}>
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
            <div className={styles.horizontal} datatype="infants" id={index.toString()}>
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
        </div>
      ))}
      <div className={`${styles.horizontal} ${styles.justify}`}>
        <div className={styles.button} onClick={handleAddRoom}>
          Add room
        </div>
        <div className={styles.button} onClick={handleRemoveRoom}>
          Remove room
        </div>
      </div>
      <Filler />
      <Button text="Select" onClick={handleSubmit} />
    </Drawer>
  );
};
export default GuestsDrawer;
