import styles from '../styles/Home.module.css';
import Map from './Map';
import Character from './Character';

function Home() {

  return (
      // <main className={styles.main}>
      <main>
          <Map />
          {/* <h1 className={styles.title}>
            Welcome to <a href="https://nextjs.org">nunc</a>
          </h1> */}
      </main>
  );
}

export default Home;
