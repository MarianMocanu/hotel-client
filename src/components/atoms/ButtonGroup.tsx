import React, { FC, Dispatch, SetStateAction } from 'react';
import styles from '@/styles/ButtonGroup.module.css';

type Props = {
  text: string[];
  onButtonClick: Dispatch<SetStateAction<number>>;
  selected: number;
};

const ButtonGroup: FC<Props> = ({ text, selected, onButtonClick }) => {
  return (
    <div className={styles.container}>
      {text.map((item, index) => (
        <div
          className={index === selected ? styles.selectedTab : styles.tab}
          key={index}
          onClick={() => onButtonClick(index)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
export default ButtonGroup;
