import React, { FC } from 'react';
import Modal from './Modal';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from '@/styles/Calendar.module.css';
import Button from './Button';

type Props = {
  onSelect: (date: DateRange | undefined) => void;
  selected: DateRange | undefined;
  isOpen: boolean;
  onClose: () => void;
};

const Calendar: FC<Props> = ({ onSelect, selected, isOpen, onClose }) => {
  const css = `
  .my-selected:not([disabled]) { 
    font-weight: bold; 
    border: 2px solid currentColor;
  }
  .my-selected:hover:not([disabled]) { 
    border-color: blue;
    color: blue;
  }
  .my-today { 
    font-weight: bold;
    font-size: 140%; 
    color: red;
  }
`;
  return (
    <Modal isOpen={isOpen} closeModal={onClose} bottom={'5rem'} left={'40rem'}>
      <style>{css}</style>
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={onSelect}
        modifiersClassNames={{
          selected: styles.selected,
        }}
        footer={<Button text="Select" onClick={onClose} />}
      />
    </Modal>
  );
};
export default Calendar;
