import { FC, useContext } from 'react';
import { Context } from './Context';
import styles from '@/styles/BookingDrawer.module.css';
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaClock,
  FaGlassCheers,
  FaMapMarkerAlt,
  FaUser,
} from 'react-icons/fa';
import { formatDate } from '@/app/util';

type DrawerHeaderProps = {
  onBackClick: () => void;
  isEvent: boolean;
};

export const DrawerHeader: FC<DrawerHeaderProps> = ({ onBackClick, isEvent }) => {
  const { eventBooking, booking } = useContext(Context);
  return (
    <div className={styles.horizontal}>
      <div className={`${styles.icon} ${styles.background}`} onClick={onBackClick}>
        <FaChevronLeft />
      </div>
      <div className={styles.horizontal}>
        <div className={styles.icon}>
          <FaCalendarAlt />
        </div>
        {isEvent ? (
          <p>{formatDate(eventBooking.date)}</p>
        ) : (
          <p>
            {formatDate(booking.checkin)} - {formatDate(booking.checkout)}
          </p>
        )}
      </div>
      {isEvent && eventBooking?.type === 'meeting' && (
        <div className={styles.horizontal}>
          <div className={styles.icon}>
            <FaClock />
          </div>
          <p>
            {eventBooking.start_time} - {eventBooking.end_time}
          </p>
        </div>
      )}
      <div className={styles.horizontal}>
        <div className={styles.icon}>
          <FaUser />
        </div>
        {isEvent ? <p>{eventBooking.guest_amount} participants</p> : <p>{booking.guest?.guestsString}</p>}
      </div>
      {!isEvent && (
        <div className={styles.horizontal}>
          <div className={styles.icon}>
            <FaMapMarkerAlt />
          </div>
          <p>{booking.hotel?.name}</p>
        </div>
      )}
      {isEvent && eventBooking?.type !== 'meeting' && (
        <div className={styles.horizontal}>
          <div className={styles.icon}>
            <FaGlassCheers />
          </div>
          <p>{eventBooking.type}</p>
        </div>
      )}
    </div>
  );
};
