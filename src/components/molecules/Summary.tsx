import React, { useContext } from 'react';
import { Context } from '../atoms/Context';
import { differenceInDays } from 'date-fns';
import styles from '@/styles/BookingDrawer.module.css';

function Summary() {
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
    <>
      <div className={styles.summary}>
        <h3>Summary</h3>
        <p>
          <span>
            {booking.room.name} - {nights} {nights === 1 ? 'night' : 'nights'}
          </span>
          <span>{(booking.price * nights).toLocaleString('de-DE')} kr.</span>
        </p>
        <p>
          <span>
            {booking.package ? booking.package.title : 'Accommodation with breakfast buffet'}
          </span>
          {booking.package && (
            <span>{(booking.package?.price * nights).toLocaleString('de-DE')} kr.</span>
          )}
        </p>
        {booking.addons.length > 0 &&
          booking.addons.map((addon, index) => (
            <p key={index}>
              {' '}
              <span>{addon.title}</span> <span>{addon.price.toLocaleString('de-DE')} kr.</span>{' '}
            </p>
          ))}
        <h3>
          Total <span>{calculateSubtotal().toLocaleString('de-DE')} kr.</span>
        </h3>
      </div>
    </>
  );
}

export default Summary;
