import React, { FC, useContext, useEffect, useState, MouseEvent, useLayoutEffect } from 'react';
import Drawer from '../atoms/Drawer';
import styles from '@/styles/BookingDrawer.module.css';
import { FaChevronLeft, FaCalendarAlt, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { formatDate } from '@/app/util';
import { fetchAvailableRooms } from '@/app/roomsAPI';
import { BookedRoom, Booking, Context, Room, Service } from '../atoms/Context';
import RoomCard from './RoomCard';
import { differenceInDays } from 'date-fns';
import Button from '../atoms/Button';
import Filler from '../atoms/Filler';
import GuestForm from './GuestForm';
import Image from 'next/image';
import { BookingObject, createBooking } from '@/app/bookingAPI';
import { toast } from 'react-toastify';
import RoomInfoDrawer from './RoomInfoDrawer';
import { PackageCard } from '../atoms/PackageCard';
import Summary from './Summary';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const BookingDrawer: FC<Props> = ({ onClose, isOpen }) => {
  const { setError, booking, setBooking } = useContext(Context);
  // steps index: 0: choose room, 1: choose package, 2: addons ,  3:guest info
  const [rooms, setRooms] = useState<Room[]>([] as Room[]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([] as Room[]);
  const [services, setServices] = useState<Service[]>([] as Service[]);
  const [selectedAddons, setSelectedAddons] = useState<Service[]>([] as Service[]);
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [roomIndex, setRoomIndex] = useState(0);

  function handleOnBackClick(): void {
    if (step === 0) {
      if (roomIndex > 0) {
        const newBooking = { ...booking };
        newBooking.rooms[roomIndex - 1].room = {} as Room;
        setBooking(newBooking);
        setRoomIndex(roomIndex - 1);
      } else {
        handleOnDrawerClose();
      }
    } else if (step === 1) {
      setStep(0);
      const newRooms = [...booking.rooms];
      newRooms.forEach(room => (room.room = {} as Room));
      setBooking({ ...booking, rooms: newRooms });
    } else if (step === 2) {
      setStep(1);
      setSelectedAddons([] as Service[]);
      setBooking({ ...booking, addons: [] as Service[] });
    } else if (step === 3) {
      setStep(2);
      setRoomIndex(booking.rooms.length - 1);
    }
  }

  function hasSelectedAllRooms() {
    const notSelectedRoomIndex = booking.rooms.findIndex(room => !room.room._id);
    return notSelectedRoomIndex === -1;
  }

  function isBookingReadyToBeCreated(): boolean {
    return (
      !!booking.checkin &&
      !!booking.checkout &&
      !!booking.rooms &&
      booking.rooms.length > 0 &&
      !!booking.hotel._id &&
      hasSelectedAllRooms()
    );
  }

  async function handleOnNextClick(): Promise<void> {
    const newBooking: BookingObject = {} as BookingObject;
    if (step === 3) {
      if (isBookingReadyToBeCreated()) {
        newBooking.checkinDate = booking.checkin;
        newBooking.checkoutDate = booking.checkout;
        newBooking.hotel_id = booking.hotel._id;
        newBooking.services = [
          ...booking.addons.map(service => service._id),
          ...(booking.package !== null ? [booking.package._id] : []),
        ];
        // add rooms and guest
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
          setRooms([] as Room[]);
          setBooking({} as Booking);
          onClose();
        }
      }
    } else if (step === 2) {
      if (hasSelectedAllRooms()) {
        setStep(3);
      } else {
        setStep(0);
        setRoomIndex(prevState => (prevState < booking.rooms.length ? prevState + 1 : prevState));
      }
    } else {
      setStep(prevStep => (prevStep + 1) as 0 | 1 | 2 | 3);
    }
  }

  function handleOnDrawerClose(): void {
    setRooms([]);
    const newBooking = { ...booking };
    newBooking.rooms.forEach(room => (room.room = {} as Room));
    newBooking.price = 0;
    setBooking(newBooking);
    onClose();
  }

  function handleOnRoomClick(event: MouseEvent): void {
    const roomId = event.currentTarget.id;
    const room = rooms.find(room => room._id === roomId);
    if (room) {
      const newBooking = { ...booking };
      newBooking.rooms[roomIndex].room = room;
      if (!newBooking.price) {
        newBooking.price = room.price * differenceInDays(newBooking.checkout, newBooking.checkin);
      } else {
        newBooking.price += room.price * differenceInDays(newBooking.checkout, newBooking.checkin);
      }
      newBooking.package = null;
      setBooking(newBooking);
      setStep(1);
    }
  }

  function handleAddonChange(service: Service): void {
    if (selectedAddons.some(addon => addon._id === service._id)) {
      setSelectedAddons(prevAddons => {
        const newAddons = prevAddons.filter(addon => addon._id !== service._id);
        setBooking({ ...booking, addons: newAddons });
        return newAddons;
      });
    } else {
      setSelectedAddons(prevAddons => {
        const newAddons = [...prevAddons, service];
        setBooking({ ...booking, addons: newAddons });
        return newAddons;
      });
    }
  }

  function getUniqueRoomTypes(rooms: Room[]): Room[] {
    return rooms.filter((room, index, self) => index === self.findIndex(r => r.type === room.type));
  }

  function getUniqueServices(services: Service[]): Service[] {
    return services.filter(
      (service, index, self) => index === self.findIndex(s => s._id === service._id),
    );
  }

  function filterRooms(): Room[] {
    if (booking.rooms) {
      const bookedRoomsIds = booking.rooms.map(room => room.room._id);
      const filtered = rooms.filter(room => !bookedRoomsIds.includes(room._id));
      return filtered;
    }
    return [];
  }

  useLayoutEffect(() => {
    if (booking.rooms && roomIndex === booking.rooms.length) {
      setStep(1);
    }
  }, [roomIndex]);

  useEffect(() => {
    async function getRooms() {
      try {
        const response = await fetchAvailableRooms({
          hotelId: booking.hotel._id,
          checkinDate: booking.checkin,
          checkoutDate: booking.checkout,
          numberOfRooms: booking.rooms.length,
          numberOfGuests: booking.guest.numberOfGuests,
        });
        if (response && response.ok) {
          const parsedResponse = await response.json();
          if (parsedResponse.rooms) {
            setRooms(getUniqueRoomTypes(parsedResponse.rooms));
            setServices(getUniqueServices(parsedResponse.hotel_services));
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
      booking.rooms.length > 0
    ) {
      getRooms();
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    setFilteredRooms(filterRooms());
  }, [rooms, roomIndex]);

  return (
    <Drawer
      onClose={handleOnDrawerClose}
      open={isOpen}
      title={
        step === 0
          ? `Choose room ${roomIndex + 1}`
          : step === 1
          ? `Choose room ${roomIndex + 1} package`
          : step === 2
          ? `Additional services for room ${roomIndex + 1}`
          : step === 3
          ? 'Guest information'
          : ''
      }
      zIndex={1001}
      size="55rem"
      closeButtonVisible={false}
      header={<DrawerHeader onBackClick={handleOnBackClick} />}
      footer={
        <DrawerFooter
          onNextClick={handleOnNextClick}
          step={step}
          nextDisabled={step === 3 && !isBookingReadyToBeCreated()}
          roomIndex={roomIndex}
        />
      }
    >
      {step === 0 && (
        <div className={styles.content}>
          {step === 0 &&
            filteredRooms.length > 0 &&
            filteredRooms.map((room, index) => (
              <RoomCard
                data={room}
                onClick={handleOnRoomClick}
                key={index.toString()}
                nights={differenceInDays(booking.checkout, booking.checkin)}
              />
            ))}
        </div>
      )}
      {/* package page */}
      {step === 1 && <RoomInfoDrawer services={services} roomIndex={roomIndex} />}
      {/* addons page */}
      {step === 2 && (
        <div className={styles.grid}>
          {services.length > 0 &&
            services.map((service, index) => {
              if (service.type === 'addon') {
                return (
                  <PackageCard
                    key={index}
                    service={service}
                    selected={
                      selectedAddons && selectedAddons.some(addon => addon._id === service._id)
                    }
                    onClick={() => handleAddonChange(service)}
                  />
                );
              }
            })}
        </div>
      )}
      {step === 3 && (
        <div className={styles.overview}>
          <div className={styles.flex}>
            <GuestForm />
          </div>
          <div className={styles.summarycontainer}>
            {booking.rooms[0] && (
              <Image
                src={`/rooms/${booking.rooms[0].room.type}.webp`}
                alt="hotel"
                width={350}
                height={200}
                className={styles.flex}
              />
            )}
            <Summary />
          </div>
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
        <p>{booking.guest && booking.guest.guestsString}</p>
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
  step: 0 | 1 | 2 | 3;
  nextDisabled?: boolean;
  roomIndex: number;
};

// used for diplaying price per room per period and navigating to next step
const DrawerFooter: FC<DrawerFooterProps> = ({ onNextClick, step, nextDisabled, roomIndex }) => {
  const { booking } = useContext(Context);
  const nights = differenceInDays(booking.checkout, booking.checkin);

  function getTotalPriceForBooking(): number {
    const total = booking.rooms.reduce((acc, room) => acc + room.room.price, 0);
    return total * nights;
  }

  function getTotalPricePerRoom(): number {
    const roomPricePerNight = booking.rooms[roomIndex].room.price;
    return roomPricePerNight * nights + (booking.package ? booking.package.price : 0) * nights;
  }

  function getFooterString(): string {
    let roomsString = step === 3 ? 'Total costs for ' : 'Costs for ';
    const nights = differenceInDays(booking.checkout, booking.checkin);
    roomsString += nights;
    if (nights === 1) {
      roomsString += ' night';
    } else if (nights > 1) {
      roomsString += ' nights';
    }
    return roomsString;
  }

  function getButtonText() {
    if (step === 3) return 'Book your stay';
    return 'Select';
  }

  if (
    booking.rooms &&
    booking.rooms.length > 0 &&
    booking.checkin &&
    booking.checkout &&
    booking.price &&
    step > 0
  ) {
    return (
      <div className={styles.footer}>
        <div className={styles.footerText}>{getFooterString()}</div>
        <Filler />
        <div className={styles.footerText}>
          {step === 3
            ? getTotalPriceForBooking().toLocaleString('de-DE')
            : getTotalPricePerRoom().toLocaleString('de-DE')}
          {' kr.'}
        </div>
        <div className={styles.buttonContainer}>
          <Button onClick={onNextClick} text={getButtonText()} disabled={nextDisabled} />
        </div>
      </div>
    );
  }
};
