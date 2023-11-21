import React, { FC, useContext, useEffect, useState } from 'react';
import Drawer from '../atoms/Drawer';
import styles from '@/styles/BookingDrawer.module.css';
import { FaChevronLeft, FaCalendarAlt, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { DateRange } from 'react-day-picker';
import { formatDate, getGuestsString } from '@/app/util';
import ButtonGroup from '../atoms/ButtonGroup';
import { fetchAvailableRooms } from '@/app/roomsAPI';
import { Context } from '../atoms/Context';
import { set } from 'date-fns';

type Props = {
  onClose: () => void;
  isOpen: boolean;
  booking: Booking;
};

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

type RoomType =
  | 'single'
  | 'double'
  | 'twin'
  | 'double double'
  | 'double superior'
  | 'junior suite'
  | 'executive suite';

type Room = {
  name: string;
  description: string;
  type: RoomType;
  facilities: string[];
  price: number;
  maxGuests: number;
  booked_dates: string[];
};

const BookingDrawer: FC<Props> = ({ onClose, isOpen, booking }) => {
  const { setError } = useContext(Context);

  const [step, setStep] = useState<number>(0);
  const tabs = ['Rooms', 'Packages'];
  const [tab, setTab] = useState<number>(0);
  const [rooms, setRooms] = useState<Room[]>([] as Room[]);

  function handleBackClick(): void {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  }

  useEffect(() => {
    async function getRooms() {
      try {
        const response = await fetchAvailableRooms({
          hotelId: booking.hotel!._id,
          checkinDate: booking.dates!.from!,
          checkoutDate: booking.dates!.to!,
          guestsAmount: booking.guests!.adults,
        });
        if (response && response.ok) {
          const parsedResponse = await response.json();
          if (parsedResponse.rooms) {
            setRooms(getUniqueRoomTypes(parsedResponse.rooms));
          } else {
            throw new Error('No rooms found');
          }
        } else {
          throw new Error('No response');
        }
      } catch (error) {
        console.error('Error fetching available rooms', error);
        setError({ message: 'Error fetching available rooms', shouldRefresh: true });
      }
    }
    if (
      isOpen &&
      booking.hotel &&
      booking.dates &&
      booking.dates.from &&
      booking.dates.to &&
      booking.guests &&
      rooms.length === 0
    ) {
      getRooms();
    }
  }, [isOpen]);

  function getUniqueRoomTypes(rooms: Room[]): Room[] {
    return rooms.filter((room, index, self) => index === self.findIndex(r => r.type === room.type));
  }

  console.log(rooms);

  return (
    <Drawer
      onClose={onClose}
      open={isOpen}
      title="Choose your room"
      zIndex={1001}
      size="55rem"
      closeButtonVisible={false}
      header={
        <DrawerHeader
          dates={booking.dates}
          guests={booking.guests}
          hotel={booking.hotel}
          onBackClick={handleBackClick}
        />
      }
    >
      <div className={styles.content}>
        <ButtonGroup text={tabs} onButtonClick={setTab} selected={tab} />
        {tab === 0 && <div>Here should be displayed the rooms</div>}
      </div>
    </Drawer>
  );
};
export default BookingDrawer;

type Booking = {
  dates?: DateRange | undefined;
  guests?: Guests;
  hotel?: Hotel;
  onBackClick?: () => void;
};

const DrawerHeader: FC<Booking> = ({ dates, guests, hotel, onBackClick }) => {
  return (
    <div className={styles.horizontal}>
      <div className={`${styles.icon} ${styles.background}`} onClick={onBackClick}>
        <FaChevronLeft />
      </div>
      {dates && (
        <div className={styles.horizontal}>
          <div className={styles.icon}>
            <FaCalendarAlt />
          </div>
          <p>
            {formatDate(dates?.from)} - {formatDate(dates?.to)}
          </p>
        </div>
      )}
      {guests && (
        <div className={styles.horizontal}>
          <div className={styles.icon}>
            <FaUser />
          </div>
          <p>{getGuestsString(guests)}</p>
        </div>
      )}
      {hotel && (
        <div className={styles.horizontal}>
          <div className={styles.icon}>
            <FaMapMarkerAlt />
          </div>
          <p>{hotel.name}</p>
        </div>
      )}
    </div>
  );
};
