import React, { FC, useContext, useState, MouseEvent, useEffect, useLayoutEffect } from 'react';
import { Context, Service } from '../atoms/Context';
import Image from 'next/image';
import styles from '@/styles/RoomInfoDrawer.module.css';
import { BsGem, BsBookmarkStar } from 'react-icons/bs';
import { ServiceCard } from './ServiceCard';

type Props = {
  services: Service[];
  roomIndex: number;
};

const RoomInfoDrawer: FC<Props> = ({ services, roomIndex }) => {
  const { booking, setBooking } = useContext(Context);
  const [selectedPackage, setSelectedPackage] = useState<Service>({} as Service);

  function handleOnServiceClick(event: MouseEvent): void {
    const id = event.currentTarget.id;
    const service = services.find(service => service._id === id);
    if (service) {
      const newBooking = { ...booking };
      newBooking.rooms[roomIndex].package = service;
      setSelectedPackage(service as Service);
      setBooking(newBooking);
    }
  }

  useLayoutEffect(() => {
    if (booking.rooms[roomIndex].package) {
      setSelectedPackage(booking.rooms[roomIndex].package);
    }
  }, []);

  if (booking.rooms[roomIndex] && booking.rooms[roomIndex].room._id) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>{booking.rooms[roomIndex].room.name}</h3>
        <div className={styles.horizontalContainer}>
          <Image
            src={`/rooms/${booking.rooms[roomIndex].room.type}.webp`}
            alt="hotel"
            width={350}
            height={200}
            className={styles.image}
          />
          <div className={styles.facilities}>
            {booking.rooms[roomIndex].room.facilities &&
              booking.rooms[roomIndex].room.facilities.map((amenity, index) => (
                <div className={styles.facility} key={index.toString()}>
                  {index % 2 === 0 ? <BsGem size={'1rem'} /> : <BsBookmarkStar size={'1rem'} />}
                  <div>{amenity}</div>
                </div>
              ))}
          </div>
        </div>

        <p className={styles.description}>{booking.rooms[roomIndex].room.description}</p>

        <h4 className={styles.subtitle}>Packages</h4>
        <div className={styles.grid}>
          {services.length > 0 &&
            services.map((service, index) => {
              if (service.type === 'package') {
                return (
                  <ServiceCard
                    key={index.toString()}
                    service={service}
                    selected={selectedPackage._id === service._id ?? false}
                    onClick={handleOnServiceClick}
                    roomIndex={roomIndex}
                  />
                );
              }
            })}
        </div>
      </div>
    );
  }
};

export default RoomInfoDrawer;
