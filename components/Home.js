import styles from '../styles/Home.module.css';
import Character from './Character';

function Home() {

  return (
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Gorà</a>
        </h1>
          <Character/>
      </main>
  );
}

export default Home;
