import React, { FC, useContext, MouseEvent } from 'react';
import { Context, Service } from '../atoms/Context';
import styles from '@/styles/RoomInfoDrawer.module.css';
import { differenceInDays } from 'date-fns';
import { FaCheckCircle } from 'react-icons/fa';

type Props = {
  service: Service;
  onClick: (event: MouseEvent) => void;
  selected: boolean;
  roomIndex: number;
};

export const ServiceCard: FC<Props> = ({ service, onClick, selected, roomIndex }) => {
  const { booking } = useContext(Context);
  const nights = differenceInDays(booking.checkout, booking.checkin);
  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      id={service._id}
    >
      <div className={styles.column}>
        <p className={styles.name}>{service.title}</p>
        <p className={styles.price}>
          {service.type === 'package'
            ? (
                booking.rooms[roomIndex].room.price * nights +
                service.price * nights
              ).toLocaleString('de-DE') + ' kr.'
            : service.price.toLocaleString('de-DE') + ' kr.'}
        </p>
      </div>
      {selected && (
        <div className={styles.icon}>
          <FaCheckCircle size={'1.5rem'} />
        </div>
      )}
    </div>
  );
};
