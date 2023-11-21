import { fetchHotels } from '@/app/hotelsAPI';
import React, { FC, useEffect, useState, useContext } from 'react';
import Drawer from '@/components/atoms/Drawer';
import { Context } from '../atoms/Context';
import Image from 'next/image';
import styles from '@/styles/HotelsDrawer.module.css';
import { FaCheckCircle } from 'react-icons/fa';
import Filler from '../atoms/Filler';
import Button from '../atoms/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hotel: Hotel) => void;
};

type Hotel = {
  _id: string;
  name: string;
  town: string;
};

const HotelsDrawer: FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const { setError } = useContext(Context);
  const [hotels, setHotels] = useState<Hotel[] | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  function handleOnClick(hotelId: string): void {
    setSelectedId(hotelId);
  }

  function handleSubmit(): void {
    if (hotels && selectedId) {
      const hotel = hotels.find(hotel => hotel._id === selectedId);
      if (hotel) {
        onSubmit(hotel);
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
            name={hotel.name}
            town={hotel.town}
            selected={selectedId === hotel._id}
            onClick={() => handleOnClick(hotel._id)}
          />
        ))}
      <Filler />
      <div className={styles.buttonContainer}>
        <Button text="Select" onClick={handleSubmit} disabled={!selectedId} />
      </div>
    </Drawer>
  );
};

type CardProps = {
  town: string;
  name: string;
  selected: boolean;
  onClick?: () => void;
};

const HotelCard: FC<CardProps> = ({ town, name, selected, onClick }) => {
  return (
    <div className={`${styles.container} ${selected ? styles.selected : ''}`} onClick={onClick}>
      <Image
        src={`/hotels/${town}.webp`}
        alt="image"
        width={100}
        height={80}
        className={styles.image}
      />
      <div className={styles.column}>
        <p className={styles.name}>{name}</p>
        <p className={styles.town}>{town}</p>
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

export default HotelsDrawer;
