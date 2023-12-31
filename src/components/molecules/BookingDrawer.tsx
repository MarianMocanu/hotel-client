import React, { FC, useContext, useEffect, useState, MouseEvent, useLayoutEffect } from 'react';
import Drawer from '../atoms/Drawer';
import styles from '@/styles/BookingDrawer.module.css';
import { FaChevronLeft, FaCalendarAlt, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { formatDate } from '@/app/util';
import ButtonGroup from '../atoms/ButtonGroup';
import { fetchAvailableRooms } from '@/app/roomsAPI';
import { Booking, Context, Room, Service } from '../atoms/Context';
import RoomCard from './RoomCard';
import { differenceInDays } from 'date-fns';
import Button from '../atoms/Button';
import Filler from '../atoms/Filler';
import GuestForm from './GuestForm';
import { APIBookedRoom, APIBooking, createBooking } from '@/app/bookingAPI';
import { toast } from 'react-toastify';
import RoomInfoDrawer from './RoomInfoDrawer';
import { ServiceCard } from './ServiceCard';
import Summary from './Summary';
import { DrawerHeader } from '../atoms/DrawerHeader';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const BookingDrawer: FC<Props> = ({ onClose, isOpen }) => {
  const { setError, booking, setBooking, user } = useContext(Context);

  const [rooms, setRooms] = useState<Room[]>([] as Room[]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([] as Room[]);

  const [services, setServices] = useState<Service[]>([] as Service[]);

  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [roomIndex, setRoomIndex] = useState(0);

  function handleOnBackClick(): void {
    const newBooking = { ...booking };
    switch (step) {
      case 0:
        newBooking.rooms[roomIndex].room = {} as Room;
        setBooking(newBooking);
        if (roomIndex > 0) {
          setRoomIndex(prevState => prevState - 1);
          setStep(2);
        } else {
          handleOnDrawerClose();
        }
        break;
      case 1:
        newBooking.rooms[roomIndex].package = {} as Service;
        setBooking(newBooking);
        setStep(prevState => (prevState - 1) as 0 | 1 | 2 | 3);
        break;
      case 2:
        newBooking.rooms[roomIndex].addons = [] as Service[];
        setBooking(newBooking);
        setStep(prevState => (prevState - 1) as 0 | 1 | 2 | 3);
        break;
      case 3:
        setStep(prevState => (prevState - 1) as 0 | 1 | 2 | 3);
        break;
      default:
        break;
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
      !!booking.guest.name &&
      !!booking.guest.email &&
      !!booking.guest.phone &&
      hasSelectedAllRooms()
    );
  }

  async function submitBooking(data: APIBooking): Promise<void> {
    try {
      const response = await createBooking(data);
      if (response && response.ok) {
        const createdBooking = await response.json();
        if (createdBooking && createdBooking._id) {
          handleOnDrawerClose();
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

  async function handleOnNextClick(): Promise<void> {
    switch (step) {
      case 0:
        if (booking.rooms[roomIndex].room._id) {
          setStep(prevState => (prevState + 1) as 0 | 1 | 2 | 3);
        }
        break;
      case 1:
        if (booking.rooms[roomIndex].package._id) {
          setStep(prevState => (prevState + 1) as 0 | 1 | 2 | 3);
        }
        break;
      case 2:
        if (roomIndex < booking.rooms.length - 1) {
          setRoomIndex(prevState => prevState + 1);
          setStep(0);
        } else {
          setStep(prevState => (prevState + 1) as 0 | 1 | 2 | 3);
        }
        break;
      case 3:
        if (isBookingReadyToBeCreated()) {
          await submitBooking(convertToAPIBooking());
        } else {
          console.error('Booking is not ready to be created');
        }
        break;
      default:
        break;
    }
  }

  function convertToAPIBooking(): APIBooking {
    return {
      checkinDate: booking.checkin,
      checkoutDate: booking.checkout,
      hotelId: booking.hotel._id,
      guest: { ...booking.guest, userId: user._id },
      guestsAmount: booking.guest.numberOfGuests,
      rooms: booking.rooms.map(room => {
        const newRoom: APIBookedRoom = {} as APIBookedRoom;
        newRoom.roomId = room.room._id;
        newRoom.packageId = room.package._id;
        if (room.addons && room.addons.length > 0) {
          newRoom.addonsIds = room.addons.map(addon => addon._id);
        }
        newRoom.guest = room.guest;
        return newRoom;
      }),
    } as APIBooking;
  }

  function handleOnDrawerClose(): void {
    setRooms([] as Room[]);
    const newBooking = { ...booking };
    newBooking.rooms.forEach(room => {
      room.room = {} as Room;
      room.package = {} as Service;
      room.addons = [] as Service[];
    });
    newBooking.price = 0;
    setBooking(newBooking);
    setStep(0);
    setRoomIndex(0);
    setRooms([] as Room[]);
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
      setBooking(newBooking);
      setStep(1);
    }
  }

  function handleOnAddonClick(event: MouseEvent): void {
    const serviceId = event.currentTarget.id;
    const service = services.find(service => service._id === serviceId);
    if (service) {
      const newBooking = { ...booking };
      if (!newBooking.rooms[roomIndex].addons) {
        newBooking.rooms[roomIndex].addons = [];
      }
      const foundServiceIndex = newBooking.rooms[roomIndex].addons.findIndex(
        addon => addon._id === service._id,
      );
      if (foundServiceIndex === -1) {
        newBooking.rooms[roomIndex].addons.push(service);
      } else {
        newBooking.rooms[roomIndex].addons.splice(foundServiceIndex, 1);
      }
      setBooking(newBooking);
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
    if (booking.rooms && booking.rooms.length > 0) {
      const bookedRoomsIds = booking.rooms.map(room => room.room._id);
      const filteredRooms = rooms.filter(
        room =>
          !bookedRoomsIds.includes(room._id) &&
          room.maxGuests >= booking.rooms[roomIndex].guest.numberOfGuests!,
      );
      return getUniqueRoomTypes(filteredRooms);
    }
    return [];
  }

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
          if (parsedResponse.rooms.length > 0) {
            setRooms(parsedResponse.rooms);
            setServices(parsedResponse.hotel_services);
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

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    setFilteredRooms(filterRooms());
  }, [rooms, roomIndex]);

  return (
    <Drawer
      onClose={handleOnDrawerClose}
      open={isOpen}
      title={
        filteredRooms.length > 0
          ? step === 0
            ? `Choose room ${roomIndex + 1}`
            : step === 1
            ? `Choose room ${roomIndex + 1} package`
            : step === 2
            ? `Additional services for room ${roomIndex + 1}`
            : step === 3
            ? 'Guest information'
            : ''
          : ''
      }
      zIndex={1001}
      size="55rem"
      closeButtonVisible={false}
      header={<DrawerHeader onBackClick={handleOnBackClick} isEvent={false} />}
      footer={
        <DrawerFooter
          onNextClick={handleOnNextClick}
          step={step}
          nextDisabled={
            (step === 3 && !isBookingReadyToBeCreated()) ||
            (step === 1 && !booking.rooms[roomIndex].package?._id)
          }
          roomIndex={roomIndex}
        />
      }
    >
      {step === 0 && (
        <div className={styles.content}>
          {step === 0 && filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <RoomCard
                data={room}
                onClick={handleOnRoomClick}
                key={index.toString()}
                nights={differenceInDays(booking.checkout, booking.checkin)}
              />
            ))
          ) : (
            <div className={styles.noRooms}>
              There are no rooms available for the selected period
            </div>
          )}
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
                  <ServiceCard
                    key={index.toString()}
                    service={service}
                    onClick={handleOnAddonClick}
                    selected={
                      booking.rooms[roomIndex].addons
                        ? booking.rooms[roomIndex].addons.findIndex(s => s._id === service._id) !==
                          -1
                        : false
                    }
                    roomIndex={roomIndex}
                  />
                );
              }
            })}
        </div>
      )}
      {step === 3 && (
        <div className={styles.overview}>
          <div className={styles.guestInfo}>
            <GuestForm isEvent={false} />
          </div>
          <div className={styles.summaryContainer}>
            <Summary />
          </div>
        </div>
      )}
    </Drawer>
  );
};
export default BookingDrawer;

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
    let total = 0;
    booking.rooms.forEach(room => {
      total += room.room.price * nights;
      if (room.package) {
        total += room.package.price * nights;
      }
      if (room.addons) {
        room.addons.forEach(addon => (total += addon.price));
      }
    });
    return total;
  }

  function getTotalPricePerRoom(): number {
    const roomPricePerNight = booking.rooms[roomIndex].room.price;
    const totalRoomPrice = roomPricePerNight * nights;
    const packagePrice = booking.rooms[roomIndex].package?.price ?? 0;
    const totalPackagePrice = packagePrice * nights;
    const addonsPrice = booking.rooms[roomIndex].addons
      ? booking.rooms[roomIndex].addons.reduce((acc, addon) => acc + addon.price, 0)
      : 0;
    return totalRoomPrice + totalPackagePrice + addonsPrice;
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
