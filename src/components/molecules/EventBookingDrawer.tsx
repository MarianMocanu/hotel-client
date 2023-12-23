import React, { FC, useContext, useEffect, useState, MouseEvent } from 'react';
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
import Image from 'next/image';
import { BookingObject, createBooking } from '@/app/bookingAPI';
import { toast } from 'react-toastify';
import RoomInfoDrawer from './RoomInfoDrawer';
import { PackageCard } from '../atoms/PackageCard';
import Summary from './Summary';
import { EventVenue } from '../atoms/Context';
import { DrawerHeader } from '../atoms/DrawerHeader';
import { fetchVenues } from '@/app/venuesAPI';
import VenueInfoDrawer from './VenueInfoDrawer';
import VenueCard from './VenueCard';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Venues = { selected_venue: EventVenue; other_venues: EventVenue[] } | undefined;

const EventBookingDrawer: FC<Props> = ({ onClose, isOpen }) => {
  const { setError, eventBooking, setEventBooking } = useContext(Context);
  const [venues, setVenues] = useState<Venues>(undefined);

  const [step, setStep] = useState<0 | 1 | 2>(0);

  function handleOnBackClick(): void {
    if (step === 0) {
      handleOnDrawerClose();
    } else if (step === 1) {
      setStep(0);
    } else if (step === 2) {
      setStep(1);
    }
  }

  function isBookingReadyToBeCreated(): boolean {
    return (
      !!eventBooking.venue_data &&
      !!eventBooking.host_name &&
      !!eventBooking.email &&
      !!eventBooking.phone &&
      !!eventBooking.date &&
      !!eventBooking.guest_amount &&
      !!eventBooking.type
    );
  }

  async function handleOnNextClick(): Promise<void> {
    if (step === 2) {
      if (isBookingReadyToBeCreated()) {
        //   const newBooking: BookingObject = {
        //     checkinDate: booking.checkin,
        //     checkoutDate: booking.checkout,
        //     guestInfo: {
        //       email: booking.guest.email,
        //       name: booking.guest.name,
        //       phone: booking.guest.phone,
        //     },
        //     hotel_id: booking.hotel._id,
        //     room_id: booking.room._id,
        //     guestsAmount: booking.guest.numberOfGuests,
        //     services: [
        //       ...booking.addons.map(service => service._id),
        //       ...(booking.package !== null ? [booking.package._id] : []),
        //     ],
        //   };
        //   try {
        //     const response = await createBooking(newBooking);
        //     if (response && response.ok) {
        //       const createdBooking = await response.json();
        //       if (createdBooking && createdBooking._id) {
        //         toast.success('Your booking was created successfully!');
        //       }
        //     } else {
        //       throw new Error('Booking could not be created');
        //     }
        //   } catch (error) {
        //     console.error('Error creating booking', error);
        //     setError({ message: 'Error creating booking', shouldRefresh: false });
        //   } finally {
        //     setStep(1);
        //     setTab('rooms');
        //     setRooms([] as Room[]);
        //     setBooking({} as Booking);
        //     onClose();
        //   }
      }
    } else {
      setStep(2);
    }
  }

  function handleOnDrawerClose(): void {
    setVenues(undefined);
    onClose();
  }

  function handleOnVenueClick(event: MouseEvent): void {
    const venueId = event.currentTarget.id;
    if (venues?.selected_venue._id === venueId) {
      setEventBooking({ ...eventBooking, venue_data: venues.selected_venue });
      setStep(1);
    } else {
      const selectedVenue = venues?.other_venues.find(venue => venue._id === venueId);
      if (selectedVenue) {
        setEventBooking({ ...eventBooking, venue_data: selectedVenue });
        setStep(1);
      }
    }
  }

  useEffect(() => {
    async function getVenues() {
      try {
        const response = await fetchVenues({
          hotel_id: eventBooking.hotel_id,
          guests_amount: eventBooking.guest_amount,
          date: eventBooking.date,
          type: eventBooking.type,
          start_time: eventBooking?.start_time,
          end_time: eventBooking?.end_time,
        });
        if (response && response.ok) {
          const parsedResponse = await response.json();
          console.log(parsedResponse);
          if (parsedResponse.selected_venue) {
            setVenues(parsedResponse);
          } else {
            throw new Error('No venues found');
          }
        } else {
          throw new Error('No response');
        }
      } catch (error) {
        console.error('Error fetching available venues', error);
        setError({ message: 'Error fetching available venues', shouldRefresh: true });
      }
    }
    if (
      isOpen &&
      eventBooking.hotel_id &&
      eventBooking.guest_amount &&
      eventBooking.date &&
      eventBooking.type &&
      venues === undefined
    ) {
      getVenues();
    }
  }, [isOpen]);

  return (
    <Drawer
      onClose={handleOnDrawerClose}
      open={isOpen}
      title={step === 0 ? 'Your Selection' : step === 2 ? 'Your Inquiry' : ''}
      zIndex={1001}
      size="55rem"
      closeButtonVisible={false}
      header={<DrawerHeader onBackClick={handleOnBackClick} isEvent={true} />}
      footer={
        <DrawerFooter
          onNextClick={handleOnNextClick}
          step={step}
          nextDisabled={step === 2 && !isBookingReadyToBeCreated()}
        />
      }
    >
      {step === 0 && venues !== undefined && (
        <div className={styles.content}>
          <VenueCard
            venue={venues?.selected_venue}
            onClick={handleOnVenueClick}
            isMain={true}
            isMeeting={eventBooking.type === ' meeting' ? true : false}
          />
          <h3>Recommended alternatives</h3>
          <div>
            {venues !== undefined &&
              venues.other_venues.map(venue => {
                return (
                  <VenueCard
                    key={venue._id}
                    venue={venue}
                    onClick={handleOnVenueClick}
                    isMain={false}
                    isMeeting={eventBooking.type === 'meeting' ? true : false}
                  />
                );
              })}
          </div>
        </div>
      )}
      {step === 1 && <VenueInfoDrawer />}

      {step === 2 && (
        <GuestForm isEvent={true} />
      )}
    </Drawer>
  );
};
export default EventBookingDrawer;

type DrawerFooterProps = {
  onNextClick: () => void;
  step: 0 | 1 | 2 | 3;
  nextDisabled?: boolean;
};

const DrawerFooter: FC<DrawerFooterProps> = ({ onNextClick, step, nextDisabled }) => {
  return (
    <div className={styles.footer}>
      <Button
        onClick={onNextClick}
        text={step === 0 || step === 1 ? 'Continue' : 'Send your inquiry'}
        disabled={nextDisabled}
      />
    </div>
  );
};
