import React, { FC, useState, useContext } from 'react';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from '@/styles/CalendarDrawer.module.css';
import Button from '../atoms/Button';
import Drawer from '../atoms/Drawer';
import { Context } from '../atoms/Context';
import Filler from '../atoms/Filler';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isEvent: boolean;
};

const CalendarDrawer: FC<Props> = ({ isOpen, onClose, isEvent }) => {
  const { booking, setBooking, eventBooking, setEventBooking } = useContext(Context);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [selected, setSelected] = useState<Date>();

  function handleOnSelect(range: DateRange | undefined): void {
    setRange(range);
  }

  function handleOnSubmit(): void {
    if(isEvent) {
      selected && setEventBooking({...eventBooking, date: selected});
      onClose();
    } else {
      if (range && range.from && range.to) {
        setBooking({ ...booking, checkin: range.from, checkout: range.to });
        onClose();
      }
    }
  }

  return (
    <>
      {isEvent ? (
        <Drawer open={isOpen} onClose={onClose} title="Select Date" size={'25rem'} zIndex={1001}>
          <div className={styles.content}>
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={setSelected}
              modifiersClassNames={{ selected: styles.selected }}
              numberOfMonths={3}
              fromDate={new Date()}
              styles={{
                months: { flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' },
                nav_button_previous: {
                  position: 'relative',
                  top: '-2rem',
                  left: '8rem',
                  transform: 'rotate(90deg)',
                },
                nav_button_next: {
                  position: 'relative',
                  top: '18rem',
                  left: '-8rem',
                  transform: 'rotate(90deg)',
                },
              }}
            />

            <Filler />
            <div className={styles.buttonContainer}>
              <Button text="Select" onClick={handleOnSubmit} />
            </div>
          </div>
        </Drawer>
      ) : (
        <Drawer open={isOpen} onClose={onClose} title="Select dates" size={'25rem'} zIndex={1001}>
          <div className={styles.content}>
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleOnSelect}
              modifiersClassNames={{ selected: styles.selected }}
              numberOfMonths={3}
              fromDate={new Date()}
              styles={{
                months: { flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' },
                nav_button_previous: {
                  position: 'relative',
                  top: '-2rem',
                  left: '8rem',
                  transform: 'rotate(90deg)',
                },
                nav_button_next: {
                  position: 'relative',
                  top: '18rem',
                  left: '-8rem',
                  transform: 'rotate(90deg)',
                },
              }}
            />

            <Filler />
            <div className={styles.buttonContainer}>
              <Button text="Select" onClick={handleOnSubmit} />
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
};
export default CalendarDrawer;
