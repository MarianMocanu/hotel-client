import React, { FC, MouseEvent } from 'react';
import styles from '@/styles/ButtonGroup.module.css';

type Props = {
  text: string[];
  onButtonClick: (event: MouseEvent) => void;
  selected: string;
};

const ButtonGroup: FC<Props> = ({ text, selected, onButtonClick }) => {
  return (
    <div className={styles.container}>
      {text.map((item, index) => (
        <div
          className={
            text[index].toLowerCase() === selected.toLowerCase() ? styles.selectedTab : styles.tab
          }
          key={index}
          onClick={onButtonClick}
          id={text[index]}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
export default ButtonGroup;
