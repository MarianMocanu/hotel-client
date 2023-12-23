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
    >
      <Image
        src={`/venues/${venue.name.trim().toLowerCase().replace(/\s+/g, '').replace(/\./g, '')}.webp`}
        alt="venue"
        height={200}
        width={330}
        className={styles.img}
      />
        <h2>{venue.name}</h2>
      <div>
        <ul>
            {isMeeting ? (
                venue.meetingPerks.map((perk, index) => { if(index < 4) return <li>{perk}</li>} )
            ) : (venue.partyPerks.map((perk, index) => { if(index < 4) return <li>{perk}</li>} ))}
        </ul>
        <div>
            <p>Read More</p>
        </div>
      </div>
    </div>
  );
};
export default VenueCard;
