import React, { FC } from "react";
import styles from "./SmallCard.module.css";

type Props = {
  name: string;
  email: string;
};

const SmallCard: FC<Props> = ({ name, email }) => {
  return (
    <div className={styles.card}>
      <p className={styles.text}>{name}</p>
      <p className={styles.text}>{email}</p>
    </div>
  );
};

export default SmallCard;
