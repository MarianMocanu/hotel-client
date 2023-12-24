import React, { FC, MouseEvent, useContext } from 'react';
import Image from 'next/image';
import { EventVenue } from '../atoms/Context';
import styles from '@/styles/VenueDrawer.module.css'


type Props = {
  venue: EventVenue;
  onClick: (event: MouseEvent) => void;
  isMain: boolean;
  isMeeting: boolean;
};

const VenueCard: FC<Props> = ({ venue, onClick, isMain, isMeeting }) => {
  return (
    <div
      onClick={onClick}
      id={venue._id}
      className={isMain ? styles.mainCard : styles.smallCard}
    >
      <Image
        src={`/venues/${venue.name.trim().toLowerCase().replace(/\s+/g, '').replace(/\./g, '')}.webp`}
        alt="venue"
        height={210}
        width={346}
        className={styles.img}
      />
        <h2 className={styles.cardTitle} >{venue.name}</h2>
      <div className={styles.cardContent}>
        <ul className={styles.perks} >
            {isMeeting ? (
                venue.meetingPerks.map((perk, index) => { if(index < 3) return <li>{perk}</li>} )
            ) : (venue.partyPerks.map((perk, index) => { if(index < 3) return <li>{perk}</li>} ))}
        </ul>
        <div className={styles.btn}>
            <p>Read More</p>
        </div>
      </div>
    </div>
  );
};
export default VenueCard;
