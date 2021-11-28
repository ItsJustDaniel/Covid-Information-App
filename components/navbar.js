import Link from "next/link";
import styles from "/styles/navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.nav__content}>
        <div className={styles.nav__links}>
          <Link href="/">
            <a className={`${styles.nav__link}`}>Home</a>
          </Link>
          <Link href="/Map">
            <a className={`${styles.nav__link}`}>Map</a>
          </Link>{" "}
          <Link
            href="/Statistics
          "
          >
            <a className={`${styles.nav__link}`}>Statistics</a>
          </Link>{" "}
          <Link href="/MoreInformation">
            <a className={`${styles.nav__link}`}>More Information</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
