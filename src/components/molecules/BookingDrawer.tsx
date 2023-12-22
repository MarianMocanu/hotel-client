import React, { FC, useContext, useEffect, useState, MouseEvent } from 'react';
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
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [rooms, setRooms] = useState<Room[]>([] as Room[]);
  const [services, setServices] = useState<Service[]>([] as Service[]);
  const [selectedAddons, setSelectedAddons] = useState<Service[]>([] as Service[]);

  function handleOnBackClick(): void {
    if (step === 0) {
      handleOnDrawerClose();
    } else if (step === 1) {
      setStep(0);
      setBooking({ ...booking, rooms: [] as BookedRoom[], package: null });
    } else if (step === 2) {
      setStep(1);
      setSelectedAddons([] as Service[]);
      setBooking({ ...booking, addons: [] as Service[] });
    } else if (step === 3) {
      setStep(2);
    }
  }

  function isBookingReadyToBeCreated(): boolean {
    return (
      !!booking.checkin &&
      !!booking.checkout &&
      !!booking.rooms &&
      !!booking.rooms[0].guest &&
      !!booking.hotel._id &&
      booking.rooms.length > 0
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
    } else if (step < 3) {
      setStep(prevStep => (prevStep + 1) as 0 | 1 | 2 | 3);
    }
  }

  function handleOnDrawerClose(): void {
    setRooms([]);
    onClose();
  }

  function handleOnRoomClick(event: MouseEvent): void {
    const roomId = event.currentTarget.id;
    const room = rooms.find(room => room._id === roomId);
    if (room) {
      const newBooking = { ...booking };
      // newBooking.rooms.push(room);
      newBooking.price = room.price * differenceInDays(newBooking.checkout, newBooking.checkin);
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

  useEffect(() => {
    async function getRooms() {
      try {
        const response = await fetchAvailableRooms({
          hotelId: booking.hotel._id,
          checkinDate: booking.checkin,
          checkoutDate: booking.checkout,
          guestsAmount: 2,
        });
        if (response && response.ok) {
          const parsedResponse = await response.json();
          console.log(parsedResponse);
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
      booking.rooms[0].guest &&
      rooms.length === 0
    ) {
      getRooms();
    }
  }, [isOpen]);

  return (
    <Drawer
      onClose={handleOnDrawerClose}
      open={isOpen}
      title={
        step === 0
          ? 'Choose room'
          : step === 2
          ? 'Additional services'
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
        />
      }
    >
      {step === 0 && (
        <div className={styles.content}>
          {step === 0 &&
            rooms.length > 0 &&
            rooms.map((room, index) => (
              <RoomCard
                data={room}
                onClick={handleOnRoomClick}
                key={index}
                nights={differenceInDays(booking.checkout, booking.checkin)}
              />
            ))}
        </div>
      )}
      {step === 1 && <RoomInfoDrawer services={services} />}
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
        <p>{booking.rooms && booking.rooms[0].guest ? booking.rooms[0].guest.guestsString : ''}</p>
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
};
const DrawerFooter: FC<DrawerFooterProps> = ({ onNextClick, step, nextDisabled }) => {
  const { booking } = useContext(Context);
  const subtotal =
    booking.price +
    (booking.package ? booking.package.price : 0) *
      differenceInDays(booking.checkout, booking.checkin) +
    (booking.addons ? booking.addons.reduce((acc, addon) => acc + addon.price, 0) : 0);

  if (
    booking.rooms &&
    booking.rooms.length > 0 &&
    booking.checkin &&
    booking.checkout &&
    booking.price
  ) {
    return (
      <div className={styles.footer}>
        <div className={styles.footerText}>
          {booking.rooms[0].room.name} for {differenceInDays(booking.checkout, booking.checkin)}
          {' nights'}
        </div>
        <Filler />
        <div className={styles.footerText}>{subtotal.toLocaleString('de-DE')} kr.</div>
        <div className={styles.buttonContainer}>
          <Button
            onClick={onNextClick}
            text={step === 1 ? 'Select' : step === 2 ? 'Finish Your Booking' : 'Book your stay'}
            disabled={nextDisabled}
          />
        </div>
      </div>
    );
  }
};
