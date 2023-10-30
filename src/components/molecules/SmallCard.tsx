import React, { FC } from "react";
import styles from "./SmallCard.module.css";

type Props = {
  name: string;
  email: string;
};

const SmallCard: FC<Props> = ({ name, email }) => {
  return (
    <div className={styles.card}>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
};

export default SmallCard;
