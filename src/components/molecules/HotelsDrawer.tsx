import { fetchHotels } from '@/app/hotelsAPI';
import React, { FC, useEffect, useState, useContext, MouseEvent } from 'react';
import Drawer from '@/components/atoms/Drawer';
import { Context, Hotel } from '../atoms/Context';
import Image from 'next/image';
import styles from '@/styles/HotelsDrawer.module.css';
import { FaCheckCircle } from 'react-icons/fa';
import Filler from '../atoms/Filler';
import Button from '../atoms/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const HotelsDrawer: FC<Props> = ({ isOpen, onClose }) => {
  const { setError, setBooking, booking } = useContext(Context);
  const [hotels, setHotels] = useState<Hotel[] | undefined>(undefined);
  const [selectedHotelId, setSelectedHotelId] = useState<string | undefined>(undefined);

  function handleOnClick(event: MouseEvent): void {
    const hotelId = event.currentTarget.id;
    setSelectedHotelId(hotelId);
  }

  function handleSubmit(): void {
    if (hotels && selectedHotelId) {
      const hotel = hotels.find(hotel => hotel._id === selectedHotelId);
      if (hotel) {
        setBooking({ ...booking, hotel });
        onClose();
      }
    }
  }

  useEffect(() => {
    if (isOpen && !hotels) {
      async function getHotels(): Promise<void> {
        try {
          const response = await fetchHotels();
          if (response && response.ok) {
            const data = await response.json();
            if (data) {
              setHotels(data);
            } else {
              throw new Error('No data');
            }
          } else {
            throw new Error('Response not ok');
          }
        } catch (error) {
          console.error(error);
          setError({ message: 'There was an error while fetching hotels.', shouldRefresh: true });
        }
      }
      getHotels();
    }
  }, [isOpen, hotels]);

  return (
    <Drawer open={isOpen} onClose={onClose} title="Hotels" size={'25rem'} zIndex={1001}>
      {hotels &&
        hotels.map(hotel => (
          <HotelCard
            key={hotel._id}
            data={hotel}
            selected={selectedHotelId === hotel._id}
            onClick={handleOnClick}
          />
        ))}
      <Filler />
      <Button text="Select" onClick={handleSubmit} disabled={!selectedHotelId} />
    </Drawer>
  );
};
export default HotelsDrawer;

type HotelCardProps = {
  data: Hotel;
  selected: boolean;
  onClick: (event: MouseEvent) => void;
};

const HotelCard: FC<HotelCardProps> = ({ data, selected, onClick }) => {
  return (
    <div
      className={`${styles.container} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      id={data._id}
    >
      <Image
        src={`/hotels/${data.town}.webp`}
        alt="image"
        width={100}
        height={80}
        className={styles.image}
      />
      <div className={styles.column}>
        <p className={styles.name}>{data.name}</p>
        <p className={styles.town}>{data.town}</p>
      </div>
      <Filler />
      {selected && (
        <div className={styles.icon}>
          <FaCheckCircle size={'1.5rem'} />
        </div>
      )}
    </div>
  );
};
