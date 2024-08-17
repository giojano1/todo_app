import React from "react";
import logo from "/assets/img/Logo.png";
import styles from "./header.module.scss";
const Header = () => {
  return (
    <header>
      <div className={styles.header__content}>
        <img src={logo} alt="logo" />
      </div>
    </header>
  );
};

export default Header;
