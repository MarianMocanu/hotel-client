import React, { FC, useState, useContext, MouseEvent } from 'react';
import Drawer from '@/components/atoms/Drawer';
import { Context } from '../atoms/Context';
import styles from '@/styles/EventFieldDrawer.module.css';
import Filler from '../atoms/Filler';
import Button from '../atoms/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const EventFieldDrawer: FC<Props> = ({ isOpen, onClose }) => {
  const { setEventBooking, eventBooking } = useContext(Context);

  function handleOnClick(event: MouseEvent): void {
  }

  function handleSubmit(): void {
  }

  return (
    <Drawer open={isOpen} onClose={onClose} title='Your Selection' size={'55rem'} zIndex={1001}>

        venues here
      <Filler />
      <Button text="Select" onClick={handleSubmit} />
    </Drawer>
  );
};
export default EventFieldDrawer;
