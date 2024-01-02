import React, { FC, useContext, useEffect, useState, MouseEvent } from 'react';
import Drawer from '../atoms/Drawer';
import styles from '@/styles/BookingDrawer.module.css';
import styles2 from '@/styles/VenueDrawer.module.css';
import { Context, EventBooking } from '../atoms/Context';
import Button from '../atoms/Button';
import GuestForm from './GuestForm';
import { EventVenue } from '../atoms/Context';
import { DrawerHeader } from '../atoms/DrawerHeader';
import { fetchVenues } from '@/app/venuesAPI';
import VenueInfoDrawer from './VenueInfoDrawer';
import VenueCard from './VenueCard';
import { EventBookingObject, createEventBooking } from '@/app/eventBookingAPI';
import { toast } from 'react-toastify';

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
        const newEventBooking: EventBookingObject = {
          venue_id: eventBooking.venue_data._id,
          date: eventBooking.date,
          type: eventBooking.type,
          host_name: eventBooking.host_name,
          email: eventBooking.email,
          phone: eventBooking.phone,
          guest_amount: eventBooking.guest_amount,
          start_time: eventBooking.start_time,
          end_time: eventBooking.end_time,
          corporation: eventBooking.corporation,
          comments: eventBooking.comments,
        };
        try {
          const response = await createEventBooking(newEventBooking);
          if (response && response.ok) {
            const createdEventBooking = await response.json();
            if (createdEventBooking && createdEventBooking._id) {
              toast.success(
                'Thanks for your inquiry. One of our representants will message you as soon as possible.',
              );
            }
          } else {
            throw new Error('Sorry, something went wrong. Please try again.');
          }
        } catch (error) {
          console.error('Error creating event booking', error);
          setError({ message: 'Error creating event booking', shouldRefresh: false });
        } finally {
          setStep(0);
          setVenues(undefined);
          setEventBooking({} as EventBooking);
          onClose();
        }
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
          guest_amount: eventBooking.guest_amount,
          date: eventBooking.date,
          type: eventBooking.type,
          start_time: eventBooking?.start_time,
          end_time: eventBooking?.end_time,
        });
        if (response && response.ok) {
          const parsedResponse = await response.json();
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
      title={step === 2 ? 'Your Inquiry' : ''}
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
        <div className={`${styles.content} ${styles2.scrollable}`}>
          <h3 className={styles2.title}>Your Selection</h3>
          <VenueCard
            key={venues.selected_venue._id}
            venue={venues?.selected_venue}
            onClick={handleOnVenueClick}
            isMain={true}
            isMeeting={eventBooking.type === ' meeting' ? true : false}
          />
          <h3 className={styles2.title}>Recommended alternatives</h3>
          <div className={styles2.venueCardsGrid}>
            {venues !== undefined &&
              venues.other_venues.map((venue, index) => {
                return (
                  <VenueCard
                    key={index.toString()}
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

      {step === 2 && <GuestForm isEvent={true} />}
    </Drawer>
  );
};
export default EventBookingDrawer;

type DrawerFooterProps = {
  onNextClick: () => void;
  step: 0 | 1 | 2;
  nextDisabled?: boolean;
};

const DrawerFooter: FC<DrawerFooterProps> = ({ onNextClick, step, nextDisabled }) => {
  return (
    <>
      {(step === 1 || step === 2) && (
        <div className={`${styles.footer} ${styles2.footerDrawer} `}>
          <Button
            onClick={onNextClick}
            text={step === 1 ? 'Continue' : 'Send your inquiry'}
            disabled={nextDisabled}
          />
        </div>
      )}
    </>
  );
};
