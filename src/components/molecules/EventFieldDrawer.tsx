import React, { FC, useState, useContext, MouseEvent } from 'react';
import Drawer from '@/components/atoms/Drawer';
import { Context } from '../atoms/Context';
import styles from '@/styles/EventFieldDrawer.module.css';
import Filler from '../atoms/Filler';
import Button from '../atoms/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  field: 'Start Time' | 'End Time' | 'Event Type';
};

const EventFieldDrawer: FC<Props> = ({ isOpen, onClose, field }) => {
  const { setEventBooking, eventBooking } = useContext(Context);
  const [selectedTimeslot, setSelectedTimeslot] = useState<string | undefined>(undefined);
  const [selectedEventType, setSelectedEventType] = useState<string | undefined>(undefined);

  const timeslots: string[] = [
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
  ];
  const eventTypes: string[] = [
    'Birthday',
    'Wedding',
    'Baptism',
    'Company Party',
    'Christmas Lunch',
    'Confirmation',
    'Other',
  ];

  function handleOnClick(event: MouseEvent): void {
    const selection = event.currentTarget.id;
    field === 'Event Type' ? setSelectedEventType(selection) : setSelectedTimeslot(selection);
  }

  function handleSubmit(): void {
    if (field === 'Start Time') {
      if (selectedTimeslot !== undefined) {
        setEventBooking({ ...eventBooking, start_time: selectedTimeslot });
        setSelectedTimeslot(undefined);
        onClose();
      }
    } else if (field === 'End Time') {
      if (selectedTimeslot !== undefined) {
        setEventBooking({ ...eventBooking, end_time: selectedTimeslot });
        setSelectedTimeslot(undefined);
        onClose();
      }
    } else if (field === 'Event Type') {
      if (selectedEventType !== undefined) {
        setEventBooking({ ...eventBooking, type: selectedEventType });
        onClose();
      }
    }
  }

  return (
    <Drawer open={isOpen} onClose={onClose} title={field} size={'25rem'} zIndex={1001}>
      {(field === 'Start Time' || field === 'End Time') && (
        <div>
          <div className={styles.grid}>
            {timeslots.map(timeslot => (
              <div
                key={timeslot}
                className={`${styles.timeslot} ${
                  selectedTimeslot === timeslot ? styles.selected : ''
                }`}
                onClick={handleOnClick}
                id={timeslot}
              >
                <p>{timeslot}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {field === 'Event Type' && (
        <div>
          <div className={styles.horizontal}>
            {eventTypes.map(eventType => (
              <div
                key={eventType}
                className={`${styles.timeslot} ${styles.eventType} ${
                  selectedEventType === eventType ? styles.selected : ''
                }`}
                onClick={handleOnClick}
                id={eventType}
              >
                <p>{eventType}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Filler />
      <Button
        text="Select"
        onClick={handleSubmit}
        disabled={field === 'Event Type' ? !selectedEventType : !selectedTimeslot}
      />
    </Drawer>
  );
};
export default EventFieldDrawer;
