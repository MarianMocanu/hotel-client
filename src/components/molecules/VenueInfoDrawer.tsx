import React, { useContext } from 'react'
import { Context } from '../atoms/Context'
import Image from 'next/image';
import styles from '@/styles/VenueDrawer.module.css'

function VenueInfoDrawer() {
    const {eventBooking} = useContext(Context);



  return (
    <div>
        <div>
        <Image
        src={`/venues/${eventBooking.venue_data.name.trim().toLowerCase().replace(/\s+/g, '').replace(/\./g, '')}.webp`}
        alt="venue"
        width={350}
        height={200}
        className={styles.img}
      />
              <Image
        src={`/venues/${eventBooking.type === 'meeting' ? 'meeting' : 'wedding'}.webp`}
        alt="venue2"
        width={350}
        height={200}
        className={styles.img}
      />
        </div>
        <div>
            <div>
                <h3>{eventBooking.venue_data.name}</h3>
                {eventBooking.type === 'meeting' ?
                (<p>{eventBooking.venue_data.meetingDesc}</p>) :
            (<p>{eventBooking.venue_data.partyDesc}</p>)
        }
            </div>
            <ul>
                {
                    eventBooking.type === 'meeting' ?
                    (eventBooking.venue_data.meetingPerks.map((perk)=> {return <li>{perk}</li>}))
                    :
                    (eventBooking.venue_data.partyPerks.map((perk)=> {return <li>{perk}</li>}))
                }
            </ul>
        </div>
    </div>
  )
}

export default VenueInfoDrawer