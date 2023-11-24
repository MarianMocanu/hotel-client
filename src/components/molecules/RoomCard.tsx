import React, { FC, MouseEvent } from 'react';
import styles from '@/styles/RoomCard.module.css';
import Image from 'next/image';
import { Room } from '../atoms/Context';

type Props = {
  data: Room;
  onClick: (event: MouseEvent) => void;
  selected?: boolean;
  nights?: number;
};

const RoomCard: FC<Props> = ({ data, onClick, selected, nights }) => {
  return (
    <div
      className={`${styles.container} ${styles.border} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      id={data._id}
    >
      <Image
        src={`/rooms/${data.type}.webp`}
        alt="room"
        height={200}
        width={330}
        className={styles.picture}
      />
      <div className={styles.vertical}>
        <div className={styles.title}>{data.name}</div>
        <div className={styles.description}>{data.description}</div>
        <div className={styles.facilities}>
          {data.facilities.map((facility, index) => (
            <div className={styles.facility} key={index.toString()}>
              {facility.charAt(0).toUpperCase() + facility.slice(1)}
            </div>
          ))}
        </div>
        {nights && (
          <div className={styles.price}>{(nights * data.price).toLocaleString('de-DE')} kr.</div>
        )}
      </div>
    </div>
  );
};
export default RoomCard;
