import React, { FC, useContext, useState } from 'react';
import { Context, Service } from '../atoms/Context';
import Image from 'next/image';
import styles from '@/styles/RoomInfoDrawer.module.css';
import { BsGem, BsBookmarkStar } from 'react-icons/bs';
import { PackageCard } from '../atoms/PackageCard';

type Props = {
  services: Service[];
  roomIndex: number;
};

const RoomInfoDrawer: FC<Props> = ({ services, roomIndex }) => {
  const defaultPackage: Service = {
    _id: 'default',
    title: 'Accommodation with breakfast buffet',
    price: 0,
    type: 'package',
  };

  const { booking, setBooking } = useContext(Context);
  const [selectedPackage, setSelectedPackage] = useState<Service>(defaultPackage);

  function handlePackageChange(service: Service): void {
    setSelectedPackage(service as Service);
    if (service._id !== 'default') {
      setBooking({ ...booking, package: service });
    } else {
      setBooking({ ...booking, package: null });
    }
  }

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
          {services.length > 0 && !services.some(service => service.price === 0) && (
            <PackageCard
              key={22}
              service={defaultPackage}
              selected={selectedPackage && selectedPackage._id === defaultPackage._id}
              onClick={() => handlePackageChange(defaultPackage)}
            />
          )}
          {services.length > 0 &&
            services.map((service, index) => {
              if (service.type === 'package') {
                return (
                  <PackageCard
                    key={index}
                    service={service}
                    selected={selectedPackage && selectedPackage._id === service._id}
                    onClick={() => handlePackageChange(service)}
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
