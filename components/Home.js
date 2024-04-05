import styles from '../styles/Home.module.css';
import Map from './Map';
import { useEffect } from 'react';

function Home() {

  useEffect(() => {
    // Ajouter la classe au body lorsque le composant est monté
    document.body.classList.add('bodyModified');

    return () => {
      // Supprimer la classe du body lorsque le composant est démonté
      document.body.classList.remove('bodyModified');
    };
  }, []);

  return (
      // <main className={styles.main}>
      <main>
          <Map/>
          {/* <h1 className={styles.title}>
            Welcome to <a href="https://nextjs.org">nunc</a>
          </h1> */}
      </main>
  );
}

export default Home;
