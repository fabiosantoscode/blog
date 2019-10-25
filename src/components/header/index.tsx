import React from "react";

import { siteLinks } from "../../data";

import Nav from "../nav";

import { ReactComponent as LogoSVG } from "./logo.svg";
import styles from "./styles.module.css";

function Header() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.placeholder} />
      <div className={styles.header}>
        <div className={styles.container}>
          <a href={siteLinks.root}>
            <LogoSVG className={styles.logo} />
          </a>
          <Nav />
        </div>
      </div>
    </div>
  );
}

export default Header;