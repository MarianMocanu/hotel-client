import React, { useContext, useState } from 'react';
import { Context, Service } from '../atoms/Context';
import Image from 'next/image';
import styles from '@/styles/RoomInfoDrawer.module.css';
import { BsGem, BsBookmarkStar } from 'react-icons/bs';
import { PackageCard } from '../atoms/PackageCard';

function RoomInfoDrawer({ services }: { services: Service[] }) {
  const defaultPackage: Service = {
    _id: 'default',
    title: 'Accommodation with breakfast buffet',
    price: 0,
    type: 'package',
  };

  const { setError, booking, setBooking } = useContext(Context);
  const [selectedPackage, setSelectedPackage] = useState<Service>(defaultPackage);

  function handlePackageChange(service: Service): void {
    setSelectedPackage(service as Service);
    if (service._id !== 'default') {
      setBooking({ ...booking, package: service });
    } else {
      setBooking({ ...booking, package: null });
    }

    console.log(booking.package);
  }

  return (
    <>
      <div className={styles.overview}>
        {booking.room && (
          <>
            <Image
              src={`/rooms/${booking.room.type}.webp`}
              alt="hotel"
              width={350}
              height={200}
              className={styles.flex}
            />
            <Image
              src={`/rooms/${booking.room.type}.webp`}
              alt="hotel"
              width={350}
              height={200}
              className={styles.flex}
            />
          </>
        )}
      </div>
      <div className={styles.roomHeader}>
        <h3 className={styles.title}>{booking.room.name}</h3>
        <div>
          <p className={styles.facilitiesgrid}>
            {booking.room.facilities.map((amenity, index) => (
              <span className={styles.facility} key={index}>
                {index % 2 === 0 ? <BsGem /> : <BsBookmarkStar />}
                {amenity}
              </span>
            ))}
          </p>
          <p>{booking.room.description}</p>
        </div>
      </div>
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
    </>
  );
}

export default RoomInfoDrawer;
