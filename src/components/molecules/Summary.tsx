import React, { FC, useContext } from 'react';
import { Context } from '../atoms/Context';
import { differenceInDays } from 'date-fns';
import styles from '@/styles/BookingDrawer.module.css';
import Filler from '../atoms/Filler';

const Summary: FC = () => {
  const { setError, booking, setBooking } = useContext(Context);
  const nights = differenceInDays(booking.checkout, booking.checkin);

  function calculateSubtotal(): number {
    const subtotal =
      booking.price +
      (booking.package ? booking.package.price : 0) *
        differenceInDays(booking.checkout, booking.checkin) +
      (booking.addons ? booking.addons.reduce((acc, addon) => acc + addon.price, 0) : 0);
    return subtotal;
  }

  return (
    <div className={styles.summaryContainer}>
      <h3 className={styles.heading}>Summary</h3>
      {booking.rooms.map(room => (
        <div className={styles.roomContainer}>
          <div className={styles.row}>
            <div className={styles.description}>
              {`${room.room.name} for ${nights} ${nights === 1 ? 'night' : 'nights'}`}
              {/* price has to be refactored. needs to be calculated according to services */}
            </div>
            <div className={styles.price}>
              {(room.room.price * nights).toLocaleString('de-DE') + ' kr.'}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.description}>
              {booking.package ? booking.package.title : 'Accommodation with breakfast buffet'}
            </div>
            <div className={styles.price}>
              {booking.package &&
                (booking.package?.price * nights).toLocaleString('de-DE') + ' kr.'}
            </div>
          </div>
        </div>
      ))}
      {booking.addons &&
        booking.addons.length > 0 &&
        booking.addons.map((addon, index) => (
          <div key={index.toString()}>
            {addon.title}
            {addon.price.toLocaleString('de-DE') + ' kr.'}
          </div>
        ))}
      <Filler />
      <h3 className={styles.heading}>
        Total <span>{calculateSubtotal().toLocaleString('de-DE') + ' kr.'}</span>
      </h3>
    </div>
  );
};

export default Summary;
