import Navbar from "./navbar";
import styles from "/styles/layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={styles.content__container}>
      <div className={styles.content}>
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
