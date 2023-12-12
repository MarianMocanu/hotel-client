import React, { FC, MouseEventHandler, useContext } from 'react';
import { Context, Service } from '../atoms/Context';
import styles from '@/styles/RoomInfoDrawer.module.css';
import { differenceInDays } from 'date-fns';
import { FaCheckCircle } from 'react-icons/fa';

type PackageCardProps = {
  key: number;
  service: Service;
  selected: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
};

export const PackageCard: FC<PackageCardProps> = ({ service, selected, onClick }) => {
  const { booking } = useContext(Context);
  return (
    <div
      className={`${styles.container} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      id={service._id}
    >
      <div className={styles.column}>
        <p className={styles.name}>{service.title}</p>
        <p className={styles.price}>
          {service.type === 'package'
            ? (
                booking.price +
                service.price * differenceInDays(booking.checkout, booking.checkin)
              ).toLocaleString('de-DE')
            : service.price.toLocaleString('de-DE')}
          kr.
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
