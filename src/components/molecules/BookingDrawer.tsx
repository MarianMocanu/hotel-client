import React, { FC, useContext, useEffect, useState, MouseEvent } from 'react';
import Drawer from '../atoms/Drawer';
import styles from '@/styles/BookingDrawer.module.css';
import { FaChevronLeft, FaCalendarAlt, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { formatDate } from '@/app/util';
import ButtonGroup from '../atoms/ButtonGroup';
import { fetchAvailableRooms } from '@/app/roomsAPI';
import { Booking, Context, Room } from '../atoms/Context';
import RoomCard from './RoomCard';
import { differenceInDays } from 'date-fns';
import Button from '../atoms/Button';
import Filler from '../atoms/Filler';
import GuestForm from './GuestForm';
import Image from 'next/image';
import { BookingObject, createBooking } from '@/app/bookingAPI';
import { toast } from 'react-toastify';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const BookingDrawer: FC<Props> = ({ onClose, isOpen }) => {
  const { setError, booking, setBooking } = useContext(Context);

  const tabs = ['Rooms', 'Packages'];

  const [step, setStep] = useState<0 | 1>(0);
  const [tab, setTab] = useState<'rooms' | 'packages'>('rooms');
  const [rooms, setRooms] = useState<Room[]>([] as Room[]);

  function handleOnBackClick(): void {
    if (step === 1) {
      setStep(0);
    } else if (booking?.room.name) {
      setBooking({ ...booking, room: {} as Room });
    } else {
      handleOnDrawerClose();
    }
  }

  function isBookingReadyToBeCreated(): boolean {
    return (
      !!booking.checkin &&
      !!booking.checkout &&
      !!booking.guest.email &&
      !!booking.guest.name &&
      !!booking.guest.phone &&
      !!booking.guest.numberOfGuests &&
      !!booking.hotel._id &&
      !!booking.room._id
    );
  }

  async function handleOnNextClick(): Promise<void> {
    if (step === 1) {
      if (isBookingReadyToBeCreated()) {
        const newBooking: BookingObject = {
          checkinDate: booking.checkin,
          checkoutDate: booking.checkout,
          guestInfo: {
            email: booking.guest.email,
            name: booking.guest.name,
            phone: booking.guest.phone,
          },
          hotel_id: booking.hotel._id,
          room_id: booking.room._id,
          guestsAmount: booking.guest.numberOfGuests,
        };
        try {
          const response = await createBooking(newBooking);
          if (response && response.ok) {
            const createdBooking = await response.json();
            if (createdBooking && createdBooking._id) {
              toast.success('Your booking was created successfully!');
            }
          } else {
            throw new Error('Booking could not be created');
          }
        } catch (error) {
          console.error('Error creating booking', error);
          setError({ message: 'Error creating booking', shouldRefresh: false });
        } finally {
          setStep(0);
          setTab('rooms');
          setRooms([] as Room[]);
          setBooking({} as Booking);
          onClose();
        }
      }
    } else if (booking.room._id) {
      setStep(1);
    }
  }

  function handleOnDrawerClose(): void {
    setTab('rooms');
    setRooms([]);
    onClose();
  }

  function handleOnTabClick(event: MouseEvent): void {
    const tab = event.currentTarget.id;
    setTab(tab as 'rooms' | 'packages');
  }

  function handleOnRoomClick(event: MouseEvent): void {
    const roomId = event.currentTarget.id;
    const room = rooms.find(room => room._id === roomId);
    if (room) {
      const newBooking = { ...booking };
      newBooking.room = room;
      newBooking.price = room.price * differenceInDays(newBooking.checkout, newBooking.checkin);
      setBooking(newBooking);
    }
  }

  function getUniqueRoomTypes(rooms: Room[]): Room[] {
    return rooms.filter((room, index, self) => index === self.findIndex(r => r.type === room.type));
  }

  useEffect(() => {
    async function getRooms() {
      try {
        const response = await fetchAvailableRooms({
          hotelId: booking.hotel._id,
          checkinDate: booking.checkin,
          checkoutDate: booking.checkout,
          guestsAmount: booking.guest.numberOfGuests,
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
      booking.hotel._id &&
      booking.checkin &&
      booking.checkout &&
      booking.guest.numberOfGuests &&
      rooms.length === 0
    ) {
      getRooms();
    }
  }, [isOpen]);

  return (
    <Drawer
      onClose={handleOnDrawerClose}
      open={isOpen}
      title={step === 0 ? 'Choose room' : 'Guest information'}
      zIndex={1001}
      size="55rem"
      closeButtonVisible={false}
      header={<DrawerHeader onBackClick={handleOnBackClick} />}
      footer={
        <DrawerFooter
          onNextClick={handleOnNextClick}
          step={step}
          nextDisabled={step === 1 && !isBookingReadyToBeCreated()}
        />
      }
    >
      {step === 0 && (
        <div className={styles.content}>
          <ButtonGroup text={tabs} onButtonClick={handleOnTabClick} selected={tab} />
          {tab === 'rooms' &&
            rooms.length > 0 &&
            rooms.map((room, index) => (
              <RoomCard
                data={room}
                onClick={handleOnRoomClick}
                key={index}
                selected={booking.room ? booking.room._id === room._id : false}
                nights={differenceInDays(booking.checkout, booking.checkin)}
              />
            ))}
        </div>
      )}
      {step === 1 && (
        <div className={styles.overview}>
          <div className={styles.flex}>
            <GuestForm />
          </div>
          {booking.room && (
            <Image
              src={`/rooms/${booking.room.type}.webp`}
              alt="hotel"
              width={350}
              height={200}
              className={styles.flex}
            />
          )}
        </div>
      )}
    </Drawer>
  );
};
export default BookingDrawer;

type DrawerHeaderProps = {
  onBackClick: () => void;
};
const DrawerHeader: FC<DrawerHeaderProps> = ({ onBackClick }) => {
  const { booking } = useContext(Context);
  return (
    <div className={styles.horizontal}>
      <div className={`${styles.icon} ${styles.background}`} onClick={onBackClick}>
        <FaChevronLeft />
      </div>
      <div className={styles.horizontal}>
        <div className={styles.icon}>
          <FaCalendarAlt />
        </div>
        <p>
          {formatDate(booking.checkin)} - {formatDate(booking.checkout)}
        </p>
      </div>
      <div className={styles.horizontal}>
        <div className={styles.icon}>
          <FaUser />
        </div>
        <p>{booking.guest?.guestsString}</p>
      </div>
      <div className={styles.horizontal}>
        <div className={styles.icon}>
          <FaMapMarkerAlt />
        </div>
        <p>{booking.hotel?.name}</p>
      </div>
    </div>
  );
};

type DrawerFooterProps = {
  onNextClick: () => void;
  step: 0 | 1;
  nextDisabled?: boolean;
};
const DrawerFooter: FC<DrawerFooterProps> = ({ onNextClick, step, nextDisabled }) => {
  const { booking } = useContext(Context);
  if (booking.room && booking.room.name && booking.checkin && booking.checkout && booking.price) {
    return (
      <div className={styles.footer}>
        <div className={styles.footerText}>
          {booking.room.name} for {differenceInDays(booking.checkout, booking.checkin)}
          {' nights'}
        </div>
        <Filler />
        <div className={styles.footerText}>{booking.price.toLocaleString('de-DE')} kr.</div>
        <div className={styles.buttonContainer}>
          <Button
            onClick={onNextClick}
            text={step === 0 ? 'Select' : 'Book your stay'}
            disabled={nextDisabled}
          />
        </div>
      </div>
    );
  }
};
