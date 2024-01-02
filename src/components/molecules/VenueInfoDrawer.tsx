import React, { useContext } from 'react';
import { Context } from '../atoms/Context';
import Image from 'next/image';
import styles from '@/styles/VenueDrawer.module.css';

function VenueInfoDrawer() {
  const { eventBooking } = useContext(Context);

  return (
    <div>
      <div className={styles.venueImgContainer}>
        <Image
          src={`/venues/${eventBooking.venue_data.name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/\./g, '')}.webp`}
          alt="venue"
          width={385}
          height={220}
          className={styles.img}
        />
        <Image
          src={`/venues/${eventBooking.type === 'meeting' ? 'meeting' : 'wedding'}.webp`}
          alt="venue2"
          width={385}
          height={220}
          className={styles.img}
        />
      </div>
      <div>
        <h3 className={styles.title}>{eventBooking.venue_data.name}</h3>
        <div className={styles.venueContainer}>
          {eventBooking.type === 'meeting' ? (
            <p>{eventBooking.venue_data.meetingDesc}</p>
          ) : (
            <p>{eventBooking.venue_data.partyDesc}</p>
          )}
          <ul>
            {eventBooking.type === 'meeting'
              ? eventBooking.venue_data.meetingPerks.map((perk, index) => {
                  return <li key={index.toString()}>{perk}</li>;
                })
              : eventBooking.venue_data.partyPerks.map((perk, index) => {
                  return <li key={index.toString()}>{perk}</li>;
                })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VenueInfoDrawer;
