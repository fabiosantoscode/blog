import Image, { FixedObject } from "gatsby-image";
import React from "react";

import styles from "./styles.module.css";

interface IFeedMetaProps {
  date: string;
  name: string;
  timeToRead: string;
  avatar: {
    childImageSharp: {
      fixed: FixedObject;
    };
  };
}

function FeedMeta({ avatar, date, name, timeToRead }: IFeedMetaProps) {
  return (
    <div className={styles.wrapper}>
      <Image fixed={avatar.childImageSharp.fixed} className={styles.avatar} />
      <ul className={styles.list}>
        <li className={styles.item}>{name}</li>
        <li className={styles.item}>
          {date} • {timeToRead} min.
        </li>
      </ul>
    </div>
  );
}

export default FeedMeta;