import React, { FC, useContext } from 'react';
import { Context } from '../atoms/Context';
import { differenceInDays } from 'date-fns';
import styles from '@/styles/BookingDrawer.module.css';
import Filler from '../atoms/Filler';

const Summary: FC = () => {
  const { setError, booking, setBooking } = useContext(Context);
  const nights = differenceInDays(booking.checkout, booking.checkin);

  function calculateTotalPriceForBooking(): number {
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

  return (
    <div className={styles.summaryContainer}>
      <h3 className={styles.heading}>Summary</h3>
      {booking.rooms.map((room, index) => (
        <div className={styles.roomContainer} key={index.toString()}>
          {/* room info */}
          <div className={styles.row}>
            <div className={styles.description}>
              {`${room.room.name} for ${nights} ${nights === 1 ? 'night' : 'nights'}`}
              {/* price has to be refactored. needs to be calculated according to services */}
            </div>
            <div className={styles.price}>
              {(room.room.price * nights).toLocaleString('de-DE') + ' kr.'}
            </div>
          </div>
          {/* package info */}
          <div className={styles.row}>
            <div className={styles.description}>
              {room.package ? room.package.title : 'Accommodation with breakfast buffet'}
            </div>
            <div className={styles.price}>
              {room.package && (room.package.price * nights).toLocaleString('de-DE') + ' kr.'}
            </div>
          </div>
          {/* addons info */}
          {room.addons &&
            room.addons.map((addon, index) => (
              <div className={styles.row} key={index.toString()}>
                <div className={styles.description}>{addon.title}</div>
                <div className={styles.price}>{addon.price.toLocaleString('de-DE') + ' kr.'}</div>
              </div>
            ))}
        </div>
      ))}
      <Filler />
      <h3 className={styles.heading}>
        Total <span>{calculateTotalPriceForBooking().toLocaleString('de-DE') + ' kr.'}</span>
      </h3>
    </div>
  );
};

export default Summary;
